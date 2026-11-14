// PART 1 landing map for decision 2 ("Where should we land?"). Owned by Person 1.
// A flat, stylized map of Mars with real places at their real positions
// (latitude/longitude, plate carrée). Two outposts can be picked: A and B, with
// the master story's exact label and detail. Other famous places are shown as
// landmarks only. Both outposts look the same, so nothing hints at a better one.

import type { Line, OptionText } from "../core/Beats";
import type { Choice, Lang } from "../types";

type Text = { en: string; bn: string };

const W = 1600;
const H = 900;
/** Real Mars coordinates to map position (east longitude, -180..180). */
const at = (lat: number, lon: number) => ({ x: ((lon + 180) / 360) * W, y: ((90 - lat) / 180) * H });

/** The two landing outposts, in the order of the decision's options. */
/** card: where the info card sits, as an offset from the pin (top-left corner). */
const OUTPOSTS: { choice: Choice; place: Text; lat: number; lon: number; card: { dx: number; dy: number } }[] = [
  // A: a very flat, safe plain; NASA's InSight lander chose it for that reason.
  { choice: "A", place: { en: "Elysium Planitia", bn: "এলিসিয়াম প্লানিশিয়া" }, lat: 4.5, lon: 135.6, card: { dx: -300, dy: 56 } },
  // B: buried ice cliffs found by NASA's Mars Reconnaissance Orbiter (2018) lie near here.
  { choice: "B", place: { en: "Milankovič Crater", bn: "মিলানকোভিচ ক্রেটার" }, lat: 54.7, lon: -146.7, card: { dx: 44, dy: -75 } },
];

/** Famous places shown for orientation only (not landing sites). */
const LANDMARKS: { name: Text; note: Text; lat: number; lon: number }[] = [
  { name: { en: "Olympus Mons", bn: "অলিম্পাস মনস" }, note: { en: "biggest volcano", bn: "সবচেয়ে বড় আগ্নেয়গিরি" }, lat: 18.65, lon: -133.8 },
  { name: { en: "Valles Marineris", bn: "ভ্যালেস মেরিনারিস" }, note: { en: "giant canyon", bn: "বিশাল ক্যানিয়ন" }, lat: -14, lon: -59 },
  { name: { en: "Jezero Crater", bn: "জেজেরো ক্রেটার" }, note: { en: "Perseverance rover", bn: "পারসিভিয়ারেন্স রোভার" }, lat: 18.4, lon: 77.5 },
  { name: { en: "Hellas Basin", bn: "হেলাস বেসিন" }, note: { en: "deep basin", bn: "গভীর বেসিন" }, lat: -42.4, lon: 70.5 },
];

const UI = {
  title: { en: "Choose a landing site", bn: "ল্যান্ডিংয়ের জায়গা বেছে নাও" },
  legend: { en: "Landmark", bn: "চেনা জায়গা" },
};

/** The map itself: highlands, northern lowlands, volcanoes, canyon, basins, craters. */
function MarsMap() {
  let s = 17;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const craters = Array.from({ length: 70 }, () => ({ x: rnd() * W, y: 120 + rnd() * 680, r: 3 + rnd() * rnd() * 22 }));
  const olympus = at(18.65, -133.8);
  const hellas = at(-42.4, 70.5);
  const argyre = at(-49.7, -43);
  const jezero = at(18.4, 77.5);
  return (
    <g>
      {/* southern highlands */}
      <rect width={W} height={H} fill="#cf7446" />
      {/* the darker northern lowlands */}
      <path d="M0 0 H1600 V250 Q1500 300 1420 270 Q1330 240 1270 300 Q1200 360 1120 330 Q1040 300 980 340 Q900 390 830 330 Q760 280 690 300 Q610 330 560 280 Q500 230 430 260 Q360 290 300 250 Q220 200 150 240 Q70 280 0 250 Z" fill="#a85a35" />
      <path d="M0 0 H1600 V170 Q1450 210 1300 180 Q1150 150 1000 200 Q860 240 720 190 Q560 140 420 180 Q260 220 120 170 Q60 150 0 165 Z" fill="#94502f" />
      {/* Tharsis rise and Olympus Mons */}
      <ellipse cx={olympus.x + 150} cy={olympus.y + 70} rx="230" ry="150" fill="#b8603a" opacity="0.7" />
      {[70, 52, 34, 16].map((r, i) => (
        <circle key={r} cx={olympus.x} cy={olympus.y} r={r} fill={["#a9532f", "#b25a33", "#bd643a", "#7a3a20"][i]} />
      ))}
      {[[olympus.x + 170, olympus.y + 30], [olympus.x + 210, olympus.y + 90], [olympus.x + 240, olympus.y + 150]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="22" fill="#a9532f" />
          <circle cx={x} cy={y} r="8" fill="#7a3a20" />
        </g>
      ))}
      {/* Valles Marineris, the giant canyon */}
      <path d="M430 470 Q520 452 600 474 Q680 494 760 484 L768 498 Q680 512 600 494 Q520 474 436 486 Z" fill="#5a2814" />
      <path d="M430 470 Q520 452 600 474 Q680 494 760 484" fill="none" stroke="#f0b088" strokeWidth="2" opacity="0.5" />
      {/* Hellas and Argyre basins */}
      <ellipse cx={hellas.x} cy={hellas.y} rx="120" ry="80" fill="#e3a07a" />
      <ellipse cx={hellas.x} cy={hellas.y} rx="120" ry="80" fill="none" stroke="#8e4224" strokeWidth="6" opacity="0.6" />
      <ellipse cx={argyre.x} cy={argyre.y} rx="70" ry="48" fill="#dc966e" stroke="#8e4224" strokeWidth="5" strokeOpacity="0.5" />
      {/* Jezero, an old lake crater with a river delta */}
      <circle cx={jezero.x} cy={jezero.y} r="16" fill="#9a4f2c" stroke="#e6a27a" strokeWidth="3" />
      <path d={`M${jezero.x - 60} ${jezero.y - 30} Q${jezero.x - 30} ${jezero.y - 20} ${jezero.x - 12} ${jezero.y - 6}`} fill="none" stroke="#7a3a20" strokeWidth="3" />
      {/* scattered craters */}
      {craters.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={c.r} fill="#8e4224" opacity="0.45" />
          <circle cx={c.x - c.r * 0.2} cy={c.y - c.r * 0.2} r={c.r * 0.75} fill="#e3a07a" opacity="0.25" />
        </g>
      ))}
      {/* polar ice caps */}
      <path d="M0 0 H1600 V40 Q1300 70 1000 46 Q700 26 400 52 Q200 66 0 44 Z" fill="#f4ece4" opacity="0.92" />
      <path d="M0 900 H1600 V872 Q1200 850 800 866 Q400 880 0 862 Z" fill="#f4ece4" opacity="0.85" />
      {/* a faint latitude/longitude grid, like a real map */}
      <g stroke="#fff" opacity="0.08">
        {[150, 300, 450, 600, 750].map((y) => (
          <line key={`y${y}`} x1="0" y1={y} x2={W} y2={y} />
        ))}
        {[200, 400, 600, 800, 1000, 1200, 1400].map((x) => (
          <line key={`x${x}`} x1={x} y1="0" x2={x} y2={H} />
        ))}
      </g>
    </g>
  );
}

