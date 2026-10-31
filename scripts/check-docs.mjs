import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, compileScript } from '@vue/compiler-sfc';
import { baseParse } from '@vue/compiler-dom';
import { componentManifest } from './component-manifest.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contracts = new Map();
for (const c of componentManifest) {
  const source = readFileSync(join(root, `uni_modules/mori-ui/components/mori-${c.name}/mori-${c.name}.uvue`),'utf8');
  const props = new Set([...source.matchAll(/(\w+)\s*:\s*\{\s*type:/g)].map(m=>m[1]));
  const events = new Set((source.match(/defineEmits\(\[([^\]]+)\]/)?.[1].match(/['"]([^'"]+)['"]/g)||[]).map(s=>s.slice(1,-1)));
  contracts.set('mori-'+c.name,{props,events});
}
const camel = s => s.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
let snippets = 0, links = 0;
function inspect(node, file) {
  if(node.type===1 && contracts.has(node.tag)) {
    const contract=contracts.get(node.tag);
    for(const attr of node.props) {
      let prop = attr.type===6 ? attr.name : attr.name==='bind' ? attr.arg?.content : attr.name==='model' ? attr.arg?.content||'modelValue' : null;
      if(prop && !['class','style','id','key','ref'].includes(prop)) assert.ok(contract.props.has(camel(prop)), `${file}: ${node.tag} has no prop ${prop}`);
      if(attr.type===7 && attr.name==='on') assert.ok(contract.events.has(attr.arg?.content)||contract.events.has(camel(attr.arg?.content||'')),`${file}: ${node.tag} has no event ${attr.arg?.content}`);
    }
  }
  for(const child of node.children||[])inspect(child,file);
}
for(const c of componentManifest) {
  const file=join(root,'docs/components',c.name+'.md');const text=readFileSync(file,'utf8');
  assert.ok(text.includes('## 基础用法') && text.includes('## 平台与验证边界'),`${c.name}: missing usage/platform notes`);
  for(const match of text.matchAll(/```vue\n([\s\S]*?)```/g)) {
    let source=match[1].replace('lang="uts"','lang="ts"');
    if(!/^\s*<(template|script)[\s>]/.test(source))source='<template>\n'+source+'\n</template>';
    const result=parse(source,{filename:c.name+'.vue'});
    assert.deepEqual(result.errors,[],`${file}: invalid example`);
    if(result.descriptor.scriptSetup)compileScript(result.descriptor,{id:c.name});
    if(result.descriptor.template)inspect(baseParse(result.descriptor.template.content),file);
    snippets++;
  }
}
function files(dir) { return readdirSync(dir,{withFileTypes:true}).flatMap(item=>item.isDirectory()?files(join(dir,item.name)):item.name.endsWith('.md')?[join(dir,item.name)]:[]); }
for(const file of files(join(root,'docs'))) {
  for(const match of readFileSync(file,'utf8').matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const path=match[1].split('#')[0];if(!path||/^(https?:|mailto:)/.test(path))continue;
    assert.ok(existsSync(resolve(dirname(file),decodeURIComponent(path))),`${file}: missing link ${path}`);links++;
  }
}
console.log(`PASS ${componentManifest.length} guides, ${snippets} Vue/UTS example structures with real props/events, ${links} local links. Native compilation of examples is not implied.`);
