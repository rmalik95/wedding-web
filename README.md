# Interactive Wedding Invitation Website

This repository contains a responsive, single-page invitation website built with React, TypeScript, Vite, native CSS, and jsPDF. It presents an editorial correspondence experience with an animated envelope opening, date reveal, countdown, photo carousel, story section, illustrated map, destination postcard gallery, and long-form postcard composer.

The interface uses one cohesive visual system with warm paper tones, deep red, antique gold, serif typography, printed rules, tactile composition, and restrained motion. It is designed for desktop, tablet, and mobile browsers. There is no RSVP flow.

## Features

- Animated envelope, candle, thread, wax seal, flap, and emerging invitation pieces.
- Keyboard-accessible skip action and `prefers-reduced-motion` support.
- Scratch-to-reveal date interaction with accessible reveal buttons.
- Timezone-aware live countdown with wedding-day and post-event states.
- Controllable photo carousel with previous, next, pause, play, keyboard, and touch support.
- Responsive editorial event, story, and illustrated map sections.
- Destination postcard gallery with accessible dialog-based wish composer.
- Local draft storage with validation and clear delivery state.
- Designed postcard PDF preview and download with continuation pages for long messages.
- Reusable styled HTML email builder and PDF export API for future server integration.
- No analytics, autoplay audio, payment flow, guest tracking, or public email service is included.

## Current integration status

Email delivery is intentionally not connected. The browser currently lets a visitor save a draft locally, preview the complete postcard PDF, and download it. It does not claim that a message was sent.

The future email integration should send a styled HTML postcard body and attach the complete generated PDF. The implementation contract is documented in [`docs/POSTCARD-EMAIL.md`](docs/POSTCARD-EMAIL.md). The HTML builder is [`src/lib/postcardEmail.ts`](src/lib/postcardEmail.ts), and the PDF generator is [`src/components/postcardExport.ts`](src/components/postcardExport.ts).

A future server must provide the email provider, recipient configuration, secure endpoint, validation, rate limiting, sender verification, attachment handling, and secret storage. Credentials must never be placed in browser code.

## Requirements

Use Node.js 20.19 or newer, or Node.js 22.12 or newer.

## Development

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Vite prints the local URL. The default is `http://localhost:5173` when that port is available.

Create a production build:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

The deployable output is written to `dist/`. No hosting or GitHub push is performed by the repository scripts.

## Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install project dependencies |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run TypeScript checking and create the production build |
| `npm run preview` | Serve the production build locally |

## Project structure

```text
src/
  App.tsx                         Main page composition
  main.tsx                        React entry point
  styles.css                      Shared design tokens and responsive layout
  components/Envelope.tsx         Opening animation
  components/DateReveal.tsx       Scratch surfaces and countdown
  components/PhotoCarousel.tsx    Accessible photo carousel
  components/Postcards.tsx        Gallery and wish composer
  components/postcardExport.ts    Paginated postcard PDF generator
  lib/postcardEmail.ts            Escaped styled email body builder
public/images/                    Optimized website image assets
public/fonts/                     Local font files and license texts
docs/                             Requirements, QA, art, and email specifications
AGENTS.md                         Repository instructions for coding agents
index.html                        Document metadata and React mount point
package.json                      Scripts and dependencies
package-lock.json                 Locked dependency versions
tsconfig.json                     TypeScript configuration
```

## Assets

Website-ready image derivatives live under `public/images/`. The postcard gallery uses the `postcard-*-illustrated.webp` files. The source photographs, design source files, PDFs, local QA screenshots, environment files, and agent handoff files are excluded by `.gitignore`.

Images have explicit dimensions, deliberate crops, descriptive alternative text, and lazy loading where appropriate. Fonts are stored locally with their license files. No third-party image URLs are required at runtime.

## Technical and design notes

- React, TypeScript, Vite, native CSS, and jsPDF are used without an animation framework.
- CSS variables keep colors, typography, spacing, and component states coherent.
- Motion uses compositor-friendly transforms and opacity, and is disabled or reduced when requested by the operating system.
- Native controls, labels, visible focus states, keyboard alternatives, pointer input, touch alternatives, modal behavior, and live status messages support accessible interaction.
- Layout is checked at 375, 768, and 1440 pixel widths with no horizontal overflow.
- The PDF renderer wraps long text, including long unbroken tokens, and creates continuation pages instead of truncating content. PDF pages are raster artwork, so their text is not selectable.
- The HTML email builder escapes user content and is intended for server-side use only.

## Verification

Verification notes are maintained in [`docs/QA.md`](docs/QA.md). The checks cover:

- TypeScript and Vite production builds;
- desktop, tablet, and mobile layout and overflow;
- opening animation and reduced-motion behavior;
- scratch interaction and countdown states;
- carousel controls and pause behavior;
- all postcard destinations and dialog behavior;
- empty-form validation, local drafts, PDF preview, and PDF download;
- long-message preservation across continuation pages;
- keyboard focus containment, Escape close, and focus restoration; and
- browser runtime errors in exercised flows.

Run `npm run build` before publishing. Browser checks use the local production preview and an installed Chromium runtime.

## Documentation map

- [`docs/PRD.md`](docs/PRD.md): product scope, interaction requirements, design direction, and acceptance criteria.
- [`docs/QA.md`](docs/QA.md): browser and production verification notes.
- [`docs/POSTCARD-ARTWORK.md`](docs/POSTCARD-ARTWORK.md): generated artwork prompts and provenance.
- [`docs/POSTCARD-EMAIL.md`](docs/POSTCARD-EMAIL.md): future email payload, inline artwork, and complete PDF attachment contract.
- [`AGENTS.md`](AGENTS.md): repository-specific instructions for coding agents.

## What belongs in this README

Keep this file focused on the public technical handoff:

- a neutral product overview;
- feature behavior and current integration status;
- prerequisites and exact development commands;
- source structure and asset conventions;
- accessibility, performance, and responsive constraints;
- verification steps and known technical limitations; and
- links to detailed project documentation.

Do not put private names, personal schedules, addresses, personal correspondence, raw source photos, private design PDFs, secrets, `.env` values, local QA output, or agent handoff content in this README.

## Publishing checklist

1. Confirm that all public copy and assets are approved.
2. Configure the secure email service separately from the browser application.
3. Test short and very long postcard messages through the email and attachment path.
4. Run `npm run build` and the documented browser checks.
5. Deploy `dist/` to the chosen static host.
6. Add and push the intended source files to the remote repository manually.
