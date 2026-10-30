import { chromium, expect } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const browser = await chromium.launch({ channel: process.env.MORI_BROWSER_EXECUTABLE ? undefined : 'chromium', executablePath: process.env.MORI_BROWSER_EXECUTABLE || undefined, headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference', colorScheme: 'light' });
const evidence = {};
const nav = name => page.locator('.mobile-nav-item').filter({ hasText: name }).click();
const sample = async (control, animated, property) => page.evaluate(async ({ control, animated, property }) => {
  const target = document.querySelector(control);
  const node = document.querySelector(animated);
  const samples = [];
  const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
  await frame();
  const start = performance.now();
  target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  do {
    await frame();
    const style = getComputedStyle(node);
    const bounds = target.getBoundingClientRect();
    samples.push({ time: performance.now() - start, value: property === 'opacity' ? Number(style.opacity) : new DOMMatrix(style.transform).m41, width: bounds.width, height: bounds.height });
  } while (performance.now() - start < 280);
  return samples;
}, { control, animated, property });
function verifyFrames(samples, start, end) {
  expect(samples.some(frame => frame.value > Math.min(start, end) + 0.01 && frame.value < Math.max(start, end) - 0.01)).toBe(true);
  expect(samples.at(-1).value).toBeCloseTo(end, 2);
  expect(new Set(samples.map(frame => `${frame.width},${frame.height}`)).size).toBe(1);
}
try {
  await page.goto(process.env.MORI_BASE_URL || 'http://127.0.0.1:5173', { waitUntil: 'networkidle' });
  await nav('开关');
  evidence.switch = await sample('.selection-stage .mori-switch__control', '.selection-stage .mori-switch__thumb', 'transform');
  verifyFrames(evidence.switch, 16, 0);
  const switcher = page.locator('.selection-stage [role="switch"]').first();
  await expect(switcher).toHaveAttribute('aria-checked', 'false');
  // Reverse an in-flight transition three times and confirm the final controlled state.
  await page.evaluate(async () => {
    const control = document.querySelector('.selection-stage [role="switch"]');
    for (let index = 0; index < 3; index++) {
      control.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
  });
  await expect(switcher).toHaveAttribute('aria-checked', 'true');
  await expect(switcher.locator('.mori-switch__thumb')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 16, 0)');
  await nav('复选框');
  evidence.checkbox = await sample('.selection-stage .mori-checkbox', '.selection-stage .mori-checkbox__check', 'opacity');
  verifyFrames(evidence.checkbox, 1, 0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.selection-stage .mori-checkbox__check').first()).toHaveCSS('transition-duration', '0s');
  await nav('开关');
  await expect(page.locator('.selection-stage .mori-switch__thumb').first()).toHaveCSS('transition-duration', '0s');
  evidence.generated = new Date().toISOString();
  evidence.checks = ['Switch has intermediate transform frames', 'Checkbox has intermediate opacity frames', 'Control bounds stay fixed', 'Rapid reversal settles to the last state', 'Reduced motion disables both transitions'];
  writeFileSync(new URL('../.impeccable/review/motion-verification.json', import.meta.url), JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify({ passed: evidence.checks, switchFrames: evidence.switch.length, checkboxFrames: evidence.checkbox.length }, null, 2));
} finally { await browser.close(); }
