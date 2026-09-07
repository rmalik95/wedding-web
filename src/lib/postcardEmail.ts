/** Shared by the future server-side email integration. Does not send mail. */
export type PostcardEmailInput = { destination: string; name: string; message: string };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);

export function buildPostcardEmail({ destination, name, message }: PostcardEmailInput) {
  const place = escapeHtml(destination);
  const sender = escapeHtml(name);
  const wish = escapeHtml(message).replace(/\r\n|\r|\n/g, '<br>');
  const artworkContentId = 'destination-artwork@wedding';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:24px 12px;background:#eae2cf;color:#741b29"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#f4efdf;border:1px solid #cba65c;table-layout:fixed"><tr><td style="padding:24px 28px;font:12px Georgia,serif;letter-spacing:2px">GREETINGS FROM ${place}</td></tr><tr><td><img src="cid:${artworkContentId}" width="640" alt="Postcard illustration of ${place}" style="display:block;width:100%;height:auto;border:0"></td></tr><tr><td style="padding:30px 28px;font:18px/1.7 Georgia,serif;overflow-wrap:anywhere;word-break:break-word"><p style="margin:0 0 24px;font-size:25px">To Rishabh &amp; Glyra,</p><div style="border-top:1px solid #cba65c;padding-top:24px">${wish}</div><p style="margin:28px 0 0">With love,<br>${sender}</p></td></tr><tr><td style="padding:18px 28px;border-top:1px solid #cba65c;font:11px Arial,sans-serif">21 OCTOBER 2026 · HONG KONG<br><br>The attached PDF contains your complete postcard, including any continuation pages.</td></tr></table></td></tr></table></body></html>`;
  return {
    subject: `A postcard from ${name.replace(/[\r\n]/g, ' ')} · ${destination.replace(/[\r\n]/g, ' ')}`,
    html,
    text: `Greetings from ${destination}\n\nTo Rishabh & Glyra,\n\n${message}\n\nWith love,\n${name}\n\nSee the attached PDF for the designed postcard.`,
    artworkContentId,
  };
}
