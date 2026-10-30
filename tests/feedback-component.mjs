import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { parse, compileScript } from '@vue/compiler-sfc';
import { createRenderer, h, ref, nextTick } from 'vue';

// Run the real component's setup/watchers with Vue; only the DOM renderer and clock are replaced.
const source = readFileSync(new URL('../uni_modules/mori-ui/components/mori-toast/mori-toast.uvue', import.meta.url), 'utf8').replace('lang="uts"', 'lang="ts"');
const descriptor = parse(source).descriptor;
const feedbackSource = stripTypeScriptTypes(readFileSync(new URL('../uni_modules/mori-ui/feedback.uts', import.meta.url), 'utf8'));
const feedbackURL = 'data:text/javascript;base64,' + Buffer.from(feedbackSource).toString('base64');
let code = compileScript(descriptor, { id: 'toast-behavior-test' }).content;
code = code.replace(/from ['"]vue['"]/g, 'from ' + JSON.stringify(import.meta.resolve('vue')))
  .replace('{ MoriToastOptions, createMoriToastTimer }', '{ createMoriToastTimer }')
  .replace(/import \{ moriIsDark \} from ['"]\.\.\/\.\.\/theme\.uts['"]/, 'const moriIsDark = ref(false)')
  .replace(/from ['"]\.\.\/\.\.\/feedback\.uts['"]/, 'from ' + JSON.stringify(feedbackURL));
const { default: Toast } = await import('data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(code)).toString('base64'));
Toast.render = () => null;
const renderer = createRenderer({
  createElement: () => ({}), createText: () => ({}), createComment: () => ({}),
  insert() {}, remove() {}, setText() {}, setElementText() {}, patchProp() {},
  parentNode: () => null, nextSibling: () => null,
});
let now = 0;
let nextId = 0;
const jobs = new Map();
const originalSetTimeout = globalThis.setTimeout;
const originalClearTimeout = globalThis.clearTimeout;
globalThis.setTimeout = (callback, delay) => { const id = ++nextId; jobs.set(id, { callback, due: now + delay }); return id; };
globalThis.clearTimeout = id => jobs.delete(id);
async function tick(ms) {
  now += ms;
  for (const [id, job] of [...jobs]) {
    if (job.due <= now && jobs.has(id)) { jobs.delete(id); job.callback(); }
  }
  await nextTick();
}
const visible = ref(false);
const message = ref('prop default');
const duration = ref(2000);
const updates = [];
let closed = 0;
let instance;
let unmounted = false;
const app = renderer.createApp({ setup: () => () => h(Toast, {
  ref: value => { if (value != null) instance = value; },
  modelValue: visible.value, message: message.value, duration: duration.value,
  'onUpdate:modelValue': value => { updates.push(value); visible.value = value; },
  onClose: () => closed++,
}) });
try {
  app.mount({});
  await nextTick();
  instance.show({ message: 'imperative content', type: 'success', duration: 1000, position: 'top' });
  await nextTick();
  const state = app._instance.subTree.component.setupState;
  assert.equal(visible.value, true);
  assert.equal(state.currentMessage, 'imperative content', 'Parent model ACK preserves imperative content');
  assert.equal(state.currentType, 'success');
  assert.equal(state.currentPosition, 'top');
  await tick(900);
  assert.equal(state.visible, true);
  message.value = 'parent replacement';
  await nextTick();
  assert.equal(state.currentMessage, 'parent replacement');
  await tick(200);
  assert.equal(state.visible, true, 'Parent message restarts the full countdown');
  duration.value = 500;
  await nextTick();
  await tick(400);
  assert.equal(state.visible, true, 'Parent duration starts a new countdown');
  await tick(100);
  assert.equal(state.visible, false);
  assert.equal(closed, 1);
  instance.close();
  assert.equal(closed, 1, 'Closing an expired toast is idempotent');
  duration.value = 0;
  await nextTick();
  instance.show({});
  await nextTick();
  assert.equal(state.currentMessage, 'parent replacement', 'Omitted show options use current prop defaults');
  assert.equal(state.currentType, 'text');
  assert.equal(state.currentPosition, 'middle');
  await tick(10000);
  assert.equal(state.visible, true, 'Zero duration persists');
  visible.value = false;
  await nextTick();
  assert.equal(state.visible, false, 'Controlled false dismisses imperative session');
  assert.equal(closed, 2);
  instance.close();
  assert.equal(closed, 2);
  visible.value = true;
  await nextTick();
  assert.equal(state.visible, true, 'Controlled reopen uses prop defaults');
  instance.show({ message: 'unmount pending', duration: 1000 });
  await nextTick();
  assert.equal(jobs.size, 1);
  app.unmount();
  unmounted = true;
  assert.equal(jobs.size, 0, 'Unmount cancels pending timer');
  const count = updates.length;
  await tick(2000);
  assert.equal(updates.length, count, 'Unmount never emits stale visibility events');
  assert.equal(closed, 2);
  console.log('PASS real Toast lifecycle: model ACK, prop changes, controlled dismissal/reopen, close once and unmount');
} finally {
  if (!unmounted) app.unmount();
  globalThis.setTimeout = originalSetTimeout;
  globalThis.clearTimeout = originalClearTimeout;
}
