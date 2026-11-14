// PART 1: prologue, crisis 1 (decisions 1-2) and the landing. Owned by Person 1.
// Must ask exactly decisions 1 and 2 (onChoose twice), then call onDone().
//
// A full-screen player in the look of the title page: the scene fills the
// window, a slim dialogue bar sits at the bottom with Pip, and decisions are
// two neutral cards. It never shows whether a choice was good or bad.

import { useCallback, useEffect, useState } from "react";
import { speak, stopSpeaking } from "../../services/speech";
import { Pip } from "../../ui/Pip";
import { fill, type Line } from "../core/Beats";
import type { Choice, PartProps } from "../types";
import { Part1Art } from "./art";
import { PART1_BEATS, PART1_CHAPTERS, type Part1ArtKey } from "./content";
import { LandingGame, type LandingResult } from "./landing";
import { Intro } from "./intro";
import { p1Sound } from "./sound";
import "./part1.css";

const UI = {
  part: { en: "Part 1 · The fall", bn: "পার্ট ১ · মঙ্গলে নামা" },
  next: { en: "Next", bn: "পরের" },
  fact: { en: "Real NASA fact", bn: "নাসার আসল তথ্য" },
  source: { en: "Read the NASA source", bn: "নাসার সোর্স দেখো" },
  choose: { en: "Choose one", bn: "একটা বেছে নাও" },
  sound: { en: "Sound", bn: "সাউন্ড" },
  who: { pip: { en: "Pip", bn: "পিপ" }, tunde: { en: "Tunde · Engineer", bn: "তুন্দে · ইঞ্জিনিয়ার" }, mei: { en: "Mei · Doctor", bn: "মেই · ডাক্তার" }, earth: { en: "Earth", bn: "পৃথিবী" } },
} as const;

/** The touchdown line ("Rockets firing... touchdown!"), where the landing game plays. */
const TOUCHDOWN = PART1_BEATS.findIndex((b) => b.art === "descentLand");

