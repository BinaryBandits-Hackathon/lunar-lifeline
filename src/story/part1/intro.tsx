// PART 1 opening: the backstory, told like a short documentary before the
// prologue. Owned by Person 1.
// It only covers what happened BEFORE the game starts (why the crew is at
// Mars). It ends right before Pip's "Good morning ... Day 412" line and never
// mentions anything the player will experience in the story.

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Pip } from "../../ui/Pip";
import type { Lang } from "../types";
import { DriftingStars, MarsGlobe, Particles, Stars } from "./art";
import { canNarrate, narrate, stopNarration } from "./narrator";
import { p1Sound } from "./sound";

interface Shot {
  en: string;
  bn: string;
  art: (still: boolean) => ReactNode;
}

const UI = {
  kicker: { en: "Before the story", bn: "গল্পের আগের কথা" },
  skip: { en: "Skip intro", bn: "ইন্ট্রো বাদ দাও" },
  next: { en: "Next", bn: "পরের" },
};

/** Earth at night from space, city lights on the dark side. */
function Earth({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <defs>
        <radialGradient id="p1i-earth" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#6fb6ff" />
          <stop offset="0.5" stopColor="#1f5fae" />
          <stop offset="1" stopColor="#0b1f45" />
        </radialGradient>
        <radialGradient id="p1i-earthnight" cx="0.25" cy="0.25" r="1">
          <stop offset="0.45" stopColor="#02040a" stopOpacity="0" />
          <stop offset="0.9" stopColor="#02040a" stopOpacity="0.9" />
        </radialGradient>
        <clipPath id="p1i-earthclip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r * 1.04} fill="#5aa8ff" opacity="0.18" />
      <circle cx={cx} cy={cy} r={r} fill="url(#p1i-earth)" />
      <g clipPath="url(#p1i-earthclip)">
        {/* land and clouds */}
        <path d={`M${cx - r * 0.6} ${cy - r * 0.2} q${r * 0.2} ${-r * 0.3} ${r * 0.45} ${-r * 0.1} q${r * 0.1} ${r * 0.3} ${-r * 0.15} ${r * 0.45} q${-r * 0.25} ${r * 0.05} ${-r * 0.3} ${-r * 0.35} Z`} fill="#3f7a4a" opacity="0.85" />
        <path d={`M${cx + r * 0.1} ${cy + r * 0.05} q${r * 0.3} ${-r * 0.15} ${r * 0.45} ${r * 0.1} q${-r * 0.05} ${r * 0.35} ${-r * 0.3} ${r * 0.4} q${-r * 0.2} ${-r * 0.2} ${-r * 0.15} ${-r * 0.5} Z`} fill="#7a6a3f" opacity="0.8" />
        <path d={`M${cx - r} ${cy - r * 0.45} q${r * 0.6} ${-r * 0.15} ${r * 1.2} ${r * 0.05} q${r * 0.5} ${r * 0.1} ${r * 0.9} ${-r * 0.05}`} fill="none" stroke="#fff" strokeWidth={r * 0.06} opacity="0.35" strokeLinecap="round" />
        <path d={`M${cx - r} ${cy + r * 0.5} q${r * 0.7} ${-r * 0.2} ${r * 1.4} ${0} q${r * 0.3} ${r * 0.1} ${r * 0.7} ${-r * 0.05}`} fill="none" stroke="#fff" strokeWidth={r * 0.05} opacity="0.3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={r} fill="url(#p1i-earthnight)" />
        {/* city lights on the night side */}
        <g fill="#ffd27a">
          {Array.from({ length: 26 }, (_, i) => (
            <circle key={i} cx={cx + r * (0.25 + ((i * 37) % 60) / 100)} cy={cy + r * (-0.5 + ((i * 53) % 100) / 100)} r={r * (0.0025 + (i % 3) * 0.0015)} opacity="0.9" />
          ))}
        </g>
      </g>
    </g>
  );
}

/** The Wayfarer: a small, whole science ship (before anything goes wrong). */
function Wayfarer({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      {[-150, 70].map((wx) => (
        <g key={wx}>
          <rect x={wx} y="-10" width="80" height="20" fill="#131b2a" stroke="#56627a" strokeWidth="1.5" />
          <line x1={wx + 27} y1="-10" x2={wx + 27} y2="10" stroke="#2c3749" strokeWidth="1.5" />
          <line x1={wx + 53} y1="-10" x2={wx + 53} y2="10" stroke="#2c3749" strokeWidth="1.5" />
        </g>
      ))}
      <rect x="-70" y="-18" width="140" height="36" rx="10" fill="#d9dee6" stroke="#5d6470" strokeWidth="1.5" />
      <path d="M70 -15 L100 -8 L100 8 L70 15 Z" fill="#e9ecf0" stroke="#5d6470" strokeWidth="1.5" />
      <rect x="82" y="-4" width="10" height="8" rx="2" fill="#1f2633" />
      <path d="M-70 -12 L-92 -18 L-92 18 L-70 12 Z" fill="#7b828e" />
      <circle cx="-20" cy="22" r="13" fill="#c9ced6" stroke="#5d6470" strokeWidth="1.2" />
      <ellipse cx="-96" cy="0" rx="10" ry="14" fill="#ffb347" opacity="0.8" className="story-p1-anim-flicker" />
    </g>
  );
}

/** A helmet portrait for the crew shot. */
function Helmet({ visor, ring }: { visor: string; ring: string }) {
  return (
    <svg viewBox="0 0 120 120" className="story-p1i-face" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="#121a28" stroke={ring} strokeWidth="3" />
      <circle cx="60" cy="54" r="34" fill="#e9ecf2" />
      <path d="M32 54 A28 22 0 0 1 88 54 L88 60 A28 16 0 0 1 32 60 Z" fill={visor} />
      <path d="M40 50 A20 14 0 0 1 60 40" fill="none" stroke="#fff" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
      <path d="M24 112 Q60 82 96 112" fill="#d7dbe3" />
    </svg>
  );
}

/** Blue glints of hidden ice scattered over a Mars globe (cx, cy, r). */
function IceSpots({ cx, cy, r, n, seed, cls }: { cx: number; cy: number; r: number; n: number; seed: number; cls?: string }) {
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = rnd() * Math.PI * 2;
        const d = Math.sqrt(rnd()) * r * 0.82;
        const x = cx + Math.cos(a) * d;
        const y = cy + Math.sin(a) * d * 0.9;
        return (
          <g key={i} className={cls} style={cls ? { animationDelay: `${(i / n) * 4}s` } : undefined}>
            <circle cx={x} cy={y} r={r * 0.04} fill="#8fd0ff" opacity="0.25" />
            <circle cx={x} cy={y} r={r * 0.012} fill="#e6f6ff" />
          </g>
        );
      })}
    </g>
  );
}

