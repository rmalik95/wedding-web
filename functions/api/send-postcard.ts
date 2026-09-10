import { buildPostcardEmail } from '../../src/lib/postcardEmail';

interface Env {
  RESEND_API_KEY: string;
  WISHES_TO_EMAIL: string;
  WISHES_FROM_EMAIL: string;
}

type PagesFunction<T> = (context: { request: Request; env: T }) => Promise<Response>;

const destinations = new Set(['Newcastle', 'Davao', 'Tanzania', 'India', 'Hungary', 'London', 'Edinburgh', 'Portugal', 'Amsterdam', 'Alnwick Castle', 'Hong Kong']);
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 12_000;
const MAX_PDF_BYTES = 8 * 1024 * 1024;
const EMAIL_ADDRESS = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const imageFor = (destination: string) => `/images/postcard-${destination.toLowerCase().replaceAll(' ', '-')}-illustrated.webp`;
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

function recipientEmails(value: string) {
  const recipients = value.split(',').map((email) => email.trim()).filter(Boolean);
  return recipients.length && recipients.every((email) => EMAIL_ADDRESS.test(email)) ? recipients : null;
}

function base64(bytes: Uint8Array) {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  return btoa(binary);
}

async function allowRequest(request: Request, destination: string, name: string, message: string) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  // Keep guests free to send distinct postcards, while preventing an accidental
  // second click from delivering the exact same postcard twice.
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${ip}\u0000${destination}\u0000${name}\u0000${message}`));
  const key = `https://postcard-rate-limit.invalid/${base64(new Uint8Array(digest)).replaceAll('/', '_').replaceAll('+', '-').replaceAll('=', '')}`;
  const edgeCache = (caches as CacheStorage & { default: Cache }).default;
  const cached = await edgeCache.match(key);
  if (cached) return false;
  await edgeCache.put(key, new Response('1', { headers: { 'Cache-Control': 'max-age=300' } }));
  return true;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid request origin.' }, 403);
  const recipients = recipientEmails(env.WISHES_TO_EMAIL || '');
  if (!env.RESEND_API_KEY || !recipients || !env.WISHES_FROM_EMAIL) return json({ error: 'Postcard delivery is not configured yet.' }, 503);

  let form: FormData;
  try { form = await request.formData(); } catch { return json({ error: 'Please try sending the postcard again.' }, 400); }
  const destination = form.get('destination');
  const name = form.get('name');
  const message = form.get('message');
  const pdf = form.get('pdf');
  const honeypot = form.get('website');
  if (honeypot) return json({ ok: true });
  if (typeof destination !== 'string' || typeof name !== 'string' || typeof message !== 'string' || !(pdf instanceof File)) return json({ error: 'Your postcard is incomplete. Please try again.' }, 400);
  const trimmedName = name.trim();
  const trimmedMessage = message.trim();
  if (!destinations.has(destination) || !trimmedName || !trimmedMessage || trimmedName.length > MAX_NAME_LENGTH || trimmedMessage.length > MAX_MESSAGE_LENGTH) return json({ error: 'Please check your name and message, then try again.' }, 400);
  if (!(await allowRequest(request, destination, trimmedName, trimmedMessage))) return json({ error: 'This exact postcard was already sent. Change your message to send another one.' }, 429);
  if (pdf.type !== 'application/pdf' || pdf.size < 8 || pdf.size > MAX_PDF_BYTES) return json({ error: 'The postcard PDF is too large to email. Please shorten the message and try again.' }, 413);

  const pdfBytes = new Uint8Array(await pdf.arrayBuffer());
  if (new TextDecoder().decode(pdfBytes.subarray(0, 5)) !== '%PDF-') return json({ error: 'The postcard PDF could not be verified. Please try again.' }, 400);
  const artwork = await fetch(new URL(imageFor(destination), request.url));
  if (!artwork.ok) return json({ error: 'The postcard artwork is unavailable. Please try again later.' }, 503);
  const artworkBytes = new Uint8Array(await artwork.arrayBuffer());
  const email = buildPostcardEmail({ destination, name: trimmedName, message: trimmedMessage });
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.WISHES_FROM_EMAIL, to: recipients, subject: email.subject, html: email.html, text: email.text, attachments: [
      { filename: `wedding-postcard-${destination.toLowerCase().replaceAll(' ', '-')}.pdf`, content: base64(pdfBytes), content_type: 'application/pdf' },
      { filename: `${destination.toLowerCase().replaceAll(' ', '-')}-postcard.webp`, content: base64(artworkBytes), content_type: 'image/webp', content_id: email.artworkContentId },
    ] }),
  });
  if (!response.ok) { console.error('Resend rejected postcard delivery', response.status); return json({ error: 'We could not send your postcard just now. Please try again shortly.' }, 502); }
  return json({ ok: true });
};
