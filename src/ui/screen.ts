import { useEffect, type Dispatch } from "react";
import type { Action, GameState } from "../engine/types";
import { speak } from "../services/speech";

/** Reads `text` aloud when it changes, if read-aloud is on. */
export function useSpeak(text: string | null, enabled: boolean) {
  useEffect(() => {
    if (enabled && text) speak(text);
  }, [text, enabled]);
}

export interface ScreenProps {
  state: GameState;
  dispatch: Dispatch<Action>;
}

/**
 * Moves an animated stage on by itself after `ms`. The player can always
 * press Next sooner; there is never a timer that punishes being slow.
 */
export function useAutoAdvance(key: string, ms: number, dispatch: Dispatch<Action>, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const t = window.setTimeout(() => dispatch({ type: "NEXT" }), ms);
    return () => window.clearTimeout(t);
  }, [key, ms, dispatch, enabled]);
}
