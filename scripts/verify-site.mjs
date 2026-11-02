import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { componentManifest } from './component-manifest.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, '.impeccable/review');
mkdirSync(output, { recursive: true });
const base = process.env.MORI_SITE_URL || 'http://127.0.0.1:5180';
const layoutOnly = process.argv.includes('--layout');
const browser = await chromium.launch({ executablePath: process.env.MORI_BROWSER_EXECUTABLE || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
const errors = [], failures = [], checks = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
const shot = name => page.screenshot({ path: resolve(output, `site-${name}.png`), fullPage: true });
const noOverflow = async () => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Page horizontal overflow');
try {
  await page.goto(base, { waitUntil: 'networkidle' });
  const heroFrame = () => page.frameLocator('.hero-preview iframe');
  await heroFrame().getByText('操作层级', { exact: true }).waitFor();
  await heroFrame().getByRole('button', { name: '主要按钮', exact: true }).click();
  await heroFrame().getByText('点击了主要按钮', { exact: true }).waitFor();
  await heroFrame().getByRole('button', { name: '体验异步保存', exact: true }).click();
  await heroFrame().getByText('已保存，这是本地演示。', { exact: true }).waitFor();
  await noOverflow(); await shot('home-desktop');
  await page.getByRole('button', { name: '输入框', exact: true }).click();
  await heroFrame().getByRole('textbox', { name: '你的称呼', exact: true }).fill('Mori');
  await heroFrame().getByText('你好，Mori').waitFor();
  await page.getByRole('button', { name: '切换为深色预览' }).click();
  await heroFrame().locator('.preview-page').waitFor();
  const color = await heroFrame().locator('.preview-page').evaluate(el => getComputedStyle(el).backgroundColor);
  assert.equal(color, 'rgb(17, 19, 24)');
  assert.equal(await heroFrame().locator('.preview-title').evaluate(el => getComputedStyle(el).color), 'rgb(232, 237, 245)');
  await page.getByRole('button', { name: '刷新示例' }).click();
  await heroFrame().getByRole('textbox', { name: '你的称呼', exact: true }).waitFor();
  assert.equal(await heroFrame().getByRole('textbox', { name: '你的称呼', exact: true }).inputValue(), '');
  await page.locator('.preview-qr summary').click();
  await page.getByAltText('当前组件预览地址二维码').waitFor();
  assert((await page.getByAltText('当前组件预览地址二维码').getAttribute('src')).startsWith('data:image/png'));
  assert((await page.getByRole('link', { name: '独立打开示例' }).getAttribute('href')).includes('component=input'));
  await page.locator('.preview-qr summary').click();
  checks.push('Homepage actual button/input, async state, iframe theme/reset, QR and standalone URL');
  await page.getByRole('searchbox', { name: '搜索组件', exact: true }).fill('picker');
  assert.equal(await page.locator('.component-links a').count(), componentManifest.filter(c => c.name.includes('picker')).length);
  await page.getByRole('searchbox', { name: '搜索组件', exact: true }).fill('no-such-mori');
  await page.getByRole('status').filter({ hasText: '没有找到' }).waitFor();
  await page.getByRole('searchbox', { name: '搜索组件', exact: true }).fill('');
  await page.getByRole('button', { name: /录入/ }).click();
  assert.equal(await page.locator('.component-links a').count(), componentManifest.filter(c => c.group === '录入').length);
  checks.push('Category filtering and component search including empty results');

  await page.goto(base + '/components/button', { waitUntil: 'networkidle' });
  await page.locator('h1').filter({ hasText: 'Button 按钮' }).waitFor();
  await page.frameLocator('.aside iframe').getByText('操作层级', { exact: true }).waitFor();
  assert(await page.locator('.aside .component-preview').evaluate(el => el.getBoundingClientRect().right <= innerWidth), 'Preview clipped at right edge');
  await noOverflow(); await shot('docs-desktop');
  const searchButton = page.getByRole('button', { name: '搜索文档', exact: true });
  await searchButton.click();
  await page.locator('#localsearch-input').fill('Popup');
  await page.locator('.VPLocalSearchBox .result').first().waitFor();
  await page.keyboard.press('Escape');
  checks.push('Document sidebar, route-bound preview, local full-text search');

  // Every published component must have a real, mounted demo and a rendered guide.
  const demo = await browser.newPage({ viewport: { width: 360, height: 740 } });
  demo.on('pageerror', error => errors.push(error.message));
  demo.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  for (const c of layoutOnly ? [] : componentManifest) {
    const response = await page.request.get(base + '/components/' + c.name);
    assert.equal(response.status(), 200, `${c.name} guide status`);
    await demo.goto(`${base}/demo/?example=${c.name}#/pages/preview/preview?component=${c.name}&theme=light`, { waitUntil: 'networkidle' });
    await demo.locator('.preview-title').filter({ hasText: c.title }).waitFor();
    assert(await demo.locator('.site-preview-content').evaluate(el => el.getBoundingClientRect().height > 0), `${c.name} empty demo`);
    assert(await demo.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${c.name} demo overflow`);
  }
  await demo.goto(`${base}/demo/#/pages/preview/preview?component=popup&theme=dark`, { waitUntil: 'networkidle' });
  await demo.getByRole('button', { name: '打开详情', exact: true }).click();
  await demo.getByText('这里放业务内容。', { exact: true }).waitFor();
  await demo.waitForFunction(() => { const panel = document.querySelector('.mori-popup__panel'); return panel && getComputedStyle(panel).opacity === '1' && Math.abs(panel.getBoundingClientRect().bottom - innerHeight) < 1; });
  await demo.screenshot({ path: resolve(output, 'site-demo-popup.png'), fullPage: true });
  await demo.keyboard.press('Escape');
  await demo.close();
  checks.push(layoutOnly ? 'Popup interaction; component sweep preserved in site-verification.json' : 'All 88 guides return 200; all 88 real demos mount at 360px without overflow; popup interaction');

  for (const width of [1440, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    await page.emulateMedia({ colorScheme: width === 390 ? 'dark' : 'light', reducedMotion: 'reduce' });
    await page.goto(base, { waitUntil: 'networkidle' });
    await noOverflow(); await shot(`home-${width}`);
    if (width === 390) await page.screenshot({ path: resolve(output, 'site-home-mobile-viewport.png') });
    await page.goto(base + '/components/input', { waitUntil: 'networkidle' });
    if (width < 1280) {
      await page.locator('.mobile-demo > summary').click();
      await page.frameLocator('.mobile-demo iframe').getByRole('textbox', { name: '你的称呼', exact: true }).fill('手机预览');
      await page.frameLocator('.mobile-demo iframe').getByText('你好，手机预览').waitFor();
    }
    await noOverflow(); await shot(`docs-${width}`);
    if (width >= 1280) assert(await page.locator('.aside .component-preview').evaluate(el => el.getBoundingClientRect().right <= innerWidth), 'Preview clipped');
    if (width === 390) await page.screenshot({ path: resolve(output, 'site-docs-mobile-viewport.png') });
  }
  checks.push('1440/1280/768/390 layouts, dark theme, reduced motion and inline mobile preview');
  assert.deepEqual(errors, [], 'Browser runtime errors');
  assert.deepEqual(failures, [], 'HTTP resource failures');
  writeFileSync(resolve(output, layoutOnly ? 'site-layout-verification.json' : 'site-verification.json'), JSON.stringify({ browser: browser.version(), checks, errors, failures }, null, 2));
  console.log(`PASS ${checks.length} website groups${layoutOnly ? ' (layout pass)' : '; 88 live component demos'}. Browser ${browser.version()}`);
} finally { await browser.close(); }
