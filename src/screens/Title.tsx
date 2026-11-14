import { useState } from "react";
import { canSkipIntro } from "../engine/flow";
import { NasaData } from "../ui/NasaData";
import { canSpeak } from "../services/speech";
import { Pip } from "../ui/Pip";
import type { ScreenProps } from "../ui/screen";
import { RankCard } from "./Academy";

/** Mission emblem: a little rocket on an orange medallion. */
function Emblem() {
  return (
    <svg className="title-emblem" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id="emblemFace" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#ffb070" />
          <stop offset="0.6" stopColor="#e2672a" />
          <stop offset="1" stopColor="#8f3414" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="#3a1608" />
      <circle cx="60" cy="60" r="56" fill="none" stroke="#c4521f" strokeWidth="3" />
      <circle cx="60" cy="60" r="44" fill="url(#emblemFace)" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx={60 + 50 * Math.cos((a * Math.PI) / 180)} cy={60 + 50 * Math.sin((a * Math.PI) / 180)} r="1.8" fill="#ffcf8a" />
      ))}
      <g transform="rotate(-35 60 60)">
        <path d="M60 24 Q72 38 72 62 L72 80 L48 80 L48 62 Q48 38 60 24 Z" fill="#fff4e4" stroke="#7a2c0e" strokeWidth="2" />
        <circle cx="60" cy="52" r="6" fill="#2a3446" stroke="#7a2c0e" strokeWidth="2" />
        <path d="M48 70 L38 86 L48 82 Z M72 70 L82 86 L72 82 Z" fill="#c8321f" stroke="#7a2c0e" strokeWidth="1.5" />
        <path d="M52 82 Q60 100 68 82 Z" fill="#ffd36a" />
      </g>
    </svg>
  );
}

export function Title({ state, dispatch }: ScreenProps) {
  const { settings } = state;
  const commander = state.level === "commander";
  const [showData, setShowData] = useState(false);
  const toggle = (key: "readAloud" | "reduceMotion") => dispatch({ type: "SET_SETTING", key, value: !settings[key] });

  return (
    <main className="screen title-screen">
      {/* the stage: stars and a slowly turning Mars */}
      <div className="title-space" aria-hidden="true">
        <div className="title-mars">
          <div className="mars-surface" />
          <div className="mars-shade" />
        </div>
      </div>

      <div className="title-tab">NASA Space Apps 2026</div>

      <section className="title-panel" aria-labelledby="game-title">
        <Emblem />
        <h1 id="game-title" className="title-name">Lunar Life</h1>
        <p className="title-studio">by Vantaloc Space</p>

        {state.career.points > 0 || state.career.missions.length > 0 ? <RankCard points={state.career.points} compact /> : null}

        <div className="title-rule" />

        <ul className="title-rows">
          <li>
            <span className="row-key">Level</span>
            <span className="row-choice" role="group" aria-label="Level">
              <button type="button" aria-pressed={!commander} onClick={() => dispatch({ type: "SET_LEVEL", level: "cadet" })}>
                Cadet
              </button>
              <button type="button" aria-pressed={commander} onClick={() => dispatch({ type: "SET_LEVEL", level: "commander" })}>
                Commander
              </button>
            </span>
          </li>
          <li>
            <span className="row-key">Read to me</span>
            <button type="button" className="row-value" aria-pressed={settings.readAloud} disabled={!canSpeak()} onClick={() => toggle("readAloud")}>
              {!canSpeak() ? "Not available" : settings.readAloud ? "On" : "Off"}
            </button>
          </li>
          <li>
            <span className="row-key">Reduce motion</span>
            <button type="button" className="row-value" aria-pressed={settings.reduceMotion} onClick={() => toggle("reduceMotion")}>
              {settings.reduceMotion ? "On" : "Off"}
            </button>
          </li>
          <li>
            <span className="row-key">Training</span>
            <button type="button" className="row-value" onClick={() => dispatch({ type: "OPEN_ACADEMY" })}>
              Astronaut Academy
            </button>
          </li>
          <li>
            <span className="row-key">Science</span>
            <button type="button" className="row-value" onClick={() => setShowData(true)}>
              Real NASA data
            </button>
          </li>
        </ul>

        <div className="title-rule" />

        <div className="title-brief">
          <h2>Mission</h2>
          <p>Fly to Mars, land your crew, and keep your base alive.</p>
          <p className="title-level">{commander ? "Commander · Ages 10–12" : "Cadet · Ages 7–9"}</p>
          <div className="title-pip">
            <Pip mood="happy" size={32} />
            <p>Hi, I'm Pip, your ship's computer. Ready to train?</p>
          </div>
        </div>

        <div className="title-nav">
          {canSkipIntro(state) && (
            <button type="button" className="title-link" onClick={() => dispatch({ type: "SKIP_INTRO" })}>
              Skip to landing
            </button>
          )}
          <button type="button" className="title-link title-start" onClick={() => dispatch({ type: "START" })}>
            Start mission
          </button>
        </div>
      </section>
      {showData && <NasaData onClose={() => setShowData(false)} />}
    </main>
  );
}
