import type { ReactNode } from "react";
import { MASCOT_NAME } from "../content/script";
import type { Mood } from "../engine/types";
import { speak } from "../services/speech";
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

/** Pip's speech box: caption always visible, a replay button, and Next. */
export function Dialogue({ text, mood = "calm", form = "screen", onNext, nextLabel = "Next", readAloud, children }: Props) {
  return (
    <div className={`dialogue mood-${mood}`} role="status" aria-live="polite">
      <div className="dialogue-pip">
        <Pip mood={mood} form={form} size={64} />
      </div>
      <div className="dialogue-body">
        <span className="dialogue-name">{MASCOT_NAME}</span>
        <p className="dialogue-text">{text}</p>
        <div className="dialogue-actions">
          {readAloud && (
            <button type="button" className="btn btn-ghost" onClick={() => speak(text)} aria-label="Hear this again">
              🔊 Again
            </button>
          )}
          {children}
          {onNext && (
            <button type="button" className="btn btn-primary" onClick={onNext} autoFocus>
              {nextLabel} ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
