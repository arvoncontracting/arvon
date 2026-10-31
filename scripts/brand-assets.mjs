// Builds favicons, the social preview and the structured-data logo from the traced artwork.
// Run with: node scripts/brand-assets.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { logoArtwork } from '../src/components/logoArtwork.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/brand');
await mkdir(outDir, { recursive: true });

const ORANGE = '#E65A1F';
const CHARCOAL = '#1F2326';
const { symbol, standalone, wordEn } = logoArtwork;

// Approved app icon: white symbol centred on an orange rounded square.
const inkW = standalone.ink.x1 - standalone.ink.x0;
const inkH = standalone.ink.y1 - standalone.ink.y0;
const scale = 300 / inkW;
const iconInner = (rx) => `
  <rect width="512" height="512" rx="${rx}" fill="${ORANGE}"/>
  <g fill="#fff" fill-rule="evenodd" transform="translate(${256 - (standalone.ink.x0 + inkW / 2) * scale} ${256 - (standalone.ink.y0 + inkH / 2) * scale}) scale(${scale})">
    <path d="${standalone.orange}"/><path d="${standalone.dark}"/>
  </g>`;
const icon = (rx) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${iconInner(rx)}</svg>`;

await writeFile(path.join(outDir, 'favicon.svg'), icon(96));
await sharp(Buffer.from(icon(96))).resize(32, 32).png().toFile(path.join(outDir, 'favicon-32.png'));
await sharp(Buffer.from(icon(0))).resize(180, 180).png().toFile(path.join(outDir, 'apple-touch-icon.png'));

const master = (body, accent) => `
  <g transform="translate(944 400)" fill-rule="evenodd"><path fill="${accent}" d="${symbol.orange}"/><path fill="${body}" d="${symbol.dark}"/></g>
  <g transform="translate(288 2016)" fill-rule="evenodd"><path fill="${body}" d="${wordEn.dark}"/><path fill="${accent}" d="${wordEn.orange}"/></g>`;

const logoSvg = (body, accent, width) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="387 451 3932 2621" width="${width}" height="${Math.round((width * 2621) / 3932)}">${master(body, accent)}</svg>`;

await sharp(Buffer.from(logoSvg(CHARCOAL, ORANGE, 800)))
  .flatten({ background: '#ffffff' })
  .extend({ top: 60, bottom: 60, left: 60, right: 60, background: '#ffffff' })
  .png()
  .toFile(path.join(outDir, 'arvon-logo.png'));

// Social preview: Amman under a dark gradient, logo on the calm charcoal side.
const scrim = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="1" x2="0"><stop offset="0" stop-color="${CHARCOAL}" stop-opacity="0.96"/><stop offset="0.5" stop-color="${CHARCOAL}" stop-opacity="0.8"/><stop offset="1" stop-color="${CHARCOAL}" stop-opacity="0.1"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
</svg>`;
const logoPng = await sharp(Buffer.from(logoSvg('#FFFFFF', ORANGE, 440))).png().toBuffer();

await sharp(path.resolve(root, '../Image/1.jpeg'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([{ input: Buffer.from(scrim) }, { input: logoPng, top: 168, left: 700 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(outDir, 'og-image.jpg'));

console.log('Brand assets written to public/brand');