const SHOTS: Shot[] = [
  {
    en: "People have always dreamed of living on Mars. But to live there, you need water.",
    bn: "মানুষ সবসময় মঙ্গলে থাকার স্বপ্ন দেখেছে। কিন্তু ওখানে থাকতে হলে লাগবে পানি।",
    art: () => (
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <rect width="1600" height="900" fill="#02040a" />
        <DriftingStars n={140} seed={61} />
        <Earth cx={560} cy={1000} r={620} />
        {/* a rocket climbing away from Earth */}
        <g className="story-p1i-anim-launch">
          <path d="M780 470 Q840 330 960 230" fill="none" stroke="#ffd9a0" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
          <circle cx="960" cy="230" r="5" fill="#fff6dc" />
          <circle cx="960" cy="230" r="16" fill="#ffd9a0" opacity="0.3" />
        </g>
        {/* Mars far away, a small red dot */}
        <circle cx="1320" cy="190" r="10" fill="#d0623a" />
        <circle cx="1320" cy="190" r="22" fill="#d0623a" opacity="0.18" />
      </svg>
    ),
  },
  {
    en: "Mars does have water. It is frozen into ice, hidden under the red dust. But no one knew exactly where.",
    bn: "মঙ্গলে পানি আছে। লাল ধুলার নিচে বরফ হয়ে লুকিয়ে আছে। কিন্তু ঠিক কোথায়, কেউ জানত না।",
    art: () => (
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <rect width="1600" height="900" fill="#02040a" />
        <Stars n={110} seed={7} />
        <g className="story-p1i-anim-turn">
          <MarsGlobe cx={800} cy={450} r={330} id="p1i-mars2" />
        </g>
        {/* ice glimmering faintly under the dust */}
        <IceSpots cx={800} cy={450} r={330} n={14} seed={5} cls="story-p1i-anim-glint" />
      </svg>
    ),
  },
  {
    en: "So a small ship called the Wayfarer flew across space to find it. The trip took seven months.",
    bn: "তাই ওয়েফেয়ারার নামের ছোট্ট একটা স্পেসশিপ সেটা খুঁজতে স্পেস পাড়ি দিল। যেতে লাগল সাত মাস।",
    art: (still) => (
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <rect width="1600" height="900" fill="#02040a" />
        <Stars n={150} seed={19} />
        {/* the Sun's glow far to the side */}
        <circle cx="800" cy="980" r="260" fill="#ffe7b0" opacity="0.06" />
        <Earth cx={300} cy={560} r={90} />
        <MarsGlobe cx={1300} cy={380} r={70} id="p1i-mars3" />
        <path id="p1i-route" d="M380 520 C 650 240, 1000 200, 1240 360" fill="none" stroke="#8fd0ff" strokeWidth="3" strokeDasharray="4 14" strokeLinecap="round" opacity="0.6" />
        {still ? (
          <g transform="translate(1000 230) rotate(8)">
            <Wayfarer s={0.6} />
          </g>
        ) : (
          <g>
            <Wayfarer s={0.6} />
            <animateMotion dur="9s" fill="freeze" rotate="auto" path="M380 520 C 650 240, 1000 200, 1240 360" />
          </g>
        )}
      </svg>
    ),
  },
  {
    en: "On board were three explorers: you, our Commander; Mei, the doctor; and Tunde, the engineer. And Pip, the ship's computer, kept them company.",
    bn: "শিপে ছিল তিনজন এক্সপ্লোরার: তুমি, আমাদের কমান্ডার; মেই, ডাক্তার; আর তুন্দে, ইঞ্জিনিয়ার। আর সঙ্গী ছিল শিপের কম্পিউটার পিপ।",
    art: () => (
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <rect width="1600" height="900" fill="#03060e" />
        <DriftingStars n={120} seed={33} />
        <MarsGlobe cx={800} cy={1500} r={900} id="p1i-mars4" />
      </svg>
    ),
  },
  {
    en: "For more than two hundred days, they circled Mars, scanning the ground with radar, marking every patch of hidden ice.",
    bn: "দুইশো দিনেরও বেশি সময় ধরে তারা মঙ্গলের চারপাশে ঘুরেছে, রাডার দিয়ে মাটি স্ক্যান করে লুকানো সব বরফ খুঁজে বের করেছে।",
    art: () => (
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="p1i-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8fd0ff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#8fd0ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="#02040a" />
        <DriftingStars n={120} seed={45} />
        <MarsGlobe cx={800} cy={1180} r={760} id="p1i-mars5" />
        {/* ice found so far, appearing one by one */}
        <IceSpots cx={800} cy={1180} r={760} n={30} seed={11} cls="story-p1i-anim-found" />
        {/* the ship sweeping its radar across the ground */}
        <g className="story-p1i-anim-scan">
          <path d="M800 230 L700 560 L900 560 Z" fill="url(#p1i-beam)" />
          <g transform="translate(800 220)">
            <Wayfarer s={0.55} />
          </g>
        </g>
      </svg>
    ),
  },
  {
    en: "Now the ice map is finished. One day, it will tell families where to build their homes.",
    bn: "এখন বরফের ম্যাপ তৈরি শেষ। একদিন এই ম্যাপ দেখে মানুষ বুঝবে কোথায় বাড়ি বানাতে হবে।",
    art: () => (
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <rect width="1600" height="900" fill="#02040a" />
        <Stars n={120} seed={77} />
        <MarsGlobe cx={800} cy={470} r={340} id="p1i-mars6" />
        {/* the finished map: a fine grid of lines with every ice patch marked */}
        <g clipPath="url(#p1i-mars6-clip)" opacity="0.5" className="story-p1i-anim-map">
          {/* meridians: ellipses of the same height, narrower toward the middle */}
          {[300, 230, 140, 50].map((rx) => (
            <ellipse key={`m${rx}`} cx="800" cy="470" rx={rx} ry="340" fill="none" stroke="#8fd0ff" strokeWidth="1" opacity="0.5" />
          ))}
          {[-240, -120, 0, 120, 240].map((d) => (
            <line key={`p${d}`} x1="440" y1={470 + d} x2="1160" y2={470 + d} stroke="#8fd0ff" strokeWidth="1" opacity="0.5" />
          ))}
        </g>
        <IceSpots cx={800} cy={470} r={340} n={34} seed={11} />
        <g transform="translate(1180 200) rotate(-12)">
          <Wayfarer s={0.5} />
        </g>
        <g opacity="0.6">
          <Particles n={18} seed={13} box={[460, 140, 1140, 800]} dx={[-10, 10]} dy={[-30, -10]} r={[0.8, 1.6]} color="#bfe6ff" dur={[5, 9]} />
        </g>
      </svg>
    ),
  },
];

