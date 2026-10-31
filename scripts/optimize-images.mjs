// Generates responsive AVIF / WebP / JPEG copies of the source photographs.
// Originals in ../Image are read only. Run with: npm run images
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(root, '../../Image');
const outDir = path.resolve(root, '../public/images');
const widths = [480, 800, 1200, 1600];

const photos = [
  { id: 'amman-skyline', source: '1.jpeg' },
  { id: 'hot-asphalt', source: '2.jpeg' },
  { id: 'bitumen-membranes', source: '3.jpeg' },
  // Source file carries black letterbox bars; only the picture area is kept.
  { id: 'asphalt-paving', source: '4.jpeg', extract: { left: 0, top: 64, width: 1448, height: 958 } },
  { id: 'slope-screed', source: '5.jpeg' },
  { id: 'power-trowel', source: '6.jpeg' },
  { id: 'polyurethane', source: '7.jpeg' },
  { id: 'foundation', source: '8.jpeg' },
  { id: 'thermal-insulation', source: '9.jpeg' },
  { id: 'underfloor', source: '10.jpeg' },
];

await mkdir(outDir, { recursive: true });

for (const photo of photos) {
  const input = path.join(sourceDir, photo.source);
  if (!existsSync(input)) throw new Error(`Missing source image: ${input}`);
  const base = () => (photo.extract ? sharp(input).extract(photo.extract) : sharp(input));
  const { width: sourceWidth, height: sourceHeight } = photo.extract ?? (await sharp(input).metadata());
  const targets = widths.filter((w) => w < sourceWidth).concat(sourceWidth);

  for (const width of [...new Set(targets)]) {
    const resized = () => base().resize({ width, withoutEnlargement: true });
    await resized().avif({ quality: 52, effort: 6 }).toFile(path.join(outDir, `${photo.id}-${width}.avif`));
    await resized().webp({ quality: 74, effort: 6 }).toFile(path.join(outDir, `${photo.id}-${width}.webp`));
  }
  await base().resize({ width: Math.min(1200, sourceWidth) }).jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(outDir, `${photo.id}.jpg`));
  console.log(`${photo.id}: ${sourceWidth}x${sourceHeight} -> ${targets.join(', ')}`);
}

// Portrait hero crop for phones: towers and mosque, at a fraction of the wide file's weight.
const portrait = { left: 400, top: 0, width: 660, height: 1006 };
for (const width of [480, 660]) {
  const crop = () => sharp(path.join(sourceDir, '1.jpeg')).extract(portrait).resize({ width });
  await crop().avif({ quality: 48, effort: 6 }).toFile(path.join(outDir, `amman-skyline-portrait-${width}.avif`));
  await crop().webp({ quality: 70, effort: 6 }).toFile(path.join(outDir, `amman-skyline-portrait-${width}.webp`));
}
