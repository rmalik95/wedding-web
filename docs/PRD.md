# Rishabh & Glyra — wedding correspondence

## Purpose and design
A complete, responsive wedding invitation based on all four Canva pages. Guests open a personal letter, discover the celebrations and the couple’s story, reveal the wedding date, and compose a destination postcard. One coherent editorial correspondence theme: oxblood #741b29, warm paper #f4efdf, antique gold #cba65c, muted olive, serif display typography, restrained handwritten accents. Fine printed rules, generous space, physical paper composition; no dashboard or generic marketing cards.

## Content source
Use original supplied images, never PDF screenshots for available photography. PDF contains the name Glyra; retain pending user confirmation. Wedding: 21 October 2026, 10:30 AM Hong Kong time, Cotton Tree Drive, Central, Hong Kong; reception to follow. Davao send-off: 17 October 2026, 6:30 PM, Davao City. No specific Davao venue supplied; do not invent one.

## Guest experience
1. Full-screen red envelope, gold wax monogram seal, hanging thread. Candle and thread opening without the illustrated couple. Activate seal to light candle, burn thread upward, release seal, lift flap, and animate invitation/photo pieces out. Skip accessible by keyboard, touch, and reduced-motion.
2. Main invitation: editorial letter and photographic composition; names, date, Hong Kong. Welcome narrative faithful to PDF.
3. Three round scratch surfaces reveal 21 / OCT / 2026; pointer/touch scratching and explicit accessible reveal button. After all three, countdown to 2026-10-21T10:30:00+08:00. Zero-clamp elapsed time and display wedding-day/past state correctly.
4. Animated real-photo carousel with previous/next, pause, keyboard and touch support, informative alt text; reduced-motion disables autoplay.
5. Celebration details for Davao send-off and Hong Kong ceremony, reception note, calendar download.
6. Our story and original journey illustration, with readable destination list.
7. Postcards for every distinct map destination: Newcastle, Davao, Tanzania, India, Hungary, London, Edinburgh, Portugal, Amsterdam, Alnwick Castle, Hong Kong. Repeated Newcastle/Davao map stops share destination postcard. Destination artwork is a custom ChatGPT-generated vintage travel illustration for each destination, without the couple or map snapshots. These are destination illustrations, not personal travel photographs. Choosing a card opens postcard-form composition with name and wish, validation and local draft handling. Live email delivery sends a styled postcard body and the complete PDF attachment. Never claim success until the delivery endpoint confirms it.
8. Personal closing, no RSVP. Once the wedding date has been revealed, guests can save an all-day Google Calendar reminder or download an `.ics` event for Apple Calendar, Outlook, and compatible calendar apps.

## Implementation plan
- Vite + React + TypeScript; minimal dependencies; native CSS and SVG animations, no animation framework.
- Optimize supplied photographs to WebP, original source files preserved. Local serif fonts if available, dependable fallbacks.
- Components split across opening, date reveal, photo carousel, wishes, and main editorial sections.
- Central content data and CSS variables. IntersectionObserver section entrances; honor reduced motion everywhere.
- Semantic headings, labeled buttons, focus indicators, keyboard form and dialog operation, modal focus restoration, scroll locking, minimum touch targets.
- Responsive at 375, 768, 1440 px; avoid horizontal overflow; use lazy images and explicit dimensions.

## Delivery / acceptance
Working dev and production builds; typecheck; browser verification for opening, scratch/reveal, carousel, postcards, responsive layout and reduced motion. Document actual test results and remaining integration/setup work. Postcard delivery is live and must never report a success before the endpoint confirms it. No RSVP, guest tracking, payment, autoplay audio, fabricated venue, or false sending success. No deployment without configured hosting; provide reproducible run/build steps.

## Asset / integration follow-up
Postcard artwork is a coordinated collection of 11 custom generated destination illustrations. Confirm bride spelling and Davao venue if desired. Postcard email delivery runs through the configured Cloudflare Pages endpoint and Resend. Keep all secrets in Pages environment bindings, never browser code. Place the original teacup illustration beneath the revealed countdown and use the full original couple illustration in the personal closing. No em dashes in site copy.
