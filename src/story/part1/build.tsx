// PART 1 build days: sols 1-3 on the Martian surface, after touchdown.
// Owned by Person 1. A guided build: each sol the kid builds two things for
// the base, and the crew explains why, with one real NASA number each time.
// Nothing here changes the hidden numbers or records a decision.

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Pip } from "../../ui/Pip";
import type { Lang } from "../types";
import { LandingScene } from "./art";
import { ITEMS, SOLS, type BuildItem, type ItemId, type T, type Who } from "./buildContent";
import { MeiFace, TundeFace } from "./portraits";
import { p1Sound } from "./sound";

const UI = {
  build: { en: "Build", bn: "বানাও" },
  pick: { en: "Tap something to build", bn: "কী বানাবে, ট্যাপ করো" },
  built: { en: "Built", bn: "বানানো শেষ" },
  sol: { en: "Sol", bn: "সোল" },
  next: { en: "Next", bn: "পরের" },
  endSol: { en: "End sol", bn: "সোল শেষ" },
  data: { en: "Real NASA data", bn: "নাসার আসল তথ্য" },
  source: { en: "NASA source", bn: "নাসার সোর্স" },
  night: { en: "Night on Mars", bn: "মঙ্গলে রাত" },
  who: { pip: { en: "Pip", bn: "পিপ" }, mei: { en: "Mei · Doctor", bn: "মেই · ডাক্তার" }, tunde: { en: "Tunde · Engineer", bn: "তুন্দে · ইঞ্জিনিয়ার" } },
};
const SOL_DIGIT = { en: ["1", "2", "3"], bn: ["১", "২", "৩"] };

// ---------- the base, drawn over the landing site ----------

