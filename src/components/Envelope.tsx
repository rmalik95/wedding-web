import { useEffect, useRef, useState } from 'react';
import './Envelope.css';

export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finish = useRef(onOpen);
  finish.current = onOpen;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => {
      query.removeEventListener('change', update);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function openLetter() {
    if (opening) return;
    setOpening(true);
    timer.current = setTimeout(() => finish.current(), reduced ? 1300 : 6500);
  }

  return (
    <section className={`envelope-scene${opening ? ' is-opening' : ''}${reduced ? ' is-reduced' : ''}`} aria-label="Your wedding invitation">
      <div className="envelope-introduction">
        <h1>A mail has arrived.</h1>
      </div>
      <div className="envelope-stage">
        <div className="envelope-object" aria-hidden="true">
          <div className="envelope-back" />
          <div className="envelope-letter"><span>WITH JOY, WE INVITE YOU</span><strong>Rishabh <i>&amp;</i> Glyra</strong><span>21 OCTOBER 2026 · HONG KONG</span><small>The beginning of our forever.</small></div>
          <div className="envelope-keepsake"><span>Our next chapter</span><b>21</b><small>OCTOBER · 2026</small></div>
          <div className="envelope-photo"><img src="/images/woodland.webp" width="420" height="560" alt="" /><span>Always, you &amp; me.</span></div>
          <div className="envelope-front" />
          <div className="envelope-flap" />
          <div className="envelope-thread"><span className="thread-ember" /></div>
        </div>
        <button className="envelope-seal" onClick={openLetter} disabled={opening} aria-label="Light the candle and open your invitation"><span className="seal-rim"><span>R<span className="seal-amp">&amp;</span>G</span><small>WITH LOVE</small></span></button>
        <div className="envelope-candle" aria-hidden="true"><div className="candle-flame" /><div className="candle-wick" /><div className="candle-body" /><div className="candle-dish" /></div>
      </div>
      <div className="envelope-footer"><p className="sr-only" role="status">{opening ? 'The invitation is opening.' : 'Activate the wax seal or open invitation button to begin.'}</p><button className="envelope-skip" onClick={() => finish.current()}>Open invitation <span aria-hidden="true">↗</span></button></div>
    </section>
  );
}
