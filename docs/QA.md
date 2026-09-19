# Verification

- `npm run build`: TypeScript and Vite production compilation pass.
- Chromium browser checked at 375, 768, and 1440 px: no document overflow or failed images.
- Keepsake clasp, book cover, accordion map, route drawing, and fade transition reach the main invitation.
- Canvas pointer scratching reveals the first circle; accessible reveal-all reveals remaining date and starts countdown.
- Carousel next control changes photograph; pause and reduced-motion prevent autoplay.
- Eleven destination cards are present; final Hong Kong card opens correctly.
- Empty postcard form is blocked by validation; filled postcard saves to local storage; illustrated PDF download and full preview work.
- Modal keyboard focus remains contained; Escape closes and restores destination focus. Mobile form is usable at 375 × 667.
- Wedding day before ceremony shows a countdown; after ceremony shows wedding-day message; following day shows “Our forever has begun.” No negative countdown.
- Reduced-motion opening reaches invitation and slideshow starts paused.
- No JavaScript runtime errors in exercised flows.
- Frontend reviewed with repository-required Web Interface Guidelines: labels, focus, touch alternatives, reduced motion, image sizing, local assets, modal overflow, validation, and honest delivery state addressed.

Tests use installed Chrome through the bundled Playwright runtime. QA scripts and screenshots are in ignored `work/`. No live email or hosted public deployment was tested because neither is configured.

## 7 September refinements

No em dashes remain in website source copy. The opening has no couple illustration; the countdown contains it and the teacup is included beneath celebrations. Desktop/mobile checks passed. Complete postcard PDF export checked with long Unicode messages and continuation pages. The final production build exported a three-page sample PDF without errors. Email transport remains unconfigured; styled HTML and complete PDF attachment are specified in docs/POSTCARD-EMAIL.md.

## Editorial redesign preview, 13 September 2026
- Production build and TypeScript pass.
- Chrome browser checks at 375 × 1000, 768 × 1000 and 1440 × 1000: no horizontal document overflow, no runtime errors in exercised flows.
- Verified main section order: date, invitation, celebrations, story, photographic interlude, postcards, closing. Envelope precedes main content.
- Exercised reveal-all and individual keyboard-accessible date buttons, countdown appearance, next-photo and keyboard-arrow navigation, postcard opening, draft save and dialog closing.
- Reviewed mobile and desktop full-page screenshots plus tablet carousel and desktop celebrations screenshots. Original image crops and map retained. Teacup given ivory backing for contrast.
- Normal-motion wax opening reaches the invitation; reduced-motion opening and carousel mode verified. No broken loaded images.
- Applied web-design-guidelines review to changed UI: native labeled controls, visible focus, dimensions, motion preference, swipe alternatives and responsive overflow. No active email delivery offered.
- Photo set remains three supplied originals; remaining 4–5 photos are a documented asset TODO. PDF generator/server logic unchanged; live delivery was not tested or represented as active.
- No commits or deployment performed.

## Follow-up corrections, 13 September 2026
Supersedes the preview note above about disabled email: the user confirmed delivery is complete. Restored existing sending flow and corrected stale repository instructions/documentation. Success now requires the endpoint's JSON `ok: true`, preventing a static preview HTML fallback from claiming delivery.
Removed the repeated invitation hero; restored the original story markup and CSS treatment; moved the teacup artwork beside the celebration introduction (stacked on mobile). Kept the carousel. Browser screenshot checks at 375, 768 and 1440 pixels passed without horizontal overflow. Reviewed original map and illustration placement, heading hierarchy and responsive controls. Production build passes. No real emails, deployment or commits performed.

## Keepsake-book opening, 19 September 2026
Replaced the envelope with an ivory keepsake folio, oxblood cord, compass clasp, and a continuous seven-panel illustrated journey map on a warm still-life tabletop. The opening contains no wedding date, couple illustration, wedding photograph, or venue detail. Removed the woodland photograph from the date page and restored the scratch reveal to a centered composition. Inspected closed and unfolded states at 375 × 812, 768 × 1024, 1280 × 720, and 1440 × 900. No clipping or horizontal overflow was found. Keyboard focus reaches the folio first, Enter activates the unfolding, the final action reaches the date page, and focus moves to `main`. Browser console reports no warnings or errors. `npm run build` and `git diff --check` pass. Original photograph files remain untouched; no commit, deployment, or live email was performed.

