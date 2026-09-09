import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import './Postcards.css';
import { createPostcardPdf } from './postcardExport';

const destinations = ['Newcastle', 'Davao', 'Tanzania', 'India', 'Hungary', 'London', 'Edinburgh', 'Portugal', 'Amsterdam', 'Alnwick Castle', 'Hong Kong'];
const imageFor = (place: string) => `/images/postcard-${place.toLowerCase().replaceAll(' ', '-')}-illustrated.webp`;
const postcardDetails: Record<string, [string, string]> = {
  'Newcastle': ['England', 'Vintage travel illustration of the Tyne Bridge and Newcastle Quayside'],
  'Davao': ['Philippines', 'Vintage travel illustration of Davao Gulf, palms and Mount Apo'],
  'Tanzania': ['East Africa', 'Vintage travel illustration of the Serengeti with an acacia tree and giraffes'],
  'India': ['Agra', 'Vintage travel illustration of the Taj Mahal and its reflecting pool'],
  'Hungary': ['Budapest', 'Vintage travel illustration of the Hungarian Parliament beside the Danube'],
  'London': ['England', 'Vintage travel illustration of Big Ben, Westminster and the Thames'],
  'Edinburgh': ['Scotland', 'Vintage travel illustration of Edinburgh Castle above the old town'],
  'Portugal': ['Lisbon', 'Vintage travel illustration of a yellow Lisbon tram and tiled buildings'],
  'Amsterdam': ['Netherlands', 'Vintage travel illustration of Amsterdam canal houses and an arched bridge'],
  'Alnwick Castle': ['Northumberland', 'Vintage travel illustration of Alnwick Castle and its green lawns'],
  'Hong Kong': ['Victoria Harbour', 'Vintage travel illustration of Hong Kong skyline and a red-sailed junk'],
};
const draftKey = 'wedding-postcard-draft';

