import sharp from 'sharp';
import potrace from 'potrace';
import { writeFileSync, mkdirSync } from 'node:fs';
import { promisify } from 'node:util';

const trace = promisify(potrace.trace);
const [board, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const SCALE = 8;

const isOrange = (r, g, b) => r > 170 && r - b > 90 && r - g > 40;
const isDark = (r, g, b) => (r + g + b) / 3 < 125 && !(r - b > 40);

async function rawCrop(box) {
  const w = box.width * SCALE, h = box.height * SCALE;
  const raw = await sharp(board).extract(box).removeAlpha()
    .resize(w, h, { kernel: 'lanczos3' }).blur(1.6).raw().toBuffer();
  return { raw, w, h };
}
function maskBuf({ raw, w, h }, test) {
  const buf = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) {
    buf[i] = test(raw[i * 3], raw[i * 3 + 1], raw[i * 3 + 2]) ? 0 : 255;
  }
  return buf;
}
function bbox(buf, w, h) {
  let x0 = w, x1 = 0, y0 = h, y1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (buf[y * w + x] === 0) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return { x0, x1, y0, y1 };
}
const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)));

async function tracePath(buf, w, h, smooth, turd) {
  const png = await sharp(buf, { raw: { width: w, height: h, channels: 1 } })
    .blur(smooth).threshold(128).png().toBuffer();
  const svg = await trace(png, { threshold: 128, turdSize: turd, optTolerance: 3, alphaMax: 1.0, turnPolicy: 'majority' });
  return round(svg.match(/ d="([^"]+)"/)?.[1] ?? '');
}

const prims = {
  symbol: { box: { left: 118, top: 50, width: 356, height: 196 }, smooth: 11, turd: 800 },
  standalone: { box: { left: 618, top: 42, width: 180, height: 110 }, smooth: 7, turd: 800 },
  wordEn: { box: { left: 36, top: 252, width: 530, height: 140 }, smooth: 3, turd: 200 },
  wordAr: { box: { left: 1000, top: 500, width: 260, height: 136 }, smooth: 1.2, turd: 30 },
};
const result = {};
for (const [name, { box, smooth, turd }] of Object.entries(prims)) {
  const c = await rawCrop(box);
  const o = maskBuf(c, isOrange), d = maskBuf(c, isDark);
  const bo = bbox(o, c.w, c.h), bd = bbox(d, c.w, c.h);
  result[name] = {
    w: c.w, h: c.h,
    orange: name === 'wordAr' ? '' : await tracePath(o, c.w, c.h, smooth, turd),
    dark: await tracePath(d, c.w, c.h, smooth, turd),
    ink: { x0: Math.min(bo.x0, bd.x0), x1: Math.max(bo.x1, bd.x1), y0: Math.min(bo.y0, bd.y0), y1: Math.max(bo.y1, bd.y1) },
  };
  console.log(name, result[name].orange.length, result[name].dark.length, result[name].ink);
}

// Measure approved lockups on the board so recomposition keeps their geometry.
async function regions(box) {
  const c = await rawCrop(box);
  const ink = Buffer.alloc(c.w * c.h);
  const o = maskBuf(c, isOrange), d = maskBuf(c, isDark);
  for (let i = 0; i < ink.length; i++) ink[i] = o[i] === 0 || d[i] === 0 ? 0 : 255;
  const cols = [];
  for (let x = 0; x < c.w; x++) {
    let any = false;
    for (let y = 0; y < c.h; y++) if (ink[y * c.w + x] === 0) { any = true; break; }
    cols.push(any);
  }
  const runs = []; let s = -1;
  for (let x = 0; x <= c.w; x++) {
    if (cols[x] && s < 0) s = x;
    if (!cols[x] && s >= 0) { runs.push([s, x - 1]); s = -1; }
  }
  // merge runs with gaps under 10 board px
  const merged = [];
  for (const r of runs) {
    const last = merged[merged.length - 1];
    if (last && r[0] - last[1] < 10 * SCALE) last[1] = r[1]; else merged.push([...r]);
  }
  return merged.map(([a, b]) => {
    let y0 = c.h, y1 = 0;
    for (let y = 0; y < c.h; y++) for (let x = a; x <= b; x++) if (ink[y * c.w + x] === 0) { if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return { x0: a, x1: b, y0, y1 };
  });
}
result.lockups = {
  arabic: await regions({ left: 1000, top: 218, width: 262, height: 86 }),
  bilingual: await regions({ left: 612, top: 360, width: 420, height: 68 }),
};
console.log(JSON.stringify(result.lockups));
writeFileSync(`${out}/prims.json`, JSON.stringify(result));
const preview = (p, color = '#1F2326') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${p.w} ${p.h}"><rect width="100%" height="100%" fill="#fff"/><path fill="${color}" fill-rule="evenodd" d="${p.dark}"/><path fill="#E65A1F" fill-rule="evenodd" d="${p.orange}"/></svg>`;
for (const k of Object.keys(prims)) writeFileSync(`${out}/${k}.svg`, preview(result[k]));
