// One-off: builds public/og.jpg (1200×630) for link previews, in the site's own look:
// the green panel with the Bodoni headline on the left, their table photo on the right.
// Run with `npm run og`.
import sharp from 'sharp';
import { statSync } from 'node:fs';

const W = 1200;
const H = 630;
const PHOTO_W = 540;
const GREEN = '#123f26';

const photo = await sharp('research/img/cover.jpg')
  .extract({ left: 260, top: 0, width: 1250, height: 1460 })
  .resize({ width: PHOTO_W, height: H, fit: 'cover' })
  .toBuffer();

const text = (markup, font, file, width) =>
  sharp({ text: { text: markup, font, fontfile: file, rgba: true, dpi: 72, width, spacing: 0 } }).png().toBuffer();

const roman = 'scripts/fonts/BodoniModa.ttf';
const italic = 'scripts/fonts/BodoniModa-Italic.ttf';
const sans = 'scripts/fonts/DMSans.ttf';

const line1 = await text('<span foreground="#f3ead5" letter_spacing="-1400">Breakfast, brunch,</span>', 'Bodoni Moda 70', roman);
const line2 = await text('<span foreground="#eaa62a" letter_spacing="-1400">all day</span>', 'Bodoni Moda Italic 70', italic);
const line3 = await text('<span foreground="#f3ead5" letter_spacing="-1400">everyday.</span>', 'Bodoni Moda 70', roman);
const places = await text('<span foreground="#f3ead5" letter_spacing="3000">BRIXTON  ·  EAST DULWICH</span>', 'DM Sans Medium 17', sans);
const logo = await sharp('research/img/background-logo.png').trim().resize({ width: 190 }).toBuffer();

const size = async (b) => sharp(b).metadata();
const [m1, m2, m3, mp] = await Promise.all([size(line1), size(line2), size(line3), size(places)]);

const X = 60;
await sharp({ create: { width: W, height: H, channels: 3, background: GREEN } })
  .composite([
    { input: photo, left: W - PHOTO_W, top: 0 },
    { input: logo, left: X, top: 48 },
    { input: line1, left: X, top: 200 },
    { input: line2, left: X, top: 200 + m1.height - 4 },
    { input: line3, left: X, top: 200 + m1.height + m2.height - 8 },
    { input: places, left: X + 2, top: H - 56 - mp.height },
  ])
  .jpeg({ quality: 84, progressive: false, trellisQuantisation: true, overshootDeringing: true, quantisationTable: 3, chromaSubsampling: '4:2:0' })
  .toFile('public/og.jpg');

const meta = await sharp('public/og.jpg').metadata();
console.log(`public/og.jpg ${meta.width}x${meta.height} ${Math.round(statSync('public/og.jpg').size / 1024)}KB`, m1.width, m3.width);
