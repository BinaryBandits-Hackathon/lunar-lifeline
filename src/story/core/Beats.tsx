// A simple, shared player for story "beats": lines, decisions and a fact.
// FROZEN shared helper. Parts may use it, or replace it with their own
// screens inside their own folder. It never shows whether a choice was good.

import { useEffect, useState, type ReactNode } from "react";
import { speak } from "../../services/speech";
import type { Choice, Lang } from "../types";

export interface Line {
  /** "pip", "mei", "tunde", "earth" or undefined for narration. */
  who?: "pip" | "mei" | "tunde" | "earth";
  en: string;
  bn: string;
}
export interface OptionText {
  label: Line;
  detail: Line;
  reaction: Line;
}
export type Beat =
  | { kind: "line"; line: Line; art?: string }
  | { kind: "decide"; question: Line; a: OptionText; b: OptionText; art?: string }
  | { kind: "fact"; fact: Line; source: string; art?: string };

const WHO: Record<NonNullable<Line["who"]>, { en: string; bn: string }> = {
  pip: { en: "Pip", bn: "পিপ" },
  mei: { en: "Mei", bn: "মেই" },
  tunde: { en: "Tunde", bn: "তুন্দে" },
  earth: { en: "Earth", bn: "পৃথিবী" },
};

const NEXT = { en: "Next", bn: "পরের" };
const SOURCE = { en: "NASA source", bn: "নাসার সোর্স" };
const FACT = { en: "Real NASA fact", bn: "নাসার আসল তথ্য" };

/** Replaces {name} with the player's name. */
export const fill = (text: string, name: string) => text.replaceAll("{name}", name);

interface Props {
  beats: Beat[];
  lang: Lang;
  readAloud: boolean;
  playerName: string;
  /** Pictures by art key; the beat's `art` (or the last one used) is shown. */
  art: Record<string, () => ReactNode>;
  onChoose: (choice: Choice) => void;
  onDone: () => void;
}

export function Beats({ beats, lang, readAloud, playerName, art, onChoose, onDone }: Props) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<Choice | null>(null);
  const beat = beats[i];
  const say = (l: Line) => fill(l[lang], playerName);
  const artKey = [...beats.slice(0, i + 1)].reverse().find((b) => b.art)?.art;
  const Pic = artKey ? art[artKey] : undefined;

  const next = () => {
    setPicked(null);
    if (i + 1 >= beats.length) onDone();
    else setI(i + 1);
  };

  const spoken = !beat ? "" : beat.kind === "line" ? say(beat.line) : beat.kind === "fact" ? say(beat.fact) : picked ? say(beat[picked === "A" ? "a" : "b"].reaction) : say(beat.question);
  useEffect(() => {
    if (readAloud && spoken) speak(spoken);
  }, [spoken, readAloud]);

  if (!beat) return null;
  return (
    <div className="story-beats" lang={lang === "bn" ? "bn" : "en"}>
      <div className="story-art" aria-hidden="true">
        {Pic ? <Pic /> : null}
      </div>
      <div className="story-panel">
        {beat.kind === "line" && (
          <>
            {beat.line.who && <span className="story-who">{WHO[beat.line.who][lang]}</span>}
            <p className="story-text">{say(beat.line)}</p>
            <button type="button" className="btn btn-primary" onClick={next} autoFocus>
              {NEXT[lang]}
            </button>
          </>
        )}
        {beat.kind === "decide" && !picked && (
          <>
            <span className="story-who">{WHO.pip[lang]}</span>
            <p className="story-text">{say(beat.question)}</p>
            <div className="story-options">
              {(["A", "B"] as Choice[]).map((c) => {
                const o = beat[c === "A" ? "a" : "b"];
                return (
                  <button
                    key={c}
                    type="button"
                    className="story-option"
                    onClick={() => {
                      onChoose(c);
                      setPicked(c);
                    }}
                  >
                    <strong>{say(o.label)}</strong>
                    <span>{say(o.detail)}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
        {beat.kind === "decide" && picked && (
          <>
            <p className="story-text">{say(beat[picked === "A" ? "a" : "b"].reaction)}</p>
            <button type="button" className="btn btn-primary" onClick={next} autoFocus>
              {NEXT[lang]}
            </button>
          </>
        )}
        {beat.kind === "fact" && (
          <>
            <span className="story-who">{FACT[lang]}</span>
            <p className="story-text">{say(beat.fact)}</p>
            {beat.source && (
              <a className="story-source" href={beat.source} target="_blank" rel="noreferrer">
                {SOURCE[lang]}
              </a>
            )}
            <button type="button" className="btn btn-primary" onClick={next} autoFocus>
              {NEXT[lang]}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
