// PART 1 landing game. Owned by Person 1.
// Just before touchdown the player fires the landing rockets: hold SPACE on a
// keyboard, or press and hold the screen on a phone or tablet. Letting go lets
// Mars' gravity speed the capsule up. Touching down slowly gives a smooth
// landing; too fast gives a bumpy one. The landing only changes how the
// touchdown looks: it never changes the decisions or the hidden numbers, and
// the story always carries on.

import { useEffect, useRef, useState } from "react";
import type { Lang } from "../types";
import { LandingScene } from "./art";

export type LandingResult = "smooth" | "bumpy";

const TEXT = {
  ready: { en: "Get ready to land!", bn: "ল্যান্ড করার জন্য রেডি হও!" },
  holdKey: { en: "Hold SPACE to fire the landing rockets", bn: "ল্যান্ডিং রকেট চালাতে স্পেস চেপে ধরে রাখো" },
  holdTouch: { en: "Press and hold the screen to fire the landing rockets", bn: "ল্যান্ডিং রকেট চালাতে স্ক্রিন চেপে ধরে রাখো" },
  slow: { en: "Slow down! Fire the rockets!", bn: "আস্তে! রকেট চালাও!" },
  good: { en: "Nice and slow...", bn: "আস্তে আস্তে নামছি..." },
  height: { en: "Height", bn: "উচ্চতা" },
  speed: { en: "Speed", bn: "স্পিড" },
  smooth: { en: "Smooth landing!", bn: "আস্তে করে ল্যান্ড করলাম!" },
  bumpy: { en: "Bumpy landing!", bn: "ঝাঁকুনি দিয়ে ল্যান্ড করলাম!" },
  button: { en: "Hold", bn: "চেপে ধরো" },
} as const;

// Physics in "heights per second": the capsule starts at height 1.
const START_SPEED = 0.16;
const GRAVITY = 0.14;
const THRUST = 0.36;
const MAX_UP = -0.05;
const MAX_DOWN = 0.5;
/** Touching down slower than this is a smooth landing. */
const SAFE = 0.16;
const READY_MS = 1600;
const RESULT_MS = 1900;

const isTouch = () => typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;

export function LandingGame({ lang, reduceMotion, onLanded }: { lang: Lang; reduceMotion: boolean; onLanded: (r: LandingResult) => void }) {
  const [alt, setAlt] = useState(1);
  const [speed, setSpeed] = useState(START_SPEED);
  const [firing, setFiring] = useState(false);
  const [phase, setPhase] = useState<"ready" | "fly" | LandingResult>("ready");
  const held = useRef(false);
  const touch = useRef(isTouch());
  const done = useRef(onLanded);
  done.current = onLanded;

  const press = (on: boolean) => {
    held.current = on;
    setFiring(on);
    // pressing during "get ready" starts the descent straight away
    if (on) setPhase((p) => (p === "ready" ? "fly" : p));
  };

  // keyboard: hold Space (Enter works too, for keyboards without a big space bar)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!e.repeat) press(true);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        press(false);
      }
    };
    const blur = () => press(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  // "get ready" pause, then the fall begins by itself
  useEffect(() => {
    if (phase !== "ready") return;
    const t = window.setTimeout(() => setPhase("fly"), READY_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // the descent
  useEffect(() => {
    if (phase !== "fly") return;
    let h = alt;
    let v = speed;
    let last = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      v += (GRAVITY - (held.current ? THRUST : 0)) * dt;
      v = Math.max(MAX_UP, Math.min(MAX_DOWN, v));
      h = Math.min(1, h - v * dt);
      if (h <= 0) {
        setAlt(0);
        setSpeed(v);
        held.current = false;
        setFiring(false);
        setPhase(v <= SAFE ? "smooth" : "bumpy");
        return;
      }
      setAlt(h);
      setSpeed(v);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
    // the loop owns alt and speed while flying
  }, [phase]);

  // show the result for a moment, then hand back to the story
  useEffect(() => {
    if (phase !== "smooth" && phase !== "bumpy") return;
    const t = window.setTimeout(() => done.current(phase), RESULT_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  const landed = phase === "smooth" || phase === "bumpy";
  const tooFast = speed > SAFE;
  const hint = phase === "ready" ? TEXT.ready : landed ? TEXT[phase] : alt < 0.5 && tooFast ? TEXT.slow : alt < 0.5 ? TEXT.good : touch.current ? TEXT.holdTouch : TEXT.holdKey;
  const speedPct = Math.max(0, Math.min(1, speed / MAX_DOWN));

  return (
    <div
      className={`story-p1-landing${phase === "bumpy" && !reduceMotion ? " is-bumpy" : ""}${phase === "smooth" ? " is-smooth" : ""}`}
      onPointerDown={(e) => {
        e.preventDefault();
        press(true);
      }}
      onPointerUp={() => press(false)}
      onPointerCancel={() => press(false)}
      onPointerLeave={() => press(false)}
      onContextMenu={(e) => e.preventDefault()}
      role="application"
      aria-label={touch.current ? TEXT.holdTouch[lang] : TEXT.holdKey[lang]}
    >
      <div className="story-p1-landing-scene">
        <LandingScene alt={alt} thrust={firing || (landed && phase === "smooth")} />
      </div>

      <div className={`story-p1-landing-hint${landed ? " is-result" : ""}${!landed && alt < 0.5 && tooFast ? " is-warn" : ""}`} aria-live="polite">
        {!landed && phase !== "ready" && !touch.current && (
          <span className="story-p1-landing-key" aria-hidden="true">
            SPACE
          </span>
        )}
        <span>{hint[lang]}</span>
      </div>

      {!landed && (
        <div className="story-p1-gauges" aria-hidden="true">
          <div className="story-p1-gauge">
            <span>{TEXT.height[lang]}</span>
            <div className="story-p1-gauge-track tall">
              <i style={{ height: `${alt * 100}%` }} />
            </div>
          </div>
          <div className="story-p1-gauge">
            <span>{TEXT.speed[lang]}</span>
            <div className="story-p1-gauge-track tall">
              <b style={{ bottom: `${(SAFE / MAX_DOWN) * 100}%` }} />
              <i className={tooFast ? "is-fast" : ""} style={{ height: `${speedPct * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      {!landed && touch.current && (
        <div className={`story-p1-hold${firing ? " is-on" : ""}`} aria-hidden="true">
          {TEXT.button[lang]}
        </div>
      )}
    </div>
  );
}
