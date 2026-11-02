import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2] || 'dev';
const vitepress = resolve(root, 'node_modules/vitepress/bin/vitepress.js');
function run(file, args, env = {}) {
  return new Promise((accept, reject) => {
    const child = spawn(process.execPath, [file, ...args], { cwd: root, env: { ...process.env, ...env }, stdio: 'inherit', windowsHide: true });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? accept() : reject(new Error(`${file} exited ${code}`)));
    process.once('SIGINT', () => child.kill('SIGINT'));
  });
}
if (mode === 'preview') {
  await run(resolve(root, 'scripts/serve-site.mjs'), []);
} else if (['dev', 'build', 'refresh'].includes(mode)) {
  await run(resolve(root, 'scripts/site-prepare.mjs'), []);
  await run(resolve(root, 'scripts/uni.mjs'), ['build', 'h5'], { UNI_H5_BASE: '/demo/', MORI_SITE_BUILD: 'true' });
  const demo = resolve(root, 'site/.generated/public/demo');
  mkdirSync(demo, { recursive: true });
  cpSync(resolve(root, 'unpackage/dist/site/h5'), demo, { recursive: true });
  if (!existsSync(resolve(demo, 'index.html'))) throw new Error('Missing H5 demo build.');
  if (mode !== 'refresh') await run(vitepress, [mode === 'build' ? 'build' : 'dev', 'site', ...(mode === 'dev' ? ['--host', '0.0.0.0', '--port', '5180'] : [])]);
} else throw new Error('Use dev, build, refresh, or preview.');
