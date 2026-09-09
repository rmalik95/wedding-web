import { useEffect, useRef, useState } from 'react';
import './DateReveal.css';
import { wedding, weddingStart } from '../config';

const WEDDING = weddingStart;
const parts = [ { value: '21', label: 'day' }, { value: 'OCT', label: 'month' }, { value: '2026', label: 'year' } ];

function ScratchCircle({ value, label, revealed, onReveal }: { value: string; label: string; revealed: boolean; onReveal: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const previous = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!context) return;
    const gradient = context.createLinearGradient(0, 0, 300, 300);
    gradient.addColorStop(0, '#d9be7e');
    gradient.addColorStop(.45, '#bd974c');
    gradient.addColorStop(1, '#e0c88c');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 300, 300);
    context.strokeStyle = 'rgba(92, 61, 22, .35)';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(150, 150, 135, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = '#583d1c';
    context.textAlign = 'center';
    context.font = 'italic 30px Georgia';
    context.fillText('a little', 150, 140);
    context.fillText('surprise', 150, 177);
  }, []);
  const scratch = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!previous.current || revealed) return;
    const element = canvas.current;
    const context = element?.getContext('2d', { willReadFrequently: true });
    if (!element || !context) return;
    const rect = element.getBoundingClientRect();
    const point = { x: (event.clientX - rect.left) * 300 / rect.width, y: (event.clientY - rect.top) * 300 / rect.height };
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = 44;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(previous.current.x, previous.current.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    previous.current = point;
    if (++strokes.current % 5 === 0) {
      const pixels = context.getImageData(0, 0, 300, 300).data;
      let clear = 0;
      let total = 0;
      for (let y = 15; y < 285; y += 6) for (let x = 15; x < 285; x += 6) {
        if ((x - 150) ** 2 + (y - 150) ** 2 > 135 ** 2) continue;
        total++;
        if (pixels[(y * 300 + x) * 4 + 3] < 100) clear++;
      }
      if (clear / total > .38) onReveal();
    }
  };
  return <div className="date-piece">
    <div className={`date-circle${revealed ? ' is-revealed' : ''}`}>
      <span className="date-value" aria-hidden={!revealed}>{value}</span>
      <canvas ref={canvas} width={300} height={300} aria-hidden="true"
        onPointerDown={event => {
          if (revealed) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          const rect = event.currentTarget.getBoundingClientRect();
          previous.current = { x: (event.clientX - rect.left) * 300 / rect.width, y: (event.clientY - rect.top) * 300 / rect.height };
          scratch(event);
        }} onPointerMove={scratch} onPointerUp={() => { previous.current = null; }} onPointerCancel={() => { previous.current = null; }} />
    </div>
    <button className="date-piece-button" onClick={onReveal} disabled={revealed} aria-label={revealed ? `${label}: ${value}` : `Reveal the wedding ${label}`}>
      {revealed ? label : `reveal ${label}`}
    </button>
  </div>;
}

export default function DateReveal({ onCalendar }: { onCalendar: () => void }) {
  const [revealed, setRevealed] = useState([false, false, false]);
  const [now, setNow] = useState(() => Date.now());
  const allRevealed = revealed.every(Boolean);
  useEffect(() => {
    if (!allRevealed) return;
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [allRevealed]);
  const remaining = Math.max(0, Math.floor((WEDDING - now) / 1000));
  const hongKongDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Hong_Kong', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const onWeddingDay = hongKongDay === wedding.hongKongDateKey;
  const countdown = [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24, Math.floor(remaining / 60) % 60, remaining % 60];
  return <section className="date-reveal" id="date" aria-labelledby="date-heading">
    <p className="date-eyebrow">A date to keep</p>
    <h2 id="date-heading">Some things are worth<br /><em>uncovering.</em></h2>
    <p className="date-instruction">Scratch the golden circles. Our forever is underneath. Use the reveal buttons if you prefer.</p>
    <div className="date-circles">
      {parts.map((part, index) => <ScratchCircle key={part.label} {...part} revealed={revealed[index]} onReveal={() => setRevealed(previous => previous.map((item, i) => i === index || item))} />)}
    </div>
    {!allRevealed && <button className="date-reveal-all" onClick={() => setRevealed([true, true, true])}>Or, reveal our date <span aria-hidden="true">↗</span></button>}
    <div className="date-announcement" role="status">{allRevealed ? `${wedding.dateLabel}. Hong Kong. Our wedding day.` : ''}</div>
    {allRevealed && <div className="date-countdown">
      <p className="date-countdown-title">{onWeddingDay ? 'Today is our forever.' : now > WEDDING ? 'Our forever has begun.' : 'Counting the moments until we say “I do”.'}</p>
      {now < WEDDING && <div className="date-countdown-values" role="timer" aria-label="Time until our wedding">
        {countdown.map((value, index) => <div key={index}><span>{String(value).padStart(2, '0')}</span><small>{['days', 'hours', 'minutes', 'seconds'][index]}</small></div>)}
      </div>}
      <p className="date-time-note">{wedding.dateLabel} · {wedding.timeLabel} · Hong Kong</p>
      <div className="date-calendar-actions" aria-label="Save the wedding date">
        <a className="date-calendar-link" href={wedding.googleCalendarUrl} target="_blank" rel="noreferrer">Save the date in Google Calendar <span aria-hidden="true">↗</span></a>
        <button type="button" className="date-calendar-link" onClick={onCalendar}>Download for Apple Calendar &amp; Outlook <span aria-hidden="true">↓</span></button>
      </div>
    </div>}
    <figure className="date-illustration reveal"><img src="/images/couple.webp" alt="Illustration of Rishabh and Glyra in their wedding outfits" width="300" height="300" loading="lazy" /></figure>
  </section>;
}
