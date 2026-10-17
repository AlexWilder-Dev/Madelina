# Madelina — demo site

A speculative redesign for [Madelina](https://www.madelina.co.uk), the family-run brunch cafés at
105 Acre Lane, Brixton and 75 East Dulwich Grove. Front end only: the booking and hire forms show a
confirmation but send nothing.

Live demo: https://alexwilder-dev.github.io/Madelina/

## What's in it

- **Their look, given more room**: the deep green and pale gold of their current site, Inknut Antiqua
  capitals for headings, their own green for links, and their photographs shown large on square
  corners. No widgets, cards or drawn ornaments.
- **Which café, open or not**: both cafés on two typeset lines under the opening photo, with live
  open/closed in London time. Tap one to make it yours; the menu prices, phone, directions, hours
  order and booking form follow, and the choice is remembered on the device.
- **Brixton wine nights**: on Friday and Saturday from 6pm the page darkens, the opening photo turns
  to drinks and the status reads "Wine night until 11pm". There's a preview link in the footer.
- **Both menus**, transcribed from madelina.co.uk, with the other café's price noted where it differs,
  plus what's on the counter.
- **A booking request form** for a table, a wine night, a garden table or private hire (front end only).

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
`.github/workflows/deploy.yml` publishes `dist/` to GitHub Pages on every push to the default branch
(Settings → Pages → Source: GitHub Actions).

Photos and logo are Madelina's own (from their website). The counter photo comes from Volcano Coffee
Works' 2024 feature on the café and is credited where shown.

Site by AlexWilder-Dev
