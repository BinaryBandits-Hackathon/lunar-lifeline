// PART 1: prologue, crisis 1 (decisions 1-2) and the landing. Owned by Person 1.
// Must ask exactly decisions 1 and 2 (onChoose twice), then call onDone().
//
// A full-screen player in the look of the title page. It adds chapter title
// cards, typed-out lines, character voices, synthesized sound and a suspense
// beat at each decision. Sound and animation only describe the scene: nothing
// ever shows or sounds like a right or wrong choice.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pip } from "../../ui/Pip";
import { fill, type Line } from "../core/Beats";
import type { Choice, Lang, PartProps } from "../types";
import { Part1Art } from "./art";
import { PART1_BEATS, PART1_CHAPTERS, type Part1ArtKey } from "./content";
import "./part1.css";
import { p1Sound } from "./sound";
import { hasVoice, hush, say as speakAs, type Speaker } from "./voice";

const UI = {
  part: { en: "Part 1 · The fall", bn: "পার্ট ১ · মঙ্গলে নামা" },
  next: { en: "Next", bn: "পরের" },
  fact: { en: "Real NASA fact", bn: "নাসার আসল তথ্য" },
  source: { en: "Read the NASA source", bn: "নাসার সোর্স দেখো" },
  choose: { en: "Choose one", bn: "একটা বেছে নাও" },
  sound: { en: "Sound", bn: "সাউন্ড" },
  voice: { en: "Voice", bn: "ভয়েস" },
  noVoice: { en: "No voice on this device", bn: "এই ডিভাইসে ভয়েস নেই" },
  who: { pip: { en: "Pip", bn: "পিপ" }, tunde: { en: "Tunde · Engineer", bn: "তুন্দে · ইঞ্জিনিয়ার" }, mei: { en: "Mei · Doctor", bn: "মেই · ডাক্তার" }, earth: { en: "Earth", bn: "পৃথিবী" } },
} as const;

/** Big title cards shown when a new chapter starts (index = first beat). */
const CARDS: Record<number, { kicker: { en: string; bn: string }; title: { en: string; bn: string } }> = {
  0: { kicker: { en: "Part 1", bn: "পার্ট ১" }, title: { en: "The fall", bn: "মঙ্গলে নামা" } },
  6: { kicker: { en: "Crisis 1 · Sol 0", bn: "বিপদ ১ · সোল ০" }, title: { en: "The broken ship", bn: "ভাঙা স্পেসশিপ" } },
  9: { kicker: { en: "Sol 0", bn: "সোল ০" }, title: { en: "The landing", bn: "ল্যান্ডিং" } },
};
const CARD_MS = 2400;
const LOCK_MS = 1500;
const HIT_BEAT = 2;
const TYPE_MS = 26;

const store = {
  get: (k: string) => {
    try {
      return window.localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      window.localStorage.setItem(k, v);
    } catch {
      // private mode: the switch still works for this visit
    }
  },
};

/** Splits text into letters a reader sees (keeps Bangla vowel signs whole). */
function graphemes(text: string, lang: Lang): string[] {
  try {
    return Array.from(new Intl.Segmenter(lang, { granularity: "grapheme" }).segment(text), (s) => s.segment);
  } catch {
    return Array.from(text);
  }
}

/** Small portrait of Tunde in his helmet, drawn in code like Pip. */
function TundeFace() {
  return (
    <svg className="story-p1-face" viewBox="0 0 64 64" role="img" aria-label="Tunde">
      <circle cx="32" cy="32" r="30" fill="#1b2433" stroke="#f5c04a" strokeWidth="2" />
      <circle cx="32" cy="30" r="18" fill="#e9ecf2" />
      <path d="M18 30 A14 12 0 0 1 46 30 L46 33 A14 9 0 0 1 18 33 Z" fill="#c98a1f" />
      <path d="M22 28 A10 8 0 0 1 32 22" fill="none" stroke="#ffe7a8" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 58 Q32 42 50 58" fill="#d7dbe3" />
    </svg>
  );
}

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="currentColor" />
      {on ? <path d="M16 8.5 Q19 12 16 15.5 M18.5 6 Q23 12 18.5 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /> : <path d="M16 9 L21 15 M21 9 L16 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  );
}

function MouthIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="5" y="4" width="14" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 19 L12 16 L15 19" fill="none" stroke="currentColor" strokeWidth="1.8" />
      {on ? <path d="M9 10 Q12 13 15 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /> : <path d="M9 10 H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  );
}

type Phase = "card" | "ask" | "locking" | "react";

export function Part1({ lang, readAloud, reduceMotion, playerName, choices, onChoose, onDone }: PartProps) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<Choice | null>(null);
  const [phase, setPhase] = useState<Phase>(CARDS[0] ? "card" : "ask");
  const [typed, setTyped] = useState(0);
  const [talking, setTalking] = useState(false);
  const [soundOn, setSoundOn] = useState(() => store.get("p1-sound") !== "off");
  const [voiceOn, setVoiceOn] = useState(() => readAloud || store.get("p1-voice") !== "off");
  const voiceAvailable = useMemo(() => hasVoice(lang), [lang]);
  const timers = useRef<number[]>([]);

  const beat = PART1_BEATS[i];
  const words = (l: Line) => fill(l[lang], playerName);
  const artKey = ([...PART1_BEATS.slice(0, i + 1)].reverse().find((b) => b.art)?.art ?? "ship") as Part1ArtKey;
  const chapter = [...PART1_CHAPTERS].reverse().find((c) => c.from <= i) ?? PART1_CHAPTERS[0];
  const card = phase === "card" ? CARDS[i] : undefined;

  // what is on screen now, and who says it
  const text = !beat
    ? ""
    : beat.kind === "line"
      ? words(beat.line)
      : beat.kind === "fact"
        ? words(beat.fact)
        : picked && phase === "react"
          ? words(beat[picked === "A" ? "a" : "b"].reaction)
          : words(beat.question);
  const speaker: Speaker = !beat ? "narrator" : beat.kind === "line" ? (beat.line.who ?? "narrator") : beat.kind === "fact" ? "pip" : phase === "react" ? "narrator" : "pip";
  const letters = useMemo(() => graphemes(text, lang), [text, lang]);
  const doneTyping = reduceMotion || typed >= letters.length;
  const pipMood = i < HIT_BEAT ? "happy" : artKey === "descentChute" || artKey === "descentLand" || beat?.kind === "fact" ? "calm" : "alert";
  // The scene only redraws when it changes, not on every typed letter.
  const landing = choices[1] ?? null;
  const scene = useMemo(() => <Part1Art k={artKey} landing={landing} />, [artKey, landing]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // sound switches
  useEffect(() => {
    p1Sound.setEnabled(soundOn);
    store.set("p1-sound", soundOn ? "on" : "off");
  }, [soundOn]);
  useEffect(() => {
    store.set("p1-voice", voiceOn ? "on" : "off");
    if (!voiceOn) hush();
  }, [voiceOn]);
  useEffect(
    () => () => {
      p1Sound.stopAll();
      hush();
    },
    [],
  );

  // chapter title cards: show, play the sting, then move on by themselves
  useEffect(() => {
    if (phase !== "card") return;
    p1Sound.sting();
    const t = window.setTimeout(() => setPhase("ask"), reduceMotion ? 1400 : CARD_MS);
    return () => window.clearTimeout(t);
  }, [phase, i, reduceMotion]);

  // the scene's sound: background bed plus the big moments
  useEffect(() => {
    if (artKey === "ship") p1Sound.bed("ship");
    if (artKey === "shipHit") {
      p1Sound.bed("ship");
      p1Sound.crack();
      p1Sound.alarm(4);
    }
    if (artKey === "orbit") {
      p1Sound.stopAlarm();
      p1Sound.bed("orbit");
      p1Sound.hiss(choices[0] === "B" ? "off" : choices[0] === "A" ? "loud" : "soft");
    }
    if (artKey === "descentHeat") {
      p1Sound.bed("heat");
      p1Sound.hiss(choices[0] === "A" ? "loud" : "off");
    }
    if (artKey === "descentChute") {
      p1Sound.hiss("off");
      p1Sound.chute();
      p1Sound.bed("wind");
    }
    if (artKey === "descentLand") {
      p1Sound.touchdown(choices[1] === "B");
      p1Sound.bed("surface");
    }
  }, [artKey]);

  // the leak reacts to decision 1 as soon as it is made
  useEffect(() => {
    if (choices[0] === "A") p1Sound.hiss("loud");
    if (choices[0] === "B") p1Sound.hiss("off");
  }, [choices[0]]);

  useEffect(() => {
    if (beat?.kind === "fact" && phase === "ask") p1Sound.chime();
  }, [beat, phase]);

  // type the line out, letter by letter
  useEffect(() => {
    setTyped(0);
    if (phase === "card" || phase === "locking" || reduceMotion) return;
    const t = window.setInterval(() => setTyped((n) => (n >= letters.length ? n : n + 1)), TYPE_MS);
    return () => window.clearInterval(t);
  }, [text, phase, reduceMotion, letters.length]);

  // voices: Pip chirps first, then each character speaks in their own voice
  useEffect(() => {
    if (phase === "card" || phase === "locking" || !text) return;
    setTalking(true);
    if (speaker === "pip") p1Sound.blip();
    const end = () => setTalking(false);
    const t = window.setTimeout(
      () => {
        if (voiceOn && voiceAvailable) speakAs(text, speaker, lang, end);
        else window.setTimeout(end, Math.min(4000, letters.length * TYPE_MS + 300));
      },
      speaker === "pip" ? 260 : 60,
    );
    return () => {
      window.clearTimeout(t);
      hush();
    };
  }, [text, phase, voiceOn]);

  // suspense while a decision waits
  const deciding = beat?.kind === "decide" && phase === "ask" && doneTyping;
  useEffect(() => {
    if (deciding) p1Sound.startSuspense();
    else p1Sound.stopSuspense();
  }, [deciding]);

  const next = useCallback(() => {
    p1Sound.unlock();
    if (phase === "card") {
      setPhase("ask");
      return;
    }
    if (!doneTyping) {
      setTyped(letters.length);
      return;
    }
    p1Sound.tick();
    setPicked(null);
    if (i + 1 >= PART1_BEATS.length) {
      p1Sound.stopAll();
      hush();
      onDone();
      return;
    }
    const n = i + 1;
    setI(n);
    setPhase(CARDS[n] ? "card" : "ask");
  }, [phase, doneTyping, letters.length, i, onDone]);

  const choose = (c: Choice) => {
    if (picked || !deciding) return;
    p1Sound.unlock();
    onChoose(c);
    setPicked(c);
    setPhase("locking");
    p1Sound.stopSuspense();
    p1Sound.lockIn();
    hush();
    later(() => setPhase("react"), reduceMotion ? 500 : LOCK_MS);
  };

  // keyboard: Enter, Space or → moves on; A/B or 1/2 picks an option
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || !beat) return;
      const k = e.key.toLowerCase();
      if (beat.kind === "decide" && phase === "ask") {
        if (doneTyping && (k === "a" || k === "1")) choose("A");
        if (doneTyping && (k === "b" || k === "2")) choose("B");
        if (!doneTyping && (k === "enter" || k === " " || k === "arrowright")) {
          e.preventDefault();
          setTyped(letters.length);
        }
        return;
      }
      if (phase !== "locking" && (k === "arrowright" || ((k === "enter" || k === " ") && !(e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement)))) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!beat) return null;

  const who = beat.kind === "line" ? beat.line.who : beat.kind === "decide" && phase === "ask" ? "pip" : undefined;
  const narration = !who && beat.kind !== "fact";
  const shown = reduceMotion ? text : letters.slice(0, typed).join("");
  const rest = reduceMotion ? "" : letters.slice(typed).join("");
  const showDialogue = phase !== "card" && phase !== "locking";
  const showOptions = beat.kind === "decide" && (phase === "ask" || phase === "locking") && (doneTyping || phase === "locking");
  const rootClass = ["story-p1", reduceMotion && "story-p1-still", deciding && "is-deciding", phase === "locking" && "is-locking", `scene-${artKey}`].filter(Boolean).join(" ");

  return (
    <div className={rootClass} lang={lang === "bn" ? "bn" : "en"} onPointerDown={() => p1Sound.unlock()}>
      <div className="story-p1-scene" aria-hidden="true">
        <div className="story-p1-scene-in" key={artKey}>
          {scene}
        </div>
      </div>
      {artKey === "shipHit" && <div className="story-p1-flash" key="flash" aria-hidden="true" />}
      <div className="story-p1-vignette" aria-hidden="true" />
      <div className="story-p1-pulse" aria-hidden="true" />

      <header className="story-p1-top">
        <span className="story-p1-brand">{UI.part[lang]}</span>
        <span className="story-p1-tab">{chapter[lang]}</span>
        <span className="story-p1-switches">
          <button type="button" className="story-p1-switch" aria-pressed={soundOn} onClick={() => setSoundOn((v) => !v)} title={UI.sound[lang]}>
            <SpeakerIcon on={soundOn} />
            <span>{UI.sound[lang]}</span>
          </button>
          <button
            type="button"
            className="story-p1-switch"
            aria-pressed={voiceOn && voiceAvailable}
            disabled={!voiceAvailable}
            onClick={() => setVoiceOn((v) => !v)}
            title={voiceAvailable ? UI.voice[lang] : UI.noVoice[lang]}
          >
            <MouthIcon on={voiceOn && voiceAvailable} />
            <span>{UI.voice[lang]}</span>
          </button>
        </span>
      </header>

      {card && (
        <button type="button" className="story-p1-card" key={`card-${i}`} onClick={next} aria-label={`${card.kicker[lang]}: ${card.title[lang]}`}>
          <span className="story-p1-card-kicker">{card.kicker[lang]}</span>
          <span className="story-p1-card-title">{card.title[lang]}</span>
          <span className="story-p1-card-rule" />
        </button>
      )}

      {showOptions && beat.kind === "decide" && (
        <div className="story-p1-options" role="group" aria-label={UI.choose[lang]}>
          {(["A", "B"] as Choice[]).map((c) => {
            const o = beat[c === "A" ? "a" : "b"];
            const state = phase === "locking" ? (picked === c ? " is-picked" : " is-other") : "";
            return (
              <button key={c} type="button" className={`story-p1-option${state}`} onClick={() => choose(c)} autoFocus={c === "A"} disabled={phase === "locking"}>
                <span className="story-p1-key" aria-hidden="true">{c}</span>
                <span className="story-p1-option-text">
                  <strong>{words(o.label)}</strong>
                  <span>{words(o.detail)}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {showDialogue && beat.kind === "fact" && (
        <section className="story-p1-fact" key={i} onClick={(e) => {
          if (!doneTyping && !(e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement)) setTyped(letters.length);
        }}>
          <span className="story-p1-fact-head">{UI.fact[lang]}</span>
          <p>
            <span className="story-p1-sr">{text}</span>
            <span aria-hidden="true">
              {shown}
              <span className="story-p1-ghost">{rest}</span>
            </span>
          </p>
          <div className="story-p1-row">
            <a href={beat.source} target="_blank" rel="noreferrer" className="story-p1-source">
              {UI.source[lang]} ↗
            </a>
            <button type="button" className="story-p1-next" onClick={next} autoFocus>
              {UI.next[lang]}
            </button>
          </div>
        </section>
      )}

      {showDialogue && beat.kind !== "fact" && (
        <section className={`story-p1-dialogue${narration ? " is-narration" : ""}${talking ? " is-talking" : ""}`} key={`${i}-${phase}`} aria-live="polite" onClick={(e) => {
            // a click anywhere on the bar finishes the typing (the Next button keeps its own job)
            if (!doneTyping && !(e.target instanceof HTMLButtonElement)) setTyped(letters.length);
          }}>
          {who === "pip" && (
            <span className="story-p1-avatar">
              <span className="story-p1-waves" aria-hidden="true" />
              <Pip mood={pipMood} size={64} />
            </span>
          )}
          {who === "tunde" && (
            <span className="story-p1-avatar">
              <span className="story-p1-waves" aria-hidden="true" />
              <TundeFace />
            </span>
          )}
          <div className="story-p1-words">
            {who && <span className="story-p1-who">{UI.who[who][lang]}</span>}
            <p className="story-p1-text">
              <span className="story-p1-sr">{text}</span>
              <span aria-hidden="true">
                {shown}
                <span className="story-p1-ghost">{rest}</span>
              </span>
            </p>
          </div>
          {(beat.kind !== "decide" || phase === "react") && (
            <button type="button" className="story-p1-next" onClick={next} autoFocus>
              {UI.next[lang]}
            </button>
          )}
        </section>
      )}
    </div>
  );
}
