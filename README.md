# Madelina — demo site

A speculative redesign for [Madelina](https://www.madelina.co.uk), the family-run brunch cafés at
105 Acre Lane, Brixton and 75 East Dulwich Grove. Front end only: the booking and hire forms show a
confirmation but send nothing.

Live demo: https://alexwilder-dev.github.io/Madelina/

## What's in it

- **Big editorial type and their own colours**: Bodoni Moda headlines on Madelina's deep green, with
  cream, marigold, terracotta and pansy purple taken from their plates, flowers and drinks.
- **Choose your Madelina**: *Brixton* and *Dulwich* as two big words with live open/closed in London
  time. The choice carries through prices, phone, directions, café order and the booking form, and is
  remembered on the device.
- **Brixton wine nights**: on Friday and Saturday from 6pm the site turns purple and leads with wine.
  There's a preview link in the footer.
- **Both menus**, transcribed from madelina.co.uk, with dish photos where they have them and the other
  café's price noted where it differs, plus what's on the counter.
- **Their plates**: a cup and a bowl cut out of their photos, turning as you scroll.
- **A booking request form** for a table, a wine night, a garden table or private hire (front end only).

All content lives in `src/data/madelina.ts`. Sources and open questions are in `research/notes.md`.

## Develop

```sh
npm install
npm run dev       # http://localhost:5173/Madelina/
npm run build     # type-check and build to dist/
npm run images    # re-crop photos from research/img into src/assets/photos
npm run og        # rebuild public/og.jpg (1200×630 link preview, fonts in scripts/fonts)
```

Built with Vite, React, TypeScript, Framer Motion and React Router (hash routing for GitHub Pages).
`.github/workflows/deploy.yml` publishes `dist/` to GitHub Pages on every push to the default branch
(Settings → Pages → Source: GitHub Actions).

Photos and logo are Madelina's own (from their website). The counter photo comes from Volcano Coffee
Works' 2024 feature on the café and is credited where shown.

Site by AlexWilder-Dev
