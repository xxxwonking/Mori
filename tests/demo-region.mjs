import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
const source = readFileSync(new URL('../components/demo-region/regions.uts', import.meta.url), 'utf8').replace(/^import[^\r\n]+\r?\n/, '');
const { demoRegions, resolveDemoRegionPath } = await import('data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
const values = new Set();
function check(nodes, depth = 1) {
  assert(nodes.length > 0);
  for (const node of nodes) {
    assert(!values.has(node.value), 'demo values must be globally unique'); values.add(node.value);
    if (depth < 3) check(node.children, depth + 1);
    else assert.equal(node.children, undefined, 'district is the final level');
  }
}
check(demoRegions);
const path = input => resolveDemoRegionPath(input).map(node => node.value);
assert.deepEqual(path([]), ['zj', 'hz', 'xh']);
assert.deepEqual(path(['zj', 'nb', '']), ['zj', 'nb', 'hs']);
assert.deepEqual(path(['js', '', '']), ['js', 'nj', 'xw']);
assert.deepEqual(path(['js', 'hz', 'xh']), ['js', 'nj', 'xw'], 'stale descendants cannot cross a province');
assert.deepEqual(path(['gd', 'shenzhen', 'ft']), ['gd', 'shenzhen', 'ft']);
console.log('PASS demonstration regions: every branch has province/city/district, unique values and descendant replacement. Not an administrative dataset validation.');