## Handcrafted folio refinement, 19 September 2026
Replaced the remaining CSS-drawn diary, cord, and clasp with a transparent generated production asset featuring deckled cotton-rag paper, layered page edges, three oxblood silk cords, and a patinated brass compass. Removed the visible skip action and increased the invitation heading. Removed the red shadow layer and hover transform that could create the maroon cover artifact. Rechecked closed and unfolded views at 375 × 812 and the default desktop viewport: no horizontal overflow, no date in the opening, no skip control in the DOM, no console warnings or errors, and the keyboard-accessible cover still opens the map.

## Darkroom photograph opening, 19 September 2026
Supersedes the folio opening above. Replaced the diary and map with the original supplied woodland photograph as a printed layer in a generated aged-brass darkroom tray. The generated tray contains no people or date, and the original photograph is not repeated on the date-reveal page. Checked the photo-led opening at 375 × 812, portrait tablet, and 1440 × 900. The mobile composition stacks the invitation typography below the tray; wider screens use the paper field at right. The first screen contains no date, has no horizontal overflow, the brass seal is keyboard-operable, the interaction moves focus to `main`, and the browser console has no warnings or errors.

## Full-plate photo adjustment, 19 September 2026
Expanded the original photo print to fill the full usable brass-tray inset, leaving only a narrow physical print edge. Rechecked 1440 × 900 and 375 × 812 after the change: the photo remains inside the tray, the first screen contains no date, and there is no horizontal overflow.

## Darkroom-layer refinement, 19 September 2026
Removed the duplicate tongs baked into the tray background and added one transparent foreground pair, placed below and in front of the print on wide screens. This restores the intended physical depth rather than making the photo appear to cover the metal. On 375 × 812 the foreground tongs are intentionally hidden because that cropped composition does not include them. Wide and mobile checks pass without date leakage or overflow.

## Paper-theatre opening, 19 September 2026
Supersedes the previous opening experiments. Verified the bespoke wide and independently composed 375 × 812 portrait paper-theatre assets in a real browser. The first screen contains only `Private invitation`, `R & G`, the couple's names, and `Enter our story`; it contains no date, venue, skip action, couple illustration, or photograph. The button is a native control, focuses `main` after the paper-wash transition, and the site appears behind the outgoing ivory wash without a hard cut. `npm run build` and `git diff --check` pass.

## Final responsive and interaction pass, 19 September 2026
The paper-theatre opening now renders alone, locks document scrolling, and measures exactly one viewport before entry. R & G remains centered across 320 × 568, 375 × 812, 390 × 844, 768 × 1024, 1280 × 720, 1440 × 900, and 1920 × 1080. Entering restores document scrolling and moves focus to `main`.

The revealed countdown remains centered independently of the taped teacup keepsake at desktop and tablet sizes, then stacks both elements centrally at 760 pixels and below. The contact-sheet carousel renders the current and adjacent full-size frames, provides blurred edge proofs and a scrollable numbered proof strip, and retains button, keyboard, touch, autoplay, pause, and reduced-motion behavior. Its navigation is structured for the future 56-photo collection.

Full-page checks at 320, 375, 390, 600, 768, 1024, 1280, 1440, and 1920 pixel widths found no horizontal overflow, missing images, undersized visible controls, duplicate IDs, unlabeled buttons, unlabeled form fields, or console warnings/errors. The postcard dialog was checked at mobile and wide desktop sizes; required-field validation focuses the missing field, Escape closes the dialog, focus returns to its destination card, and body scrolling is restored. No live postcard was sent. `npm run build` and `git diff --check` pass.

## Countdown keepsake refinement, 19 September 2026
Removed the decorative patch above the teacup illustration. The keepsake now aligns lower beside the desktop and tablet countdown, while the mobile rule retains its centered stacked placement. Verified at 1440 × 900, 768 × 1024, and 375 × 812 with no horizontal overflow; the countdown itself remains centered at every size.
