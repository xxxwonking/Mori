import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { componentManifest } from './component-manifest.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, '.impeccable/review');
mkdirSync(output, { recursive: true });
const focused = process.argv.includes('--focused');
const base = process.env.MORI_SITE_URL || 'http://127.0.0.1:5180';
const browser = await chromium.launch({ executablePath: process.env.MORI_BROWSER_EXECUTABLE || undefined });
const context = await browser.newContext({ viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
const page = await context.newPage();
const touch = await context.newCDPSession(page);
let passed = false;
const errors = [], failures = [], checks = [], sweep = [];
page.on('pageerror', e => errors.push(e.message));
page.on('response', r => { if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`); });
const open = async (name, theme = 'light') => {
  await page.goto(`${base}/demo/?example=${name}&appearance=${theme}#/pages/preview/preview?component=${name}&theme=${theme}`, { waitUntil: 'networkidle' });
  await page.locator('.site-preview-content').waitFor();
  await page.waitForFunction(color => getComputedStyle(document.querySelector('.preview-page')).backgroundColor === color, theme === 'dark' ? 'rgb(10, 10, 10)' : 'rgb(250, 250, 250)');
};
const noOverflow = async name => {
  const bounds = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, width: innerWidth }));
  assert(bounds.content <= bounds.width + 1, `${name}: horizontal overflow ${JSON.stringify(bounds)}`);
};
// Wait for real scroll motion to settle before switching between touch and wheel input.
const scrollSettled = locator => locator.evaluate(el => new Promise((resolve, reject) => {
  let last = el.scrollTop, stable = 0, frames = 0;
  const sample = () => {
    stable = Math.abs(el.scrollTop - last) < 0.1 ? stable + 1 : 0;
    last = el.scrollTop;
    if (stable >= 10) resolve();
    else if (++frames > 240) reject(new Error('Scroll did not settle'));
    else requestAnimationFrame(sample);
  };
  requestAnimationFrame(sample);
}));
const shot = name => page.screenshot({ path: resolve(output, `mobile-${name}.png`) });
try {
  for (const component of focused ? [] : componentManifest) {
    await open(component.name);
    assert(await page.locator('.site-preview-content').evaluate(el => el.getBoundingClientRect().height > 0), `${component.name}: empty example`);
    await noOverflow(component.name); sweep.push(component.name);
  }
  if (!focused) checks.push('All 88 actual component examples mount at 320px without page overflow');

  for (const [width, height, theme] of [[320, 640, 'light'], [390, 844, 'dark'], [844, 390, 'light']]) {
    await page.setViewportSize({ width, height });
    await open('popup', theme);
    for (const [name, position] of [['打开长内容', 'bottom'], ['居中长内容', 'center'], ['侧边长内容', 'right']]) {
      await page.getByRole('button', { name, exact: true }).tap();
      const panel = page.locator('.mori-popup__panel');
      await panel.waitFor();
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.mori-popup__panel')).opacity === '1');
      assert.equal(await panel.evaluate(el => getComputedStyle(el).backgroundColor), theme === 'dark' ? 'rgb(23, 23, 23)' : 'rgb(255, 255, 255)', 'Popup theme must match the capture label');
      const bounds = await panel.boundingBox();
      assert(bounds.y >= -1 && bounds.y + bounds.height <= height + 1, `${position} must stay within ${width}x${height}`);
      const close = panel.getByRole('button', { name: '关闭弹出层' });
      const buttonBounds = await close.boundingBox();
      assert(buttonBounds.width >= 44 && buttonBounds.height >= 44, 'Close control needs a 44px touch target');
      const scroller = panel.locator('.mori-popup__scroll .uni-scroll-view .uni-scroll-view').first();
      const dimensions = await scroller.evaluate(el => ({ client: el.clientHeight, scroll: el.scrollHeight }));
      assert(dimensions.client > 0 && dimensions.scroll > dimensions.client + 100, 'Long content needs an actual bounded scroll area: ' + JSON.stringify(dimensions));
      const scrollBounds = await scroller.boundingBox();
      await page.mouse.move(scrollBounds.x + scrollBounds.width / 2, scrollBounds.y + scrollBounds.height / 2);
      await page.mouse.wheel(0, 2500);
      await scrollSettled(scroller);
      await page.waitForFunction(() => document.querySelector('.mori-popup__scroll .uni-scroll-view .uni-scroll-view').scrollTop > 100);
      assert.equal(await page.locator('.mori-popup').evaluate(el => el.scrollTop), 0, 'Only the body scrolls');
      const after = await close.boundingBox();
      assert(Math.abs(after.y - buttonBounds.y) < 1, 'Close button stays visible while content scrolls');
      await shot(`popup-${position}-${width}-${theme}`);
      await close.tap(); await panel.waitFor({ state: 'detached' });
    }
    await noOverflow(`popup-${width}`);
  }
  checks.push('Bottom/center/side long-content scrolling, persistent 44px close targets and touch close at 320/390/844px');

  await page.setViewportSize({ width: 320, height: 640 });
  await open('navbar', 'dark');
  await noOverflow('long navbar');
  const nav = page.locator('.mori-navbar').last();
  const title = await nav.locator('.mori-navbar__title').boundingBox();
  const sides = await nav.locator('.mori-navbar__side').all();
  const left = await sides[0].boundingBox(), right = await sides[1].boundingBox();
  assert(left.x + left.width <= title.x + 1 && title.x + title.width <= right.x + 1, 'Title and actions may not overlap');
  assert(left.height >= 44 && right.height >= 44);
  await nav.getByRole('button', { name: '保存全部修改' }).tap();
  await page.getByText('长文字保存操作', { exact: true }).waitFor();
  await shot('navbar-long-dark');
  checks.push('Long navbar labels stay bounded, full accessible names and touch actions survive');

  // Resize an already open popup, as happens with rotation or a resized app window.
  await open('popup');
  await page.getByRole('button', { name: '打开长内容', exact: true }).tap();
  await page.setViewportSize({ width: 640, height: 320 });
  await page.waitForFunction(() => document.querySelector('.mori-popup__panel').getBoundingClientRect().bottom <= innerHeight + 1);
  await page.locator('.mori-popup__close').tap();
  await page.locator('.mori-popup').waitFor({ state: 'detached' });
  assert.equal(await page.evaluate(() => document.body.style.overflow), '', 'Closing restores the background scroll lock');
  checks.push('Open-popup rotation updates height and closing releases the scroll lock');
  // Run raw touch scrolling last, in a fresh page. Chromium 145 raw-CDP scrolling
  // suppresses the next synthesized click even for a plain HTML button (see progress).
  // Touch taps above and scrolling here are separate evidence; don't claim the combination.
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('about:blank');
  await open('popup');
  await page.getByRole('button', { name: '打开长内容', exact: true }).tap();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.mori-popup__panel')).opacity === '1');
  const touchBody = page.locator('.mori-popup__scroll .uni-scroll-view .uni-scroll-view').first();
  const touchBounds = await touchBody.boundingBox();
  const x = touchBounds.x + touchBounds.width / 2, y = touchBounds.y + touchBounds.height - 24;
  await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let step = 1; step <= 8; step++) await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - step * 24 }] });
  await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForFunction(() => document.querySelector('.mori-popup__scroll .uni-scroll-view .uni-scroll-view').scrollTop > 20);
  await scrollSettled(touchBody);
  await page.keyboard.press('Escape');
  await page.locator('.mori-popup').waitFor({ state: 'detached' });
  checks.push('Raw touch scroll moves the content; Escape closes afterward. Subsequent touch tap requires physical-device verification');
  assert.deepEqual(errors, []); assert.deepEqual(failures, []);
  passed = true;
  console.log(`PASS ${checks.length} mobile groups; ${sweep.length} component examples; ${browser.version()}`);
} finally {
  writeFileSync(resolve(output, focused ? 'mobile-focused-verification.json' : 'mobile-verification.json'), JSON.stringify({ passed, generated: new Date().toISOString(), browser: browser.version(), sweep, checks, errors, failures, evidence: 'Chromium touch/viewport simulation, not physical mobile devices' }, null, 2));
  await browser.close();
}
