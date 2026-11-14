// PART 3: crisis 5 (marsquake, decisions 9-10), crisis 6 (launch day,
// decisions 11-12) and the ending. Must ask exactly decisions 9-12, then show
// the ending from `outcome`.

import { useState } from "react";
import { Beats } from "../core/Beats";
import { CRISIS_OF, DECISION_LABELS } from "../core/labels";
import { DECISIONS } from "../core/outcome";
import type { DecisionId, FinalPartProps } from "../types";
import { PART3_ART } from "./art";
import "./part3.css";
import { ENDING_TEXT, PART3_BEATS } from "./content";

export function Part3(props: FinalPartProps) {
  const { lang, readAloud, playerName, onChoose, choices, outcome, onRestart, onExit } = props;
  const [ending, setEnding] = useState(false);

  if (!ending || !outcome) {
    return <Beats beats={PART3_BEATS} art={PART3_ART} lang={lang} readAloud={readAloud} playerName={playerName} onChoose={onChoose} onDone={() => setEnding(true)} />;
  }

  const won = outcome.result === "success";
  const Pic = won ? PART3_ART.home : PART3_ART.stranded;
  const label = (id: DecisionId) => DECISION_LABELS[id][choices[id - 1]][lang];
  return (
    <div className="story-beats" lang={lang}>
      <div className="story-art" aria-hidden="true">
        <Pic />
      </div>
      <div className="story-panel">
        <span className="story-who">{won ? ENDING_TEXT.success.title[lang] : ENDING_TEXT.fail.title[lang]}</span>
        {won ? (
          ENDING_TEXT.success.lines.map((l) => (
            <p key={l.en} className="story-text">
              {l[lang]}
            </p>
          ))
        ) : (
          <>
            <p className="story-text">{ENDING_TEXT.fail.reasons[outcome.reason!][lang]}</p>
            <p className="story-text">{ENDING_TEXT.fail.led[lang]}</p>
            <ul className="story-p3-blame">
              {outcome.blame.map((id) => (
                <li key={id}>{label(id)}</li>
              ))}
            </ul>
          </>
        )}
        <p className="story-p3-path">
          <strong>{ENDING_TEXT.path[lang]}:</strong> {DECISIONS.map((id) => `${CRISIS_OF[id]}${choices[id - 1]} ${label(id)}`).join(" → ")}
        </p>
        <div className="story-p3-actions">
          <button type="button" className="btn btn-primary" onClick={onRestart} autoFocus>
            {ENDING_TEXT.tryAgain[lang]}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onExit}>
            {ENDING_TEXT.title[lang]}
          </button>
        </div>
      </div>
    </div>
  );
}
