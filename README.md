# Muhammad Asif — Portfolio Website

Dark, cinematic single-page portfolio. No build step — plain HTML/CSS/JS with GSAP from CDN.
Design system based on the "portfolio-cosmic-hero" reference; the Connect section's orbiting
project carousel follows the "vortex-studio-hero" reference.

## Structure

- `index.html` — all content and sections
- `css/style.css` — design system (palette, type, layout, responsive)
- `js/main.js` — starfield canvas, GSAP reveals, stat counters, orbit carousel, media lightbox
- `assets/carousel/` — web-optimized carousel slide images (sources in `CAROUSEL/`)
- `assets/docs/` — book-review and content-calendar PDFs
- `assets/certs/` — all 9 certificate PDFs (downloaded from the old GitHub site)
- `assets/thumbs/` — auto-generated PDF cover thumbnails

## Content rules

- **No dates anywhere on the site** (no "Published on", years, or month names).
- **No Upwork mentions** — visitors must not know about it.
- Media tiles are driven by data attributes: `data-drive="<Drive file ID>"`,
  `data-yt="<YouTube ID>"`, `data-yt-short="<YouTube ID>"` (vertical), or
  `data-img="<path>"`. PDFs are plain `<a class="media-tile tile-pdf">` links.
- Projects 05–08 sit inside `#moreProjects` and show via the "View more projects" button.

## Run locally

```
python -m http.server 4173
```

Then open http://localhost:4173

## Hero showreel

`assets/showreel.mp4` is the beat-synced editor showreel (H.264 + AAC, 1080p, 44s, ~7.6 MB,
music included), compressed from `videos/editor-showreel/renders/showreel-final.mp4` (the
full-quality master for YouTube, 27 MB). `assets/poster.jpg` is its first frame. The hero
autoplays muted (a browser requirement) with a "Tap for sound" toggle that unmutes on click.
The showreel is a HyperFrames project at `videos/editor-showreel/` — edit the storyboard or
frames there and re-render (`npx hyperframes render . -q high`), then re-compress with
ffmpeg (CRF 25, keep audio, `+faststart`) into `assets/showreel.mp4` and re-extract the
poster. The previous 20s AI-generated loop's source remains at `ABOUT ME.mp4`.

Notes:
- The site deliberately contains **no Upwork mentions** and **no dates** — keep it that way.
- One Drive video (`19i3cF5hhtDeUs9vMaevWUmTO5UaAO7iF`) still needs sharing set to
  "Anyone with the link – Viewer" or its tiles stay dark.

## Notes

- All work videos stream from Google Drive. The files must stay shared as
  **"Anyone with the link can view"**, or thumbnails and playback will break.
- Thumbnails come from `drive.google.com/thumbnail?id=...` automatically — no manual images needed.
- To swap or add portfolio videos, change the `data-video="<DRIVE_FILE_ID>"` attributes on the
  `.work-card` and `.orbit-card` elements in `index.html`.

## Deploy (GitHub Pages, like the old site)

```
git init
git add .
git commit -m "Portfolio site"
```

Push to a repo named `<username>.github.io` (or enable Pages on any repo, main branch, root).
No build configuration needed.
