import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
const data = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const native = data(`export const chooseIOSImages=(...args)=>globalThis.nativeUpload.choose(...args);export const uploadIOSFile=(...args)=>globalThis.nativeUpload.upload(...args);export const cancelIOSTask=id=>globalThis.nativeUpload.cancel(id);export const releaseIOSFile=path=>globalThis.nativeUpload.release(path);`);
const source = readFileSync(new URL('../uni_modules/mori-ui/platform/upload-ios.uts',import.meta.url),'utf8')
  .replace(/^import \{ Mori[^\n]+\n/,'').replace("'../../mori-upload-ios'",JSON.stringify(native));
const ios = data(stripTypeScriptTypes(source));
const platformSource = readFileSync(new URL('../uni_modules/mori-ui/platform/upload.uts',import.meta.url),'utf8')
  .replace(/\s*\/\/ #ifndef APP-IOS[\s\S]*?\/\/ #endif/g,'')
  .replace(/^import \{ Mori[^\n]+\n/,'').replace("'./upload-ios.uts'",JSON.stringify(ios));
let choose, upload;
const cancelled = [], released = [], events = [];
JSON.parseArray = value => { try { return JSON.parse(value) } catch { return null } };
globalThis.uni = new Proxy({}, {get(){throw Error('iOS must not call uni selection/upload APIs')}});
globalThis.nativeUpload = {
  choose(options,success,fail){choose={options:JSON.parse(options),success,fail};return 'picker-id'},
  upload(path,name,options,progress,success,fail){upload={path,name,options:JSON.parse(options),progress,success,fail};return 'upload-id'},
  cancel:id=>cancelled.push(id), release:path=>released.push(path)
};
const adapter = await import(data(stripTypeScriptTypes(platformSource)));
let cancel = adapter.chooseMoriImages(30,['album'],files=>events.push(['files',files]),(message,cancelled)=>events.push(['chooseError',message,cancelled]));
assert.equal(choose.options.count,9);assert.deepEqual(choose.options.sourceType,['album']);
const file={path:'/sandbox/照片 %20.heic',name:'原图.heic',size:12,type:'image/heic'};
choose.success(JSON.stringify([file]));assert.deepEqual(events[0][1],[file]);
cancel();cancel();assert.deepEqual(cancelled,['picker-id']);
choose.success(JSON.stringify([{...file,path:'/sandbox/late.heic'}]));assert.deepEqual(released,['/sandbox/late.heic']);
assert.equal(events.length,1,'late native picker results are cleaned without becoming selected');
const request={url:'https://example.test/upload',name:'photo',header:{Authorization:'test'},formData:{folder:'test'},timeout:1234};
cancel=adapter.startMoriUpload({url:file.path,name:file.name},request,p=>events.push(['progress',p]),r=>events.push(['success',r]),e=>events.push(['error',e]));
assert.equal(upload.path,file.path);assert.equal(upload.name,file.name);assert.deepEqual(upload.options,request);
upload.progress('40');assert.deepEqual(events.at(-1),['progress',40]);upload.success('{"url":"remote"}');assert.deepEqual(events.at(-1),['success','{"url":"remote"}']);
const count=events.length;cancel();upload.progress('80');upload.success('late');upload.fail('late');assert.equal(events.length,count);
adapter.releaseMoriPickedFile(file.path);assert.equal(released.at(-1),file.path);
cancel=adapter.chooseMoriImages(1,['album'],files=>events.push(['files',files]),(message,cancelled)=>events.push(['chooseError',message,cancelled]));
choose.success('invalid JSON');assert.deepEqual(events.at(-1),['chooseError','原生选择器返回的数据无效',false]);
cancel=adapter.chooseMoriImages(1,['camera'],files=>events.push(['files',files]),(message,cancelled)=>events.push(['chooseError',message,cancelled]));
choose.fail('已取消选择',true);assert.deepEqual(events.at(-1),['chooseError','已取消选择',true]);
cancel=adapter.chooseMoriImages(1,['album'],files=>events.push(['files',files]),(message,cancelled)=>events.push(['chooseError',message,cancelled]));
cancel();const beforeLate=events.length;choose.fail('late error',false);assert.equal(events.length,beforeLate);
cancel=adapter.startMoriUpload({url:file.path,name:file.name},request,p=>events.push(['progress',p]),r=>events.push(['success',r]),e=>events.push(['error',e]));
upload.progress('150');assert.deepEqual(events.at(-1),['progress',100]);upload.progress('-2');assert.deepEqual(events.at(-1),['progress',0]);
const beforeNaN=events.length;upload.progress('not a number');assert.equal(events.length,beforeNaN);
upload.fail('上传失败（HTTP 403）');assert.deepEqual(events.at(-1),['error','上传失败（HTTP 403）']);cancel();
delete globalThis.uni;delete globalThis.nativeUpload;
delete JSON.parseArray;
console.log('PASS iOS adapter routing, native payloads, opaque paths, cancellation and late-file cleanup (bridge mock; no iOS runtime claim).');
