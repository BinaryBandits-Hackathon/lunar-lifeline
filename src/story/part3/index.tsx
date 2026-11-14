// PART 3: crisis 4 (decisions 7-8) and the ending. Owned by Person 3.
// Asks exactly decisions 7 and 8, then shows the ending from `outcome`
// (computed by the shell; never computed here).

import { useEffect, useState } from "react";
import { speak } from "../../services/speech";
import { NasaData } from "../../ui/NasaData";
import { Beats } from "../core/Beats";
import { DECISION_LABELS } from "../core/labels";
import type { DecisionId, FinalPartProps } from "../types";
import { HomeScene, StrandedScene, part3Art } from "./art";
import { ENDING_TEXT, PART3_BEATS } from "./content";
import "./part3.css";

/** Decisions grouped by crisis, for the path. */
const BY_CRISIS: DecisionId[][] = [
  [1, 2],
  [3, 4],
  [5, 6],
  [7, 8],
];

export function Part3(props: FinalPartProps) {
  const { lang, readAloud, playerName, onChoose, choices, outcome, onRestart, onExit } = props;
  const [ending, setEnding] = useState(false);
  const [showData, setShowData] = useState(false);
  const done = ending && outcome !== null;

  const won = outcome?.result === "success";
  const headline = !outcome ? "" : won ? ENDING_TEXT.success.lines.map((l) => l[lang]).join(" ") : ENDING_TEXT.fail.reasons[outcome.reason!][lang];
  useEffect(() => {
    if (done && readAloud && headline) speak(headline);
  }, [done, readAloud, headline]);

  if (!done) {
    // The launch scene follows the story: rock boxes after decision 7, ignition (and night for 8B) after decision 8.
    const art = part3Art({ rocks: choices[6] ?? null, launch: choices[7] ?? null });
    return <Beats beats={PART3_BEATS} art={art} lang={lang} readAloud={readAloud} playerName={playerName} onChoose={onChoose} onDone={() => setEnding(true)} />;
  }

  const Pic = won ? HomeScene : StrandedScene;
  const blamed = new Set(outcome.blame);
  const label = (id: DecisionId) => DECISION_LABELS[id][choices[id - 1]][lang];

  return (
    <div className="story-beats story-p3-end" lang={lang}>
      <div className="story-art" aria-hidden="true">
        <Pic />
      </div>
      <section className={`story-panel story-p3-panel ${won ? "is-home" : "is-stranded"}`} aria-labelledby="p3-title">
        <h2 id="p3-title" className="story-p3-title">
          {won ? ENDING_TEXT.success.title[lang] : ENDING_TEXT.fail.title[lang]}
        </h2>

        {won ? (
          ENDING_TEXT.success.lines.map((l) => (
            <p key={l.en} className="story-text">
              {l[lang]}
            </p>
          ))
        ) : (
          <p className="story-text">{ENDING_TEXT.fail.reasons[outcome.reason!][lang]}</p>
        )}

        <div className="story-p3-path" aria-label={ENDING_TEXT.path[lang]}>
          <span className="story-p3-path-head">{won ? ENDING_TEXT.path[lang] : ENDING_TEXT.fail.led[lang]}</span>
          <ol className="story-p3-crises">
            {BY_CRISIS.map((ids, ci) => (
              <li key={ci} className="story-p3-crisis" style={{ animationDelay: `${0.5 + ci * 0.35}s` }}>
                <span className="story-p3-crisis-name">
                  {ci + 1}. {ENDING_TEXT.crises[ci][lang]}
                </span>
                {ids.map((id) => {
                  const hit = !won && blamed.has(id);
                  return (
                    <span key={id} className={`story-p3-choice${hit ? " is-blamed" : ""}`} title={hit ? ENDING_TEXT.why[lang] : undefined}>
                      <b>{choices[id - 1]}</b>
                      {label(id)}
                    </span>
                  );
                })}
              </li>
            ))}
          </ol>
        </div>

        <div className="story-p3-actions">
          <button type="button" className="btn btn-primary" onClick={onRestart} autoFocus>
            {ENDING_TEXT.tryAgain[lang]}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setShowData(true)}>
            {lang === "bn" ? "নাসার আসল ডেটা" : "Real NASA data"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onExit}>
            {ENDING_TEXT.title[lang]}
          </button>
        </div>
      </section>
      {showData && <NasaData onClose={() => setShowData(false)} />}
    </div>
  );
}
