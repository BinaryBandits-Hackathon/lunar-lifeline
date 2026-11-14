// The shared contract for "14 Sols". FROZEN: nobody edits this file on their
// own branch. Changes need the whole team's OK (see docs/team/README.md).

export type Choice = "A" | "B";
/** Decisions are numbered 1-8 across the whole story. */
export type DecisionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type FailReason = "time" | "fuel" | "health";
export type Lang = "en" | "bn";

/** Result of the hidden calculation (docs/design/04-story-plan.md, section 5). */
export interface Outcome {
  result: "success" | "fail";
  reason: FailReason | null;
  fuel: number;
  time: number;
  health: number;
  /** For a fail: the player's own decisions that pushed the failing number down. */
  blame: DecisionId[];
}

/** What the shell gives every part. */
export interface PartProps {
  /** Every choice made so far in the whole story (choices[0] is decision 1). */
  choices: Choice[];
  /** Record the next decision. Call it exactly once per decision, in order. */
  onChoose: (choice: Choice) => void;
  /** Call when the part is finished; the shell then shows the next part. */
  onDone: () => void;
  lang: Lang;
  readAloud: boolean;
  reduceMotion: boolean;
  /** The player's name for {name} in the text ("Commander" if none). */
  playerName: string;
}

/** Part 3 also shows the ending, so it gets the outcome and two more actions. */
export interface FinalPartProps extends PartProps {
  /** Filled in by the shell once all 8 choices are made; null before that. */
  outcome: Outcome | null;
  /** Start the whole story again from the prologue. */
  onRestart: () => void;
  /** Leave the story and go back to the title screen. */
  onExit: () => void;
}

/** Which decisions each part asks. A part must ask exactly these, in order. */
export const PART_DECISIONS: Record<1 | 2 | 3, DecisionId[]> = {
  1: [1, 2],
  2: [3, 4, 5, 6],
  3: [7, 8],
};
