import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join, relative, isAbsolute, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { invalidComponentSelectors } from './weixin-style-contract.mjs';

const workspace = process.cwd();
const configPath = resolve(workspace, 'project.config.json');
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8')) : null;
const directory = resolve(workspace, config ? config.miniprogramRoot || '.' : 'unpackage/dist/build/mp-weixin');
const appPath = join(directory, 'app.json');
if (!existsSync(appPath)) {
  throw new Error('Missing ' + appPath + '. Build WeChat first; when importing the source root, set miniprogramRoot to unpackage/dist/build/mp-weixin/.');
}
const app = JSON.parse(readFileSync(appPath, 'utf8'));
const pages = [...app.pages, ...(app.subPackages || app.subpackages || []).flatMap(group => group.pages.map(page => group.root + '/' + page))];
const missing = pages.flatMap(page => ['.json', '.js', '.wxml', '.wxss'].map(extension => join(directory, page + extension))).filter(file => !existsSync(file));
if (missing.length) throw new Error('Missing page output:\n' + missing.join('\n'));

const compiler = process.env.MORI_WXSS_COMPILER || (process.env.WECHAT_DEVTOOLS_HOME ? join(process.env.WECHAT_DEVTOOLS_HOME, 'code/package.nw/node_modules/wcc-exec/wcsc.exe') : '');
if (!compiler || !isAbsolute(compiler) || !existsSync(compiler)) {
  throw new Error('Set MORI_WXSS_COMPILER to the absolute path of wcsc in your installed WeChat DevTools. On Windows, WECHAT_DEVTOOLS_HOME can point to the installation directory. This check does not download a compiler.');
}
const styles = [];
function collect(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) collect(path);
    else if (entry.name.endsWith('.wxss')) styles.push(relative(directory, path).replaceAll('\\', '/'));
  }
}
collect(directory);
styles.sort();
if (!styles.length) throw new Error('No WXSS output found.');
const selectorProblems = [];
for (const file of styles) {
  const metaPath = join(directory, file.replace(/\.wxss$/, '.json'));
  if (existsSync(metaPath) && JSON.parse(readFileSync(metaPath, 'utf8')).component === true) {
    for (const issue of invalidComponentSelectors(readFileSync(join(directory, file), 'utf8'), file)) selectorProblems.push(`${file}:${issue.line} ${issue.selector}`);
  }
}
if (selectorProblems.length) throw new Error('Selectors unsupported in isolated component WXSS:\n' + selectorProblems.join('\n'));
const outputConfigPath = join(directory, 'project.config.json');
if (existsSync(outputConfigPath)) {
  const outputConfig = JSON.parse(readFileSync(outputConfigPath, 'utf8'));
  if (resolve(directory, outputConfig.miniprogramRoot || '.') !== directory) throw new Error('Built project.config.json must use miniprogramRoot ./; rebuild with the current scripts.');
}
// The standalone compiler lacks the IDE's virtual / project root. Resolve only
// root-relative imports in a disposable review copy; all CSS rules stay intact.
const review = resolve(workspace, '.impeccable/review/weixin-wxss-source');
for (const file of styles) {
  const destination = join(review, file);
  const content = readFileSync(join(directory, file), 'utf8').replace(/(@import\s*["'])\/([^"']+)(["']\s*;)/g, (_, start, target, end) => {
    const importPath = resolve(directory, target);
    const within = relative(directory, importPath);
    if (within.startsWith('..') || isAbsolute(within) || !existsSync(importPath)) throw new Error('Invalid root import: ' + target);
    return start + relative(dirname(join(directory, file)), importPath).replaceAll('\\', '/') + end;
  });
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, content);
}
const result = spawnSync(compiler, ['-lc', ...styles], { cwd: review, encoding: 'utf8', stdio: ['ignore', 'ignore', 'pipe'], maxBuffer: 16 * 1024 * 1024, windowsHide: true });
if (result.error) throw result.error;
if (result.status !== 0) {
  throw new Error('WeChat stylesheet compiler failed (' + result.status + '):\n' + result.stderr);
}
if (result.stderr.trim()) process.stderr.write(result.stderr);
console.log('PASS WeChat entry, ' + pages.length + ' page outputs and ' + styles.length + ' stylesheets using installed wcsc. This is compilation, not device validation.');
