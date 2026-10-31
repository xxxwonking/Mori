import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { parse, compileScript } from '@vue/compiler-sfc';
import { createRenderer, h, ref, nextTick } from 'vue';
const root = new URL('../uni_modules/mori-ui/', import.meta.url);
const data = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const cache = new Map();
function clean(source) {
  return source.replace(/import\s*\{([^}]+)\}\s*from\s*(['"][^'"]+['"])/g, (_, names, path) => {
    const keep = names.split(',').map(s=>s.trim()).filter(n=>!n.startsWith('Mori') && n!=='PropType');
    return keep.length ? 'import { '+keep.join(', ')+' } from '+path : '';
  });
}
function resolveModule(url) {
  if (url.endsWith('/theme.uts')) return data('export const moriPalette={value:{surface:"#fff",text:"#1d2430",primary:"#0066d6"}}');
  if (url.endsWith('/platform/overlay-accessibility.uts')) return data('export const moriOverlayReducedMotion=()=>false');
  if (url.endsWith('/platform/accessibility.uts')) return data('export const createMoriFieldId=()=>"test-field"');
  if (url.endsWith('/platform/selection-accessibility.uts')) return data('export const focusMoriRadio=()=>{}');
  if(cache.has(url))return cache.get(url);
  const code=imports(clean(readFileSync(new URL(url),'utf8')),url);
  const result=data(stripTypeScriptTypes(code));cache.set(url,result);return result;
}
function imports(source,url) { return source.replace(/from ['"]vue['"]/g,'from '+JSON.stringify(import.meta.resolve('vue'))).replace(/from ['"]([^'"]+\.uts)['"]/g,(_,dep)=>'from '+JSON.stringify(resolveModule(new URL(dep,url).href))); }
async function component(name) {
  const url=new URL(`components/mori-${name}/mori-${name}.uvue`,root);
  const source=readFileSync(url,'utf8').replace('lang="uts"','lang="ts"');
  const code=imports(clean(compileScript(parse(source).descriptor,{id:'test-'+name}).content),url.href);
  const result=(await import(data(stripTypeScriptTypes(code)))).default;result.render=()=>null;return result;
}
const renderer=createRenderer({createElement:()=>({}),createText:()=>({}),createComment:()=>({}),insert(){},remove(){},setText(){},setElementText(){},patchProp(){},parentNode:()=>null,nextSibling:()=>null});
function mount(Type, initial) {
  const props=ref(initial), events=[];let instance;
  const listeners={};for(const event of Type.emits||[])listeners['on'+event[0].toUpperCase()+event.slice(1)]=(...args)=>{events.push([event,...args]);if(event.startsWith('update:'))props.value={...props.value,[event.slice(7)]:args[0]}};
  const app=renderer.createApp({setup:()=>()=>h(Type,{...props.value,...listeners,ref:v=>instance=v})});app.mount({});
  return { app, props, events, get api(){return instance},get state(){return app._instance.subTree.component.setupState} };
}
const tree=[{value:'a',label:'A',children:[{value:'b',label:'B',children:[{value:'c',label:'C'}]},{value:'d',label:'Disabled',disabled:true}]}];
const logic=await import(resolveModule(new URL('extended-input.uts',root).href));
assert.deepEqual(logic.moriTreePath(tree,['a','b','c']).map(n=>n.value),['a','b','c']);
assert.deepEqual(logic.moriTreePath(tree,['a','d']).map(n=>n.value),['a']);
assert.deepEqual(logic.moriTreePath(tree,['missing','c']),[]);
assert.equal(logic.moriTreeRows([{...tree[0],disabled:true}],['a','b']).every(n=>n.disabled),true,'ancestor disabled is inherited');
const content=await import(resolveModule(new URL('content.uts',root).href));
assert.deepEqual(content.moriHighlight('a.* A.*','.*',false).filter(n=>n.highlighted).map(n=>n.text),['.*','.*']);
assert.equal(content.moriHighlight('<b>x</b>','x',true).map(n=>n.text).join(''),'<b>x</b>');
assert.equal(content.moriCountdownText(86400000),'24:00:00');
assert.equal(content.moriCountdownText(NaN),'00:00:00');
const Cascader=await component('cascader');
let c=mount(Cascader,{show:true,modelValue:[],options:tree});
c.state.select('a');c.state.select('d');assert.deepEqual(c.state.draft,['a']);
c.api.confirm();assert.equal(c.props.value.show,true,'branches cannot commit');
c.state.select('b');c.state.select('c');c.api.cancel();await nextTick();assert.deepEqual(c.props.value.modelValue,[]);
c.props.value={...c.props.value,show:true};await nextTick();assert.deepEqual(c.state.draft,[],'cancel clears on reopen');
c.state.select('a');c.state.select('b');c.state.select('c');c.api.confirm();await nextTick();assert.deepEqual(c.props.value.modelValue,['a','b','c']);
c.props.value={...c.props.value,show:true,options:[{...tree[0],disabled:true}]};await nextTick();assert.equal(c.state.valid,false,'dynamic disabled ancestor prevents confirm');c.app.unmount();
const Tree=await component('tree-select');
c=mount(Tree,{modelValue:[],options:tree,defaultExpanded:['a','b'],max:1});
c.state.select(c.state.rows.find(r=>r.value==='c'));await nextTick();assert.deepEqual(c.props.value.modelValue,['c']);
c.state.select(c.state.rows.find(r=>r.value==='d'));await nextTick();assert.deepEqual(c.props.value.modelValue,['c']);
c.state.select(c.state.rows.find(r=>r.value==='c'));await nextTick();assert.deepEqual(c.props.value.modelValue,[]);c.app.unmount();
const Keyboard=await component('number-keyboard');
c=mount(Keyboard,{modelValue:'',maxLength:4,extraKey:'.',show:true});
for(const key of ['0','1','.','.','2','3'])c.state.press(key);
await nextTick();assert.equal(c.props.value.modelValue,'01.2','rapid input retains every permitted key');
c.state.press('delete');c.state.press('3');c.state.confirm();await nextTick();assert.equal(c.props.value.modelValue,'01.3');assert.equal(c.props.value.show,false);
c.props.value={...c.props.value,show:true,modelValue:'9',disabled:true};await nextTick();c.state.press('1');assert.equal(c.props.value.modelValue,'9');c.app.unmount();
const List=await component('list');
c=mount(List,{loading:false,error:false,finished:false,immediateCheck:false});
c.api.check();c.api.check();assert.equal(c.events.filter(e=>e[0]==='load').length,1);await nextTick();
c.props.value={...c.props.value,error:true,loading:false};await nextTick();c.api.check();assert.equal(c.events.filter(e=>e[0]==='load').length,1);
c.state.retry();c.state.retry();await nextTick();assert.equal(c.events.filter(e=>e[0]==='load').length,2);assert.equal(c.props.value.error,false);
c.props.value={...c.props.value,loading:false,finished:true};await nextTick();c.api.check();assert.equal(c.events.filter(e=>e[0]==='load').length,2);c.app.unmount();
const Refresh=await component('pull-refresh');c=mount(Refresh,{modelValue:false});c.api.refresh();c.api.refresh();await nextTick();assert.equal(c.events.filter(e=>e[0]==='refresh').length,1);c.props.value={...c.props.value,modelValue:false};await nextTick();c.api.refresh();assert.equal(c.events.filter(e=>e[0]==='refresh').length,2);c.app.unmount();
c=mount(List,{loading:false,error:false,finished:false,immediateCheck:false});c.api.check();c.props.value={...c.props.value,loading:false};await nextTick();c.api.check();assert.equal(c.events.filter(e=>e[0]==='load').length,2,'synchronous completion releases list lock');c.app.unmount();
c=mount(Refresh,{modelValue:false});c.api.refresh();c.props.value={...c.props.value,modelValue:false};await nextTick();c.api.refresh();assert.equal(c.events.filter(e=>e[0]==='refresh').length,2,'synchronous completion releases refresh lock');c.app.unmount();
const IndexBar=await component('index-bar');c=mount(IndexBar,{modelValue:'B',sections:[]});await nextTick();c.props.value={...c.props.value,sections:[{index:'A',title:'A',items:[]},{index:'B',title:'B',items:[]}]};await nextTick();await nextTick();assert.equal(c.state.target,'test-field-1','asynchronous sections restore selected target');c.props.value={...c.props.value,sections:[{index:'B',title:'B',items:[]},{index:'A',title:'A',items:[]}]};await nextTick();await nextTick();assert.equal(c.state.target,'test-field-0','reorder resolves selected key again');c.state.jump(1);c.app.unmount();await nextTick();
const Swipe=await component('swipe-cell');c=mount(Swipe,{modelValue:false});
c.state.touchStart({touches:[{screenX:100,screenY:100}]});c.state.touchMove({touches:[{screenX:20,screenY:102}]});c.state.touchEnd();await nextTick();assert.equal(c.props.value.modelValue,true);
c.api.close();await nextTick();c.state.touchStart({touches:[{screenX:100,screenY:100}]});c.state.touchMove({touches:[{screenX:98,screenY:180}]});c.state.touchEnd();assert.equal(c.props.value.modelValue,false,'vertical scroll does not open');c.app.unmount();
// Deterministic clock tests run the real setup, including pause/reset/unmount cleanup.
let now=1000,nextId=0;const tasks=new Map();
const original={now:Date.now,setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout};
Date.now=()=>now;globalThis.setTimeout=(fn,delay)=>{const id=++nextId;tasks.set(id,{fn,at:now+delay});return id};globalThis.clearTimeout=id=>tasks.delete(id);
function delayedTick(ms){now+=ms;const due=[...tasks].filter(([,t])=>t.at<=now);for(const[id,t]of due){tasks.delete(id);t.fn()}}
try {
 const Countdown=await component('count-down');c=mount(Countdown,{time:2500,autoStart:false});c.api.start();c.api.start();assert.equal(tasks.size,1);delayedTick(900);c.api.pause();const paused=c.state.remaining;delayedTick(5000);assert.equal(c.state.remaining,paused);c.api.start();delayedTick(2000);assert.equal(c.state.remaining,0);assert.equal(c.events.filter(e=>e[0]==='finish').length,1);c.api.start();assert.equal(c.events.filter(e=>e[0]==='finish').length,1);c.api.reset();c.api.start();c.app.unmount();assert.equal(tasks.size,0);
 const Counter=await component('count-to');c=mount(Counter,{startValue:-10,endValue:30,duration:1000});delayedTick(400);assert.ok(c.state.value>-10&&c.state.value<30);c.props.value={...c.props.value,endValue:100};await nextTick();assert.equal(tasks.size,1,'restart cancels old task');delayedTick(1500);assert.equal(c.state.value,100);assert.deepEqual(c.events.filter(e=>e[0]==='finish'),[['finish',100]]);c.api.start();c.app.unmount();assert.equal(tasks.size,0);
} finally { Date.now=original.now;globalThis.setTimeout=original.setTimeout;globalThis.clearTimeout=original.clearTimeout; }
console.log('PASS extended catalog: tree paths, disabled ancestry, cancel/commit, keyboard rapid input, loading locks/retry, refresh, swipe direction, deadline timers and unmount.');