export function LandingMap({
  lang,
  question,
  a,
  b,
  fill,
  onPick,
}: {
  lang: Lang;
  question: Line;
  a: OptionText;
  b: OptionText;
  fill: (l: Line) => string;
  onPick: (c: Choice) => void;
}) {
  return (
    <div className="story-p1-map" role="group" aria-label={`${UI.title[lang]}: ${fill(question)}`}>
      {/* on short screens the dialogue bar steps aside and the question sits on the map */}
      <p className="story-p1-map-q">
        <span>{lang === "bn" ? "পিপ" : "Pip"}</span>
        {fill(question)}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="story-p1-map-svg">
        <MarsMap />

        {/* landmarks: for orientation only */}
        {LANDMARKS.map((m) => {
          const p = at(m.lat, m.lon);
          return (
            <g key={m.name.en} className="story-p1-landmark" aria-hidden="true">
              <circle cx={p.x} cy={p.y} r="9" fill="#f4f4f1" stroke="#2a1208" strokeWidth="2" />
              <g transform={`translate(${p.x} ${p.y + 36})`}>
                <rect x="-110" y="-22" width="220" height="54" rx="6" fill="rgba(20,12,10,0.78)" />
                <text y="0" textAnchor="middle" className="story-p1-landmark-name">
                  {m.name[lang]}
                </text>
                <text y="23" textAnchor="middle" className="story-p1-landmark-note">
                  {m.note[lang]}
                </text>
              </g>
            </g>
          );
        })}

        {/* the two outposts that can be picked; they look exactly alike */}
        {OUTPOSTS.map((o) => {
          const p = at(o.lat, o.lon);
          const opt = o.choice === "A" ? a : b;
          const cardW = 430;
          const cardX = p.x + o.card.dx;
          const cardY = p.y + o.card.dy;
          // the line runs from the pin to the nearest edge of its card
          const below = o.card.dy > 0;
          const lx = below ? p.x : cardX;
          const ly = below ? cardY : p.y;
          return (
            <g
              key={o.choice}
              className="story-p1-outpost"
              role="button"
              tabIndex={0}
              aria-label={`${o.choice}: ${fill(opt.label)}, ${o.place[lang]}. ${fill(opt.detail)}`}
              onClick={() => onPick(o.choice)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPick(o.choice);
                }
              }}
            >
              <circle cx={p.x} cy={p.y} r="30" className="story-p1-outpost-ring" />
              <circle cx={p.x} cy={p.y} r="17" className="story-p1-outpost-dot" />
              <text x={p.x} y={p.y + 7} textAnchor="middle" className="story-p1-outpost-key">
                {o.choice}
              </text>
              <line x1={below ? p.x : p.x + 30} y1={below ? p.y + 30 : p.y} x2={lx} y2={ly} className="story-p1-outpost-line" />
              <foreignObject x={cardX} y={cardY} width={cardW} height="172">
                <div className="story-p1-outpost-card">
                  <span className="story-p1-outpost-place">{o.place[lang]}</span>
                  <strong>{fill(opt.label)}</strong>
                  <span>{fill(opt.detail)}</span>
                </div>
              </foreignObject>
            </g>
          );
        })}

        <g className="story-p1-map-legend" aria-hidden="true">
          <circle cx="40" cy={H - 36} r="7" fill="#f4f4f1" stroke="#2a1208" strokeWidth="2" />
          <text x="56" y={H - 30}>{UI.legend[lang]}</text>
        </g>
      </svg>
    </div>
  );
}
