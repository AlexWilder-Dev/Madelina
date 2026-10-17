// One-off: crops and compresses the photos saved in research/img into src/assets/photos.
// Run with `npm run images` after re-downloading the originals.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'research/img';
const OUT = 'src/assets/photos';
mkdirSync(OUT, { recursive: true });

// [output name, source file, crop {left, top, width, height} in source pixels or null, output width, quality]
const jobs = [
  // The table: their cover shot. Portrait cut for phones, the full frame for wide screens.
  ['table-portrait', 'cover.jpg', { left: 0, top: 0, width: 1334, height: 1667 }, 900, 70],
  ['table-wide', 'cover.jpg', null, 1800, 68],
  // Dishes, 4:5
  ['dish-benedict', 'IMG_8051.jpeg', { left: 0, top: 380, width: 2500, height: 3125 }, 1000],
  ['dish-english', 'IMG_4155.jpeg', { left: 0, top: 300, width: 2500, height: 3125 }, 1000],
  ['dish-avocado', 'avo.jpg', { left: 0, top: 300, width: 2500, height: 3125 }, 1000],
  ['dish-bagel', 'c.jpg', { left: 1500, top: 0, width: 1000, height: 1250 }, 800],
  // Menu page band, like the avocado close-up on their own menu pages
  ['avocado-band', 'avo.jpg', { left: 0, top: 1100, width: 2500, height: 1100 }, 1800],
  // Shopfronts
  ['shop-brixton', 'IMG-6839.jpg', null, 1400],
  ['shop-dulwich', 'IMG-6260.jpg', null, 1400],
  // Drinks and the counter (counter photo: Volcano Coffee Works, credited on the page)
  ['pansy-drinks', 'IMG-6659.jpg', null, 1400],
  ['counter', 'volcano/IMG_4097.jpg', null, 1400],
];

for (const [name, file, crop, width, quality = 80] of jobs) {
  let img = sharp(`${SRC}/${file}`).rotate();
  if (crop) img = img.extract(crop);
  const info = await img.resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(`${OUT}/${name}.webp`);
  console.log(name, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}

// Logo: trim the transparent padding around the gold wordmark
const logo = await sharp(`${SRC}/background-logo.png`).trim().toBuffer();
const l = await sharp(logo).resize({ width: 900 }).png({ compressionLevel: 9 }).toFile('src/assets/logo-wordmark.png');
console.log('logo', `${l.width}x${l.height}`, `${Math.round(l.size / 1024)}KB`);

// Monogram (their favicon artwork): the artwork is slightly wider than tall,
// so pad it square with its own green so the leaf and flower survive
const mono = sharp(`${SRC}/favicon.ico`);
const meta = await mono.metadata();
const side = Math.max(meta.width, meta.height);
const padY = side - meta.height;
const padX = side - meta.width;
const square = await mono
  .extend({
    top: Math.floor(padY / 2), bottom: Math.ceil(padY / 2), left: Math.floor(padX / 2), right: Math.ceil(padX / 2),
    background: '#004645',
  })
  .toBuffer();
await sharp(square).resize(180).png().toFile('public/apple-touch-icon.png');
await sharp(square).resize(48).png().toFile('public/favicon-48.png');
await sharp(square).resize(192).png().toFile('public/icon-192.png');
console.log('icons done');

// Cut-outs: whole cups and bowls lifted out of the overhead shots with a circular mask
const cutouts = [
  ['cut-latte', 'c.jpg', 1366, 672, 247, 600],
  ['cut-bowl', 'cover.jpg', 1748, 719, 301, 700],
];
for (const [name, file, cx, cy, r, size] of cutouts) {
  const side = r * 2;
  const mask = Buffer.from(
    `<svg width="${side}" height="${side}"><circle cx="${r}" cy="${r}" r="${r - 1}" fill="#fff"/></svg>`,
  );
  // Two passes: sharp would otherwise resize before compositing the mask
  const masked = await sharp(`${SRC}/${file}`)
    .extract({ left: cx - r, top: cy - r, width: side, height: side })
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const info = await sharp(masked).resize(size).webp({ quality: 82, alphaQuality: 90 }).toFile(`${OUT}/${name}.webp`);
  console.log(name, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}

// The wordmark again in their deep green, for cream backgrounds
const { data, info: li } = await sharp(logo).resize({ width: 900 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  data[i] = 0x12;
  data[i + 1] = 0x3f;
  data[i + 2] = 0x26;
}
await sharp(data, { raw: { width: li.width, height: li.height, channels: 4 } }).png({ compressionLevel: 9 }).toFile('src/assets/logo-wordmark-green.png');
console.log('green logo done');
