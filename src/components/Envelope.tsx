import { useEffect, useRef, useState } from 'react';
import './Envelope.css';

export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => { query.removeEventListener('change', update); if (timer.current) clearTimeout(timer.current); };
  }, []);

  function openLetter() {
    if (opening) return;
    setOpening(true);
    timer.current = setTimeout(onOpen, reduced ? 850 : 5100);
  }

  return (
    <section className={`envelope-scene${opening ? ' is-opening' : ''}`} aria-label="Your wedding invitation">
      <div className="envelope-introduction"><h1>A mail has arrived.</h1></div>
      <div className="envelope-stage">
        <div className="envelope-object" aria-hidden="true">
          <div className="envelope-back" />
          <article className="envelope-letter"><span>WITH JOY, WE INVITE YOU</span><strong>Rishabh <i>&amp;</i> Glyra</strong><small>The beginning of our forever.</small></article>
          <aside className="envelope-keepsake"><span>our love letter</span><b>R <i>&amp;</i> G</b><small>WRITTEN ACROSS OCEANS</small></aside>
          <figure className="envelope-photo"><img src="/images/woodland.webp" width="420" height="560" alt="" /><figcaption>Always, you &amp; me.</figcaption></figure>
          <div className="envelope-front" /><div className="envelope-flap" />
        </div>
        <button className="envelope-seal" onClick={openLetter} disabled={opening} aria-label="Open your invitation"><span>R<i>&amp;</i>G</span><small>WITH LOVE</small></button>
      </div>
      <div className="envelope-footer"><p className="envelope-hint" aria-hidden="true">Press the wax seal</p><p className="sr-only" role="status">{opening ? 'The invitation is opening.' : 'Press the wax seal or open invitation button to begin.'}</p><button className="envelope-skip" onClick={onOpen}>Open invitation <span aria-hidden="true">↗</span></button></div>
    </section>
  );
}
