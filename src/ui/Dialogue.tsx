import type { ReactNode } from "react";
import { MASCOT_NAME } from "../content/script";
import type { Mood } from "../engine/types";
import { speak } from "../services/speech";
import { Icon } from "./Icon";
import { Pip } from "./Pip";

interface Props {
  text: string;
  mood?: Mood;
  form?: "screen" | "rover";
  onNext?: () => void;
  nextLabel?: string;
  readAloud: boolean;
  children?: ReactNode;
}

const MOOD_TAG: Record<Mood, string> = { calm: "Comms", alert: "Alert", happy: "Comms" };

/** Pip's comms panel: caption always visible, replay button, and the next action. */
export function Dialogue({ text, mood = "calm", form = "screen", onNext, nextLabel = "Next", readAloud, children }: Props) {
  return (
    <section className={`dialogue mood-${mood}`} role="status" aria-live="polite" aria-label={`${MASCOT_NAME} says`}>
      <div className="dialogue-pip">
        <Pip mood={mood} form={form} size={56} />
      </div>
      <div className="dialogue-body">
        <span className="dialogue-head">
          <span className="dialogue-name">{MASCOT_NAME}</span>
          <span className="tag">{MOOD_TAG[mood]}</span>
        </span>
        <p className="dialogue-text">{text}</p>
      </div>
      <div className="dialogue-actions">
        {readAloud && (
          <button type="button" className="btn btn-icon" onClick={() => speak(text)} aria-label="Hear this again" title="Hear this again">
            <Icon name="speaker" />
          </button>
        )}
        {children}
        {onNext && (
          <button type="button" className="btn btn-primary" onClick={onNext} autoFocus>
            {nextLabel}
            <Icon name="next" size={18} />
          </button>
        )}
      </div>
    </section>
  );
}
