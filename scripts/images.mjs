// One-off: crops and compresses the photos saved in research/img into src/assets/photos.
// Run with `npm run images` after re-downloading the originals.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'research/img';
const OUT = 'src/assets/photos';
mkdirSync(OUT, { recursive: true });

// [output name, source file, crop {left, top, width, height} in source pixels or null, output width, quality]
const jobs = [
  // Shopfronts, 4:5
  ['shop-brixton', 'IMG-6839.jpg', { left: 450, top: 0, width: 1500, height: 1875 }, 900],
  ['shop-dulwich', 'IMG-6260.jpg', { left: 700, top: 0, width: 1500, height: 1875 }, 900],
  // Round plates (square crops around the plate)
  ['plate-avocado', 'c.jpg', { left: 0, top: 150, width: 1090, height: 1090 }, 720],
  ['plate-bagel', 'c.jpg', { left: 1510, top: 50, width: 990, height: 990 }, 720],
  ['plate-coffee', 'c.jpg', { left: 1100, top: 405, width: 520, height: 520 }, 520],
  ['plate-croissant', 'cover.jpg', { left: 680, top: 435, width: 880, height: 880 }, 720],
  ['plate-benedict', 'IMG_8051.jpeg', { left: 310, top: 940, width: 2190, height: 2190 }, 720],
  ['plate-english', 'IMG_4155.jpeg', { left: 80, top: 700, width: 2200, height: 2200 }, 720],
  // Full frames
  ['table-cover', 'cover.jpg', null, 1600],
  ['table-c', 'c.jpg', null, 1600],
  ['pansy-drinks', 'IMG-6659.jpg', null, 1200],
  ['counter', 'volcano/IMG_4097.jpg', null, 1400],
  ['shelves', 'volcano/IMG_1301.jpg', { left: 0, top: 0, width: 4032, height: 3024 }, 1200],
  ['spiced-cup', 'volcano/434284784_18281833249166882_4640557560329906479_n.jpg', null, 900],
];

for (const [name, file, crop, width, q = 78] of jobs) {
  let img = sharp(`${SRC}/${file}`).rotate();
  if (crop) img = img.extract(crop);
  const info = await img.resize({ width, withoutEnlargement: true }).webp({ quality: q }).toFile(`${OUT}/${name}.webp`);
  console.log(name, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}

// Logo: trim the transparent padding around the gold wordmark
const logo = await sharp(`${SRC}/background-logo.png`).trim().toBuffer();
const l = await sharp(logo).resize({ width: 900 }).png({ compressionLevel: 9 }).toFile('src/assets/logo-wordmark.png');
console.log('logo', `${l.width}x${l.height}`, `${Math.round(l.size / 1024)}KB`);

// Monogram (their favicon artwork): square crop for icons
const mono = sharp(`${SRC}/favicon.ico`);
const meta = await mono.metadata();
// The artwork is slightly wider than tall; pad it square with its own green so the leaf and flower survive
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
