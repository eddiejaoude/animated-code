# CodeReel — animate your code

UI-only prototype of a tool that turns a code snippet into a short animated video
clip (think carbon.now.sh, but the output is motion). No backend, no real encoding —
the export flow is mocked.

<img width="1000" height="561" alt="Image" src="https://github.com/user-attachments/assets/6d1d0769-f704-47c3-b029-c57b8dd156af" />

## Features

- ✅ prototype
- ☑️ MVP + export in multiple formats
- ☑️ authentication
- ☑️ save projects
- ☑️ payment with PayPal

## Run it

```sh
npm install
npm run dev
```

## Test it

The Playwright end-to-end suite covers critical user journeys in Chromium.
Install the browser once after installing the project dependencies, then run the suite:

```sh
npm ci
npx playwright install chromium
npm test
```

Use Playwright UI mode when developing or debugging tests:

```sh
npm run test:e2e:ui
```

## What's inside

- **Code input** (left panel): editable snippet, 9-language selector with per-language
  sample code, hand-rolled syntax highlighter (`src/lib/highlight.ts`).
- **Animated preview** (center): styled macOS-style code window rendered on an
  aspect-ratio canvas, animated with typewriter / fade-in / slide motion presets.
  The window auto-scales to fit the canvas.
- **Playback bar**: play/pause/restart/loop, scrubbable timeline, duration and
  speed controls. Space = play/pause, R = restart.
- **Style panel** (right): 6 themes (Dracula, GitHub Dark, Nord, Solarized, Tokyo
  Night, Monokai), background gradients + custom color, window chrome + title,
  line numbers, corner radius, shadow, padding, font family/size.
- **Export bar** (top): 16:9 / 1:1 / 9:16 aspect presets, MP4 / GIF / WebM format
  buttons, and a mocked export modal with phased progress.

Stack: Vite + React 19 + TypeScript + Tailwind CSS v4. Fonts ship locally via
Fontsource; icons are lucide-react.
