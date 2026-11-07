import { existsSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, renameSync, rmSync } from 'node:fs';
import { join, dirname, resolve, sep } from 'node:path';

// HBuilderX copies the source-root config into the output. The output itself
// is already a mini-program root, so it must not point to a nested build path.
export function normalizeWeixinProject(output) {
  const path = join(output, 'project.config.json');
  if (!existsSync(path)) return;
  const config = JSON.parse(readFileSync(path, 'utf8'));
  config.miniprogramRoot = './';
  writeFileSync(path, JSON.stringify(config, null, 2) + '\n');
}

// Keep the imported project usable while the compiler clears/recreates its output.
export function stageWeixinBuild(output) {
  output = resolve(output);
  const parent = dirname(output);
  mkdirSync(parent, { recursive: true });
  const temporary = mkdtempSync(join(parent, '.mori-weixin-'));
  const path = join(temporary, 'current');
  const previous = join(temporary, 'previous');
  const cleanup = () => {
    if (!resolve(temporary).startsWith(parent + sep)) throw new Error('Unexpected WeChat staging path');
    // If rollback failed, retain the previous build for recovery.
    if (existsSync(previous)) return;
    rmSync(temporary, { recursive: true, force: true });
  };
  return { path, cleanup, commit() {
    const app = JSON.parse(readFileSync(join(path, 'app.json'), 'utf8'));
    if (!Array.isArray(app.pages) || app.pages.length === 0) throw new Error('WeChat build has no pages');
    normalizeWeixinProject(path);
    const hadPrevious = existsSync(output);
    if (hadPrevious) renameSync(output, previous);
    try { renameSync(path, output); }
    catch (error) { if (hadPrevious) renameSync(previous, output); throw error; }
    if (hadPrevious) rmSync(previous, { recursive: true, force: true });
    cleanup();
  } };
}
