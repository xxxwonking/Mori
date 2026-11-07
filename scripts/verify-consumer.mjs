import { chromium, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative, resolve, isAbsolute } from 'node:path';
import { createDistribution, listModuleFiles, repository, verifyDistribution } from './distribution.mjs';
import { createConsumerProject, verifyConsumerModules } from './consumer-project.mjs';
import { buildConsumer } from './build-consumer.mjs';
import { componentManifest } from './component-manifest.mjs';
import { invalidComponentSelectors } from './weixin-style-contract.mjs';
const parent = join(repository, '.impeccable/review');
mkdirSync(parent, { recursive: true });
const reuse = process.argv.includes('--reuse');
const previous = reuse ? JSON.parse(readFileSync(join(parent, 'consumer-latest.json'), 'utf8')) : null;
const distribution = reuse ? previous.distribution : createDistribution();
const project = reuse ? previous.project : createConsumerProject(distribution, parent);
if (!reuse) writeFileSync(join(parent, 'consumer-latest.json'), JSON.stringify({ distribution, project }, null, 2));
const web = reuse ? join(project, 'unpackage/dist/build/h5') : await buildConsumer(project, 'h5');
const weixin = reuse ? join(project, 'unpackage/dist/build/mp-weixin') : await buildConsumer(project, 'mp-weixin');
if (reuse) {
  verifyDistribution(distribution);
  const builtAt = Math.min(statSync(join(web, 'index.html')).mtimeMs, statSync(join(weixin, 'app.json')).mtimeMs);
  verifyConsumerModules(repository, project);
  for (const file of [...listModuleFiles(project), 'main.uts', 'App.uvue', 'pages.json', 'manifest.json', 'pages/index/index.uvue', 'index.html']) {
    if (statSync(join(project, file)).mtimeMs > builtAt) throw new Error(`Consumer input changed after build: ${file}`);
  }
}
const pageConfig = JSON.parse(readFileSync(join(weixin, 'pages/index/index.json'), 'utf8'));
for (const item of componentManifest) {
  if (!pageConfig.usingComponents[`mori-${item.name}`]) throw new Error(`Clean consumer did not register mori-${item.name}`);
  const style = join(weixin, 'uni_modules/mori-ui/components', `mori-${item.name}`, `mori-${item.name}.wxss`);
  const issues = invalidComponentSelectors(readFileSync(style, 'utf8'), style);
  if (issues.length) throw new Error(JSON.stringify(issues));
}
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png' };
const server = createServer((req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    // This minimal fixture has no site icon; answer the browser's implicit request.
    if (pathname === '/favicon.ico') { res.writeHead(204); res.end(); return; }
    const path = resolve(web, '.' + (pathname === '/' ? '/index.html' : pathname));
    const within = relative(web, path);
    if (within.startsWith('..') || isAbsolute(within)) { res.writeHead(403); res.end(); return; }
    const content = readFileSync(path);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
    res.end(content);
  } catch { res.statusCode = 404; res.end(); }
});
await new Promise(accept => server.listen(0, '127.0.0.1', accept));
let browser;
const errors = [];
try {
  browser = await chromium.launch({ headless: true, channel: process.env.MORI_BROWSER_EXECUTABLE ? undefined : 'chromium', executablePath: process.env.MORI_BROWSER_EXECUTABLE || undefined });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', colorScheme: 'light' });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' || /Missing required prop|Unhandled error/.test(message.text())) errors.push(`${message.text()} ${message.location().url || ''}`); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'networkidle' });
  await page.getByRole('textbox', { name: '姓名', exact: true }).fill('独立接入');
  await page.getByRole('switch', { name: '接收通知' }).click();
  await expect(page.getByText('选择状态：开启', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '打开弹层', exact: true }).click();
  await expect(page.getByText('独立项目弹层', { exact: true })).toBeVisible();
  await expect(page.locator('.mori-popup').getByText('独立接入', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '完成', exact: true }).click();
  await expect(page.getByText('独立项目弹层', { exact: true })).not.toBeVisible();
  const decrease = page.getByRole('button', { name: '减少', exact: true });
  await expect(decrease).toHaveClass(/mori-action--disabled/);
  await expect(decrease).toHaveCSS('opacity', '0.5');
  await page.getByRole('button', { name: '增加', exact: true }).click();
  await expect(decrease).not.toHaveClass(/mori-action--disabled/);
  await expect(page.getByRole('button', { name: '增加', exact: true })).toHaveCSS('opacity', '0.5');
  await page.screenshot({ path: join(parent, 'consumer-light.png'), fullPage: true });
  await page.getByRole('button', { name: '切换主题', exact: true }).click();
  await expect(page.locator('.consumer')).toHaveCSS('background-color', 'rgb(10, 10, 10)');
  await page.screenshot({ path: join(parent, 'consumer-dark.png'), fullPage: true });
  await page.getByRole('button', { name: '更换内置提示', exact: true }).click();
  await expect(page.getByText('Required', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Clear input', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Increase', exact: true })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: '姓名', exact: true })).toHaveValue('独立接入');
  await page.getByRole('button', { name: '打开弹层', exact: true }).click();
  await page.getByRole('button', { name: 'Close panel', exact: true }).click();
  await expect(page.getByText('独立项目弹层', { exact: true })).not.toBeVisible();
  await page.getByRole('button', { name: '恢复默认配置', exact: true }).click();
  await expect(page.getByText('必填', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '清空输入', exact: true })).toBeVisible();
  for (const [label, background, icon, capture] of [
    ['浅色模式深色提示', 'rgb(0, 0, 0)', 'check-light.svg', 'dark-surface'],
    ['深色模式浅色提示', 'rgb(255, 255, 255)', 'check-dark.svg', 'light-surface']
  ]) {
    await page.getByRole('button', { name: label, exact: true }).click();
    const toast = page.locator('.mori-toast__content');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveCSS('background-color', background);
    const image = toast.locator('img');
    await expect(image).toHaveAttribute('src', new RegExp(icon.replace('.', '\\.')));
    await expect.poll(() => image.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
    await toast.screenshot({ path: join(parent, `consumer-toast-${capture}.png`) });
  }
  await page.getByRole('button', { name: '恢复默认配置', exact: true }).click();
  await expect(page.locator('.mori-toast')).not.toBeVisible();
  await page.getByRole('button', { name: '加载全部组件', exact: true }).click();
  await expect(page.locator('.consumer-catalog')).toBeVisible();
  await expect(page.locator('.consumer-item')).toHaveCount(88);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
  const report = { distribution, project, reusedBuilds: reuse, browser: browser.version(), componentsRegistered: 88, builds: ['h5', 'mp-weixin'], checks: ['input', 'switch', 'popup', 'disabled-state', 'theme', 'messages-and-reset', 'toast-custom-surface', 'all-component-mount'], errors };
  writeFileSync(join(parent, 'consumer-report.json'), JSON.stringify(report, null, 2));
  console.log('PASS clean consumer H5/WeChat builds, 88 easycom registrations and browser interaction checks.');
} finally {
  if (browser) await browser.close();
  await new Promise(accept => server.close(accept));
}
