import { useEffect, useRef, useState } from "react";
import "./DateReveal.css";
import { wedding, weddingStart } from "../config";

const WEDDING = weddingStart;
const parts = [
  { value: "21", label: "day" },
  { value: "OCT", label: "month" },
  { value: "2026", label: "year" },
];

function CalendarAppIcon({ app }: { app: "google" | "apple" | "outlook" }) {
  if (app === "google")
    return (
      <svg
        className="calendar-app-icon google-calendar-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path fill="#4285f4" d="M4 5h16v15H4z" />
        <path fill="#34a853" d="M4 5h5v15H4z" />
        <path fill="#fbbc04" d="M9 5h6v15H9z" />
        <path fill="#ea4335" d="M15 5h5v15h-5z" />
        <path fill="#fff" d="M6 7h12v11H6z" />
        <path fill="#4285f4" d="M8 10h8v2H8zm0 3h5v2H8z" />
      </svg>
    );
  if (app === "apple")
    return (
      <svg
        className="calendar-app-icon apple-calendar-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="17"
          rx="3"
          fill="#fff"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M3.75 9h16.5" stroke="#e25c55" strokeWidth="2" />
        <path
          d="M8 2.75v3M16 2.75v3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <text
          x="12"
          y="18"
          textAnchor="middle"
          fill="currentColor"
          fontSize="8"
          fontFamily="Arial, sans-serif"
        >
          21
        </text>
      </svg>
    );
  return (
    <svg
      className="calendar-app-icon outlook-calendar-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path fill="#0f6cbd" d="M4 5h11v14H4z" />
      <path fill="#185abd" d="M10 3h10v18H10z" />
      <path fill="#fff" d="M12 6h6v3h-6zm0 5h6v2h-6zm0 4h4v2h-4z" />
      <text
        x="7.5"
        y="15.5"
        textAnchor="middle"
        fill="#fff"
        fontSize="8"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        O
      </text>
    </svg>
  );
}

