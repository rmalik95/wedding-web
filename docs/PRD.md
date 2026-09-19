# Rishabh & Glyra — wedding correspondence

## Purpose and design
A complete, responsive wedding invitation based on all four Canva pages. Guests open a personal letter, discover the celebrations and the couple’s story, reveal the wedding date, and compose a destination postcard. One coherent editorial correspondence theme: oxblood #741b29, warm paper #f4efdf, antique gold #cba65c, muted olive, serif display typography, restrained handwritten accents. Fine printed rules, generous space, physical paper composition; no dashboard or generic marketing cards.

## Content source
Use original supplied images, never PDF screenshots for available photography. PDF contains the name Glyra; retain pending user confirmation. Wedding: 21 October 2026, 10:30 AM Hong Kong time, Cotton Tree Drive, Central, Hong Kong; reception to follow. Davao send-off: 17 October 2026, 6:30 PM, Davao City. No specific Davao venue supplied; do not invent one.

## Guest experience
1. Full-screen handcrafted paper theatre: an oxblood-bound open book sits seamlessly on a warm ivory tabletop. Inside it, dimensional paper curtains frame an artistic Hong Kong harbour, mountains, bridge, foliage, and antique-gold route. The opening uses only `An invitation has arrived for you`, the R & G monogram, the couple's names, and an `Enter our story` button. It must occupy exactly one viewport with no page scrolling and must not display the wedding date, venue details, fabricated photography, a skip action, or underlying invitation content. Activating the button transforms the theatre into the ivory invitation canvas. The control remains accessible by keyboard, touch, and reduced motion.
2. Three round scratch surfaces reveal 21 / OCT / 2026; pointer/touch scratching and explicit accessible reveal button. After all three, countdown to 2026-10-21T10:30:00+08:00. Zero-clamp elapsed time and display wedding-day/past state correctly.
3. Celebration details for Davao send-off and Hong Kong ceremony, reception note, calendar download. No separate repetitive invitation hero. Place the original teacup illustration as a centered countdown keepsake without shifting the timer, and leave the celebrations heading image-free.
4. Our story and original journey illustration, restored to the previous layout with readable destination list.
5. Animated editorial contact-sheet carousel with one sharp photograph, blurred adjacent previews, numbered scrolling proofs, previous/next, pause, keyboard and touch support, and informative alt text. Reduced-motion disables autoplay. The data and proof strip must remain usable when the future 56-photo collection is supplied, while the full-size stage renders only the current and adjacent photographs.
6. Postcards for every distinct map destination: Newcastle, Davao, Tanzania, India, Hungary, London, Edinburgh, Portugal, Amsterdam, Alnwick Castle, Hong Kong. Repeated Newcastle/Davao map stops share destination postcard. Destination artwork is a custom ChatGPT-generated vintage travel illustration for each destination, without the couple or map snapshots. These are destination illustrations, not personal travel photographs. Choosing a card opens postcard-form composition with name and wish, validation and local draft handling. Email delivery sends a styled postcard body and the complete PDF attachment through the existing Cloudflare Pages endpoint and Resend. Only report success after endpoint confirmation.
7. Personal closing, no RSVP. Once the wedding date has been revealed, guests can save an all-day Google Calendar reminder or download an `.ics` event for Apple Calendar, Outlook, and compatible calendar apps.

## Implementation plan
- Vite + React + TypeScript; minimal dependencies; native CSS and SVG animations, no animation framework.
- Optimize supplied photographs to WebP, original source files preserved. Local serif fonts if available, dependable fallbacks.
- Components split across opening, date reveal, photo carousel, wishes, and main editorial sections.
- Central content data and CSS variables. IntersectionObserver section entrances; honor reduced motion everywhere.
- Semantic headings, labeled buttons, focus indicators, keyboard form and dialog operation, modal focus restoration, scroll locking, minimum touch targets.
- Responsive at 375, 768, 1440 px; avoid horizontal overflow; use lazy images and explicit dimensions.

## Delivery / acceptance
Working dev and production builds; typecheck; browser verification for opening, scratch/reveal, carousel, postcards, responsive layout and reduced motion. Document actual test results and remaining integration/setup work. Postcard delivery is implemented and confirmed complete by the user. Never report success before the endpoint confirms it. No RSVP, guest tracking, payment, autoplay audio, fabricated venue, or false sending success. No deployment without configured hosting; provide reproducible run/build steps.

## Asset / integration follow-up
Postcard artwork is a coordinated collection of 11 custom generated destination illustrations. Confirm bride spelling and Davao venue if desired. Postcard delivery uses the existing Cloudflare Pages endpoint and Resend. Local Vite preview requires a configured Pages environment for sending. Keep all secrets in Pages environment bindings, never browser code. Place the original teacup illustration with the revealed countdown and use the full original couple illustration in the personal closing. No em dashes in site copy.

## Editorial redesign, 13 September 2026
Approved sequence: handcrafted paper-theatre opening → date reveal → celebrations without a separate invitation hero → original story map in its previous layout → one guided photo carousel → postcards → compact original cartoon closing. Use numbered correspondence chapters, ivory paper, oxblood typography, antique-gold rules, asymmetrical spreads and generous whitespace. Preserve the opening interaction. The contact-sheet carousel is ready for the future 56-photo collection; show only the three supplied originals until replacements arrive. Keep the original teacup illustration beside the revealed countdown and the smaller couple illustration in the closing. Responsive acceptance at 375, 768 and 1440 pixels. Leave all changes uncommitted for comparison.

The user has confirmed email delivery is complete. Preserve active sending, the styled HTML body, and the complete PDF attachment. Do not send real test emails without explicit authorization or claim a successful delivery without endpoint confirmation.

## Date reveal composition
The first page after the paper-theatre opening is the centered scratch-date composition. Do not repeat the black-and-white woodland photograph on this page. The wedding date remains absent from the opening and is disclosed by the three scratch surfaces.
