// Writes the server-rendered markup into dist/index.html so content, SEO and
// no-JavaScript visitors all get the full page before the client bundle loads.
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);

const htmlPath = path.join(root, 'dist/index.html');
const template = await readFile(htmlPath, 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('Prerender marker missing from index.html');

await writeFile(htmlPath, template.replace('<!--app-html-->', render()));
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log('Prerendered dist/index.html');
