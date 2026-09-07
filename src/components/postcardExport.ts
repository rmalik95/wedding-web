/** A reusable browser-side PDF attachment factory. Email transport remains separate. */
export interface PostcardContent {
  destination: string;
  imageUrl: string;
  name: string;
  message: string;
}

/** Keeps every character, including whitespace, and splits long tokens safely. */
export function wrapPostcardText(text: string, width: number, measure: (value: string) => number): string[] {
  const lines: string[] = [];
  // Graphemes keep combining accents and joined emoji together when wrapping.
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  for (const paragraph of text.replace(/\r\n?/g, '\n').split('\n')) {
    let line = '';
    for (const token of paragraph.match(/\s+|\S+/gu) || []) {
      if (measure(line + token) <= width) { line += token; continue; }
      if (line) { lines.push(line); line = ''; }
      if (measure(token) <= width) { line = token; continue; }
      for (const { segment } of segmenter.segment(token)) {
        if (line && measure(line + segment) > width) { lines.push(line); line = ''; }
        line += segment;
      }
    }
    lines.push(line);
  }
  return lines;
}

export function paginatePostcardLines(lines: string[], linesPerPage: number): string[][] {
  if (!Number.isInteger(linesPerPage) || linesPerPage < 1) throw new Error('Invalid postcard page size.');
  const pages: string[][] = [];
  for (let offset = 0; offset < lines.length; offset += linesPerPage) pages.push(lines.slice(offset, offset + linesPerPage));
  return pages.length ? pages : [[]];
}

async function loadArtwork(url: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = url;
  try { await image.decode(); }
  catch { throw new Error('The destination artwork could not be loaded. Please try again once it is available.'); }
  return image;
}

/**
 * Generates every page using browser font fallback, then embeds the page image.
 * This supports accented names and punctuation without a PDF glyph substitution.
 * Pages are raster artwork, not selectable text. Glyphs depend on device fonts.
 * The returned application/pdf Blob can be uploaded to a future email endpoint.
 */
export async function createPostcardPdf(content: PostcardContent, onProgress?: (page: number, total: number) => void): Promise<Blob> {
  const [{ jsPDF }, artwork] = await Promise.all([import('jspdf'), loadArtwork(content.imageUrl), document.fonts.ready]);
  const canvas = document.createElement('canvas');
  canvas.width = 1800;
  canvas.height = 1272;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Your browser could not create the postcard. Please try another browser.');
  const bodyFont = '28px Georgia, "Times New Roman", serif';
  context.font = bodyFont;
  const allLines = wrapPostcardText(`${content.message}\n\nWith love,\n${content.name}`, 780, value => context.measureText(value).width);
  const pages = paginatePostcardLines(allLines, 21);
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a5', compress: true });
  pdf.setProperties({ title: `A wedding postcard from ${content.destination}`, subject: 'Wishes for Rishabh & Glyra', creator: 'Rishabh & Glyra wedding invitation' });
  const ink = '#741b29';
  for (let page = 0; page < pages.length; page++) {
    context.fillStyle = '#f4efdf';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = ink;
    context.lineWidth = 2;
    context.strokeRect(30, 30, 1740, 1212);
    context.strokeStyle = '#cba65c';
    context.strokeRect(43, 43, 1714, 1186);
    // Small correspondence stripes remain inside the printed paper frame.
    for (let x = 55; x < 1740; x += 42) {
      context.fillStyle = x % 84 ? ink : '#cba65c';
      context.fillRect(x, 52, 25, 5);
      context.fillRect(x, 1215, 25, 5);
    }
    context.fillStyle = ink;
    context.font = '19px Arial, sans-serif';
    context.fillText('A LITTLE LOVE, BY POST', 85, 110);
    context.font = 'italic 50px Georgia, serif';
    context.fillText(`Greetings from ${content.destination}`, 85, 182, 725);
    // Contain original artwork so none of the destination composition is cropped.
    const ratio = Math.min(725 / artwork.naturalWidth, 560 / artwork.naturalHeight);
    const artWidth = artwork.naturalWidth * ratio;
    const artHeight = artwork.naturalHeight * ratio;
    context.drawImage(artwork, 85 + (725 - artWidth) / 2, 240 + (560 - artHeight) / 2, artWidth, artHeight);
    context.strokeStyle = '#741b2944';
    context.beginPath(); context.moveTo(855, 110); context.lineTo(855, 1130); context.stroke();
    context.font = '40px Georgia, serif';
    context.fillText('Rishabh & Glyra', 85, 945);
    context.font = '21px Arial, sans-serif';
    context.fillText('21 OCTOBER 2026 · HONG KONG', 85, 994);
    context.font = 'italic 26px Georgia, serif';
    context.fillText('For the next chapter of our story.', 85, 1060);
    context.strokeStyle = ink;
    context.setLineDash([7, 5]); context.strokeRect(1560, 95, 150, 150); context.setLineDash([]);
    context.font = '40px Georgia, serif'; context.fillText('R & G', 1580, 159);
    context.font = '18px Arial, sans-serif'; context.fillText('21 · 10 · 26', 1586, 204);
    context.font = '18px Arial, sans-serif'; context.fillText(page === 0 ? 'POSTCARD' : 'POSTCARD · CONTINUED', 910, 125);
    context.font = '36px Georgia, serif'; context.fillText(page === 0 ? 'To Rishabh & Glyra,' : 'A little more love,', 910, 204);
    context.font = bodyFont;
    pages[page].forEach((line, index) => {
      const y = 306 + index * 38;
      context.strokeStyle = '#741b2927'; context.lineWidth = 1;
      context.beginPath(); context.moveTo(910, y + 9); context.lineTo(1690, y + 9); context.stroke();
      context.fillStyle = '#4b2829';
      context.fillText(line, 910, y);
    });
    context.fillStyle = ink;
    context.font = '17px Arial, sans-serif';
    context.fillText(`POSTCARD ${page + 1} OF ${pages.length}`, 910, 1167);
    context.font = '16px Arial, sans-serif';
    context.fillText('Made for a lifetime of memories.', 85, 1167);
    if (page > 0) pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 148, undefined, 'FAST');
    onProgress?.(page + 1, pages.length);
    // Yield between pages so even very long wishes keep the interface responsive.
    await new Promise<void>(resolve => setTimeout(resolve, 0));
  }
  canvas.width = 0;
  canvas.height = 0;
  return pdf.output('blob');
}
