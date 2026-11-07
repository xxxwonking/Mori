import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { parse, compileScript } from '@vue/compiler-sfc';
import { createRenderer, h, ref, nextTick, provide } from 'vue';

const root = new URL('../uni_modules/mori-ui/', import.meta.url);
const data = s => 'data:text/javascript;base64,' + Buffer.from(s).toString('base64');
const cache = new Map();
const stub = {
  'platform/accessibility.uts': 'export const createMoriFieldId=()=>"test-field";export const syncMoriInputAccessibility=()=>{}',
  'platform/textarea-accessibility.uts': 'export const syncMoriTextareaAccessibility=()=>{}',
  'platform/selection-accessibility.uts': 'export const focusMoriRadio=()=>{}',
  'platform/overlay-accessibility.uts': 'export const activateMoriOverlayAccessibility=()=>{};export const releaseMoriOverlayAccessibility=()=>{};export const moriOverlayReducedMotion=()=>true',
  'platform/viewport.uts': 'export const useMoriViewport=()=>({value:{width:390,height:844,top:0,left:0,safeTop:0,safeBottom:0}})'
};
function imports(source, url) {
  return source.replace(/import\s*\{([^}]+)\}\s*from\s*(['"][^'"]+['"])/g, (_, names, path) => {
    const keep = names.split(',').map(s=>s.trim()).filter(n=>!n.startsWith('Mori') && !['PropType','ComputedRef','Ref'].includes(n));
    return keep.length ? 'import { '+keep.join(', ')+' } from '+path : '';
  }).replace(/from ['"]vue['"]/g, 'from '+JSON.stringify(import.meta.resolve('vue')))
    .replace(/from ['"]([^'"]+\.uts)['"]/g, (_,dep)=>'from '+JSON.stringify(moduleUrl(new URL(dep,url).href)));
}
function moduleUrl(url) {
  if (cache.has(url)) return cache.get(url);
  const key = url.slice(root.href.length);
  const result = data(stripTypeScriptTypes(stub[key] || imports(readFileSync(new URL(url),'utf8'),url)));
  cache.set(url,result);
  return result;
}
async function component(name) {
  const url = new URL('components/mori-'+name+'/mori-'+name+'.uvue',root);
  const script = compileScript(parse(readFileSync(url,'utf8').replace('lang="uts"','lang="ts"')).descriptor,{id:'custom-'+name}).content;
  const Type = (await import(data(stripTypeScriptTypes(imports(script,url))))).default;
  Type.render=()=>null;
  return Type;
}
const renderer=createRenderer({createElement:()=>({}),createText:()=>({}),createComment:()=>({}),insert(){},remove(){},setText(){},setElementText(){},patchProp(){},parentNode:()=>null,nextSibling:()=>null});
function mount(Type, initial, field) {
  const props=ref(initial), events=[];
  const listeners={};
  for(const event of Type.emits || []) listeners['on'+event[0].toUpperCase()+event.slice(1)]=(...args)=>events.push([event,...args]);
  const app=renderer.createApp({setup(){ if(field)provide('mori-field-context',field); return()=>h(Type,{...props.value,...listeners}); }});
  app.mount({});
  return {props,events,app,get state(){return app._instance.subTree.component.setupState},async patch(p){props.value={...props.value,...p};await nextTick()}};
}
globalThis.uni={setAppTheme(){}};
const {setMoriConfig,moriPalette,resetMoriConfig}=await import(moduleUrl(new URL('theme.uts',root).href));
setMoriConfig({theme:'light',light:{primary:'#4338ca',surface:'#eef2ff',input:'#818cf8',ring:'#4f46e5',danger:'#b91c1c',overlay:'rgba(10, 20, 30, 0.7)'}});

for(const name of ['input','textarea']){
  const field={label:ref('账号'),required:ref(true),error:ref(''),descriptionId:ref('error-id')};
  const c=mount(await component(name),{backgroundColor:'#ffffff',borderColor:'#a5b4fc',color:'#4338ca',textColor:'#312e81'},field);
  assert(c.state.controlStyle.includes('border-color:#a5b4fc;'));
  c.state.handleFocus();
  assert(c.state.controlStyle.includes('border-color:#4338ca;'));
  field.error.value='填写有效账号';
  await nextTick();
  assert(c.state.controlStyle.includes('border-color:#b91c1c;'),'inherited error wins over custom focus');
  setMoriConfig({light:{danger:'#9f1239'}});
  assert(c.state.controlStyle.includes('border-color:#9f1239;'),'live semantic error updates');
  field.error.value='';
  c.state.handleBlur({detail:{value:'final'}});
  assert(c.state.controlStyle.includes('border-color:#a5b4fc;'));
  await c.patch({disabled:true});
  const before=c.events.length;
  c.state.handleInput({detail:{value:'blocked'}});
  assert.equal(c.events.length,before,'disabled input emits no update');
  assert(c.state.controlStyle.includes('background-color:#ffffff;'),'explicit fill survives disabled state');
  c.app.unmount();
  setMoriConfig({light:{danger:'#b91c1c'}});
}
const sw=mount(await component('switch'),{modelValue:true,color:'#123456',activeColor:'#4338ca',inactiveColor:'#c7d2fe',activeThumbColor:'#ffffff',inactiveThumbColor:'#312e81',activeText:'开启',inactiveText:'关'});
const width=sw.state.trackWidth;
assert.equal(sw.state.trackColor,'#4338ca');
assert.equal(sw.state.thumbColor,'#ffffff');
await sw.patch({modelValue:false});
assert.equal(sw.state.trackWidth,width);
assert.equal(sw.state.trackColor,'#c7d2fe');
assert.equal(sw.state.thumbColor,'#312e81');
await sw.patch({disabled:true});sw.state.toggleValue();assert.equal(sw.events.length,0);sw.app.unmount();

const cb=mount(await component('checkbox'),{backgroundColor:'#ffffff',borderColor:'#123456',color:'#4338ca'});
assert(cb.state.boxStyle.includes('background-color:#ffffff;'));
assert(cb.state.boxStyle.includes('border-color:#123456;'));
await cb.patch({indeterminate:true});
assert(cb.state.boxStyle.includes('background-color:#4338ca;'));
assert.equal(cb.state.markColor,'#ffffff');cb.app.unmount();
const radio=mount(await component('radio'),{value:'a',modelValue:'b',backgroundColor:'#ffffff',borderColor:'#123456',color:'#4338ca'});
assert(radio.state.circleStyle.includes('border-color:#123456;'));
await radio.patch({modelValue:'a'});
assert(radio.state.circleStyle.includes('border-color:#4338ca;'));
assert(radio.state.circleStyle.includes('background-color:#ffffff;'));
radio.state.selectValue();assert.equal(radio.events.length,0);radio.app.unmount();

const tabs=mount(await component('tabs'),{modelValue:'a',items:[{label:'A',value:'a'},{label:'B',value:'b',disabled:true},{label:'C',value:'c'}],color:'#4338ca'});
tabs.state.move(1);
assert.deepEqual(tabs.events.find(e=>e[0]==='change'),['change','c']);
await tabs.patch({disabled:true});const count=tabs.events.length;tabs.state.move(-1);assert.equal(tabs.events.length,count);tabs.app.unmount();

const popup=mount(await component('popup'),{backgroundColor:'#eef2ff',textColor:'#312e81',borderColor:'#a5b4fc',overlayColor:'rgba(15, 23, 42, 0.65)'});
assert(popup.state.panelStyle.includes('background-color:#eef2ff;border-color:#a5b4fc;color:#312e81;'));
assert(popup.state.maskStyle.includes('rgba(15, 23, 42, 0.65)'));
await popup.patch({overlayColor:''});
assert(popup.state.maskStyle.includes(moriPalette.value.overlay));
popup.app.unmount();
const dialog=mount(await component('dialog'),{modelValue:true,confirmLoading:true,confirmColor:'#4338ca'});
dialog.state.confirm();dialog.state.cancel();assert.equal(dialog.events.length,0);
await dialog.patch({confirmLoading:false});dialog.state.confirm();dialog.state.confirm();assert.equal(dialog.events.filter(e=>e[0]==='confirm').length,1);
dialog.app.unmount();
resetMoriConfig();delete globalThis.uni;
console.log('PASS real component customization: inherited errors, disabled events, switch states, selection, keyboard navigation, overlay colors and loading guards');