const CREW = [
  { name: { en: "You · Commander", bn: "তুমি · কমান্ডার" }, face: <Helmet visor="#c98a1f" ring="#f5c04a" /> },
  { name: { en: "Mei · Doctor", bn: "মেই · ডাক্তার" }, face: <Helmet visor="#5a7fa8" ring="#8fd0ff" /> },
  { name: { en: "Tunde · Engineer", bn: "তুন্দে · ইঞ্জিনিয়ার" }, face: <Helmet visor="#8a5a2a" ring="#ff8a4a" /> },
];

/** How long a shot stays when nobody is narrating: enough time to read it. */
const readMs = (text: string) => Math.max(5200, text.length * 62);

export function Intro({ lang, reduceMotion, soundOn, onDone }: { lang: Lang; reduceMotion: boolean; soundOn: boolean; onDone: () => void }) {
  const [shot, setShot] = useState(0);
  const finished = useRef(false);
  const s = SHOTS[shot];
  const text = s[lang];

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    stopNarration();
    onDone();
  }, [onDone]);

  const advance = useCallback(() => {
    stopNarration();
    if (shot + 1 >= SHOTS.length) finish();
    else {
      p1Sound.whoosh();
      setShot(shot + 1);
    }
  }, [shot, finish]);

  // soft music under the whole opening
  useEffect(() => {
    p1Sound.bed("story");
  }, []);
  useEffect(() => () => stopNarration(), []);

  // narrate each shot, then hold a moment and move on by itself
  useEffect(() => {
    let alive = true;
    let hold = 0;
    const moveOn = (wait: number) => {
      hold = window.setTimeout(() => alive && advance(), wait);
    };
    const start = window.setTimeout(() => {
      if (soundOn && canNarrate(lang)) narrate(text, lang, () => moveOn(1400));
      else moveOn(readMs(text));
    }, 700);
    return () => {
      alive = false;
      window.clearTimeout(start);
      window.clearTimeout(hold);
    };
  }, [shot, text, lang, soundOn, advance]);

  // keyboard: → or Enter for the next shot, Escape to skip
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      else if (e.key === "ArrowRight" || (e.key === "Enter" && !(e.target instanceof HTMLButtonElement))) advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, finish]);

  return (
    <div className="story-p1i" onClick={(e) => !(e.target instanceof HTMLButtonElement) && advance()} role="region" aria-label={UI.kicker[lang]}>
      <div className="story-p1i-shot" key={shot}>
        {s.art(reduceMotion)}
        {shot === 3 && (
          <div className="story-p1i-crew">
            {CREW.map((c, n) => (
              <figure key={n} style={{ animationDelay: `${0.5 + n * 1.1}s` }}>
                {c.face}
                <figcaption>{c.name[lang]}</figcaption>
              </figure>
            ))}
            <figure style={{ animationDelay: `${0.5 + 3 * 1.1}s` }}>
              <span className="story-p1i-pip">
                <Pip mood="happy" size={86} />
              </span>
              <figcaption>{lang === "bn" ? "পিপ · শিপের কম্পিউটার" : "Pip · Ship's computer"}</figcaption>
            </figure>
          </div>
        )}
      </div>

      {/* cinematic bars */}
      <div className="story-p1i-bar top" aria-hidden="true" />
      <div className="story-p1i-bar bottom" aria-hidden="true" />

      <span className="story-p1i-kicker">{UI.kicker[lang]}</span>
      <p className="story-p1i-caption" key={`c${shot}`} aria-live="polite">
        {text}
      </p>

      <div className="story-p1i-controls">
        <span className="story-p1i-dots" aria-hidden="true">
          {SHOTS.map((_, n) => (
            <i key={n} className={n === shot ? "on" : n < shot ? "seen" : ""} />
          ))}
        </span>
        <button type="button" className="story-p1i-skip" onClick={finish}>
          {UI.skip[lang]} ▸▸
        </button>
      </div>
    </div>
  );
}
