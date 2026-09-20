import { useEffect, useRef, useState } from 'react';
import './PhotoCarousel.css';

const photos = [
  { src: 'RNI-Films-IMG-05E0EBB1-07C4-4854-A3B6-317F9D15DBD0', alt: 'Film photograph from Rishabh and Glyra’s collection, photograph 01', position: '50% 50%' },
  { src: 'RNI-Films-IMG-3DA1D4CB-A071-4C0A-983E-C241F3D957F6', alt: 'Film photograph from Rishabh and Glyra’s collection, photograph 02', position: '50% 50%' },
  { src: 'RNI-Films-IMG-40224143-07D3-4642-A686-D97C2A0AFFB0', alt: 'Film photograph from Rishabh and Glyra’s collection, photograph 03', position: '50% 50%' },
  { src: 'RNI-Films-IMG-5DC53160-2951-4095-B03C-645B4B63BBC6', alt: 'Film photograph from Rishabh and Glyra’s collection, photograph 04', position: '50% 50%' },
  { src: 'RNI-Films-IMG-8154F193-05BA-482C-AAC5-2F36FEFB9C29', alt: 'Film photograph from Rishabh and Glyra’s collection, photograph 05', position: '50% 50%' },
  { src: 'RNI-Films-IMG-8B663372-8DED-42C8-8065-02E89C466404', alt: 'Film photograph from Rishabh and Glyra’s collection, photograph 06', position: '50% 50%' },
  { src: 'RNI-Films-IMG-9268B4CC-C78B-4091-92D1-AB50164E890B', alt: 'Film photograph from Rishabh and Glyra’s collection, photograph 07', position: '50% 50%' },
  { src: 'RNI-Films-IMG-942DF284-3503-4FE9-9722-73D83B2B7F73', alt: 'Film photograph from Rishabh and Glyra’s collection, photograph 08', position: '50% 50%' },
  { src: 'RNI-Films-IMG-BC8D2004-A44D-4311-9D35-A1E4A2FFC259', alt: 'Film photograph from Rishabh and Glyra’s collection, photograph 09', position: '50% 50%' },
  { src: 'RNI-Films-IMG-D0856C19-F917-4A0D-A962-28F25AA113E4', alt: 'Film photograph from Rishabh and Glyra’s collection, photograph 10', position: '50% 50%' },
];

const number = (value: number) => String(value).padStart(2, '0');