/** Each item's look, in scene units (1600 x 900, ground near y = 660). */
const ART: Record<ItemId, (night: boolean) => ReactNode> = {
  habitat: (night) => (
    <g>
      <ellipse cx="1010" cy="684" rx="170" ry="16" fill="#2a1208" opacity="0.4" />
      {/* an inflatable habitat: a soft white tube with ribs and round windows */}
      <rect x="860" y="572" width="300" height="112" rx="56" fill="#eef0f3" stroke="#8a919c" strokeWidth="3" />
      {[920, 980, 1040, 1100].map((x) => (
        <line key={x} x1={x} y1="576" x2={x} y2="680" stroke="#c4c9d1" strokeWidth="3" />
      ))}
      <rect x="860" y="660" width="300" height="24" rx="10" fill="#9aa1ad" />
      {[950, 1010, 1070].map((x) => (
        <circle key={x} cx={x} cy="616" r="14" fill={night ? "#ffd98a" : "#2a3446"} stroke="#5d6470" strokeWidth="3" className={night ? "story-p1b-glow" : undefined} />
      ))}
      {/* airlock door and a heater vent glowing orange */}
      <rect x="836" y="600" width="40" height="74" rx="12" fill="#dfe2e7" stroke="#8a919c" strokeWidth="3" />
      <rect x="846" y="616" width="20" height="44" rx="5" fill="#3a3d44" />
      <rect x="1124" y="640" width="26" height="12" rx="3" fill="#ff8a4a" opacity="0.85" />
    </g>
  ),
  oxygen: (night) => (
    <g>
      <ellipse cx="1260" cy="690" rx="70" ry="9" fill="#2a1208" opacity="0.4" />
      {/* an oxygen maker: intake fan on the front, a pipe into the habitat */}
      <path d="M1160 640 H1210" stroke="#b9bfc9" strokeWidth="9" strokeLinecap="round" />
      <rect x="1210" y="610" width="100" height="78" rx="8" fill="#d7dbe3" stroke="#6b7280" strokeWidth="3" />
      <circle cx="1246" cy="649" r="22" fill="#3a3d44" />
      <g className="story-p1b-anim-fan" style={{ transformOrigin: "1246px 649px" }}>
        <path d="M1246 649 L1246 631 M1246 649 L1262 658 M1246 649 L1230 658" stroke="#9aa1ad" strokeWidth="5" strokeLinecap="round" />
      </g>
      <circle cx="1290" cy="626" r="6" fill={night ? "#7fe0ff" : "#4ee08a"} className="story-p1-anim-blink" style={{ animationDuration: "2s" }} />
    </g>
  ),
  panels: (night) => (
    <g>
      {/* two rows of solar panels tilted to the sun */}
      {[0, 1].map((row) =>
        [0, 1, 2, 3].map((col) => {
          const x = 1040 + col * 120 + row * 40;
          const y = 760 + row * 64;
          return (
            <g key={`${row}-${col}`}>
              <ellipse cx={x + 52} cy={y + 34} rx="56" ry="7" fill="#2a1208" opacity="0.35" />
              <line x1={x + 52} y1={y + 14} x2={x + 52} y2={y + 32} stroke="#6b7280" strokeWidth="4" />
              <path d={`M${x} ${y + 18} L${x + 18} ${y - 12} L${x + 108} ${y - 12} L${x + 90} ${y + 18} Z`} fill={night ? "#0e1424" : "#1c2b4a"} stroke="#c9ccd1" strokeWidth="2" />
              <path d={`M${x + 36} ${y - 12} L${x + 18} ${y + 18} M${x + 72} ${y - 12} L${x + 54} ${y + 18} M${x + 9} ${y + 3} L${x + 99} ${y + 3}`} stroke="#5f7aa8" strokeWidth="1.5" />
              {!night && <path d={`M${x + 8} ${y + 12} L${x + 22} ${y - 8} L${x + 40} ${y - 8} L${x + 26} ${y + 12} Z`} fill="#fff" opacity="0.18" />}
            </g>
          );
        }),
      )}
    </g>
  ),
  battery: (night) => (
    <g>
      <ellipse cx="940" cy="830" rx="80" ry="9" fill="#2a1208" opacity="0.4" />
      {/* a battery bank; its lights show how full it is */}
      <path d="M1000 800 Q1020 790 1040 790" fill="none" stroke="#2b2f3a" strokeWidth="5" />
      <rect x="870" y="768" width="140" height="62" rx="8" fill="#d7dbe3" stroke="#6b7280" strokeWidth="3" />
      <rect x="882" y="780" width="116" height="20" rx="3" fill="#111317" />
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <rect key={n} x={886 + n * 18.5} y="783" width="14" height="14" rx="2" fill={night && n > 3 ? "#23262c" : "#4ee08a"} />
      ))}
      <rect x="882" y="808" width="116" height="12" rx="2" fill="#4a4d54" />
    </g>
  ),
  water: (night) => (
    <g>
      {/* water tanks with a blue stripe; a pipe runs to the fuel plant */}
      {[230, 320, 410].map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy="842" rx="44" ry="8" fill="#2a1208" opacity="0.4" />
          <rect x={x - 36} y={740 - i * 6} width="72" height={102 + i * 6} rx="30" fill="#eef0f3" stroke="#8a919c" strokeWidth="3" />
          <rect x={x - 36} y={790} width="72" height="12" fill="#3aa0ff" opacity={night ? 0.6 : 0.9} />
        </g>
      ))}
      <path d="M446 790 Q500 760 470 700" fill="none" stroke="#9aa1ad" strokeWidth="7" strokeLinecap="round" />
    </g>
  ),
  fuel: (night) => (
    <g>
      <ellipse cx="420" cy="690" rx="120" ry="12" fill="#2a1208" opacity="0.4" />
      {/* the fuel plant: a box of pipes, a round tank and a little flare */}
      <rect x="320" y="600" width="150" height="88" rx="8" fill="#c9ced6" stroke="#6b7280" strokeWidth="3" />
      <rect x="336" y="616" width="60" height="30" rx="4" fill="#3a3d44" />
      <circle cx="430" cy="636" r="22" fill="#e9ecf0" stroke="#6b7280" strokeWidth="3" />
      <path d="M470 650 H520 V610" fill="none" stroke="#9aa1ad" strokeWidth="8" strokeLinecap="round" />
      <line x1="350" y1="600" x2="350" y2="560" stroke="#6b7280" strokeWidth="6" />
      <circle cx="350" cy="554" r="7" fill="#ffb347" className={night ? "story-p1b-glow" : "story-p1-anim-blink"} />
      {/* the line to the rocket is not connected yet */}
      <path d="M520 610 Q560 580 600 600" fill="none" stroke="#9aa1ad" strokeWidth="6" strokeDasharray="8 10" opacity="0.6" />
    </g>
  ),
};

/**
 * Where each item stands in the scene. The drawings above use their own
 * coordinates; these moves keep every building in the band that stays visible
 * above the menu and dialogue bar, and inside the 4:3 crop (x 220 to 1380).
 */