export default function Postcards() {
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [exporting, setExporting] = useState(false);
  const [sending, setSending] = useState(false);
  const exportBusy = useRef(false);
  const exportUrls = useRef<string[]>([]);
  useEffect(() => () => exportUrls.current.forEach(url => URL.revokeObjectURL(url)), []);
  const [active, setActive] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const loaded = useRef(false);
  const [savedContent, setSavedContent] = useState('');
  useEffect(() => {
    if (!name.trim() && !message.trim() || JSON.stringify({name, message}) === savedContent) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [name, message, savedContent]);
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selected || !dialog.current) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.showModal();
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus();
    };
  }, [selected]);

  function open(place: string) {
    trigger.current = document.activeElement as HTMLElement;
    setStatus('');
    if (!loaded.current) {
    loaded.current = true;
    try {
      const draft = JSON.parse(localStorage.getItem(draftKey) || 'null');
      if (draft && typeof draft.name === 'string' && typeof draft.message === 'string') {
        setName(draft.name);
        setMessage(draft.message);
        setSavedContent(JSON.stringify({ name: draft.name, message: draft.message }));
      }
    } catch { /* The form remains usable when browser storage is unavailable. */ }
    }
    setSelected(place);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !message.trim()) {
      setStatus('Please add your name and a wish before saving.');
      document.getElementById(!message.trim() ? 'postcard-message' : 'postcard-name')?.focus();
      return;
    }
    try {
      localStorage.setItem(draftKey, JSON.stringify({ name, message, destination: selected }));
      setSavedContent(JSON.stringify({name, message}));
      setStatus('Your postcard draft is saved on this device. Download it below to keep a copy. It has not been emailed.');
    } catch {
      setStatus('This browser could not save your draft. You can still download your postcard below.');
    }
  }

  async function exportPdf(preview: boolean) {
    if (exportBusy.current) return;
    if (!name.trim() || !message.trim() || !selected) {
      setStatus('Please add your name and a wish first.');
      document.getElementById(!message.trim() ? 'postcard-message' : 'postcard-name')?.focus();
      return;
    }
    // Open synchronously during the click so popup blockers do not reject an async preview.
    const previewWindow = preview ? window.open('about:blank', '_blank') : null;
    if (previewWindow) {
      previewWindow.opener = null;
      previewWindow.document.title = 'Preparing your postcard';
      previewWindow.document.body.textContent = 'Preparing your complete postcard PDF…';
    }
    exportBusy.current = true;
    setExporting(true);
    setStatus('Preparing your postcard, including every word…');
    try {
      const blob = await createPostcardPdf({ destination: selected, imageUrl: imageFor(selected), name, message }, (page, total) => setStatus(`Preparing postcard page ${page} of ${total}…`));
      const url = URL.createObjectURL(blob);
      exportUrls.current.push(url);
      if (previewWindow && !previewWindow.closed) {
        previewWindow.location.replace(url);
        setStatus('Your complete postcard PDF is open in a new tab. It has not been emailed.');
      } else {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `wedding-postcard-${selected.toLowerCase().replaceAll(' ', '-')}.pdf`;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        setStatus(preview ? 'The preview tab was unavailable, so your PDF was downloaded instead. It has not been emailed.' : 'Your complete postcard PDF is ready. It has not been emailed.');
      }
    } catch (error) {
      previewWindow?.close();
      setStatus(error instanceof Error ? `Could not create your postcard. ${error.message}` : 'Could not create your postcard. Please try again.');
    } finally {
      exportBusy.current = false;
      setExporting(false);
    }
  }

  async function sendPostcard() {
    if (exportBusy.current || sending) return;
    if (!name.trim() || !message.trim() || !selected) {
      setStatus('Please add your name and a wish first.');
      document.getElementById(!message.trim() ? 'postcard-message' : 'postcard-name')?.focus();
      return;
    }
    exportBusy.current = true;
    setSending(true);
    setStatus('Preparing your complete postcard…');
    try {
      const pdf = await createPostcardPdf({ destination: selected, imageUrl: imageFor(selected), name, message }, (page, total) => setStatus(`Preparing postcard page ${page} of ${total}…`));
      const data = new FormData();
      data.set('destination', selected);
      data.set('name', name.trim());
      data.set('message', message.trim());
      data.set('pdf', new File([pdf], `wedding-postcard-${selected.toLowerCase().replaceAll(' ', '-')}.pdf`, { type: 'application/pdf' }));
      data.set('website', '');
      setStatus('Sending your postcard…');
      const response = await fetch('/api/send-postcard', { method: 'POST', body: data, credentials: 'same-origin' });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) throw new Error(typeof result === 'object' && result && 'error' in result && typeof result.error === 'string' ? result.error : 'Please try again shortly.');
      try { localStorage.setItem(draftKey, JSON.stringify({ name, message, destination: selected })); setSavedContent(JSON.stringify({ name, message })); } catch { /* Sending does not depend on browser storage. */ }
      setStatus('Your postcard has been sent to Rishabh & Glyra. Thank you.');
    } catch (error) {
      setStatus(error instanceof Error ? `Your postcard was not sent. ${error.message}` : 'Your postcard was not sent. Please try again.');
    } finally {
      exportBusy.current = false;
      setSending(false);
    }
  }

  function move(direction: number) {
    const next = Math.max(0, Math.min(destinations.length - 1, active + direction));
    const card = track.current?.children[next] as HTMLElement | undefined;
    if (card && track.current) {
      track.current.scrollTo({ left: card.offsetLeft - (track.current.firstElementChild as HTMLElement).offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      setActive(next);
    }
  }

  return (
    <section className="postcards-section reveal" id="wishes" aria-labelledby="postcards-title">
      <div className="postcards-heading">
        <div><p className="postcards-eyebrow">A little love, by post</p><h2 id="postcards-title">Wish you were here.<br /><em>Glad you are.</em></h2></div>
        <p>Every place holds a little piece of our story. Pick a postcard from our journey and leave a few words for the next chapter.</p>
      </div>
      <div className="postcards-track" ref={track} onScroll={() => {
        if (!track.current) return;
        const children = Array.from(track.current.children) as HTMLElement[];
        const origin = children[0]?.offsetLeft || 0;
        const closest = children.reduce((best, card, i) => Math.abs(card.offsetLeft - origin - track.current!.scrollLeft) < Math.abs(children[best].offsetLeft - origin - track.current!.scrollLeft) ? i : best, 0);
        setActive(closest);
        setAtEnd(track.current.scrollLeft + track.current.clientWidth >= track.current.scrollWidth - 3);
      }}>
        {destinations.map((place, index) => <button type="button" className="destination-postcard" key={place} onClick={() => open(place)} aria-label={`Write a postcard from ${place}`}>
          <span className="postcard-card-top"><span>Greetings from</span><span>No. {String(index + 1).padStart(2, '0')}</span></span>
          <span className="postcard-art"><img src={imageFor(place)} alt={postcardDetails[place][1]} width="480" height="360" loading="lazy" /></span>
          <span className="postcard-card-bottom"><span className="postcard-destination"><span className="postcard-place">{place}</span><span className="postcard-country">{postcardDetails[place][0]}</span></span><span className="postcard-write">Write a wish ↗</span></span>
        </button>)}
      </div>
      <div className="postcards-controls"><p>{String(active + 1).padStart(2, '0')} <span>/ {destinations.length} places, one story</span></p><div><button type="button" onClick={() => move(-1)} disabled={active === 0} aria-label="Previous postcard">←</button><button type="button" onClick={() => move(1)} disabled={atEnd} aria-label="Next postcard">→</button></div></div>
      <p className="postcards-delivery-note">Write a little love from anywhere in our story. Your complete postcard will be delivered to us by email.</p>
      {selected && <dialog ref={dialog} className="postcard-dialog" aria-labelledby="postcard-dialog-title" onCancel={() => setSelected(null)} onClick={event => { if (event.target === dialog.current) { const bounds = dialog.current.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setSelected(null); } }}>
        <button className="postcard-close" type="button" onClick={() => setSelected(null)} aria-label="Close postcard">×</button>
        <div className="postcard-dialog-art"><img src={imageFor(selected)} alt={postcardDetails[selected][1]} width="480" height="360" /><span>Greetings from {selected}</span></div>
        <form className="postcard-form" onSubmit={save}>
          <div className="postcard-form-title"><div><p className="postcards-eyebrow">With love, always</p><h3 id="postcard-dialog-title">Your postcard</h3></div><span className="postcard-stamp" aria-hidden="true">R & G<br /><small>21 · 10 · 26</small></span></div>
          <p className="postcard-origin">Postmarked {selected}</p>
          <p className="postcard-addressee">To Rishabh & Glyra,</p>
          <label htmlFor="postcard-message">Your wedding wish</label>
          <textarea id="postcard-message" name="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Here's to your next chapter…" required rows={5} />
          <label htmlFor="postcard-name">With love, from</label>
          <input id="postcard-name" name="name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
          <p className="postcard-form-note">Your illustrated PDF includes every word, with extra pages for longer wishes. Send it to us, preview it, or keep a downloaded copy.</p>
          <div className="postcard-form-actions" aria-busy={exporting || sending}><button type="button" disabled={sending || exporting} onClick={sendPostcard}>{sending ? 'Sending postcard…' : 'Send postcard ↗'}</button><button type="submit" disabled={sending}>Save draft</button><button type="button" disabled={exporting || sending} onClick={() => exportPdf(true)}>Preview full postcard ↗</button><button type="button" disabled={exporting || sending} onClick={() => exportPdf(false)}>{exporting ? 'Preparing PDF…' : 'Download postcard PDF ↓'}</button></div>
          <p className="postcard-status" role="status">{status}</p>
        </form>
      </dialog>}
    </section>
  );
}
