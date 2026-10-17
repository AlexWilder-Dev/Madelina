# Madelina — demo site

A speculative redesign for [Madelina](https://www.madelina.co.uk), the family-run brunch cafés at
105 Acre Lane, Brixton and 75 East Dulwich Grove. Front end only: the booking and hire forms show a
confirmation but send nothing.

Live demo: https://alexwilder-dev.github.io/Madelina/

## What's in it

- **Brixton / Dulwich switch** that carries through the whole site — menu prices, hours, phone,
  directions, what's on, the booking form — and is remembered on the device.
- **Live open/closed** for both branches in London time, including Brixton's Friday and Saturday wine
  nights. From 6pm on those evenings the site turns to wine night (there's a preview toggle in the
  footer and on the What's on page).
- Both menus transcribed from madelina.co.uk, plus what's on the counter.
- Wine nights, private hire, the Dulwich garden, and an enquiry form for tables, wine nights, garden
  tables and hire.

All content lives in `src/data/madelina.ts`. Sources and open questions are in `research/notes.md`.

## Develop

```sh
npm install
npm run dev       # http://localhost:5173/Madelina/
npm run build     # type-check and build to dist/
npm run images    # re-crop photos from research/img into src/assets/photos
npm run og        # rebuild public/og.jpg (1200×630 link preview)
```

Built with Vite, React, TypeScript, Framer Motion and React Router (hash routing for GitHub Pages).
`.github/workflows/deploy.yml` publishes `dist/` to GitHub Pages on every push to `main` or the current
working branch (Settings → Pages → Source: GitHub Actions).

Photos and logo are Madelina's own (from their website). Two interior photos come from Volcano Coffee
Works' 2024 feature on the café and are credited where shown; a third image in that feature is one of
Madelina's own Instagram photos.

Site by AlexWilder-Dev
