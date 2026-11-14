// PART 2, sols 4-8: crisis 2 (dust storm, decisions 3-4), crisis 3 (bad air,
// decisions 5-6) and crisis 4 (solar storm, decisions 7-8).
// Must ask exactly decisions 3-8 (onChoose six times, in order), then onDone().
//
// A full-screen player in the same look as Part 1 (it shares Part 1's styles,
// sound engine and crew portraits). It never shows or sounds like a right or
// wrong choice.

import { useCallback, useEffect, useMemo, useState } from "react";
import { speak, stopSpeaking } from "../../services/speech";
import { Pip } from "../../ui/Pip";
import { fill, type Line } from "../core/Beats";
import "../part1/part1.css";
import { MeiFace, TundeFace } from "../part1/portraits";
import { p1Sound } from "../part1/sound";
import type { Choice, PartProps } from "../types";
import { Part2Art } from "./art";
import { PART2_BEATS, PART2_CHAPTERS, type Part2ArtKey } from "./content";
import "./part2.css";

const UI = {
  part: { en: "Part 2 · Surviving Mars", bn: "পার্ট ২ · মঙ্গলে টিকে থাকা" },
  next: { en: "Next", bn: "পরের" },
  fact: { en: "Real NASA fact", bn: "নাসার আসল তথ্য" },
  source: { en: "Read the NASA source", bn: "নাসার সোর্স দেখো" },
  choose: { en: "Choose one", bn: "একটা বেছে নাও" },
  sound: { en: "Sound", bn: "সাউন্ড" },
  who: {
    pip: { en: "Pip", bn: "পিপ" },
    tunde: { en: "Tunde · Engineer", bn: "তুন্দে · ইঞ্জিনিয়ার" },
    mei: { en: "Mei · Doctor", bn: "মেই · ডাক্তার" },
    earth: { en: "Message from Earth", bn: "পৃথিবী থেকে মেসেজ" },
  },
} as const;

