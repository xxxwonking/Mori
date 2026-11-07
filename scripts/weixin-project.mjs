import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// HBuilderX copies the source-root config into the output. The output itself
// is already a mini-program root, so it must not point to a nested build path.
export function normalizeWeixinProject(output) {
  const path = join(output, 'project.config.json');
  if (!existsSync(path)) return;
  const config = JSON.parse(readFileSync(path, 'utf8'));
  config.miniprogramRoot = './';
  writeFileSync(path, JSON.stringify(config, null, 2) + '\n');
}
