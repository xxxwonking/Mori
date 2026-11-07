import { resolve } from 'node:path';
import { createDistribution, verifyDistribution } from './distribution.mjs';

const [mode = 'prepare', path] = process.argv.slice(2);
if (mode === 'prepare') {
  const output = createDistribution();
  console.log(`Prepared local distribution candidate: ${output}`);
  console.log('Contains both modules, licenses, setup instructions and SHA-256 file manifest. No publishing performed.');
} else if (mode === 'verify' && path) {
  const manifest = verifyDistribution(resolve(path));
  console.log(`PASS distribution ${manifest.version}: ${manifest.components} components, ${manifest.files.length} verified files.`);
} else throw new Error('Usage: node scripts/package.mjs prepare | verify <distribution-directory>');
