import { useEffect, useRef, useState } from "react";
import "./OpeningBook.css";

type OpeningBookProps = { onOpen: () => void };

/** The invitation's physical first page. The date deliberately appears later. */
export default function OpeningBook({ onOpen }: OpeningBookProps) {
  const [opening, setOpening] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finish = useRef(onOpen);

  useEffect(() => {
    finish.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousOverscroll = body.style.overscrollBehavior;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousOverscroll;
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function enterStory() {
    if (opening) return;
    setOpening(true);
    timer.current = window.setTimeout(
      () => finish.current(),
      reducedMotion ? 120 : 1450,
    );
  }

  return (
    <section
      className={`opening-theatre${opening ? " opening-theatre--opening" : ""}`}
      aria-labelledby="opening-title"
    >
      <picture className="opening-theatre__art" aria-hidden="true">
        <source
          media="(max-width: 700px) and (orientation: portrait)"
          srcSet="/images/opening-paper-theatre-mobile.webp"
        />
        <img
          src="/images/opening-paper-theatre-desktop.webp"
          alt=""
          width="1672"
          height="941"
          fetchPriority="high"
        />
      </picture>
      <span className="opening-theatre__paper-wash" aria-hidden="true" />

      <div className="opening-theatre__title">
        <p>An invitation has arrived for you</p>
        <h1 id="opening-title">R <i>&amp;</i> G</h1>
        <span aria-hidden="true" />
        <p className="opening-theatre__names">Glyra &amp; Rishabh</p>
      </div>

      <button
        type="button"
        className="opening-theatre__enter"
        onClick={enterStory}
        disabled={opening}
        aria-describedby="opening-description"
      >
        <span>Enter our story</span>
      </button>

      <p id="opening-description" className="sr-only">
        {opening
          ? "The paper theatre is opening into the invitation."
          : "An invitation has arrived for you from Glyra and Rishabh. Enter their story."}
      </p>
    </section>
  );
}
