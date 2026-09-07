# Rishabh & Glyra Wedding Invitation

This repository contains the responsive wedding invitation website for Rishabh and Glyra. It turns the original Canva invitation into an interactive editorial correspondence experience with an envelope opening, date reveal, countdown, photo carousel, story map, destination postcards, and a long form wish composer.

The invitation uses one visual system: oxblood red, warm ivory paper, antique gold, muted olive, printed rules, serif typography, and restrained physical paper motion. There is no RSVP flow.

## What the repository does

Guests can open the wax sealed envelope, watch the candle and thread animation, read the Hong Kong wedding invitation, see the Davao send off details, scratch to reveal the wedding date, view the live countdown, browse the supplied photo carousel, read the story and journey map, and choose from 11 destination postcards.

The destinations are Newcastle, Davao, Tanzania, India, Hungary, London, Edinburgh, Portugal, Amsterdam, Alnwick Castle, and Hong Kong. Each postcard uses custom generated destination artwork without the couple or map crops. Guests can write a wish, save it locally, preview it as a designed postcard PDF, or download it. Long messages flow across continuation pages without being truncated.

The supplied couple illustration appears beside the countdown. The supplied couple in a teacup illustration appears beneath the celebration details. The original journey map remains in Our Story and is blended into that page without a frame.

## Wedding content

- Hong Kong wedding: 21 October 2026, 10:30 AM, Cotton Tree Drive, Central, Hong Kong. Reception follows.
- Davao send off: 17 October 2026, 6:30 PM, Davao City.
- The PDF spells the bride's name `Glyra`. Confirm whether `Glyra` or `Glara` should be used before publishing.
- The Davao venue was not present in the source PDF, so the invitation currently says Davao City without inventing an address.

## Current scope and deferred work

Email delivery is not connected. The site does not claim that a wish has been emailed. The future email should contain a styled postcard body with destination artwork and the complete escaped message, plus the complete paginated postcard PDF as an attachment.

The reusable HTML email builder is [`src/lib/postcardEmail.ts`](src/lib/postcardEmail.ts). The PDF factory is [`src/components/postcardExport.ts`](src/components/postcardExport.ts). The email contract is [`docs/POSTCARD-EMAIL.md`](docs/POSTCARD-EMAIL.md).

A secure server endpoint, provider, recipient address, validation, rate limiting, sender verification, and server side attachment generation still need to be configured. Keep credentials out of browser code. No RSVP, guest tracking, payment, analytics, or autoplay audio is included.

## How to run

Use Node.js 20.19 or newer, or Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Create and preview a production build with:

```sh
npm run build
npm run preview
```

The deployable output is `dist/`. No deployment or GitHub push has been performed by this project work.

## Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start Vite development mode |
| `npm run build` | TypeScript check and production build |
| `npm run preview` | Serve the production build locally |

## Project structure

```text
src/
  App.tsx                         Main invitation composition and content
  main.tsx                        React entry point
  styles.css                      Shared tokens, layout, type, responsive rules
  components/Envelope.tsx         Envelope, candle, thread, flap animation
  components/DateReveal.tsx       Scratch surfaces and Hong Kong countdown
  components/PhotoCarousel.tsx    Accessible supplied photo carousel
  components/Postcards.tsx        Destination gallery and wish composer
  components/postcardExport.ts    Full visual, paginated PDF generator
  lib/postcardEmail.ts            Escaped styled email body for future transport
public/images/                    Optimized WebP website assets
public/fonts/                     Local fonts and license texts
docs/                             PRD, QA, artwork, and email specifications
AGENTS.md                         Repository rules for coding agents
index.html                        Page metadata and React mount point
package.json                      Scripts and dependency manifest
package-lock.json                 Locked dependency versions
tsconfig.json                     TypeScript configuration
```

## Assets

- `embrace.webp`, `balcony.webp`, and `woodland.webp` are the photo carousel images.
- `couple.webp` is the wedding outfit illustration beside the countdown.
- `teacup.webp` is the supplied couple in a teacup illustration beneath the celebrations.
- `journey.webp` is the original illustrated journey map used in Our Story.
- `postcard-*-illustrated.webp` are the 11 custom generated destination illustrations used by the postcard gallery and composer.

The original private photographs and Canva PDF are ignored by `.gitignore`. The optimized website assets in `public/images/` are required by the site and should remain available to GitHub. Generated artwork prompts and provenance are documented in [`docs/POSTCARD-ARTWORK.md`](docs/POSTCARD-ARTWORK.md).

## Design and implementation

- React, TypeScript, Vite, native CSS, and jsPDF are used.
- CSS variables keep colors, typography, and spacing consistent.
- Motion uses transform and opacity where possible and respects `prefers-reduced-motion`.
- Native controls, labels, focus states, pointer scratching, touch alternatives, dialog behavior, and live status messages support keyboard and touch users.
- Images have explicit dimensions, lazy loading below the first view, descriptive alternative text, and deliberate crops.
- Layout is checked at 375, 768, and 1440 pixels with no horizontal overflow.
- The PDF is browser rendered so long messages, accents, curly punctuation, emoji, and long tokens can be preserved. PDF pages are raster artwork, so their text is not selectable. The styled HTML email is the accessible text counterpart.

## Verification

See [`docs/QA.md`](docs/QA.md). Verification covers the production build, envelope opening, reduced motion, scratch reveal, countdown states, carousel controls, all 11 postcards, dialog validation, local drafts, long message PDF generation, preview and download, focus containment, Escape close, focus restoration, mobile layout, desktop layout, and browser runtime errors.

## What belongs in this README

This file is the setup and maintenance handoff. Keep here:

- what the product is and what guests can do;
- confirmed content and decisions still needed;
- prerequisites and exact development, build, preview, and deployment commands;
- high level source and asset structure;
- design, accessibility, performance, and content constraints;
- current integration status and links to deferred-work contracts;
- verification commands and known limitations; and
- licensing and asset provenance needed before publishing.

Keep detailed agent operating rules in [`AGENTS.md`](AGENTS.md), product requirements in [`docs/PRD.md`](docs/PRD.md), QA evidence in [`docs/QA.md`](docs/QA.md), artwork provenance in [`docs/POSTCARD-ARTWORK.md`](docs/POSTCARD-ARTWORK.md), and email requirements in [`docs/POSTCARD-EMAIL.md`](docs/POSTCARD-EMAIL.md). Do not put secrets, `.env` values, the private Canva PDF, raw source photos, or local QA screenshots in this README or repository.

## Before publishing

1. Confirm the bride's preferred spelling.
2. Confirm the Davao venue or keep the city only wording.
3. Add the secure email service and recipient configuration described in `docs/POSTCARD-EMAIL.md`.
4. Test postcard emails and PDF attachments with short and very long wishes.
5. Run `npm run build` and the browser checks again.
6. Deploy `dist/` to the chosen host, configure the domain, then add and push the intended source files to GitHub yourself.