export default function PhotoCarousel() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const swipeStart = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const thumbnails = useRef<(HTMLButtonElement | null)[]>([]);
  const previousIndex = (index - 1 + photos.length) % photos.length;
  const nextIndex = (index + 1) % photos.length;

  const move = (amount: number) => {
    setPlaying(false);
    setIndex(current => (current + amount + photos.length) % photos.length);
  };
  const choose = (next: number) => {
    setPlaying(false);
    setIndex(next);
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => {
      setReducedMotion(media.matches);
      if (media.matches) setPlaying(false);
    };
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(() => setIndex(current => (current + 1) % photos.length), 5500);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  useEffect(() => {
    const button = thumbnails.current[index];
    const strip = button?.parentElement;
    if (!button || !strip) return;
    strip.scrollTo({
      left: Math.max(0, button.offsetLeft - (strip.clientWidth - button.clientWidth) / 2),
      behavior: reducedMotion ? 'instant' : 'smooth',
    });
  }, [index, reducedMotion]);

  const currentPhoto = photos[index];
  const previousPhoto = photos[previousIndex];
  const nextPhoto = photos[nextIndex];

  return (
    <section
      id="moments"
      className="editorial-album section-pad reveal"
      aria-roledescription="carousel"
      aria-labelledby="album-title"
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          move(event.key === 'ArrowRight' ? 1 : -1);
        }
        if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault();
          choose(event.key === 'Home' ? 0 : photos.length - 1);
        }
      }}
    >
      <header className="album-heading">
        <div>
          <span className="eyebrow">The photographic interlude</span>
          <h2 id="album-title">A little collection<br />of <em>us.</em></h2>
        </div>
        <p>Turn the pages.<br />Stay a little longer.</p>
      </header>

      <div className="album-spread">
        <div className="album-margin" aria-hidden="true">
          <span>Rishabh &amp; Glyra</span><span>Collected moments</span>
        </div>

        <div
          className="album-stage"
          onPointerDown={event => {
            if (event.pointerType === 'mouse') return;
            swipeStart.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerCancel={() => { swipeStart.current = null; }}
          onPointerUp={event => {
            if (!swipeStart.current || swipeStart.current.pointerId !== event.pointerId) return;
            const dx = event.clientX - swipeStart.current.x;
            const dy = event.clientY - swipeStart.current.y;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? -1 : 1);
            swipeStart.current = null;
          }}
        >
          <button className="album-peek album-peek-previous" type="button" onClick={() => move(-1)} aria-label={`Previous photograph: ${previousPhoto.alt}`}>
            <img src={`/images/${previousPhoto.src}.webp`} alt="" width="2304" height="1536" loading="lazy" style={{ objectPosition: previousPhoto.position }} />
            <span aria-hidden="true">{number(previousIndex + 1)}</span>
          </button>

          <figure className="album-figure" role="group" aria-roledescription="slide" aria-label={`Photograph ${index + 1} of ${photos.length}`}>
            <div className="album-image">
              <img key={currentPhoto.src} src={`/images/${currentPhoto.src}.webp`} alt={currentPhoto.alt} width="2304" height="1536" loading={index === 0 ? 'eager' : 'lazy'} style={{ objectPosition: currentPhoto.position }} />
            </div>
          </figure>

          <button className="album-peek album-peek-next" type="button" onClick={() => move(1)} aria-label={`Next photograph: ${nextPhoto.alt}`}>
            <img src={`/images/${nextPhoto.src}.webp`} alt="" width="2304" height="1536" loading="lazy" style={{ objectPosition: nextPhoto.position }} />
            <span aria-hidden="true">{number(nextIndex + 1)}</span>
          </button>
        </div>

        <div className="album-side-note" aria-hidden="true">
          <span>{number(index + 1)}</span><i>of {number(photos.length)}</i>
        </div>
      </div>

      <div className="album-navigation">
        <div className="album-proof-header" aria-hidden="true">
          <span>Contact sheet</span><span>{number(photos.length)} exposures</span>
        </div>
        <div className="album-thumbnails" aria-label="Choose a photograph">
          {photos.map((photo, photoIndex) => (
            <button
              key={photo.src}
              ref={element => { thumbnails.current[photoIndex] = element; }}
              className={photoIndex === index ? 'is-selected' : ''}
              type="button"
              onClick={() => choose(photoIndex)}
              aria-label={`Show photograph ${photoIndex + 1}: ${photo.alt}`}
              aria-pressed={photoIndex === index}
            >
              <span className="album-proof-image">
                <img src={`/images/${photo.src}.webp`} alt="" width="2304" height="1536" loading="lazy" style={{ objectPosition: photo.position }} />
              </span>
              <span className="album-proof-number">{number(photoIndex + 1)}</span>
            </button>
          ))}
        </div>

        <div className="album-controls">
          <div className="album-arrows">
            <button type="button" aria-label="Previous photograph" onClick={() => move(-1)}>←</button>
            <span aria-live="polite" aria-atomic="true">{number(index + 1)} <i>/ {number(photos.length)}</i></span>
            <button type="button" aria-label="Next photograph" onClick={() => move(1)}>→</button>
          </div>
          <button className="album-play" type="button" disabled={reducedMotion} onClick={() => setPlaying(current => !current)} aria-pressed={playing}>
            {reducedMotion ? 'Still moments' : playing ? 'Pause slideshow' : 'Play slideshow'}
          </button>
        </div>
      </div>

      <p className="album-instruction">Choose a proof, use the arrows, or swipe to turn the page.</p>
    </section>
  );
}
