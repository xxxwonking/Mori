import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { componentManifest } from './component-manifest.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const file of ['package.json', 'manifest.json', 'uni_modules/mori-ui/package.json']) JSON.parse(readFileSync(join(root, file), 'utf8'));
const uiPackage = JSON.parse(readFileSync(join(root, 'uni_modules/mori-ui/package.json'), 'utf8'));
assert.ok(uiPackage.uni_modules.dependencies.includes('mori-upload-ios'), 'Copy/install must include the native iOS upload module.');
for (const file of ['package.json', 'utssdk/app-ios/config.json']) JSON.parse(readFileSync(join(root, 'uni_modules/mori-upload-ios', file), 'utf8'));
for (const file of ['README.md', 'utssdk/interface.uts', 'utssdk/app-ios/index.uts', 'utssdk/app-ios/MoriIOSUpload.swift', 'utssdk/app-ios/Info.plist']) {
  assert.ok(existsSync(join(root, 'uni_modules/mori-upload-ios', file)), 'Missing native upload dependency: ' + file);
}
// pages.json uses uni-app conditional compilation comments for the generated CLI preview.
JSON.parse(readFileSync(join(root, 'pages.json'), 'utf8').replace(/^\s*\/\/.*$/gm, ''));
const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'));
assert.equal(manifest['uni-app-x'].vapor, true, 'Native target must remain uni-app x Vapor.');
const components = readdirSync(join(root, 'uni_modules/mori-ui/components'));
assert.deepEqual(components.sort(), componentManifest.map(item => 'mori-' + item.name).sort());
for (const component of components) {
  const file = join(root, 'uni_modules/mori-ui/components', component, component + '.uvue');
  assert.ok(existsSync(file), 'Each export must be discoverable by easycom.');
  const source = readFileSync(file, 'utf8');
  assert.ok(!/\b(document|window|localStorage)\./.test(source), 'Library components cannot depend on browser globals.');
  assert.ok(existsSync(join(root, 'docs/components', component.substring(5) + '.md')), 'Each exported component must include a usage guide.');
}
console.log('Project configuration and component packaging checks passed.');
