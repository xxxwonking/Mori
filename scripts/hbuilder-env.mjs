import { mkdtempSync, mkdirSync, readdirSync, symlinkSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

/** A disposable plugin layout lets older IDE compilers use the project's locked Sass. */
export function createHBuilderEnvironment(hx, projectRoot) {
  const root = mkdtempSync(join(tmpdir(), 'mori-toolchain-'));
  const plugins = join(root, 'plugins');
  const cleanup = () => rmSync(root, { recursive: true, force: true });
  try {
    mkdirSync(plugins);
    const linkType = process.platform === 'win32' ? 'junction' : 'dir';
    for (const item of readdirSync(join(hx, 'plugins'), { withFileTypes: true })) {
      if (item.isDirectory() && item.name !== 'compile-dart-sass') {
        symlinkSync(resolve(hx, 'plugins', item.name), join(plugins, item.name), linkType);
      }
    }
    symlinkSync(resolve(projectRoot), join(plugins, 'compile-dart-sass'), linkType);
    return { root, plugins, cleanup };
  } catch (error) {
    cleanup();
    throw error;
  }
}

/** Mini-program compiler bytecode must run on the Node version shipped with its IDE. */
export function resolveCompilerRuntime(hx, platform) {
  const bundled = join(hx, 'plugins', 'node', process.platform === 'win32' ? 'node.exe' : 'node');
  return platform === 'mp-weixin' && existsSync(bundled) ? bundled : process.execPath;
}
