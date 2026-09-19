import { useEffect, useRef, useState } from "react";
import OpeningBook from "./components/OpeningBook";
import DateReveal from "./components/DateReveal";
import PhotoCarousel from "./components/PhotoCarousel";
import Postcards from "./components/Postcards";
import { wedding } from "./config";
const stops = [
  "Newcastle",
  "Davao",
  "Tanzania",
  "India",
  "Hungary",
  "London",
  "Edinburgh",
  "Portugal",
  "Amsterdam",
  "Alnwick Castle",
  "Hong Kong",
];
function icsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}
function icsTimestamp(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}
function calendar() {
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "PRODID:-//Rishabh and Glyra//Wedding//EN",
    "BEGIN:VEVENT",
    "UID:rishabh-glyra-20261021@wedding.local",
    `DTSTAMP:${icsTimestamp(new Date())}`,
    "DTSTART:20261021T023000Z",
    `SUMMARY:${icsText("Rishabh & Glyra · Wedding")}`,
    `LOCATION:${icsText(wedding.location)}`,
    `DESCRIPTION:${icsText("Together with their families. Reception to follow.")}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob([body], { type: "text/calendar;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = wedding.calendarFileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function App() {
  const [opened, setOpened] = useState(false);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!opened) return;
    main.current?.focus();
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [opened]);
  return (
    <>
      {!opened && (
        <OpeningBook
          onOpen={() => {
            setOpened(true);
            window.scrollTo(0, 0);
          }}
        />
      )}
      {opened && <>
      <a className="skip-link" href="#main">
        Skip to invitation
      </a>
      <header className="site-header invitation-shell invitation-shell--ready">
        <a
          className="monogram"
          href="#main"
          aria-label="Rishabh and Glyra home"
        >
          R<span>&</span>G
        </a>
        <nav aria-label="Invitation">
          <a href="#date">The date</a><a href="#celebrations">The celebrations</a>
          <a href="#story">Our story</a>
          <a href="#wishes">
            Send a little love <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
      <main id="main" ref={main} tabIndex={-1} className="invitation-shell invitation-shell--ready">
        <DateReveal onCalendar={calendar} />
        <section id="celebrations" className="celebrations section-pad reveal">
          <div className="arrival-mark"><span>WITH LOVE, TO</span><strong>HONG KONG</strong><span>21 OCT 2026 · 10:30 AM</span></div>
          <div className="celebration-intro">
          <div className="section-heading">
            <span className="eyebrow">Letter two · The celebrations</span>
            <h2>
              Two cities.
              <br />
              <em>One beautiful beginning.</em>
            </h2>
            <p>
              Before we fly, a celebration with our favourite people.
              <br />
              Then, a little ceremony and a very big forever.
            </p>
          </div>
          </div>
          <div className="event-grid">
            <article className="event">
              <span className="event-index">01 · THE SEND-OFF</span>
              <h3>Davao City</h3>
              <p className="event-date">17 October 2026 · 6:30 PM</p>
              <div className="event-rule" />
              <p>
                No formal ceremony, just good food, great company, stories,
                laughter, and one last celebration before we begin married life.
              </p>
              <p className="event-footer">
                Come for the love. Stay for the stories.
              </p>
            </article>
            <article className="event">
              <span className="event-index">02 · THE WEDDING</span>
              <h3>Hong Kong</h3>
              <p className="event-date">21 October 2026 · 10:30 AM</p>
              <div className="event-rule" />
              <p>
                Together with our families, we joyfully invite you to witness
                the celebration of our marriage at{" "}
                <strong>Cotton Tree Drive, Central, Hong Kong.</strong>
              </p>
              <p className="event-footer">Reception to follow.</p>
              <button className="text-link" onClick={calendar}>
                Add the wedding to your calendar <span>↗</span>
              </button>
            </article>
          </div>
          <p className="timezone-note">
            Each celebration’s time is local to its city.
          </p>
        </section>
        <section id="story" className="story section-pad reveal">
          <div className="story-copy">
            <span className="eyebrow">Letter three · Our story</span>
            <h2>
              Different places.
              <br />
              <em>The same love.</em>
            </h2>
            <p>
              What started as a conversation between two people living on
              opposite sides of the world became the greatest adventure of our
              lives.
            </p>
            <p>
              From Newcastle and Davao to Tanzania, India, Hungary, and beyond,
              we collected passport stamps, unforgettable memories, and every
              reason to believe that love knows no borders.
            </p>
            <p>
              There were time zones to navigate and flights to catch. But
              through every mile, we always found our way back to each other.
            </p>
            <p>
              Now, we’re celebrating not just where we’re going, but everything
              and everyone that brought us here.
            </p>
            <span className="handwritten">Many places. One love.</span>
          </div>
          <figure className="journey-map">
            <a
              href="/images/journey.webp"
              target="_blank"
              rel="noreferrer"
              aria-label="Open our illustrated journey map in full size"
            >
              <picture>
                <source media="(max-width: 600px)" srcSet="/images/journey-ink.webp" />
                <img
                  src="/images/journey.webp"
                  alt="Illustrated journey from Newcastle and Davao, through Tanzania, India, Hungary, London, Edinburgh, Portugal, Amsterdam and the proposal at Alnwick Castle, to our wedding in Hong Kong"
                  width="1130"
                  height="1394"
                  loading="lazy"
                />
              </picture>
            </a>
          </figure>
          <div className="destination-line">
            {stops.map((s, i) => (
              <span key={s}>
                {s}
                {i < stops.length - 1 && <i aria-hidden="true"> · </i>}
              </span>
            ))}
          </div>
        </section>
        <PhotoCarousel />
        <Postcards />
        <footer className="footer reveal">
          <span className="eyebrow">Final delivery · Forever</span>
          <h2>
            Forever, <em>with you.</em>
          </h2>
          <figure className="footer-couple">
            <img
              src="/images/couple-cutout.png"
              alt="Illustration of Rishabh and Glyra in their wedding outfits"
              width="300"
              height="300"
              loading="lazy"
            />
          </figure>
          <span className="footer-monogram">R & G</span>
          <p>21 October 2026 · Hong Kong</p>
          <a href="#main" className="text-link">
            Back to the beginning ↑
          </a>
          <span className="footer-small">SEALED WITH LOVE. SENT WITH JOY.</span>
        </footer>
      </main>
      </>}
    </>
  );
}
