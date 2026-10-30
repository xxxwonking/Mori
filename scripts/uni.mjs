import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [mode = 'dev', platform = 'h5'] = process.argv.slice(2);
if (!['dev', 'build'].includes(mode) || !['h5', 'mp-weixin'].includes(platform)) {
  throw new Error('支持的命令：node scripts/uni.mjs <dev|build> <h5|mp-weixin>。App 请通过 HBuilderX 运行。');
}
const candidates = [process.env.HBUILDERX_HOME, 'D:/HBuilderX', 'C:/HBuilderX', '/Applications/HBuilderX.app/Contents/HBuilderX'].filter(Boolean);
const hx = candidates.find(path => existsSync(join(path, 'plugins/uniapp-cli-vite/node_modules/@dcloudio/vite-plugin-uni/bin/uni.js')));
if (!hx) throw new Error('找不到 HBuilderX Vue3 编译器。请安装 HBuilderX，并设置 HBUILDERX_HOME 指向安装目录。');
const plugins = join(hx, 'plugins');
const pluginPaths = Object.fromEntries(readdirSync(plugins, { withFileTypes: true }).filter(item => item.isDirectory()).map(item => [item.name, join(plugins, item.name)]));
// Keep the Sass dependency reproducible in this project, without changing the IDE installation.
pluginPaths['compile-dart-sass'] = root;
const compiler = join(plugins, 'uniapp-cli-vite/node_modules/@dcloudio/vite-plugin-uni/bin/uni.js');
const meta = JSON.parse(readFileSync(join(plugins, 'uniapp-cli-vite/package.json'), 'utf8'));
console.log(`Mori UI · ${mode} ${platform} · HBuilderX compiler ${meta.version}`);
console.log('App 蒸汽模式建议使用 HBuilderX 5.31+；浏览器/小程序构建不代表原生验证。');
const output = join(root, 'unpackage/dist', mode === 'dev' ? 'dev' : 'build', platform);
const args = [compiler, ...(mode === 'build' ? ['build'] : []), '-p', platform, ...(mode === 'dev' && platform === 'h5' ? ['--host', '127.0.0.1', '--port', '5173'] : [])];
const child = spawn(process.execPath, args, {
  cwd: root,
  stdio: 'inherit',
  windowsHide: true,
  env: { ...process.env, UNI_INPUT_DIR: root, UNI_OUTPUT_DIR: output, UNI_HBUILDERX_PLUGINS: plugins, HX_PLUGIN_PATHS: JSON.stringify(pluginPaths), UNI_PROJECT_TYPE: 'hbuilder', RUN_BY_HBUILDERX: 'true', UNI_APP_X: 'true', UNI_CLI_CONTEXT: join(plugins, 'uniapp-cli-vite') }
});
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