const PLACE: Record<ItemId, string> = {
  fuel: "translate(-20 30) scale(0.8)",
  water: "translate(56 -150)",
  habitat: "translate(-46 -28)",
  oxygen: "translate(-40 -39)",
  panels: "translate(448 129) scale(0.55)",
  battery: "translate(330 -128)",
};

/** The return rocket waiting on its pad in the distance. */
function DistantRocket() {
  return (
    <g transform="translate(1340 560) scale(0.32)">
      <ellipse cx="0" cy="4" rx="70" ry="10" fill="#000" opacity="0.3" />
      <path d="M-34 -20 L-58 0 M34 -20 L58 0" stroke="#9aa1ad" strokeWidth="8" strokeLinecap="round" />
      <path d="M0 -330 Q34 -280 34 -190 L34 -20 L-34 -20 L-34 -190 Q-34 -280 0 -330 Z" fill="#e9ecf0" stroke="#8a919c" strokeWidth="4" />
      <circle cx="0" cy="-230" r="13" fill="#1f2633" />
      <path d="M-34 -70 L-60 -10 L-34 -24 Z M34 -70 L60 -10 L34 -24 Z" fill="#c8642f" />
    </g>
  );
}

function BaseScene({ built, night, fresh, upcoming }: { built: Set<ItemId>; night: boolean; fresh: ItemId | null; upcoming: ItemId[] }) {
  const order: ItemId[] = ["panels", "fuel", "habitat", "oxygen", "water", "battery"]; // back to front
  return (
    <div className={`story-p1b-scene${night ? " is-night" : ""}`}>
      <LandingScene alt={0} thrust={false} clear />
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="story-p1b-overlay">
        <DistantRocket />
        {/* faint outlines where today's buildings will go */}
        {upcoming.map((id) => (
          <g key={`ghost-${id}`} transform={PLACE[id]}>
            <g className="story-p1b-ghost">{ART[id](false)}</g>
          </g>
        ))}
        {order
          .filter((id) => built.has(id))
          .map((id) => (
            <g key={id} transform={PLACE[id]}>
              <g className={id === fresh ? "story-p1b-anim-build" : undefined}>{ART[id](night)}</g>
            </g>
          ))}
      </svg>
      <div className="story-p1b-dark" aria-hidden="true" />
      {night && (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="story-p1b-overlay" aria-hidden="true">
          {/* the base keeps its lights on through the night (positions after PLACE) */}
          {built.has("habitat") &&
            [904, 964, 1024].map((x) => (
              <g key={x}>
                <circle cx={x} cy="588" r="26" fill="#ffd98a" opacity="0.28" />
                <circle cx={x} cy="588" r="12" fill="#ffe7b0" />
              </g>
            ))}
          {built.has("fuel") && <circle cx="260" cy="473" r="10" fill="#ffb347" className="story-p1-anim-blink" />}
          {built.has("oxygen") && <circle cx="1250" cy="587" r="7" fill="#7fe0ff" />}
          {built.has("battery") && <rect x="1212" y="655" width="110" height="14" rx="3" fill="#4ee08a" opacity="0.8" />}
        </svg>
      )}
      {night && (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="story-p1b-overlay story-p1b-nightstars" aria-hidden="true">
          {Array.from({ length: 70 }, (_, i) => (
            <circle key={i} cx={(i * 263) % 1600} cy={(i * 97) % 420} r={i % 5 === 0 ? 1.8 : 1} fill="#fff" />
          ))}
        </svg>
      )}
    </div>
  );
}

// ---------- the build menu ----------

function ItemIcon({ id }: { id: ItemId }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true">
      {id === "habitat" && <path {...common} d="M4 24 V16 A12 9 0 0 1 28 16 V24 Z M10 24 V19 H15 V24 M19 17 h4" />}
      {id === "oxygen" && (
        <g {...common}>
          <circle cx="11" cy="18" r="6" />
          <circle cx="21" cy="11" r="4" />
          <circle cx="23" cy="22" r="3" />
        </g>
      )}
      {id === "panels" && <path {...common} d="M4 22 L9 10 H28 L23 22 Z M14 10 L9 22 M19 10 L14 22 M6.5 16 H25.5 M16 22 V28" />}
      {id === "battery" && <path {...common} d="M5 10 H25 V24 H5 Z M25 14 H28 V20 H25 M9 14 V20 M13 14 V20 M17 14 V20" />}
      {id === "water" && <path {...common} d="M16 4 C12 11 8 15 8 20 A8 8 0 0 0 24 20 C24 15 20 11 16 4 Z" />}
      {id === "fuel" && <path {...common} d="M16 4 C20 10 24 13 24 19 A8 8 0 0 1 8 19 C8 15 11 13 12 9 C14 12 15 13 16 13 C16 10 16 7 16 4 Z" />}
    </svg>
  );
}

