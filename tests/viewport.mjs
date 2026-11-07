import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { createRenderer, h, nextTick } from 'vue';
import { parse, compileScript } from '@vue/compiler-sfc';

const data = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
function branch(source, web) {
  const enabled = [true];
  return source.split(/\r?\n/).filter(line => {
    const start = line.match(/^\s*\/\/ #(ifdef|ifndef) WEB/);
    if (start) { enabled.push(enabled.at(-1) && (start[1] === 'ifdef' ? web : !web)); return false; }
    if (/^\s*\/\/ #endif/.test(line)) { enabled.pop(); return false; }
    return enabled.at(-1);
  }).join('\n');
}
function moduleUrl(source) {
  return data(stripTypeScriptTypes(source.replace(/from ['"]vue['"]/g, 'from ' + JSON.stringify(import.meta.resolve('vue'))), { mode: 'transform' }));
}
const renderer = createRenderer({ createElement: () => ({}), createText: () => ({}), createComment: () => ({}), insert() {}, remove() {}, setText() {}, setElementText() {}, patchProp() {}, parentNode: () => null, nextSibling: () => null });
const source = readFileSync(new URL('../uni_modules/mori-ui/platform/viewport.uts', import.meta.url), 'utf8');
let info = { windowWidth: 390, windowHeight: 844, safeAreaInsets: { top: 47, bottom: 34 } };
const nativeListeners = new Set();
globalThis.uni = { getWindowInfo: () => info, onWindowResize: cb => nativeListeners.add(cb), offWindowResize: cb => nativeListeners.delete(cb) };
const nativeUrl = moduleUrl(branch(source, false));
const native = await import(nativeUrl);
const mount = use => { let state; const app = renderer.createApp({ setup() { state = use(); return () => null; } }); app.mount({}); return { app, state }; };
const a = mount(native.useMoriViewport), b = mount(native.useMoriViewport);
assert.equal(nativeListeners.size, 1, 'multiple consumers share a host subscription');
assert.deepEqual(a.state.value, { width: 390, height: 844, top: 0, left: 0, safeTop: 47, safeBottom: 34 });

// The real SafeArea setup must update on rotation, without requiring a size prop.
const componentSource = branch(readFileSync(new URL('../uni_modules/mori-ui/components/mori-safe-area/mori-safe-area.uvue', import.meta.url), 'utf8'), false).replace('lang="uts"', 'lang="ts"');
const compiled = compileScript(parse(componentSource).descriptor, { id: 'safe-area-window' }).content.replace("'../../platform/viewport.uts'", JSON.stringify(nativeUrl));
const SafeArea = (await import(moduleUrl(compiled))).default;
SafeArea.render = () => null;
const safeApp = renderer.createApp({ render: () => h(SafeArea) }); safeApp.mount({});
const area = () => safeApp._instance.subTree.component.setupState.areaStyle;
assert.match(area(), /height:34px/);
info = { windowWidth: 844, windowHeight: 390, safeAreaInsets: { top: 0, bottom: 21 } };
for (const cb of nativeListeners) cb(); await nextTick();
assert.equal(a.state.value.height, 390); assert.match(area(), /height:21px/);
info = { windowWidth: 0, windowHeight: 0 };
for (const cb of nativeListeners) cb();
assert.equal(a.state.value.height, 390, 'transient invalid windows keep the last usable measurement');
a.app.unmount(); assert.equal(nativeListeners.size, 1);
b.app.unmount(); safeApp.unmount(); assert.equal(nativeListeners.size, 0);

const events = () => {
  const callbacks = new Map();
  return { addEventListener(type, cb) { if (!callbacks.has(type)) callbacks.set(type, new Set()); callbacks.get(type).add(cb); }, removeEventListener(type, cb) { callbacks.get(type)?.delete(cb); }, fire(type) { for (const cb of callbacks.get(type) || []) cb(); }, count() { return [...callbacks.values()].reduce((sum, cbs) => sum + cbs.size, 0); } };
};
const visual = { ...events(), width: 390, height: 480, offsetTop: 16, offsetLeft: 0, scale: 1 };
globalThis.window = { ...events(), innerWidth: 390, innerHeight: 844, visualViewport: visual };
info = { windowWidth: 390, windowHeight: 844 };
const web = await import(moduleUrl(branch(source, true)));
const c = mount(web.useMoriViewport);
assert.equal(c.state.value.height, 480); assert.equal(c.state.value.top, 16);
visual.height = 420; visual.offsetTop = 25; visual.fire('resize');
assert.equal(c.state.value.height, 420); assert.equal(c.state.value.top, 25);
visual.scale = 2; visual.fire('resize');
assert.equal(c.state.value.height, 844, 'pinch zoom must not reflow the popup to the zoomed viewport');
assert.equal(c.state.value.top, 0);
c.app.unmount(); assert.equal(visual.count(), 0); assert.equal(window.count(), 0);
delete globalThis.uni; delete globalThis.window;
console.log('PASS viewport subscriptions/cleanup, rotation, actual SafeArea updates, invalid windows, visual viewport and pinch zoom. Host events are simulated, not device evidence.');
