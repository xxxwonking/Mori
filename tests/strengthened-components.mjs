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
    const keep = names.split(',').map(s=>s.trim()).filter(n=>!n.startsWith('Mori') && !['PropType','Ref','ComputedRef','ComponentPublicInstance'].includes(n));
    return keep.length ? 'import { '+keep.join(', ')+' } from '+path : '';
  });
}
function resolveModule(url) {
  if (url.endsWith('/platform/geometry.uts')) return data('export const moriElementWidth=()=>400;export const observeMoriElementWidth=()=>()=>{}');
  if (url.endsWith('/theme.uts')) return data('export const moriPalette={value:{surface:"#fff",text:"#1d2430",primary:"#0066d6"}}');
  if (url.endsWith('/platform/overlay-accessibility.uts')) return data('export const moriOverlayReducedMotion=()=>false');
  if (url.endsWith('/platform/accessibility.uts')) return data('export const createMoriFieldId=()=>"test-field"');
  if (url.endsWith('/platform/selection-accessibility.uts')) return data('export const focusMoriRadio=()=>{}');
  if(cache.has(url))return cache.get(url);
  const code=imports(clean(readFileSync(new URL(url),'utf8')),url);
  const result=data(stripTypeScriptTypes(code, { mode: 'transform' }));cache.set(url,result);return result;
}
function imports(source,url) { return source.replace(/from ['"]vue['"]/g,'from '+JSON.stringify(import.meta.resolve('vue'))).replace(/from ['"]([^'"]+\.uts)['"]/g,(_,dep)=>'from '+JSON.stringify(resolveModule(new URL(dep,url).href))); }
async function component(name) {
  const url=new URL(`components/mori-${name}/mori-${name}.uvue`,root);
  const source=readFileSync(url,'utf8').replace('lang="uts"','lang="ts"');
  const code=imports(clean(compileScript(parse(source).descriptor,{id:'test-'+name}).content),url.href);
  const result=(await import(data(stripTypeScriptTypes(code, { mode: 'transform' })))).default;result.render=()=>null;return result;
}
const renderer=createRenderer({createElement:()=>({}),createText:()=>({}),createComment:()=>({}),insert(){},remove(){},setText(){},setElementText(){},patchProp(){},parentNode:()=>null,nextSibling:()=>null});
function mount(Type, initial) {
  const props=ref(initial), events=[];let instance;
  const listeners={};for(const event of Type.emits||[])listeners['on'+event[0].toUpperCase()+event.slice(1)]=(...args)=>{events.push([event,...args]);if(event.startsWith('update:'))props.value={...props.value,[event.slice(7)]:args[0]}};
  const app=renderer.createApp({setup:()=>()=>h(Type,{...props.value,...listeners,ref:v=>instance=v})});app.mount({});
  return { app, props, events, get api(){return instance},get state(){return app._instance.subTree.component.setupState} };
}

const logic=await import(resolveModule(new URL('advanced.uts',root).href));
assert.deepEqual(logic.moriVirtualRange(10000,44000,44,264,3),[997,1009]);
assert.deepEqual(logic.moriVirtualRange(100,43,44,264,0),[0,7], 'fractional scrolling includes the last partial row without overscan');
assert.deepEqual(logic.moriVirtualRange(100,45,44,264,0),[1,8]);
assert.deepEqual(logic.moriVirtualRange(100,4110,44,264,0),[93,100]);
const original=[{id:'a',label:'A'},{id:'b',label:'B'},{id:'c',label:'C'}];
assert.deepEqual(logic.moriMoveItem(original,0,2).map(x=>x.id),['b','c','a']);assert.equal(original[0].id,'a');
assert.deepEqual(logic.moriCropRect(800,400,2,100,100,1),[600,200,200,200]);
for(const dimensions of [[800,400],[400,800]])for(const ratio of [.25,1,4])for(const zoom of [1,2,4]){const [x,y,w,h]=logic.moriCropRect(...dimensions,zoom,100,100,ratio);assert.ok(x>=0&&y>=0&&x+w<=dimensions[0]+1e-8&&y+h<=dimensions[1]+1e-8);assert.ok(Math.abs(w/h-ratio)<1e-8)}
assert.deepEqual(logic.moriWaterfall([{...original[0],height:100},{...original[1],height:300},{...original[2],height:100}],2).map(c=>c.map(x=>x.id)),[['a','c'],['b']]);
const validation=await import(resolveModule(new URL('validation.uts',root).href));
assert.equal(validation.moriFieldValue({profile:{names:['Mori']}},'profile.names[0]'),'Mori');
assert.equal(validation.moriFieldValue({a:{b:'nested'},'a.b':'direct'},'a.b'),'direct');
assert.equal(validation.moriFieldValue({},'constructor.name'),null);
assert.throws(()=>validation.validateMoriForm({name:'a'},[{name:'name',asyncValidator:async()=>''}]),/validateAsync/);
assert.equal((await validation.validateMoriFormAsync({name:'a'},[{name:'name',asyncValidator:async()=>{throw Error('network')}}])).valid,false);
assert.equal((await validation.validateMoriFormAsync({name:'a'},[{name:'name',message:'',asyncValidator:async()=>{throw Error('network')}}])).valid,false,'empty message cannot turn rejected validation into success');
const Form=await component('form');let resolveOld,resolveNew;
let c=mount(Form,{model:{profile:{name:'old'}},rules:[{name:'profile.name',asyncValidator:value=>new Promise(resolve=>{if(value==='old')resolveOld=resolve;else resolveNew=resolve})}]});
const first=c.api.validateAsync();c.props.value={...c.props.value,model:{profile:{name:'new'}}};await nextTick();const second=c.api.validateAsync();resolveNew('');assert.equal((await second).valid,true);resolveOld('old error');assert.equal((await first).stale,true);assert.deepEqual(c.state.errors,[]);
c.api.resetFields();await nextTick();assert.equal(c.props.value.model.profile.name,'old');
const third=c.api.validateAsync();c.api.clearValidate();resolveOld('late');assert.equal((await third).stale,true);assert.deepEqual(c.state.errors,[]);
c.props.value={model:{name:'x'},rules:[{name:'name',validator:()=>{throw Error('bad rule')}}]};await nextTick();await assert.rejects(c.api.validateAsync(),/bad rule/);assert.equal(c.state.validating,false);c.app.unmount();
const Picker=await component('picker');c=mount(Picker,{show:true,values:['a','b'],columns:[[{value:'a',label:'A'},{value:'x',label:'X'}],[{value:'b',label:'B'}]]});c.state.setColumn(0,'x');assert.deepEqual(c.state.columnDraft,['x','']);c.api.confirm();assert.equal(c.props.value.show,true);c.props.value={...c.props.value,columns:[c.props.value.columns[0],[{value:'y',label:'Y'}]]};await nextTick();c.state.setColumn(1,'y');c.api.confirm();await nextTick();assert.deepEqual(c.props.value.values,['x','y']);c.app.unmount();
const Cascader=await component('cascader');let finish;
c=mount(Cascader,{show:true,options:[{value:'a',label:'A',leaf:false}],loadChildren:()=>new Promise(r=>finish=r)});c.state.select('a');c.state.back(1);assert.equal(c.state.pending,true,'current breadcrumb must preserve its in-flight load');finish([{value:'b',label:'B'}]);await nextTick();await nextTick();assert.equal(c.state.levelOptions[0].value,'b');c.app.unmount();
c=mount(Cascader,{show:true,options:[{value:'a',label:'A',leaf:false}],loadChildren:()=>new Promise(r=>finish=r)});c.state.select('a');c.state.back(0);finish([{value:'b',label:'B'}]);await nextTick();await nextTick();assert.deepEqual(c.state.draft,[]);assert.deepEqual(c.state.loaded,[],'returning to an ancestor still discards late children');c.app.unmount();
c=mount(Cascader,{show:true,options:[{value:'a',label:'A',leaf:false}],loadChildren:()=>new Promise(r=>finish=r)});c.state.select('a');assert.equal(c.state.pending,true);assert.equal(c.state.valid,false);c.api.cancel();finish([{value:'b',label:'B'}]);await nextTick();await nextTick();assert.equal(c.state.loaded.length,0,'cancel discards late children');c.props.value={...c.props.value,show:true};await nextTick();c.state.select('a');finish([{value:'b',label:'B'}]);await nextTick();await nextTick();c.state.select('b');c.api.confirm();await nextTick();assert.deepEqual(c.props.value.modelValue,['a','b']);c.app.unmount();
c=mount(Cascader,{show:true,options:[{value:'a',label:'A',leaf:false}],loadChildren:async()=>{throw Error('network')}});c.state.select('a');await nextTick();await nextTick();assert.equal(c.state.pending,false);assert.ok(c.state.loadError.length>0);assert.equal(c.state.valid,false);c.app.unmount();
const Tree=await component('tree-select');const tree=[{value:'a',label:'A',children:[{value:'b',label:'B'},{value:'c',label:'C'},{value:'d',label:'D',disabled:true}]}];
c=mount(Tree,{modelValue:['b'],options:tree,checkStrictly:false,max:2});assert.equal(c.state.mixed(c.state.rows[0]),true);c.state.select(c.state.rows[0]);await nextTick();assert.deepEqual(c.props.value.modelValue,['b','c']);assert.equal(c.state.checked(c.state.rows[0]),true);c.state.select(c.state.rows[0]);await nextTick();assert.deepEqual(c.props.value.modelValue,[]);c.props.value={...c.props.value,max:1};await nextTick();c.state.select(c.state.rows[0]);assert.ok(c.events.some(e=>e[0]==='overLimit'));assert.deepEqual(c.props.value.modelValue,[]);c.app.unmount();
const Auto=await component('autocomplete');c=mount(Auto,{modelValue:'上',options:[{value:'a',label:'上海'},{value:'b',label:'北京'}]});assert.equal(c.state.matches.length,1);c.state.select(c.state.matches[0]);await nextTick();assert.equal(c.props.value.modelValue,'上海');assert.ok(c.events.some(e=>e[0]==='select'&&e[1]==='a'));c.app.unmount();
const Tags=await component('tag-input');c=mount(Tags,{modelValue:[],max:2});c.state.add('a');c.state.add('b');c.state.add('b');c.state.add('c');await nextTick();assert.deepEqual(c.props.value.modelValue,['a','b']);assert.equal(c.events.filter(e=>e[0]==='invalid').length,2);c.state.remove('a');await nextTick();assert.deepEqual(c.props.value.modelValue,['b']);c.app.unmount();
const Color=await component('color-picker');c=mount(Color,{modelValue:'#0066D6'});c.state.select('#abc');await nextTick();assert.equal(c.props.value.modelValue,'#AABBCC');c.state.select('red');assert.ok(c.state.error.length>0);c.app.unmount();
const Table=await component('table');const rows=[{id:'a',n:20},{id:'b',n:3}];c=mount(Table,{rows,columns:[{key:'n',label:'值',sortable:true}]});c.state.sort('n');assert.deepEqual(c.state.sorted.map(x=>x.n),[3,20]);c.state.sort('n');assert.deepEqual(c.state.sorted.map(x=>x.n),[20,3]);assert.equal(rows[0].n,20);c.app.unmount();
const Range=await component('date-range-picker');c=mount(Range,{show:true,modelValue:['2026-11-01','2026-11-02'],disabledDates:['2026-11-04']});c.state.draft=['2026-11-01','2026-11-05'];c.api.confirm();assert.equal(c.props.value.show,true);c.api.cancel();await nextTick();assert.deepEqual(c.props.value.modelValue,['2026-11-01','2026-11-02']);c.app.unmount();
const Virtual=await component('virtual-list');c=mount(Virtual,{items:Array.from({length:10000},(_,i)=>({id:String(i),label:String(i)})),height:264,itemHeight:44});assert.ok(c.state.visible.length<=12);await c.api.scrollToIndex(1000);assert.equal(c.state.visible[3].id,'1000');c.props.value={...c.props.value,items:[{id:'x',label:'x'}]};await nextTick();assert.equal(c.state.top,0);assert.equal(c.state.visible[0].id,'x');c.app.unmount();
const Rich=await component('rich-text');c=mount(Rich,{blocks:[{type:'paragraph',text:'<script>alert(1)</script>'},{type:'image',src:'javascript:alert(1)',text:'blocked'}]});assert.equal(c.state.nodes[0].children[0].type,'text');assert.equal(c.state.nodes[1].name,'p');c.app.unmount();
const Drag=await component('draggable');c=mount(Drag,{modelValue:original});c.state.reorder(0,2);await nextTick();assert.deepEqual(c.props.value.modelValue.map(x=>x.id),['b','c','a']);c.app.unmount();
const Panel=await component('floating-panel');c=mount(Panel,{modelValue:240,anchors:[400,120,240]});c.state.step(1);await nextTick();assert.equal(c.props.value.modelValue,400);c.state.step(-1);await nextTick();assert.equal(c.props.value.modelValue,240);c.app.unmount();
const Swipe=await component('swipe-cell');c=mount(Swipe,{modelValue:false,leftActions:[{value:'archive',label:'归档'}],rightActions:[{value:'pin',label:'置顶'},{value:'delete',label:'删除',disabled:true}]});c.api.open('left');await nextTick();assert.equal(c.state.offset,80);c.state.activateAction('left',0);assert.ok(c.events.some(e=>e[0]==='select'&&e[1]==='archive'));c.api.open();await nextTick();assert.equal(c.state.offset,-160);c.state.activateAction('right',1);assert.equal(c.events.filter(e=>e[0]==='select').length,1);c.app.unmount();
const ImagePreview=await component('image-preview');c=mount(ImagePreview,{show:true,images:['a','b']});c.state.zoom(3);c.state.shift(10000,10000);assert.equal(c.state.scale,4);assert.equal(c.state.x,600,'keyboard pan uses measured 400px viewport without touchstart');c.props.value={...c.props.value,modelValue:1};await nextTick();assert.equal(c.state.scale,1);assert.equal(c.state.x,0);c.app.unmount();
console.log('PASS strengthened components: async stale/reset/error, linked selection/lazy failure, immutable sorting, tags/color, range cancel, fixed-height virtualization, safe rich text, crop geometry, waterfall, reorder/panel and two-sided actions/zoom.');


const {default:jsQR}=await import('jsqr');
const qr=await import(resolveModule(new URL('qrcode.uts',root).href));
for(const value of ['Mori UI','https://github.com/xxxwonking/Mori','你好，Mori UI 👋','1'.repeat(512)]){
 const matrix=qr.moriQrMatrix(value), size=(matrix.length+8)*4, pixels=new Uint8ClampedArray(size*size*4).fill(255);
 for(let y=0;y<matrix.length;y++)for(let x=0;x<matrix.length;x++)if(matrix[y][x])for(let dy=0;dy<4;dy++)for(let dx=0;dx<4;dx++){const i=(((y+4)*4+dy)*size+(x+4)*4+dx)*4;pixels[i]=pixels[i+1]=pixels[i+2]=0}
 const decoded=jsQR(pixels,size,size);assert.equal(decoded?.data,value,'QR must decode the original payload');
}
console.log('PASS QR round-trip decoding: ASCII, URL, Unicode/emoji and long numeric payload.');