function BuildMenu({ lang, sol, built, onPick }: { lang: Lang; sol: number; built: Set<ItemId>; onPick: (id: ItemId) => void }) {
  return (
    <section className="story-p1b-menu" aria-label={UI.build[lang]}>
      <p className="story-p1b-menu-title">
        <span className="story-p1-who">{UI.who.pip[lang]}</span> {UI.pick[lang]}
      </p>
      <div className="story-p1b-hexes">
        {ITEMS.map((it) => {
          const done = built.has(it.id);
          const today = it.sol === sol && !done;
          const state = done ? "is-done" : today ? "is-today" : "is-locked";
          return (
            <button key={it.id} type="button" className={`story-p1b-hex ${state}`} disabled={!today} onClick={() => onPick(it.id)} aria-label={`${it.name[lang]}${done ? `, ${UI.built[lang]}` : !today ? `, ${UI.sol[lang]} ${SOL_DIGIT[lang][it.sol - 1]}` : ""}`}>
              <span className="story-p1b-hex-shape">
                <ItemIcon id={it.id} />
                {done && <i className="story-p1b-check">✓</i>}
              </span>
              <span className="story-p1b-hex-name">{it.name[lang]}</span>
              {!done && !today && (
                <span className="story-p1b-hex-sol">
                  {UI.sol[lang]} {SOL_DIGIT[lang][it.sol - 1]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Face({ who }: { who: Who }) {
  return (
    <span className="story-p1-avatar">
      {who === "pip" ? <Pip mood="happy" size={64} /> : who === "mei" ? <MeiFace /> : <TundeFace />}
    </span>
  );
}

// ---------- the build days player ----------

type Step =
  | { kind: "card" }
  | { kind: "start" }
  | { kind: "menu" }
  | { kind: "building"; item: BuildItem }
  | { kind: "why"; item: BuildItem; n: number }
  | { kind: "fact"; item: BuildItem }
  | { kind: "end" }
  | { kind: "night" };

const BUILD_MS = 1700;
const NIGHT_MS = 3200;
const CARD_MS = 2200;

export function BuildDays({ lang, reduceMotion, onDone }: { lang: Lang; reduceMotion: boolean; onDone: () => void }) {
  const [solIndex, setSolIndex] = useState(0);
  const [step, setStep] = useState<Step>({ kind: "card" });
  const [built, setBuilt] = useState<Set<ItemId>>(new Set());
  const [fresh, setFresh] = useState<ItemId | null>(null);
  const sol = SOLS[solIndex];
  const say = (t: T) => t[lang];
  const todayLeft = ITEMS.filter((it) => it.sol === sol.n && !built.has(it.id));

  // the quiet wind of the surface by day
  useEffect(() => {
    p1Sound.bed("surface");
  }, []);

  // timed steps: the sol title card, building, and nightfall
  useEffect(() => {
    let t = 0;
    if (step.kind === "card") {
      p1Sound.whoosh();
      t = window.setTimeout(() => setStep({ kind: "start" }), reduceMotion ? 1200 : CARD_MS);
    } else if (step.kind === "building") {
      p1Sound.build();
      t = window.setTimeout(() => setStep({ kind: "why", item: step.item, n: 0 }), reduceMotion ? 500 : BUILD_MS);
    } else if (step.kind === "night") {
      p1Sound.night();
      t = window.setTimeout(() => {
        if (solIndex + 1 >= SOLS.length) onDone();
        else {
          setSolIndex(solIndex + 1);
          setFresh(null);
          setStep({ kind: "card" });
        }
      }, reduceMotion ? 1600 : NIGHT_MS);
    }
    return () => window.clearTimeout(t);
  }, [step, solIndex, reduceMotion, onDone]);

  // Pip chirps when he speaks; data cards get a soft chime
  useEffect(() => {
    if (step.kind === "start" || (step.kind === "why" && step.item.who === "pip") || (step.kind === "end" && sol.end.who === "pip")) p1Sound.blip();
    if (step.kind === "fact") p1Sound.chime();
  }, [step, sol]);

  const pick = (id: ItemId) => {
    const item = ITEMS.find((it) => it.id === id)!;
    p1Sound.unlock();
    p1Sound.tick();
    setBuilt((b) => new Set(b).add(id));
    setFresh(id);
    setStep({ kind: "building", item });
  };

  const next = useCallback(() => {
    p1Sound.tick();
    if (step.kind === "card") setStep({ kind: "start" });
    else if (step.kind === "start") setStep({ kind: "menu" });
    else if (step.kind === "why") setStep(step.n + 1 < step.item.why.length ? { ...step, n: step.n + 1 } : { kind: "fact", item: step.item });
    else if (step.kind === "fact") setStep(todayLeft.length > 0 ? { kind: "menu" } : { kind: "end" });
    else if (step.kind === "end") setStep({ kind: "night" });
  }, [step, todayLeft.length]);

  // keyboard: Enter or → moves on (buttons keep their own Enter)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || (e.key === "Enter" && !(e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement))) {
        if (step.kind !== "menu" && step.kind !== "building" && step.kind !== "night") {
          e.preventDefault();
          next();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, next]);

  const night = step.kind === "night";
  const upcoming = step.kind === "menu" ? todayLeft.map((it) => it.id) : [];
  const line: { who: Who; text: string } | null =
    step.kind === "start"
      ? { who: "pip", text: say(sol.start) }
      : step.kind === "why"
        ? { who: step.item.who, text: say(step.item.why[step.n]) }
        : step.kind === "end"
          ? { who: sol.end.who, text: say(sol.end.line) }
          : null;

  return (
    <div className="story-p1b">
      <BaseScene built={built} night={night} fresh={fresh} upcoming={upcoming} />

      <span className="story-p1b-tab">{say(sol.title)}</span>
      <ol className="story-p1b-sols" aria-hidden="true">
        {SOLS.map((s, n) => (
          <li key={s.n} className={n < solIndex ? "done" : n === solIndex ? "now" : ""}>
            {UI.sol[lang]} {SOL_DIGIT[lang][n]}
          </li>
        ))}
      </ol>

      {step.kind === "card" && (
        <button type="button" className="story-p1-card story-p1b-card" onClick={next} key={`card-${solIndex}`}>
          <span className="story-p1-card-kicker">{lang === "bn" ? "বেস বানানো" : "Building the base"}</span>
          <span className="story-p1-card-title">{say(sol.title)}</span>
          <span className="story-p1-card-rule" />
        </button>
      )}

      {step.kind === "menu" && <BuildMenu lang={lang} sol={sol.n} built={built} onPick={pick} />}

      {line && (
        <section className="story-p1-dialogue" key={`${solIndex}-${step.kind}-${step.kind === "why" ? `${step.item.id}${step.n}` : ""}`} aria-live="polite">
          <Face who={line.who} />
          <div className="story-p1-words">
            <span className="story-p1-who">{UI.who[line.who][lang]}</span>
            <p className="story-p1-text">{line.text}</p>
          </div>
          <button type="button" className="story-p1-next" onClick={next} autoFocus>
            {step.kind === "end" ? UI.endSol[lang] : UI.next[lang]}
          </button>
        </section>
      )}

      {step.kind === "fact" && (
        <section className="story-p1-fact story-p1b-fact" key={`fact-${step.item.id}`}>
          <span className="story-p1-fact-head">
            {UI.data[lang]} · {step.item.name[lang]}
          </span>
          <div className="story-p1b-fact-body">
            <strong className="story-p1b-stat">{say(step.item.stat)}</strong>
            <p>{say(step.item.fact)}</p>
          </div>
          <div className="story-p1-row">
            <a href={step.item.source} target="_blank" rel="noreferrer" className="story-p1-source">
              {UI.source[lang]} ↗
            </a>
            <button type="button" className="story-p1-next" onClick={next} autoFocus>
              {UI.next[lang]}
            </button>
          </div>
        </section>
      )}

      {night && (
        <p className="story-p1b-nightcap" aria-live="polite">
          {UI.night[lang]} · {say(ITEMS[0].stat)}
        </p>
      )}
    </div>
  );
}
