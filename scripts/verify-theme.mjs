import { chromium, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const base = process.env.MORI_SITE_URL || 'http://127.0.0.1:5180';
const out = new URL('../.impeccable/review/', import.meta.url);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: process.env.MORI_BROWSER_EXECUTABLE ? undefined : 'chromium', executablePath: process.env.MORI_BROWSER_EXECUTABLE || undefined, headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 800 }, reducedMotion: 'reduce' });
const errors = [], checks = [];
page.on('pageerror', e => errors.push(e.message));
page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
const shot = name => page.screenshot({ path: fileURLToPath(new URL(`shadcn-${name}.png`, out)), fullPage: true });
function colorContrast(a, b) {
  const luminance = color => {
    const c = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
  };
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
async function open(name, theme) {
  await page.goto(`${base}/demo/?theme-check=${name}-${theme}#/pages/preview/preview?component=${name}&theme=${theme}`, { waitUntil: 'networkidle' });
  await expect(page.locator('.preview-page')).toHaveCSS('background-color', theme === 'dark' ? 'rgb(10, 10, 10)' : 'rgb(250, 250, 250)');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
try {
  for (const theme of ['light', 'dark']) {
    const dark = theme === 'dark';
    await open('button', theme);
    const solid = page.getByRole('button', { name: '主要按钮', exact: true });
    const outline = page.getByRole('button', { name: '描边按钮', exact: true });
    await expect(solid).toHaveCSS('background-color', dark ? 'rgb(229, 229, 229)' : 'rgb(23, 23, 23)');
    await expect(solid.locator('.mori-button__label')).toHaveCSS('color', dark ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)');
    await expect(solid).toHaveCSS('height', '36px');
    await expect(outline).toHaveCSS('border-color', dark ? 'rgb(64, 64, 64)' : 'rgb(212, 212, 212)');
    const bounds = await outline.boundingBox();
    await outline.hover();
    await expect(outline).toHaveCSS('background-color', dark ? 'rgb(51, 51, 51)' : 'rgb(245, 245, 245)');
    await outline.focus();
    await expect(outline).toHaveCSS('outline-style', 'solid');
    expect(await outline.boundingBox()).toEqual(bounds);
    await outline.press('Enter');
    await expect(page.getByRole('status')).toHaveText('点击了描边按钮');
    await shot(`button-${theme}`);
    const solidBounds = await solid.boundingBox();
    await solid.focus();
    await expect(solid).toHaveCSS('outline-style', 'solid');
    const focusColors = await solid.evaluate(el => {
      const style = getComputedStyle(el);
      return { ring: style.outlineColor, background: style.backgroundColor };
    });
    expect(colorContrast(focusColors.ring, focusColors.background)).toBeGreaterThanOrEqual(3);
    expect(await solid.boundingBox()).toEqual(solidBounds);
    await shot(`solid-focus-${theme}`);
    checks.push(`${theme}: button hierarchy, hover, keyboard, 36px and stable bounds`);

    await open('input', theme);
    const first = page.locator('.mori-field').first(), field = first.locator('.mori-field__control');
    const before = await field.boundingBox();
    await first.locator('input').fill('测试焦点');
    await expect(field).toHaveCSS('border-color', dark ? 'rgb(163, 163, 163)' : 'rgb(115, 115, 115)');
    await expect(field).toHaveCSS('border-width', '1px');
    await expect(first.locator('input')).toHaveCSS('outline-style', 'none');
    expect(await field.boundingBox()).toEqual(before);
    const invalid = page.locator('.mori-field').filter({ hasText: '校验反馈' });
    await invalid.locator('input').focus();
    await expect(invalid.locator('.mori-field__control')).toHaveCSS('border-color', dark ? 'rgb(248, 113, 113)' : 'rgb(198, 40, 40)');
    await expect(invalid.locator('input')).toHaveAttribute('aria-invalid', 'true');
    await shot(`input-${theme}`);
    checks.push(`${theme}: single input border, neutral focus, persistent invalid state and no size change`);

    await open('switch', theme);
    const control = page.locator('.mori-switch').first(), track = control.locator('.mori-switch__track'), thumb = control.locator('.mori-switch__thumb');
    const trackBounds = await track.boundingBox();
    await expect(thumb).toHaveCSS('background-color', dark ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)');
    await control.getByRole('switch').click();
    await expect(track).toHaveCSS('background-color', dark ? 'rgb(64, 64, 64)' : 'rgb(212, 212, 212)');
    await expect(thumb).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    expect(await track.boundingBox()).toEqual(trackBounds);
    await control.getByRole('switch').click();
    await shot(`switch-${theme}`);
    await open('checkbox', theme);
    const checkbox = page.getByRole('checkbox').first(), box = checkbox.locator('.mori-checkbox__box');
    const checkboxBounds = await box.boundingBox();
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
    await expect(box).toHaveCSS('background-color', dark ? 'rgb(229, 229, 229)' : 'rgb(23, 23, 23)');
    await expect(checkbox.locator('.mori-checkbox__check img')).toHaveAttribute('src', new RegExp(`check-${dark ? 'dark' : 'light'}\\.svg$`));
    expect(await box.boundingBox()).toEqual(checkboxBounds);
    await shot(`checkbox-${theme}`);
    checks.push(`${theme}: switch thumb contrast, neutral off track, checked icon and stable selection bounds`);

    await open('tabs', theme);
    const tabs = page.getByRole('tab');
    const sizes = await tabs.evaluateAll(nodes => nodes.map(n => ({ width: n.offsetWidth, height: n.offsetHeight })));
    await tabs.last().click();
    await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
    expect(await tabs.evaluateAll(nodes => nodes.map(n => ({ width: n.offsetWidth, height: n.offsetHeight })))).toEqual(sizes);
    await shot(`tabs-${theme}`);
    await open('card', theme); await shot(`card-${theme}`);
    checks.push(`${theme}: segmented tab state, stable layout and card surface`);
  }
  await page.setViewportSize({ width: 360, height: 780 });
  await open('input', 'dark'); await shot('mobile-360');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/components/button`, { waitUntil: 'networkidle' });
  await page.frameLocator('.aside iframe').getByText('操作层级', { exact: true }).waitFor();
  await page.screenshot({ path: fileURLToPath(new URL('shadcn-desktop.png', out)) });
  expect(errors).toEqual([]);
  writeFileSync(new URL('shadcn-verification.json', out), JSON.stringify({ passed: true, generated: new Date().toISOString(), browser: browser.version(), checks, errors }, null, 2));
  console.log(`PASS ${checks.length} neutral-theme interaction groups, 360/390/1440px captures, no page/resource errors`);
} finally { await browser.close(); }
