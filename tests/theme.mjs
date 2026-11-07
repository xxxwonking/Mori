import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { parse, compileScript } from '@vue/compiler-sfc';
import { createRenderer, h, ref, nextTick } from 'vue';

const data = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const contrast = data(stripTypeScriptTypes(readFileSync(new URL('../uni_modules/mori-ui/contrast.uts', import.meta.url), 'utf8')));
const source = readFileSync(new URL('../uni_modules/mori-ui/theme.uts', import.meta.url), 'utf8')
  .replace("'vue'", JSON.stringify(import.meta.resolve('vue')))
  .replace("'./contrast.uts'", JSON.stringify(contrast));
let hostChange;
globalThis.uni = {
  setAppTheme() {}, getAppBaseInfo: () => ({ hostTheme: 'light' }),
  getDeviceInfo: () => ({ osTheme: 'light' }),
  onHostThemeChange(callback) { hostChange = callback; }, onOsThemeChange() {}
};
const themeUrl = data(stripTypeScriptTypes(source));
const { initMoriTheme, setMoriConfig, moriPalette, moriThemeMode } = await import(themeUrl);
initMoriTheme();
function luminance(hex) {
  const values = hex.slice(1).match(/../g).map(c => parseInt(c, 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
}
function contrastRatio(a, b) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
for (const mode of ['light', 'dark']) {
  setMoriConfig({ theme: mode });
  const p = moriPalette.value;
  for (const key of ['primary','soft','surface','ground','text','muted','border','input','ring','accent']) assert.match(p[key], /^#([0-9a-f]{2})\1\1$/, `${mode} ${key} must be neutral`);
  for (const [text, background] of [['text','surface'],['muted','surface'],['muted','soft'],['muted','ground'],['onPrimary','primary'],['danger','dangerSoft']]) {
    assert(contrastRatio(p[text], p[background]) >= 4.5, `${mode} ${text}/${background} must remain readable`);
  }
}
setMoriConfig({ theme: 'light' });
hostChange({ hostTheme: 'dark' });
assert.equal(moriPalette.value.surface, '#ffffff', 'Fixed light ignores host updates');
setMoriConfig({ theme: 'auto' });
assert.equal(moriThemeMode.value, 'auto');
assert.equal(moriPalette.value.surface, '#171717', 'Auto immediately resumes current host theme');
setMoriConfig({ color: '#0066d6', darkColor: '#8cb6ff', softColor: '#eaf2ff', darkSoftColor: '#243450' });
assert.equal(moriPalette.value.primary, '#8cb6ff');
assert.equal(moriPalette.value.onPrimary, '#000000');
hostChange({ hostTheme: 'light' });
assert.equal(moriPalette.value.primary, '#0066d6', 'Custom brand overrides still work');
assert.equal(moriPalette.value.onPrimary, '#ffffff');


// Partial patches preserve sibling tokens and the other mode; aliases and new
// options share one state, so subsequent legacy calls must still take effect.
const { resetMoriConfig } = await import(themeUrl);
const { moriMessages } = await import(themeUrl);
setMoriConfig({ messages: { required: 'Required', closePopup: 'Close panel' } });
assert.equal(moriMessages.value.required, 'Required');
assert.equal(moriMessages.value.clearInput, '清空输入', 'Partial messages preserve other labels');
setMoriConfig({ messages: { clearInput: 'Clear', required: '  ' } });
assert.equal(moriMessages.value.required, 'Required', 'Empty messages cannot erase accessible names');
assert.equal(moriMessages.value.clearInput, 'Clear');
assert.throws(() => setMoriConfig({ theme: 'invalid', messages: { required: 'wrong' } }));
assert.equal(moriMessages.value.required, 'Required', 'Invalid config must not partly update labels');
resetMoriConfig();
assert.equal(moriMessages.value.required, '必填');
assert.equal(moriMessages.value.clearInput, '清空输入');
setMoriConfig({ light: { surface: '#f7f8ff', muted: '#334466', primary: '#4338ca' }, dark: { surface: '#17213b' } });
assert.equal(moriPalette.value.surface, '#f7f8ff');
setMoriConfig({ light: { border: '#a5b4fc', surface: '' } });
assert.equal(moriPalette.value.surface, '#f7f8ff');
assert.equal(moriPalette.value.muted, '#334466');
setMoriConfig({ color: '#123456', light: { primary: '#234567' } });
assert.equal(moriPalette.value.primary, '#234567');
setMoriConfig({ color: '#345678' });
assert.equal(moriPalette.value.primary, '#345678');
setMoriConfig({ theme: 'dark' });
assert.equal(moriPalette.value.surface, '#17213b');
assert.throws(() => setMoriConfig({ theme: 'invalid', dark: { surface: '#ffffff' } }));
assert.equal(moriPalette.value.surface, '#17213b');
hostChange({ hostTheme: 'dark' });
resetMoriConfig();
assert.equal(moriThemeMode.value, 'auto');
assert.equal(moriPalette.value.surface, '#171717');
assert.equal(moriPalette.value.primary, '#e5e5e5');
hostChange({ hostTheme: 'light' });
assert.equal(moriPalette.value.surface, '#ffffff');
assert.equal(moriPalette.value.primary, '#171717');
assert.equal(moriPalette.value.overlay, 'rgba(0, 0, 0, 0.5)');

// Run the real Button setup with the real runtime theme. An inset focus line must
// contrast with the button fill even when an explicit label textColor is supplied.
const buttonSource = readFileSync(new URL('../uni_modules/mori-ui/components/mori-button/mori-button.uvue', import.meta.url), 'utf8').replace('lang="uts"', 'lang="ts"');
let buttonCode = compileScript(parse(buttonSource).descriptor, { id: 'theme-button-focus' }).content;
buttonCode = buttonCode.replace(/from ['"]vue['"]/g, 'from ' + JSON.stringify(import.meta.resolve('vue')))
  .replace(/from ['"]\.\.\/\.\.\/theme\.uts['"]/g, 'from ' + JSON.stringify(themeUrl))
  .replace(/from ['"]\.\.\/\.\.\/contrast\.uts['"]/g, 'from ' + JSON.stringify(contrast));
const Button = (await import(data(stripTypeScriptTypes(buttonCode)))).default;
Button.render = () => null;
const renderer = createRenderer({ createElement: () => ({}), createText: () => ({}), createComment: () => ({}), insert() {}, remove() {}, setText() {}, setElementText() {}, patchProp() {}, parentNode: () => null, nextSibling: () => null });
const props = ref({ variant: 'solid' });
const app = renderer.createApp({ setup: () => () => h(Button, props.value) });
app.mount({});
for (const background of ['#171717', '#e5e5e5', '#0066d6', '#8cb6ff', '#808080']) {
  props.value = { variant: 'solid', color: background, textColor: '#777777' };
  await nextTick();
  const style = app._instance.subTree.component.setupState.buttonStyle;
  const ring = style.match(/--mori-button-ring:([^;]+)/)[1];
  assert(contrastRatio(ring, background) >= 3, `Solid inset focus must contrast with ${background}`);
}
props.value = { variant: 'solid', color: '#ffffff', backgroundColor: '#123456', borderColor: '#abcdef', loading: true };
await nextTick();
const customStyle = app._instance.subTree.component.setupState.buttonStyle;
assert(customStyle.includes('background-color:#123456;'));
assert(customStyle.includes('border-color:#abcdef;'));
assert.equal(app._instance.subTree.component.setupState.foreground, '#ffffff');
assert(contrastRatio(customStyle.match(/--mori-button-ring:([^;]+)/)[1], '#123456') >= 3);
props.value = { variant: 'outline' };
await nextTick();
assert(app._instance.subTree.component.setupState.buttonStyle.includes('--mori-button-ring:' + moriPalette.value.ring + ';'));
app.unmount();
// Inspect the actual SVG ink, not just a filename, while an open Toast's theme changes.
const toastSource = readFileSync(new URL('../uni_modules/mori-ui/components/mori-toast/mori-toast.uvue', import.meta.url), 'utf8').replace('lang="uts"', 'lang="ts"');
const feedbackUrl = data(stripTypeScriptTypes(readFileSync(new URL('../uni_modules/mori-ui/feedback.uts', import.meta.url), 'utf8')));
let toastCode = compileScript(parse(toastSource).descriptor, { id: 'theme-toast-surface' }).content;
toastCode = toastCode.replace(/from ['"]vue['"]/g, 'from ' + JSON.stringify(import.meta.resolve('vue')))
  .replace('{ MoriToastOptions, createMoriToastTimer }', '{ createMoriToastTimer }')
  .replace(/from ['"]\.\.\/\.\.\/theme\.uts['"]/g, 'from ' + JSON.stringify(themeUrl))
  .replace(/from ['"]\.\.\/\.\.\/contrast\.uts['"]/g, 'from ' + JSON.stringify(contrast))
  .replace(/from ['"]\.\.\/\.\.\/feedback\.uts['"]/g, 'from ' + JSON.stringify(feedbackUrl));
const Toast = (await import(data(stripTypeScriptTypes(toastCode)))).default;
Toast.render = () => null;
const toastType = ref('success');
const toastApp = renderer.createApp({ setup: () => () => h(Toast, { type: toastType.value, modelValue: true, duration: 0 }) });
toastApp.mount({});
try {
  for (const mode of ['light', 'dark']) {
    for (const surface of ['#000000', '#ffffff', '#171717']) {
      setMoriConfig({ theme: mode, [mode]: { surface } });
      for (const type of ['success', 'error']) {
        toastType.value = type;
        await nextTick();
        const state = toastApp._instance.subTree.component.setupState;
        assert.equal(state.visible, true, 'Theme changes must not dismiss an open Toast');
        const svg = readFileSync(new URL('../' + state.iconSource.slice(1), import.meta.url), 'utf8');
        const ink = svg.match(/stroke="(#[0-9a-fA-F]{6})"/)[1];
        assert(contrastRatio(ink, surface) >= 3, `${mode}/${surface}/${type}: icon must remain visible on its actual surface`);
      }
    }
  }
} finally { toastApp.unmount(); resetMoriConfig(); }

delete globalThis.uni;
console.log('PASS neutral themes, Button focus and open Toast SVG contrast on custom surfaces in both theme modes');
