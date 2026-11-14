// The shared contract for the "14 Sols" story game.
// All three team members build against these types. Do not change this file
// on your own branch: if a change is needed, agree it in the team chat, and
// Person 1 (logic) makes it on main first. See docs/team/README.md.

export type Choice = "A" | "B";
export type CrisisId = 1 | 2 | 3 | 4;
/** Decisions are numbered 1-8 across the whole story (2 per crisis). */
export type DecisionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** One option of a decision. */
export interface Option {
  /** Short button text, e.g. "Land right away". */
  label: string;
  /** One line describing the option under the button. */
  detail: string;
  /** What happens in the scene after choosing. Never says if it was good or bad. */
  reaction: string;
}

export interface Decision {
  id: DecisionId;
  /** The question Pip asks, e.g. "The oxygen tank is leaking. What do we do?" */
  question: string;
  a: Option;
  b: Option;
}

export interface Crisis {
  id: CrisisId;
  title: string;
  /** Sol (Mars day) the crisis happens on; 0 = still in orbit. */
  sol: number;
  /** 2-3 short story lines shown before the first decision. */
  scene: string[];
  decisions: [Decision, Decision];
  /** One real NASA fact shown after the second decision. */
  nasaFact: { text: string; source: string };
  /** Which background picture to show (see src/story/art). */
  art: "orbit" | "dustStorm" | "solarStorm" | "launch";
}

/** The prologue and the endings, as plain text. */
export interface StoryText {
  prologue: string[];
  success: { title: string; lines: string[] };
  fail: { title: string; reasons: Record<FailReason, string>; tryAgain: string };
}

export type FailReason = "time" | "fuel" | "health";

/** Result of the hidden calculation (see docs/design/04-story-plan.md, section 5). */
export interface Outcome {
  result: "success" | "fail";
  reason: FailReason | null;
  fuel: number;
  time: number;
  health: number;
  /** For a fail: the player's own decisions that pushed the failing number down. */
  blame: DecisionId[];
}

/** Where the player is in the story. */
export type StoryStep =
  | { kind: "prologue" }
  | { kind: "scene"; crisis: CrisisId }
  | { kind: "decide"; crisis: CrisisId; decision: DecisionId }
  | { kind: "reaction"; crisis: CrisisId; decision: DecisionId }
  | { kind: "fact"; crisis: CrisisId }
  | { kind: "ending"; outcome: Outcome };

export interface StoryState {
  step: StoryStep;
  /** choices[0] is decision 1. Empty until the player chooses. */
  choices: Choice[];
}

export type StoryAction =
  | { type: "STORY_NEXT" }
  | { type: "STORY_CHOOSE"; choice: Choice }
  | { type: "STORY_RESTART" };

// Functions Person 1 delivers in src/story/logic.ts (signatures fixed):
//   export function finalOutcome(choices: Choice[]): Outcome;
//   export function initialStory(): StoryState;
//   export function storyReducer(state: StoryState, action: StoryAction): StoryState;
