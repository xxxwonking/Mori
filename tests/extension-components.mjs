import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { parse, compileScript } from '@vue/compiler-sfc';
import { createRenderer, h, ref, nextTick } from 'vue';
const root = new URL('../uni_modules/mori-ui/', import.meta.url);
const data = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const cache = new Map();
function cleanTypes(source) {
  return source.replace(/import\s*\{([^}]+)\}\s*from\s*(['"][^'"]+['"])/g, (_, names, path) => {
    const keep = names.split(',').map(s=>s.trim()).filter(n => !n.startsWith('Mori') && n !== 'PropType');
    return keep.length ? 'import { '+keep.join(', ')+' } from '+path : '';
  });
}
const palette = { primary:'#0066d6',soft:'#eaf2ff',onPrimary:'#fff',surface:'#fff',ground:'#f6f7f9',text:'#1d2430',muted:'#616e82',border:'#d2dae6',danger:'#b63d37',dangerSoft:'#fff2ef' };
function moduleUrl(url) {
  if (url.endsWith('/theme.uts')) return data(`export const moriPalette={value:${JSON.stringify(palette)}};export const moriIsDark={value:false}`);
  if (url.endsWith('/platform/upload.uts')) return data(`export const chooseMoriImages=(...args)=>globalThis.__moriUpload.choose(...args);export const startMoriUpload=(...args)=>globalThis.__moriUpload.start(...args);export const previewMoriImages=()=>{}`);
  if (url.endsWith('/platform/overlay-accessibility.uts')) return data('export const moriOverlayReducedMotion=()=>false');
  if(cache.has(url))return cache.get(url);
  let source = cleanTypes(readFileSync(new URL(url),'utf8'));
  source = source.replace(/from ['"]vue['"]/g,'from '+JSON.stringify(import.meta.resolve('vue'))).replace(/from ['"]([^'"]+\.uts)['"]/g,(_,dep)=>'from '+JSON.stringify(moduleUrl(new URL(dep,url).href)));
  const result=data(stripTypeScriptTypes(source));cache.set(url,result);return result;
}
async function component(name) {
  const url=new URL(`components/mori-${name}/mori-${name}.uvue`,root);
  const source=readFileSync(url,'utf8').replace('lang="uts"','lang="ts"');
  let code=cleanTypes(compileScript(parse(source).descriptor,{id:'mori-test-'+name}).content);
  code=code.replace(/from ['"]vue['"]/g,'from '+JSON.stringify(import.meta.resolve('vue'))).replace(/from ['"]([^'"]+\.uts)['"]/g,(_,dep)=>'from '+JSON.stringify(moduleUrl(new URL(dep,url).href)));
  const result=(await import(data(stripTypeScriptTypes(code)))).default; result.render=()=>null;return result;
}
const renderer=createRenderer({createElement:()=>({}),createText:()=>({}),createComment:()=>({}),insert(){},remove(){},setText(){},setElementText(){},patchProp(){},parentNode:()=>null,nextSibling:()=>null});
function mount(Type, initial) {
  const props=ref(initial);let instance;const events=[];
  const listeners={};for(const event of Type.emits||[])listeners['on'+event[0].toUpperCase()+event.slice(1)]=(...args)=>{events.push([event,...args]);if(event==='update:modelValue')props.value={...props.value,modelValue:args[0]};if(event==='update:show')props.value={...props.value,show:args[0]}};
  const app=renderer.createApp({setup:()=>()=>h(Type,{...props.value,...listeners,ref:v=>instance=v})});app.mount({});
  return {app,props,events,get api(){return instance},get state(){return app._instance.subTree.component.setupState}};
}
const Picker=await component('picker');
let picker=mount(Picker,{show:true,modelValue:'a',options:[{label:'A',value:'a'},{label:'B',value:'b'},{label:'D',value:'d',disabled:true}]});
picker.state.draft='b';picker.api.cancel();await nextTick();assert.equal(picker.props.value.modelValue,'a');
picker.props.value={...picker.props.value,show:true};await nextTick();assert.equal(picker.state.draft,'a');
picker.state.draft='d';picker.api.confirm();await nextTick();assert.equal(picker.props.value.show,true);
picker.state.draft='b';picker.api.confirm();await nextTick();assert.equal(picker.props.value.modelValue,'b');assert.equal(picker.props.value.show,false);picker.app.unmount();
const Upload=await component('upload');
const requests=[];let picked;
globalThis.__moriUpload={choose(count,source,success,fail){picked={count,success,fail}},start(file,options,progress,success,fail){const r={file,options,progress,success,fail,aborted:false};requests.push(r);return()=>{r.aborted=true}}};
let upload=mount(Upload,{modelValue:[],maxCount:2,maxSize:100,uploadUrl:'/upload',autoUpload:false});
upload.api.choose();assert.equal(picked.count,2);picked.success([{path:'/tmp/a.heic',name:'a.heic',size:50,type:''},{path:'/tmp/b.png',name:'b.png',size:200,type:''}]);await nextTick();await nextTick();
assert.equal(upload.props.value.modelValue.length,1);assert.equal(upload.events.filter(e=>e[0]==='oversize').length,1);
const id=upload.props.value.modelValue[0].id;
upload.api.submit();await nextTick();assert.equal(requests.length,1);assert.equal(upload.props.value.modelValue[0].status,'uploading');
upload.api.submit();assert.equal(requests.length,1,'No duplicate upload');
requests[0].progress(50);await nextTick();assert.equal(upload.props.value.modelValue[0].progress,50);
requests[0].fail('offline');await nextTick();assert.equal(upload.props.value.modelValue[0].status,'error');
upload.api.retry(id);await nextTick();assert.equal(requests.length,2);
upload.api.remove(id);await nextTick();assert.equal(requests[1].aborted,true);assert.equal(upload.props.value.modelValue.length,0);
requests[1].success('late');await nextTick();assert.equal(upload.props.value.modelValue.length,0,'Removed file never resurrects');
upload.api.choose();picked.success([{path:'/tmp/b.png',name:'b.png',size:40,type:'image/png'}]);await nextTick();upload.api.submit();await nextTick();
requests[2].success('{"ok":true}');await nextTick();assert.equal(upload.props.value.modelValue[0].status,'success');assert.equal(upload.props.value.modelValue[0].url,'/tmp/b.png','Raw successful HTTP response does not pretend to be a remote URL');
upload.api.clear();await nextTick();assert.equal(upload.props.value.modelValue.length,0);
upload.api.choose();upload.api.clear();picked.success([{path:'/late',name:'late',size:1,type:''}]);await nextTick();assert.equal(upload.props.value.modelValue.length,0,'Clearing cancels pending selection');
upload.api.choose();picked.success([{path:'/tmp/c.png',name:'c.png',size:40,type:''}]);await nextTick();upload.api.submit();await nextTick();
const last=requests.at(-1);const eventCount=upload.events.length;upload.app.unmount();assert.equal(last.aborted,true);last.success('late');await nextTick();assert.equal(upload.events.length,eventCount,'Unmount never emits');
delete globalThis.__moriUpload;
let resolveRead, rejectRead;
globalThis.__moriUpload={choose(count,source,success){picked={success}},start(){return()=>{}}};
upload=mount(Upload,{modelValue:[],beforeRead:()=>new Promise((resolve,reject)=>{resolveRead=resolve;rejectRead=reject}),autoUpload:false});
const candidate=[{path:'/tmp/old.png',name:'old.png',size:5,type:'image/png'}];
upload.api.choose();picked.success(candidate);await nextTick();
upload.api.clear();await nextTick();let count=upload.events.length;
rejectRead(new Error('late rejection'));await nextTick();await nextTick();
assert.equal(upload.events.length,count,'clear suppresses stale beforeRead rejection');assert.equal(upload.state.errorMessage,'');
upload.api.choose();picked.success(candidate);await nextTick();const oldReject=rejectRead;
upload.api.clear();upload.api.choose();picked.success([{...candidate[0],name:'new.png'}]);await nextTick();
count=upload.events.length;oldReject(new Error('old session'));await nextTick();await nextTick();assert.equal(upload.events.length,count,'old rejection does not pollute new selection');
resolveRead(true);await nextTick();await nextTick();assert.equal(upload.props.value.modelValue[0].name,'new.png');
upload.api.choose();picked.success(candidate);await nextTick();upload.api.clear();await nextTick();count=upload.events.length;
resolveRead(true);await nextTick();await nextTick();assert.equal(upload.events.length,count,'clear suppresses stale beforeRead resolve');assert.deepEqual(upload.props.value.modelValue,[]);
upload.app.unmount();delete globalThis.__moriUpload;
console.log('PASS real Picker cancel/commit and Upload validation, progress, retry, abort, stale callbacks, clearing and unmount');
