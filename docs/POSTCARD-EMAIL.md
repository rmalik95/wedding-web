# Postcard delivery contract

Email delivery is provided by the Cloudflare Pages Function at `functions/api/send-postcard.ts`, using Resend. The recipient receives a visual postcard, not just a plain-text wish.

## Required future email payload

1. Render the responsive inline-styled HTML body using `src/lib/postcardEmail.ts` (`buildPostcardEmail`). It includes destination artwork, greeting, the complete message, sender, and wedding date. User text is HTML-escaped. Text is supplied only as an email-client accessibility fallback.
2. Attach the destination image as an inline MIME image with Content-ID `destination-artwork@wedding`. Read the image from the server's known destination-to-asset mapping; never fetch an arbitrary user-provided URL or filesystem path.
3. Attach the complete visual PDF produced by `createPostcardPdf({ destination, imageUrl, name, message }, onProgress?)` in `src/components/postcardExport.ts`. This browser helper returns `Promise<Blob>` with MIME type `application/pdf`; `onProgress(page, total)` is optional. The PDF includes artwork and all text, flowing onto matching continuation pages as needed. Do not replace it with a text attachment or truncate long messages.
4. Mail clients may clip very long HTML emails. The attached paginated PDF is the complete, portable postcard in those cases. There is no claim that every mail client can display arbitrarily long messages inline without clipping.
5. Configure recipient, secure server endpoint, provider, validation, rate limits and verified sender later. Handle transport size limits with an explicit error or a secure complete-document link rather than silent truncation. Generate or validate attachments on the server and never trust client HTML.

The form can send a postcard, preview it, or download it. The mail transport accepts only known destinations, validates the uploaded PDF, rate-limits requests, and reads Resend settings exclusively from Cloudflare Pages environment bindings. Configure `RESEND_API_KEY` as an encrypted secret, plus `WISHES_TO_EMAIL` and `WISHES_FROM_EMAIL` as production variables. Never place any of these values in browser code.

## PDF rendering

The browser draws artwork and fully wrapped message text into high-resolution postcard pages, then packages those pages in a PDF. It preserves accented names, curly punctuation and browser-supported Unicode through the device font fallback. The PDF is raster artwork, so its text is not selectable or searchable; the full HTML email is the accessible text counterpart. Rare glyph appearance depends on fonts installed on the device. No character limit or silent truncation is applied. Very long wishes produce larger files and can reach browser memory or future transport limits, which require explicit errors.
