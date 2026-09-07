# Verification

- `npm run build`: TypeScript and Vite production compilation pass.
- Chromium browser checked at 375, 768, and 1440 px: no document overflow or failed images.
- Complete candle/thread/envelope opening transitions to main invitation.
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
