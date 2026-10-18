// One-off: crops and compresses the photos saved in research/img into src/assets/photos.
// Run with `npm run images` after re-downloading the originals.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'research/img';
const OUT = 'src/assets/photos';
mkdirSync(OUT, { recursive: true });

// [output name, source file, crop {left, top, width, height} in source pixels or null, output width, quality]
const jobs = [
  // Dishes, 4:5
  ['dish-benedict', 'IMG_8051.jpeg', { left: 0, top: 380, width: 2500, height: 3125 }, 1000],
  ['dish-english', 'IMG_4155.jpeg', { left: 0, top: 300, width: 2500, height: 3125 }, 1000],
  ['dish-avocado', 'avo.jpg', { left: 0, top: 300, width: 2500, height: 3125 }, 1000],
  ['dish-bagel', 'c.jpg', { left: 1500, top: 0, width: 1000, height: 1250 }, 800],
  // Menu page band, like the avocado close-up on their own menu pages
  ['avocado-band', 'avo.jpg', { left: 0, top: 1100, width: 2500, height: 1100 }, 1800],
  // Shopfronts, 4:5 like the dish prints
  ['shop-brixton', 'IMG-6839.jpg', { left: 380, top: 0, width: 1500, height: 1875 }, 900],
  ['shop-dulwich', 'IMG-6260.jpg', { left: 760, top: 0, width: 1500, height: 1875 }, 900],
  // Drinks and the counter (counter photo: Volcano Coffee Works, credited on the page)
  ['pansy-drinks', 'IMG-6659.jpg', { left: 280, top: 0, width: 1500, height: 1875 }, 900],
  ['counter', 'volcano/IMG_4097.jpg', { left: 600, top: 0, width: 2411, height: 3014 }, 900],
];

for (const [name, file, crop, width, quality = 80] of jobs) {
  let img = sharp(`${SRC}/${file}`).rotate();
  if (crop) img = img.extract(crop);
  const info = await img.resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(`${OUT}/${name}.webp`);
  console.log(name, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}

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


// The wordmark recoloured for this design: plate navy on the cream ground, cream on navy
const trimmed = await sharp(`${SRC}/background-logo.png`).trim().resize({ width: 900 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (const [name, rgb] of [['logo-navy', [0x22, 0x30, 0x5c]], ['logo-cream', [0xf6, 0xec, 0xdc]]]) {
  const px = Buffer.from(trimmed.data);
  for (let i = 0; i < px.length; i += 4) [px[i], px[i + 1], px[i + 2]] = rgb;
  await sharp(px, { raw: { width: trimmed.info.width, height: trimmed.info.height, channels: 4 } }).png({ compressionLevel: 9 }).toFile(`src/assets/${name}.png`);
}
console.log('logos done');
