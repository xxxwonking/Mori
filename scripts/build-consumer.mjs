import { appendFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHBuilderEnvironment, resolveCompilerRuntime } from './hbuilder-env.mjs';
import { repository } from './distribution.mjs';
import { normalizeWeixinProject } from './weixin-project.mjs';

export async function buildConsumer(input, platform) {
  const candidates = [process.env.HBUILDERX_HOME, 'D:/HBuilderX', 'C:/HBuilderX', '/Applications/HBuilderX.app/Contents/HBuilderX'].filter(Boolean);
  const hx = candidates.find(path => existsSync(join(path, 'plugins/uniapp-cli-vite/node_modules/@dcloudio/vite-plugin-uni/bin/uni.js')));
  if (!hx) throw new Error('Set HBUILDERX_HOME to an installed HBuilderX with Vue3 compiler.');
  const toolchain = createHBuilderEnvironment(hx, repository);
  const pluginPaths = Object.fromEntries(readdirSync(join(hx, 'plugins'), { withFileTypes: true }).filter(e => e.isDirectory()).map(e => [e.name, join(toolchain.plugins, e.name)]));
  pluginPaths['compile-dart-sass'] = repository;
  const output = join(input, 'unpackage/dist/build', platform);
  const compiler = join(toolchain.plugins, 'uniapp-cli-vite/node_modules/@dcloudio/vite-plugin-uni/bin/uni.js');
  const log = join(input, `build-${platform}.log`);
  writeFileSync(log, '');
  console.log(`Building isolated consumer ${platform}; compiler log: ${log}`);
  // The compiler/Sass toolchain is shared; the application's input is exclusively the fixture.
  const env = { ...process.env, UNI_H5_BASE: '/', UNI_CUSTOM_CONTEXT: '{}', HX_APP_ROOT: toolchain.root, UNI_INPUT_DIR: input, UNI_OUTPUT_DIR: output, UNI_HBUILDERX_PLUGINS: toolchain.plugins, HX_PLUGIN_PATHS: JSON.stringify(pluginPaths), UNI_PROJECT_TYPE: 'hbuilder', RUN_BY_HBUILDERX: 'true', UNI_APP_X: 'true', UNI_CLI_CONTEXT: join(toolchain.plugins, 'uniapp-cli-vite') };
  try {
    await new Promise((accept, reject) => {
      const child = spawn(resolveCompilerRuntime(hx, platform), [compiler, 'build', '-p', platform], { cwd: input, env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
      for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => appendFileSync(log, chunk));
      child.once('error', reject);
      child.once('close', code => code === 0 ? accept() : reject(new Error(`Consumer ${platform} build exited ${code}; see ${log}`)));
    });
    if (platform === 'mp-weixin') normalizeWeixinProject(output);
    return output;
  } finally { toolchain.cleanup(); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [, , input, platform = 'h5'] = process.argv;
  if (!input || !['h5', 'mp-weixin'].includes(platform)) throw new Error('Usage: node scripts/build-consumer.mjs <fixture-directory> <h5|mp-weixin>');
  console.log(await buildConsumer(resolve(input), platform));
}
