// One-off: builds public/og.jpg (1200×630) for link previews.
// Their overhead table photo, with a deep-green "plate" in the middle carrying the gold logo,
// like the roundel of their monogram. Run with `npm run og`.
import sharp from 'sharp';
import { statSync } from 'node:fs';

const W = 1200;
const H = 630;
const R = 236;
const cx = W / 2;
const cy = H / 2;

const photo = await sharp('research/img/cover.jpg')
  .resize({ width: W, height: 800 })
  .extract({ left: 0, top: 70, width: W, height: H })
  .modulate({ brightness: 0.92 })
  .toBuffer();

const disc = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
      <stop offset="78%" stop-color="#000" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="${cx + 6}" cy="${cy + 12}" r="${R + 26}" fill="url(#shadow)"/>
  <circle cx="${cx}" cy="${cy}" r="${R}" fill="#123f26"/>
  <circle cx="${cx}" cy="${cy}" r="${R - 14}" fill="none" stroke="#e3b849" stroke-width="2.5"/>
  <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#0c2a19" stroke-width="4"/>
</svg>`);

const logo = await sharp('research/img/background-logo.png').trim().resize({ width: 360 }).toBuffer();
const logoMeta = await sharp(logo).metadata();

const line = await sharp({
  text: {
    text: '<span foreground="#e5da85" letter_spacing="2600">BRIXTON · EAST DULWICH</span>',
    font: 'Archivo 10.5',
    fontfile: 'scripts/fonts/Archivo.ttf',
    rgba: true,
    dpi: 144,
  },
}).png().toBuffer();
const lineMeta = await sharp(line).metadata();

const strap = await sharp({
  text: {
    text: '<span foreground="#f6efc0">Breakfast, brunch, all day everyday</span>',
    font: 'Inknut Antiqua 9.5',
    fontfile: 'scripts/fonts/InknutAntiqua-Regular.ttf',
    rgba: true,
    dpi: 144,
  },
}).png().toBuffer();
const strapMeta = await sharp(strap).metadata();

const logoTop = Math.round(cy - logoMeta.height / 2 - 40);
await sharp(photo)
  .composite([
    { input: disc, left: 0, top: 0 },
    { input: logo, left: Math.round(cx - logoMeta.width / 2), top: logoTop },
    { input: strap, left: Math.round(cx - strapMeta.width / 2), top: logoTop + logoMeta.height + 14 },
    { input: line, left: Math.round(cx - lineMeta.width / 2), top: logoTop + logoMeta.height + 14 + strapMeta.height + 10 },
  ])
  .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:2:0' })
  .toFile('public/og.jpg');

const meta = await sharp('public/og.jpg').metadata();
console.log(`public/og.jpg ${meta.width}x${meta.height} ${meta.format} ${Math.round(statSync('public/og.jpg').size / 1024)}KB`);
