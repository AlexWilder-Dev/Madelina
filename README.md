# Madelina — demo site

A speculative redesign for [Madelina](https://www.madelina.co.uk), the family-run brunch cafés at
105 Acre Lane, Brixton and 75 East Dulwich Grove. Front end only: the booking and hire forms show a
confirmation but send nothing.

Live demo: https://alexwilder-dev.github.io/Madelina/

## What's in it

- **Colours from their painted plates**: glaze cream, navy brushwork, terracotta and ochre, with a soft
  Fraunces serif and Instrument Sans.
- **Their dishes as prints on a table**, captioned with the chosen café's prices. Tap to bring one to
  the top, or slide them around with a mouse.
- **Brixton / Dulwich switch** in the status line, with live open/closed in London time. Prices, phone,
  directions, café order and the booking form follow, and the choice is remembered.
- **Brixton wine nights**: on Friday and Saturday from 6pm the site turns navy and leads with wine.
  There's a preview link in the footer.
- **Both menus**, transcribed from madelina.co.uk, as a printed menu card, plus what's on the counter.
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