/** The sound switch remembers its setting on this device. */
const SOUND_KEY = "p1-sound";
function storedSound(): boolean {
  try {
    return window.localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="currentColor" />
      {on ? (
        <path d="M16 8.5 Q19 12 16 15.5 M18.5 6 Q23 12 18.5 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path d="M16 9 L21 15 M21 9 L16 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
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

export function Part1({ lang, readAloud, reduceMotion, playerName, choices, onChoose, onDone }: PartProps) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<Choice | null>(null);
  // the landing game runs once, on the touchdown line, before the line shows
  const [landed, setLanded] = useState<LandingResult | null>(null);
  const beat = PART1_BEATS[i];
  const landing = i === TOUCHDOWN && landed === null;
  const [soundOn, setSoundOn] = useState(storedSound);
  // the backstory opening plays first, then the prologue
  const [introDone, setIntroDone] = useState(false);
  const say = (l: Line) => fill(l[lang], playerName);

  const artKey = ([...PART1_BEATS.slice(0, i + 1)].reverse().find((b) => b.art)?.art ?? "ship") as Part1ArtKey;
  const chapter = [...PART1_CHAPTERS].reverse().find((c) => c.from <= i) ?? PART1_CHAPTERS[0];
  // After the meteoroid hits, Pip stays on alert until touchdown.
  const pipMood = i < 2 ? "happy" : artKey === "descentChute" || artKey === "descentLand" || beat?.kind === "fact" ? "calm" : "alert";

  const next = useCallback(() => {
    p1Sound.unlock();
    p1Sound.tick();
    setPicked(null);
    if (i + 1 >= PART1_BEATS.length) onDone();
    else setI(i + 1);
  }, [i, onDone]);

  const choose = (c: Choice) => {
    if (picked) return;
    p1Sound.unlock();
    p1Sound.tick();
    onChoose(c);
    setPicked(c);
  };

  const spoken = !beat
    ? ""
    : beat.kind === "line"
      ? say(beat.line)
      : beat.kind === "fact"
        ? say(beat.fact)
        : picked
          ? say(beat[picked === "A" ? "a" : "b"].reaction)
          : say(beat.question);

  useEffect(() => {
    if (readAloud && spoken && !landing && introDone) speak(spoken);
  }, [spoken, readAloud, landing, introDone]);
  useEffect(() => () => stopSpeaking(), []);

  // ---------- sound ----------
  useEffect(() => {
    p1Sound.setEnabled(soundOn);
    try {
      window.localStorage.setItem(SOUND_KEY, soundOn ? "on" : "off");
    } catch {
      // private mode: the switch still works for this visit
    }
  }, [soundOn]);
  useEffect(() => () => p1Sound.stopAll(), []);

  // each scene has its own background sound, plus the big moments
  useEffect(() => {
    if (!introDone) return;
    if (artKey === "ship") p1Sound.bed("ship");
    if (artKey === "shipHit") {
      p1Sound.bed("ship");
      p1Sound.crack();
      p1Sound.alarm(4);
    }
    if (artKey === "orbit") {
      p1Sound.stopAlarm();
      p1Sound.bed("orbit");
      p1Sound.hiss("soft");
    }
    if (artKey === "descentHeat") p1Sound.bed("heat");
    if (artKey === "descentChute") {
      p1Sound.hiss("off");
      p1Sound.chute();
      p1Sound.bed("wind");
    }
  }, [artKey, introDone]);

  // the hiss follows the story: louder after "Land right away", gone after the patch
  useEffect(() => {
    if (choices[0] === "A") p1Sound.hiss("loud");
    if (choices[0] === "B") p1Sound.hiss("off");
  }, [choices[0]]);

  // after the landing game, only the quiet wind of the surface
  useEffect(() => {
    if (landed) p1Sound.bed("surface");
  }, [landed]);

  // Pip chirps when he speaks; the NASA fact gets a chime
  const pipSpeaks = introDone && !landing && ((beat?.kind === "line" && beat.line.who === "pip") || (beat?.kind === "decide" && !picked));
  useEffect(() => {
    if (pipSpeaks) p1Sound.blip();
    if (beat?.kind === "fact") p1Sound.chime();
  }, [i, pipSpeaks, beat?.kind]);

  // Keyboard: Enter, Space or → moves on; A/B or 1/2 picks an option.
  const canAdvance = beat && (beat.kind !== "decide" || picked !== null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || !beat || landing || !introDone) return;
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
  const text = spoken;

  return (
    <div className={`story-p1${reduceMotion ? " story-p1-still" : ""}`} lang={lang === "bn" ? "bn" : "en"} onPointerDown={() => p1Sound.unlock()}>
      <div className="story-p1-scene" aria-hidden="true">
        <div className={`story-p1-scene-in${landed === "bumpy" && i === TOUCHDOWN ? " story-p1-anim-shake" : ""}`} key={artKey}>
          <Part1Art k={artKey} />
        </div>
      </div>
      <div className="story-p1-vignette" aria-hidden="true" />
      {!introDone && <Intro lang={lang} reduceMotion={reduceMotion} soundOn={soundOn} onDone={() => setIntroDone(true)} />}
      {landing && <LandingGame lang={lang} reduceMotion={reduceMotion} onLanded={setLanded} />}

      <header className="story-p1-top">
        {introDone && <span className="story-p1-brand">{UI.part[lang]}</span>}
        {introDone && <span className="story-p1-tab">{chapter[lang]}</span>}
        <span className="story-p1-switches">
          <button type="button" className="story-p1-switch" aria-pressed={soundOn} onClick={() => setSoundOn((v) => !v)} title={UI.sound[lang]}>
            <SpeakerIcon on={soundOn} />
            <span>{UI.sound[lang]}</span>
          </button>
        </span>
      </header>

      {introDone && !landing && beat.kind === "decide" && !picked && (
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

      {!introDone || landing ? null : beat.kind === "fact" ? (
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
          {who === "pip" && (
            <span className="story-p1-avatar">
              <Pip mood={pipMood} size={64} />
            </span>
          )}
          {who === "tunde" && (
            <span className="story-p1-avatar">
              <TundeFace />
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
