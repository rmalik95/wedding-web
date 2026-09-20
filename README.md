# Rishabh & Glyra Wedding Invitation

<p align="center">
  <img src="public/images/rishabh-glyra-logo.png" alt="Rishabh and Glyra" width="180" />
</p>

An editorial, single-page wedding invitation built with React, TypeScript, Vite, native CSS, and jsPDF. The experience moves from a handcrafted paper-theatre opening through the date reveal, celebrations, story, photography, destination postcards, and illustrated closing.

**Topics:** `react` `typescript` `vite` `wedding-website` `editorial-design` `accessible-ui` `jspdf`

## Current experience

- Oxblood, ivory, and antique-gold correspondence design with responsive desktop, tablet, and mobile layouts.
- Accessible paper-theatre opening with keyboard support, skip navigation, touch support, and reduced-motion behavior.
- Three round scratch reveals for 21 October 2026, with accessible reveal buttons and a Hong Kong timezone-aware countdown.
- Celebration details for the Davao send-off and Hong Kong wedding, with Google Calendar and `.ics` downloads.
- Controllable ten-image film carousel with previous, next, pause, keyboard, touch, and reduced-motion support.
- Original journey map and a postcard gallery for eleven destinations.
- Postcard composer with local drafts, complete paginated PDF previews/downloads, and styled email delivery through Cloudflare Pages and Resend.
- No RSVP, analytics, autoplay audio, payment flow, guest tracking, or fabricated venue information.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Useful commands:

```sh
npm run build    # TypeScript check and production build
npm run preview  # Preview dist locally
```

The production output is generated in `dist/`. Runtime website assets live in `public/`; `dist/` should not be edited manually.

## Email delivery

Postcard delivery is implemented through the Cloudflare Pages endpoint and Resend. Configure these in the Pages environment, never in browser code:

- `RESEND_API_KEY` as an encrypted secret
- `WISHES_TO_EMAIL`
- `WISHES_FROM_EMAIL`

The endpoint sends the styled HTML email and the complete postcard PDF attachment. Local Vite preview does not provide the Cloudflare Pages endpoint.

## Project structure

```text
src/App.tsx                       Main page composition
src/components/OpeningBook.tsx   Paper-theatre opening
src/components/DateReveal.tsx    Scratch date and countdown
src/components/PhotoCarousel.tsx Film carousel
src/components/Postcards.tsx     Gallery and wish composer
src/components/postcardExport.ts Paginated postcard PDF generation
src/lib/postcardEmail.ts          Styled email builder
public/images/                    Optimized website images
public/fonts/                     Local fonts and licenses
docs/                             PRD, QA, artwork, and email documentation
```

## Design and implementation notes

- Uses semantic HTML, native controls, visible focus states, descriptive alternative text, live status messages, and keyboard-accessible alternatives.
- Honors `prefers-reduced-motion` and uses responsive layouts tested at 375, 768, and 1440 pixels.
- Original source photographs remain preserved; optimized WebP derivatives are used by the carousel.
- Postcard artwork is stored as `postcard-*-illustrated.webp`. The original map remains in the story section.
- The countdown uses `teacup-transparent.png`, and the closing uses `couple-cutout.png`.

## Documentation

- [`docs/PRD.md`](docs/PRD.md): approved scope and acceptance criteria
- [`docs/QA.md`](docs/QA.md): verification notes
- [`docs/POSTCARD-ARTWORK.md`](docs/POSTCARD-ARTWORK.md): postcard artwork provenance
- [`docs/POSTCARD-EMAIL.md`](docs/POSTCARD-EMAIL.md): email and PDF attachment contract
- [`docs/OPENING-ARTWORK.md`](docs/OPENING-ARTWORK.md): opening artwork provenance

## GitHub tags

The `Topics` line above gives the project keywords in the README. GitHub repository topics are separate from README content: open the repository page, choose **About → gear icon**, add topics under **Topics**, and save. The same topics can also be managed with GitHub CLI or the repository API.

Before publishing, run `npm run build` and verify the live Cloudflare Pages email endpoint separately.
