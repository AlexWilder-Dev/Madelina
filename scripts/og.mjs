// One-off: builds public/og.jpg (1200×630) for link previews, in the site's look:
// glaze-cream ground, the navy wordmark and headline, and three of their dishes as prints.
// Run with `npm run og`.
import sharp from 'sharp';
import { statSync } from 'node:fs';

const W = 1200;
const H = 630;
const CREAM = '#f2e7d6';
const NAVY = '#22305c';
const TERRA = '#c0532b';

const text = (markup, font, file) => sharp({ text: { text: markup, font, fontfile: file, rgba: true, dpi: 72 } }).png().toBuffer();

/** A photo with a white border, a caption strip and a soft shadow, rotated. */
async function print(file, width, angle, caption) {
  const pad = Math.round(width * 0.04);
  const imgW = width - pad * 2;
  const imgH = Math.round(imgW * 1.25);
  const strip = Math.round(width * 0.14);
  const h = pad + imgH + strip;
  const photo = await sharp(file).resize(imgW, imgH, { fit: 'cover' }).toBuffer();
  const label = await text(`<span foreground="${NAVY}">${caption}</span>`, 'Instrument Sans 15', 'scripts/fonts/InstrumentSans.ttf');
  const card = await sharp({ create: { width, height: h, channels: 4, background: '#fffdf8' } })
    .composite([
      { input: photo, left: pad, top: pad },
      { input: label, left: pad + 2, top: pad + imgH + Math.round((strip - 18) / 2) },
    ])
    .png()
    .toBuffer();
  const m = 30;
  // Composite first, blur in a second pass (sharp runs blur before composite in one pipeline)
  const block = await sharp({ create: { width: width + m * 2, height: h + m * 2, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: Buffer.from(`<svg width="${width}" height="${h}"><rect width="${width}" height="${h}" fill="rgba(70,44,18,0.34)"/></svg>`), left: m, top: m + 10 }])
    .png()
    .toBuffer();
  const shadow = await sharp(block).blur(12).png().toBuffer();
  const framed = await sharp(shadow).composite([{ input: card, left: m, top: m }]).png().toBuffer();
  return sharp(framed).rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

const logo = await sharp('src/assets/logo-navy.png').resize({ width: 170 }).toBuffer();
const l1 = await text(`<span foreground="${NAVY}" letter_spacing="-1200">Breakfast, brunch,</span>`, 'Fraunces 74', 'scripts/fonts/Fraunces.ttf');
const l2 = await text(
  `<span foreground="${TERRA}" letter_spacing="-1200">all day</span><span foreground="${NAVY}" letter_spacing="-1200"> everyday</span>`,
  'Fraunces Italic 74',
  'scripts/fonts/Fraunces-Italic.ttf',
);
const where = await text(`<span foreground="${NAVY}" letter_spacing="2400">BRIXTON  ·  EAST DULWICH</span>`, 'Instrument Sans SemiBold 15', 'scripts/fonts/InstrumentSans.ttf');

const p1 = await print('src/assets/photos/dish-benedict.webp', 200, -7, 'Eggs Benedict');
const p2 = await print('src/assets/photos/dish-avocado.webp', 228, 3, 'Avocado on Toast');
const p3 = await print('src/assets/photos/dish-english.webp', 200, 8, 'Full English');

const meta = async (b) => sharp(b).metadata();
const [m1, m2, mw, ml] = await Promise.all([meta(l1), meta(l2), meta(where), meta(logo)]);

const X = 64;
await sharp({ create: { width: W, height: H, channels: 3, background: CREAM } })
  .composite([
    { input: logo, left: X, top: 56 },
    { input: l1, left: X, top: 210 },
    { input: l2, left: X, top: 210 + m1.height - 8 },
    { input: where, left: X + 2, top: H - 64 - mw.height },
    { input: p1, left: 610, top: 150 },
    { input: p3, left: 900, top: 160 },
    { input: p2, left: 735, top: 70 },
  ])
  .jpeg({ quality: 84, progressive: false, trellisQuantisation: true, overshootDeringing: true, quantisationTable: 3, chromaSubsampling: '4:2:0' })
  .toFile('public/og.jpg');

const out = await sharp('public/og.jpg').metadata();
console.log(`public/og.jpg ${out.width}x${out.height} ${Math.round(statSync('public/og.jpg').size / 1024)}KB`, m1.width, m2.width);
