import { compileStyle } from '@vue/compiler-sfc';

/** Detect selectors rejected in isolated component WXSS, including imported rules. */
export function invalidComponentSelectors(source, filename = 'component.wxss') {
  const result = compileStyle({ source, filename, id: 'mori-wxss', scoped: false });
  if (result.errors.length) throw new Error(`${filename}: ${result.errors.join('\n')}`);
  const problems = [];
  result.rawResult.root.walkRules(rule => {
    let parent = rule.parent;
    while (parent) {
      if (parent.type === 'atrule' && /keyframes$/i.test(parent.name)) return;
      parent = parent.parent;
    }
    if (/\[|#[\w-]|(?:^|[\s>+~,\(])(?:[a-zA-Z_][\w-]*|\*)(?=[.#:\[\s>+~,\)]|$)/.test(rule.selector)) {
      problems.push({ line: rule.source.start.line, selector: rule.selector });
    }
  });
  return problems;
}
