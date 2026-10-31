// Writes the React-rendered markup into dist/index.html. The page is static HTML;
// the browser only runs the small enhancement scripts in src/client and src/motion.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);

const dist = path.join(root, 'dist');
const htmlPath = path.join(dist, 'index.html');
const template = await readFile(htmlPath, 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('Prerender marker missing from index.html');

let html = template.replace('<!--app-html-->', render());

// Inline the stylesheet: first paint then needs one request instead of two.
const stylesheet = html.match(/<link rel="stylesheet"[^>]*href="\/arvon\/(assets\/[^"]+\.css)"[^>]*>/);
if (!stylesheet) throw new Error('Built stylesheet link not found');
const css = await readFile(path.join(root, 'dist', stylesheet[1]), 'utf8');
html = html.replace(stylesheet[0], () => `<style>${css}</style>`);

// Preload the two fonts every first screen uses, so text settles quickly and only once.
const fonts = (await readdir(path.join(root, 'dist/assets'))).filter((file) =>
  /^(noto-kufi-arabic-arabic-700|ibm-plex-sans-arabic-arabic-400)-normal-.+\.woff2$/.test(file),
);
const preloads = fonts
  .map((file) => `<link rel="preload" as="font" type="font/woff2" href="/arvon/assets/${file}" crossorigin>`)
  .join('');
html = html.replace('</title>', `</title>${preloads}`);

await writeFile(htmlPath, html);
await rm(path.join(dist, stylesheet[1]));
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log('Prerendered dist/index.html');