function ScratchCircle({
  value,
  label,
  revealed,
  onReveal,
}: {
  value: string;
  label: string;
  revealed: boolean;
  onReveal: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const previous = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    const gradient = context.createLinearGradient(0, 0, 300, 300);
    gradient.addColorStop(0, "#d9be7e");
    gradient.addColorStop(0.45, "#bd974c");
    gradient.addColorStop(1, "#e0c88c");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 300, 300);
    context.strokeStyle = "rgba(92, 61, 22, .35)";
    context.lineWidth = 1;
    context.beginPath();
    context.arc(150, 150, 135, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = "#583d1c";
    context.textAlign = "center";
    context.font = "italic 30px Georgia";
    context.fillText("a little", 150, 140);
    context.fillText("surprise", 150, 177);
  }, []);
  const scratch = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealed) return;
    const element = canvas.current;
    const context = element?.getContext("2d", { willReadFrequently: true });
    if (!element || !context) return;
    const rect = element.getBoundingClientRect();
    const pointFor = (pointer: PointerEvent) => ({ x: ((pointer.clientX - rect.left) * 300) / rect.width, y: ((pointer.clientY - rect.top) * 300) / rect.height });
    const points = event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent];
    context.globalCompositeOperation = "destination-out";
    context.lineWidth = 68;
    context.lineCap = "round";
    context.lineJoin = "round";
    for (const pointer of points) {
      const point = pointFor(pointer);
      context.beginPath();
      if (previous.current) {
        context.moveTo(previous.current.x, previous.current.y);
        context.lineTo(point.x, point.y);
      } else {
        context.arc(point.x, point.y, context.lineWidth / 2, 0, Math.PI * 2);
      }
      context.stroke();
      previous.current = point;
    }
    if ((strokes.current += points.length) % 4 === 0) {
      const pixels = context.getImageData(0, 0, 300, 300).data;
      let clear = 0;
      let total = 0;
      for (let y = 15; y < 285; y += 6)
        for (let x = 15; x < 285; x += 6) {
          if ((x - 150) ** 2 + (y - 150) ** 2 > 135 ** 2) continue;
          total++;
          if (pixels[(y * 300 + x) * 4 + 3] < 100) clear++;
        }
      if (clear / total > 0.38) onReveal();
    }
  };
  return (
    <div className="date-piece">
      <div className={`date-circle${revealed ? " is-revealed" : ""}`}>
        <span className="date-value" aria-hidden={!revealed}>
          {value}
        </span>
        <canvas
          ref={canvas}
          width={300}
          height={300}
          aria-hidden="true"
          onPointerDown={(event) => {
            if (revealed) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            previous.current = null;
            scratch(event);
          }}
          onPointerMove={scratch}
          onPointerUp={() => {
            previous.current = null;
          }}
          onPointerCancel={() => {
            previous.current = null;
          }}
        />
      </div>
      <button
        className="date-piece-button"
        onClick={onReveal}
        disabled={revealed}
        aria-label={
          revealed ? `${label}: ${value}` : `Reveal the wedding ${label}`
        }
      >
        {revealed ? label : `reveal ${label}`}
      </button>
    </div>
  );
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
  const hongKongDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const onWeddingDay = hongKongDay === wedding.hongKongDateKey;
  const countdown = [
    Math.floor(remaining / 86400),
    Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ];
  return (
    <section className="date-reveal" id="date" aria-labelledby="date-heading">
      <p className="date-eyebrow">A date to keep</p>
      <h2 id="date-heading">
        Some things are worth
        <br />
        <em>uncovering.</em>
      </h2>
      <p className="date-instruction">
        Scratch the golden circles. Our forever is underneath. Use the reveal
        buttons if you prefer.
      </p>
      <div className="date-circles">
        {parts.map((part, index) => (
          <ScratchCircle
            key={part.label}
            {...part}
            revealed={revealed[index]}
            onReveal={() =>
              setRevealed((previous) =>
                previous.map((item, i) => i === index || item),
              )
            }
          />
        ))}
      </div>
      {!allRevealed && (
        <button
          className="date-reveal-all"
          onClick={() => setRevealed([true, true, true])}
        >
          Or, reveal our date <span aria-hidden="true">↗</span>
        </button>
      )}
      <div className="date-announcement" role="status">
        {allRevealed ? `${wedding.dateLabel}. Hong Kong. Our wedding day.` : ""}
      </div>
      {allRevealed && (
        <div className="date-countdown">
          <p className="date-countdown-title">
            {onWeddingDay
              ? "Today is our forever."
              : now > WEDDING
                ? "Our forever has begun."
                : "Counting the moments until we say “I do” in Hong Kong."}
          </p>
          {now < WEDDING && (
            <div
              className="date-countdown-values"
              role="timer"
              aria-label="Time until our wedding"
            >
              {countdown.map((value, index) => (
                <div key={index}>
                  <span>{String(value).padStart(2, "0")}</span>
                  <small>
                    {["days", "hours", "minutes", "seconds"][index]}
                  </small>
                </div>
              ))}
            </div>
          )}
          <div
            className="date-calendar-actions"
            aria-label="Save the wedding date"
          >
            <a
              className="date-calendar-link"
              href={wedding.googleCalendarUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Save the date in Google Calendar"
            >
              <CalendarAppIcon app="google" />
              <span>Google Calendar</span>
              <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              className="date-calendar-link"
              onClick={onCalendar}
              aria-label="Download the date for Apple Calendar"
            >
              <CalendarAppIcon app="apple" />
              <span>Apple Calendar</span>
              <span aria-hidden="true">↓</span>
            </button>
            <button
              type="button"
              className="date-calendar-link"
              onClick={onCalendar}
              aria-label="Download the date for Outlook"
            >
              <CalendarAppIcon app="outlook" />
              <span>Outlook</span>
              <span aria-hidden="true">↓</span>
            </button>
          </div>
          <figure className="date-teacup-keepsake">
            <img
              src="/images/teacup-transparent.png"
              alt="Illustration of a bride and groom sitting together in a teacup"
              width="627"
              height="627"
              loading="lazy"
            />
          </figure>
        </div>
      )}
    </section>
  );
}
