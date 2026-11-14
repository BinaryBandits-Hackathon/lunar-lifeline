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
import "./part1.css";

const UI = {
  part: { en: "Part 1 · The fall", bn: "পার্ট ১ · মঙ্গলে নামা" },
  next: { en: "Next", bn: "পরের" },
  fact: { en: "Real NASA fact", bn: "নাসার আসল তথ্য" },
  source: { en: "Read the NASA source", bn: "নাসার সোর্স দেখো" },
  choose: { en: "Choose one", bn: "একটা বেছে নাও" },
  who: { pip: { en: "Pip", bn: "পিপ" }, tunde: { en: "Tunde · Engineer", bn: "তুন্দে · ইঞ্জিনিয়ার" }, mei: { en: "Mei · Doctor", bn: "মেই · ডাক্তার" }, earth: { en: "Earth", bn: "পৃথিবী" } },
} as const;

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
  const beat = PART1_BEATS[i];
  const say = (l: Line) => fill(l[lang], playerName);

  const artKey = ([...PART1_BEATS.slice(0, i + 1)].reverse().find((b) => b.art)?.art ?? "ship") as Part1ArtKey;
  const chapter = [...PART1_CHAPTERS].reverse().find((c) => c.from <= i) ?? PART1_CHAPTERS[0];
  // After the meteoroid hits, Pip stays on alert until touchdown.
  const pipMood = i < 2 ? "happy" : artKey === "descentChute" || artKey === "descentLand" || beat?.kind === "fact" ? "calm" : "alert";

  const next = useCallback(() => {
    setPicked(null);
    if (i + 1 >= PART1_BEATS.length) onDone();
    else setI(i + 1);
  }, [i, onDone]);

  const choose = (c: Choice) => {
    if (picked) return;
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
    if (readAloud && spoken) speak(spoken);
  }, [spoken, readAloud]);
  useEffect(() => () => stopSpeaking(), []);

  // Keyboard: Enter, Space or → moves on; A/B or 1/2 picks an option.
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
  const text = spoken;

  return (
    <div className={`story-p1${reduceMotion ? " story-p1-still" : ""}`} lang={lang === "bn" ? "bn" : "en"}>
      <div className="story-p1-scene" aria-hidden="true">
        <div className="story-p1-scene-in" key={artKey}>
          <Part1Art k={artKey} landing={choices[1] ?? null} />
        </div>
      </div>
      <div className="story-p1-vignette" aria-hidden="true" />

      <header className="story-p1-top">
        <span className="story-p1-brand">{UI.part[lang]}</span>
        <span className="story-p1-tab">{chapter[lang]}</span>
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
