import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { baseParse } from '@vue/compiler-dom';
import { invalidComponentSelectors } from '../scripts/weixin-style-contract.mjs';

assert.deepEqual(invalidComponentSelectors('.button {color:red} :host {display:flex} .button::after {border:none} @keyframes spin {from {opacity:0} 100% {opacity:1}}'), []);
for (const selector of ['.action[aria-disabled=true]', '#test', 'view', '.a > *', '.a text', 'button.test', '.a:not(view)', '.a:is(button,.b)']) {
  assert.equal(invalidComponentSelectors(`${selector} {opacity:.5}`).length, 1, selector);
}
const root = new URL('../uni_modules/mori-ui/', import.meta.url);
let count = 0;
for (const directory of readdirSync(new URL('components/', root))) {
  const source = readFileSync(new URL(`components/${directory}/${directory}.uvue`, root), 'utf8');
  const template = source.match(/<template>([\s\S]*?)<\/template>/)[1];
  function walk(node) {
    if (node.type === 1 && node.props.some(p => p.type === 6 && p.name === 'class' && p.value?.content.split(/\s+/).includes('mori-action'))) {
      const disabled = node.props.find(p => p.type === 7 && p.name === 'bind' && p.arg?.content === 'aria-disabled');
      if (disabled) {
        const classes = node.props.find(p => p.type === 7 && p.name === 'bind' && p.arg?.content === 'class');
        assert(classes?.exp?.content.includes(`'mori-action--disabled': ${disabled.exp.content}`), `${directory}: disabled presentation must match its actual disabled condition.`);
        count++;
      }
    }
    for (const child of node.children || []) walk(child);
  }
  walk(baseParse(template));
}
assert(count >= 27);
const actions = readFileSync(new URL('styles/action.scss', root), 'utf8').split('/* #ifdef WEB */')[0];
assert.deepEqual(invalidComponentSelectors(actions), []);
console.log(`PASS portable disabled state for ${count} controls and component selector regression cases.`);
