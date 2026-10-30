import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const base = resolve(dirname(fileURLToPath(import.meta.url)), '../unpackage/dist/build/h5');
const port = Number(process.env.PORT || 5173);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2', '.json':'application/json' };
createServer(async (request, response) => {
  try {
    const requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let path = resolve(base, '.' + requested);
    if (path !== base && !path.startsWith(base + sep)) { response.writeHead(403); response.end(); return; }
    if ((await stat(path).catch(() => null))?.isDirectory()) path = resolve(path, 'index.html');
    const bytes = await readFile(path);
    response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(bytes);
  } catch { response.writeHead(404); response.end('Not found. Run npm run build:h5 first.'); }
}).listen(port, '127.0.0.1', () => console.log(`Mori UI: http://127.0.0.1:${port}`));
