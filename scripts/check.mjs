import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const file of ['package.json', 'manifest.json', 'pages.json', 'uni_modules/mori-ui/package.json']) JSON.parse(readFileSync(join(root, file), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'));
assert.equal(manifest['uni-app-x'].vapor, true, 'Native target must remain uni-app x Vapor.');
const components = readdirSync(join(root, 'uni_modules/mori-ui/components'));
assert.deepEqual(components.sort(), ['mori-button', 'mori-checkbox', 'mori-checkbox-group', 'mori-dialog', 'mori-form', 'mori-form-item', 'mori-input', 'mori-popup', 'mori-radio', 'mori-radio-group', 'mori-switch', 'mori-textarea', 'mori-toast']);
for (const component of components) {
  const file = join(root, 'uni_modules/mori-ui/components', component, component + '.uvue');
  assert.ok(existsSync(file), 'Each export must be discoverable by easycom.');
  const source = readFileSync(file, 'utf8');
  assert.ok(!/\b(document|window|localStorage)\./.test(source), 'Library components cannot depend on browser globals.');
}
console.log('Project configuration and component packaging checks passed.');