const SOUND_KEY = "p1-sound";
const storedSound = () => {
  try {
    return window.localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
};

/** Radio dish: the face of a message from Earth. */
function EarthFace() {
  return (
    <svg className="story-p1-face" viewBox="0 0 64 64" role="img" aria-label="Earth">
      <circle cx="32" cy="32" r="30" fill="#1b2433" stroke="#8fd0ff" strokeWidth="2" />
      <path d="M18 40 A18 18 0 0 1 40 18 Z" fill="#d7dbe3" />
      <line x1="29" y1="29" x2="40" y2="18" stroke="#56627a" strokeWidth="2" />
      <path d="M22 44 L30 36 L34 50 Z" fill="#9aa1ad" />
      <path d="M42 22 Q48 28 44 36 M46 16 Q56 28 48 42" fill="none" stroke="#8fd0ff" strokeWidth="2.4" strokeLinecap="round" />
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

export function Part2({ lang, readAloud, reduceMotion, playerName, onChoose, onDone }: PartProps) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<Choice | null>(null);
  const [soundOn, setSoundOn] = useState(storedSound);
  const beat = PART2_BEATS[i];
  const say = (l: Line) => fill(l[lang], playerName);

  const artKey = ([...PART2_BEATS.slice(0, i + 1)].reverse().find((b) => b.art)?.art ?? "dustStorm") as Part2ArtKey;
  const chapter = [...PART2_CHAPTERS].reverse().find((c) => c.from <= i) ?? PART2_CHAPTERS[0];
  const scene = useMemo(() => <Part2Art k={artKey} />, [artKey]);
  const pipMood = artKey === "dustClear" ? "happy" : artKey === "warning" || artKey === "solarStorm" || artKey === "dustStorm" ? "alert" : "calm";

  const next = useCallback(() => {
    p1Sound.unlock();
    p1Sound.tick();
    setPicked(null);
    if (i + 1 >= PART2_BEATS.length) {
      p1Sound.stopAll();
      onDone();
    } else setI(i + 1);
  }, [i, onDone]);

  const choose = (c: Choice) => {
    if (picked) return;
    p1Sound.unlock();
    p1Sound.tick();
    onChoose(c);
    setPicked(c);
  };

  const text = !beat
    ? ""
    : beat.kind === "line"
      ? say(beat.line)
      : beat.kind === "fact"
        ? say(beat.fact)
        : picked
          ? say(beat[picked === "A" ? "a" : "b"].reaction)
          : say(beat.question);

  // ---------- sound ----------
  useEffect(() => {
    p1Sound.setEnabled(soundOn);
    try {
      window.localStorage.setItem(SOUND_KEY, soundOn ? "on" : "off");
    } catch {
      // private mode: the switch still works for this visit
    }
  }, [soundOn]);
  useEffect(
    () => () => {
      p1Sound.stopAll();
      stopSpeaking();
    },
    [],
  );
  useEffect(() => {
    p1Sound.geiger(0);
    if (artKey === "dustStorm") p1Sound.bed("wind");
    if (artKey === "dustClear") {
      p1Sound.whoosh();
      p1Sound.bed("surface");
    }
    if (artKey === "badAir") {
      p1Sound.bed("ship"); // the hum of life support inside
      p1Sound.alarm(2);
    }
    if (artKey === "warning") {
      p1Sound.bed("surface");
      p1Sound.blip();
    }
    if (artKey === "solarStorm") {
      p1Sound.bed("orbit");
      p1Sound.geiger(6); // the radiation counter clicking
    }
  }, [artKey]);
  const pipSpeaks = (beat?.kind === "line" && beat.line.who === "pip") || (beat?.kind === "decide" && !picked);
  useEffect(() => {
    if (pipSpeaks) p1Sound.blip();
    if (beat?.kind === "fact") p1Sound.chime();
  }, [i, pipSpeaks, beat?.kind]);
  useEffect(() => {
    if (readAloud && text) speak(text);
  }, [text, readAloud]);

  // keyboard: → moves on; A/B or 1/2 picks an option
  const canAdvance = beat && (beat.kind !== "decide" || picked !== null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || !beat) return;
      const k = e.key.toLowerCase();
      if (beat.kind === "decide" && !picked) {
        if (k === "a" || k === "1") choose("A");
        if (k === "b" || k === "2") choose("B");
        return;
      }
      if (k === "arrowright" && canAdvance) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!beat) return null;
  const who = beat.kind === "line" ? beat.line.who : beat.kind === "decide" && !picked ? "pip" : undefined;
  const narration = !who && beat.kind !== "fact";

  return (
    <div className={`story-p1 story-p2${reduceMotion ? " story-p1-still" : ""}`} lang={lang === "bn" ? "bn" : "en"} onPointerDown={() => p1Sound.unlock()}>
      <div className="story-p1-scene" aria-hidden="true">
        <div className="story-p1-scene-in" key={artKey}>
          {scene}
        </div>
      </div>
      <div className="story-p1-vignette" aria-hidden="true" />

      <header className="story-p1-top">
        <span className="story-p1-brand">{UI.part[lang]}</span>
        <span className="story-p1-tab">{chapter[lang]}</span>
        <span className="story-p1-switches">
          <button type="button" className="story-p1-switch" aria-pressed={soundOn} onClick={() => setSoundOn((v) => !v)} title={UI.sound[lang]}>
            <SpeakerIcon on={soundOn} />
            <span>{UI.sound[lang]}</span>
          </button>
        </span>
      </header>

      {beat.kind === "decide" && !picked && (
        <div className="story-p1-options" role="group" aria-label={UI.choose[lang]}>
          {(["A", "B"] as Choice[]).map((c) => {
            const o = beat[c === "A" ? "a" : "b"];
            return (
              <button key={c} type="button" className="story-p1-option" onClick={() => choose(c)} autoFocus={c === "A"}>
                <span className="story-p1-key" aria-hidden="true">{c}</span>
                <span className="story-p1-option-text">
                  <strong>{say(o.label)}</strong>
                  <span>{say(o.detail)}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {beat.kind === "fact" ? (
        <section className="story-p1-fact" key={i}>
          <span className="story-p1-fact-head">{UI.fact[lang]}</span>
          <p>{text}</p>
          <div className="story-p1-row">
            <a href={beat.source} target="_blank" rel="noreferrer" className="story-p1-source">
              {UI.source[lang]} ↗
            </a>
            <button type="button" className="story-p1-next" onClick={next} autoFocus>
              {UI.next[lang]}
            </button>
          </div>
        </section>
      ) : (
        <section className={`story-p1-dialogue${narration ? " is-narration" : ""}`} key={`${i}-${picked ?? ""}`} aria-live="polite">
          {who && (
            <span className="story-p1-avatar">
              {who === "pip" ? <Pip mood={pipMood} size={64} /> : who === "mei" ? <MeiFace /> : who === "tunde" ? <TundeFace /> : <EarthFace />}
            </span>
          )}
          <div className="story-p1-words">
            {who && <span className="story-p1-who">{UI.who[who][lang]}</span>}
            <p className="story-p1-text">{text}</p>
          </div>
          {canAdvance && (
            <button type="button" className="story-p1-next" onClick={next} autoFocus>
              {UI.next[lang]}
            </button>
          )}
        </section>
      )}
    </div>
  );
}
