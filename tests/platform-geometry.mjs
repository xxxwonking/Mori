import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { parse, compileScript } from '@vue/compiler-sfc';
import { createRenderer, h, nextTick } from 'vue';

const data = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
function nonWeb(source) {
  const enabled = [true];
  return source.split(/\r?\n/).filter(line => {
    const start = line.match(/^\s*\/\/ #(ifdef|ifndef) WEB/);
    if (start) { enabled.push(enabled.at(-1) && start[1] === 'ifndef'); return false; }
    if (/^\s*\/\/ #endif/.test(line)) { enabled.pop(); return false; }
    return enabled.at(-1);
  }).join('\n');
}
const platform = new URL('../uni_modules/mori-ui/platform/', import.meta.url);
const geometryUrl = data(stripTypeScriptTypes(nonWeb(readFileSync(new URL('geometry.uts', platform), 'utf8')), { mode: 'transform' }));
const geometry = await import(geometryUrl);
const source = nonWeb(readFileSync(new URL('canvas.uts', platform), 'utf8'))
  .replace(/^import \{ (ComponentPublicInstance|MoriPoint) \}[^\n]+/gm, '')
  .replace('MoriElementRect, ', '').replace("'./geometry.uts'", JSON.stringify(geometryUrl));
const canvasUrl = data(stripTypeScriptTypes(source, { mode: 'transform' }));
const canvas = await import(canvasUrl);
const queries = [], resize = new Set();
// This is the WeChat UniElement API shape: asynchronous measurement only.
globalThis.uni = {
  getElementById: id => id === 'missing' ? null : { getBoundingClientRectAsync: () => new Promise((resolve, reject) => queries.push({ resolve, reject })) },
  onWindowResize: callback => resize.add(callback),
  offWindowResize: callback => resize.delete(callback)
};
const flush = () => new Promise(resolve => setImmediate(resolve));
const rect = { left: 10, top: 20, width: 300, height: 180 };
assert.equal(geometry.moriElementWidth('canvas', 280), 280);
assert.equal(await geometry.measureMoriElement('missing'), null);
const failed = geometry.measureMoriElement('canvas'); queries.shift().reject(Error('detached')); assert.equal(await failed, null);
const widths = [];
const stop = canvas.observeMoriCanvasWidth('canvas', width => widths.push(width));
const old = queries.shift();
for (const callback of resize) callback();
queries.shift().resolve({ ...rect, width: 400 }); await flush();
old.resolve(rect); await flush();
assert.deepEqual(widths, [400], 'old measurements cannot overwrite newer resize results');
for (const callback of resize) callback();
stop(); queries.shift().resolve(rect); await flush();
assert.deepEqual(widths, [400]); assert.equal(resize.size, 0, 'cleanup removes resize subscriptions');

const strokes = [];
let busy = false;
const touch = canvas.bindMoriCanvasTouch('canvas', 600, 360,
  (x,y) => strokes.push(['start',x,y]), (x,y) => strokes.push(['move',x,y]), () => strokes.push(['end']), value => busy = value);
const event = (x,y) => ({ touches: [{ clientX: x, clientY: y }] });
touch.start(event(40,50)); touch.move(event(70,80)); touch.end();
await flush(); assert.deepEqual(strokes, [], 'points wait for the asynchronous origin'); assert.equal(busy,true,'export remains blocked while points are queued');
queries.shift().resolve(rect); await flush();
assert.deepEqual(strokes, [['start',60,60],['move',120,120],['end']], 'a quick stroke keeps its first point, motion and end in order');
assert.equal(busy,false);
touch.start(event(40,50)); await flush(); touch.cancel(); queries.shift().resolve(rect); await flush();
assert.equal(strokes.length, 3, 'clear/disable/unmount discards queued drawing');
touch.start(event(20,30)); touch.end(); touch.start(event(30,40)); touch.end();
await flush(); queries.shift().resolve(rect); await flush();
assert.equal(busy,true,'the second queued stroke still blocks export');
queries.shift().resolve({ ...rect, left: 20, top: 30 }); await flush();
assert.equal(busy,false);
assert.deepEqual(strokes.slice(3), [['start',20,20],['end'],['start',20,20],['end']], 'successive strokes measure their current origin and preserve order');

// Exercise Signature's real setup too: its synchronous export must not miss queued native points.
const advanceUrl = data(stripTypeScriptTypes(readFileSync(new URL('../advanced.uts',platform),'utf8'),{mode:'transform'}));
const signatureFile = new URL('../components/mori-signature/mori-signature.uvue',platform);
const signatureSource = nonWeb(readFileSync(signatureFile,'utf8')).replace('lang="uts"','lang="ts"');
let script = compileScript(parse(signatureSource).descriptor,{id:'signature-native-test'}).content
  .replace(/from ['"]vue['"]/g,'from '+JSON.stringify(import.meta.resolve('vue')))
  .replace(/import \{ moriPalette \}[^\n]+/, 'const moriPalette={}')
  .replace(/import \{ createMoriFieldId \}[^\n]+/, 'const createMoriFieldId=()=>"canvas"')
  .replace("'../../platform/canvas.uts'",JSON.stringify(canvasUrl))
  .replace('MoriPoint, ', '').replace("'../../advanced.uts'",JSON.stringify(advanceUrl));
const Signature = (await import(data(stripTypeScriptTypes(script,{mode:'transform'})))).default;
Signature.render = () => null;
const ctx = { canvas: {}, clearRect(){}, fillRect(){}, beginPath(){}, moveTo(){}, lineTo(){}, stroke(){}, arc(){}, fill(){} };
globalThis.uni.createCanvasContextAsync = options => options.success({ getContext:()=>ctx, toDataURL:()=>'data:image/png;base64,fixture' });
const renderer = createRenderer({createElement:()=>({}),createText:()=>({}),createComment:()=>({}),insert(){},remove(){},setText(){},setElementText(){},patchProp(){},parentNode:()=>null,nextSibling:()=>null});
let api;
const app = renderer.createApp({setup:()=>()=>h(Signature,{ref:value=>api=value})});
app.mount({}); await flush();
queries.shift().resolve(rect); await flush();
const state = app._instance.subTree.component.setupState;
state.touchStart(event(40,50)); state.touchMove(event(70,80)); state.touchEnd();
assert.equal(state.processing,true); assert.equal(api.exportImage(),'');
await flush(); queries.shift().resolve(rect); await flush(); await nextTick();
assert.equal(state.count,1); assert.equal(state.processing,false); assert.ok(api.exportImage().startsWith('data:image/png'));
state.touchStart(event(50,60)); state.touchEnd();
assert.equal(api.exportImage(),'','an existing stroke must not allow exporting before the new stroke settles');
await flush(); api.clear(); queries.shift().resolve(rect); await flush();
assert.equal(state.count,0); assert.equal(state.processing,false);
app.unmount(); assert.equal(resize.size,0);
delete globalThis.uni;
console.log('PASS asynchronous platform geometry: resize races/cleanup, queued touch coordinates, fast strokes and cancellation.');
