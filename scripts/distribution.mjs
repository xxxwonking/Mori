import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { componentManifest } from './component-manifest.mjs';

export const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const moduleNames = ['mori-ui', 'mori-upload-ios'];
const allowedExtensions = new Set(['.uvue', '.uts', '.scss', '.swift', '.json', '.plist', '.md', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.webm']);
const normalize = path => path.replaceAll('\\', '/');
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

export function listModuleFiles(root) {
  const files = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      assert(!lstatSync(path).isSymbolicLink(), `Distribution must not follow links: ${path}`);
      assert(!entry.name.startsWith('.') && entry.name !== 'node_modules', `Unexpected private/cache file: ${path}`);
      if (entry.isDirectory()) walk(path);
      else {
        assert(entry.name === 'LICENSE' || allowedExtensions.has(extname(path)), `Unexpected distribution file: ${path}`);
        files.push(normalize(relative(root, path)));
      }
    }
  }
  for (const name of moduleNames) {
    const directory = join(root, 'uni_modules', name);
    assert(!lstatSync(directory).isSymbolicLink(), `Module directory must not be a link: ${name}`);
    walk(directory);
  }
  return files.sort();
}

export function validateModules(root) {
  const files = listModuleFiles(root);
  const version = json(join(root, 'uni_modules/mori-ui/package.json')).version;
  assert(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version), 'Use a semantic version.');
  for (const name of moduleNames) {
    const meta = json(join(root, 'uni_modules', name, 'package.json'));
    assert.equal(meta.id, name);
    assert.equal(meta.version, version, 'Both modules must have the same distribution version.');
    assert.equal(meta.license, 'MIT');
    for (const dependency of meta.uni_modules.dependencies) assert(moduleNames.includes(dependency), `Unpackaged module dependency: ${dependency}`);
    for (const required of ['LICENSE', 'README.md']) assert(existsSync(join(root, 'uni_modules', name, required)), `Missing ${name}/${required}`);
  }
  assert.deepEqual(readdirSync(join(root, 'uni_modules/mori-ui/components')).sort(), componentManifest.map(c => `mori-${c.name}`).sort());
  for (const file of files.filter(f => /\.(uts|uvue|scss)$/.test(f))) {
    const source = readFileSync(join(root, file), 'utf8');
    for (const match of source.matchAll(/(?:\bfrom|@import)\s*['"]([^'"]+)['"]/g)) {
      const dependency = match[1];
      if (dependency === 'vue') continue;
      assert(/^(\.{1,2}\/|@\/uni_modules\/)/.test(dependency), `Undeclared external dependency in ${file}: ${dependency}`);
      const target = dependency.startsWith('@/') ? resolve(root, dependency.slice(2)) : resolve(dirname(join(root, file)), dependency);
      const relativeTarget = normalize(relative(root, target));
      assert(moduleNames.some(name => relativeTarget.startsWith(`uni_modules/${name}/`) || relativeTarget === `uni_modules/${name}`), `Dependency escapes the distribution: ${file} -> ${dependency}`);
      assert(existsSync(target), `Missing dependency: ${file} -> ${dependency}`);
    }
    for (const match of source.matchAll(/['"]\/?(?:@\/)?(uni_modules\/[^'"]+)['"]/g)) {
      const dynamicPrefix = source.slice(match.index + match[0].length).trimStart().startsWith('+');
      assert(dynamicPrefix ? files.some(path => path.startsWith(match[1])) : existsSync(join(root, match[1])), `Missing static resource in ${file}: ${match[1]}`);
    }
  }
  return { version, files, components: componentManifest.length };
}

export function createDistribution(source = repository, parent = join(repository, 'dist')) {
  const validated = validateModules(source);
  for (const path of ['package.json', 'manifest.json']) {
    const metadata = json(join(source, path));
    assert.equal(metadata.version || metadata.versionName, validated.version, `Version mismatch: ${path}`);
  }
  const lock = json(join(source, 'package-lock.json'));
  assert.equal(lock.version, validated.version, 'Version mismatch: package-lock.json');
  assert.equal(lock.packages[''].version, validated.version, 'Version mismatch: lockfile root');
  mkdirSync(parent, { recursive: true });
  const output = mkdtempSync(join(parent, `mori-ui-${validated.version}-`));
  for (const name of moduleNames) cpSync(join(source, 'uni_modules', name), join(output, 'uni_modules', name), { recursive: true });
  cpSync(join(source, 'LICENSE'), join(output, 'LICENSE'));
  writeFileSync(join(output, 'README.md'), `# Mori UI ${validated.version}\n\nLocal distribution candidate; this is not a published release.\n\nCopy both folders in uni_modules into a uni-app x project. Keep their licenses and resources. See [Mori UI setup](uni_modules/mori-ui/README.md) and [iOS upload setup](uni_modules/mori-upload-ios/README.md).\n\nThe source uses .uvue / UTS and contains ${validated.components} easycom components. Builds and H5 checks do not establish native-device compatibility. See the [compatibility record](https://github.com/xxxwonking/Mori/blob/master/docs/compatibility.md).\n`);
  const allFiles = [...validated.files, 'LICENSE', 'README.md'].sort();
  const manifest = { format: 1, version: validated.version, components: validated.components, modules: moduleNames, files: allFiles.map(path => { const bytes = readFileSync(join(output, path)); return { path, bytes: bytes.length, sha256: digest(bytes) }; }) };
  writeFileSync(join(output, 'mori-distribution.json'), JSON.stringify(manifest, null, 2) + '\n');
  verifyDistribution(output);
  return output;
}

export function verifyDistribution(root) {
  const moduleFiles = listModuleFiles(root);
  const manifest = json(join(root, 'mori-distribution.json'));
  assert.equal(manifest.format, 1);
  assert.deepEqual(manifest.modules, moduleNames);
  const expected = new Set();
  for (const file of manifest.files) {
    assert(typeof file.path === 'string' && !file.path.includes('\\') && !isAbsolute(file.path), 'Manifest path must be relative.');
    const path = resolve(root, file.path);
    const within = relative(resolve(root), path);
    assert(within && !within.startsWith('..') && !isAbsolute(within), 'Manifest path escapes distribution.');
    assert(!expected.has(file.path), 'Duplicate manifest path.');
    expected.add(file.path);
    assert(!lstatSync(path).isSymbolicLink(), 'Manifest must not refer to symbolic links.');
    const bytes = readFileSync(path);
    assert.equal(bytes.length, file.bytes, `Changed size: ${file.path}`);
    assert.equal(digest(bytes), file.sha256, `Changed content: ${file.path}`);
  }
  const actual = [...moduleFiles, 'LICENSE', 'README.md'].sort();
  assert.deepEqual([...expected].sort(), actual, 'Distribution file list is incomplete.');
  assert.deepEqual(readdirSync(root).sort(), ['LICENSE', 'README.md', 'mori-distribution.json', 'uni_modules']);
  assert.deepEqual(readdirSync(join(root, 'uni_modules')).sort(), [...moduleNames].sort());
  const validated = validateModules(root);
  assert.equal(validated.version, manifest.version);
  assert.equal(validated.components, manifest.components);
  return manifest;
}
