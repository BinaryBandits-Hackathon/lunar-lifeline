// The hidden calculation for "14 Sols". FROZEN: it must match
// docs/design/04-story-plan.md, section 5, and tests/story.test.ts.

import type { Choice, DecisionId, FailReason, Outcome } from "../types";

export const START = { fuel: 4, time: 6, health: 8 } as const;
export const FUEL_NEEDED = 7;
/** Health at or below this means the crew can't fly. */
export const HEALTH_FAIL = 1;

type Delta = { fuel?: number; time?: number; health?: number };

/** Effect of each option. Decision 6A's fuel cost depends on decision 2 (see effectOf). */
export const EFFECTS: Record<DecisionId, Record<Choice, Delta>> = {
  1: { A: { health: -2 }, B: { time: -2 } },
  2: { A: {}, B: { fuel: 3, health: -2 } },
  3: { A: {}, B: { fuel: 3, health: -2 } },
  4: { A: { health: -1 }, B: { time: -2 } },
  5: { A: { time: -1 }, B: { health: -3 } },
  6: { A: { health: 1 }, B: { health: -1 } },
  7: { A: { fuel: 2 }, B: {} },
  8: { A: {}, B: { time: -2, fuel: 2 } },
};

/** The effect of one decision, given all choices (for the 6A / 2A link). */
export function effectOf(id: DecisionId, choices: Choice[]): Delta {
  const c = choices[id - 1];
  const base = EFFECTS[id][c];
  // Water wall: on flat ground (2A) the water can't be refilled, so it costs fuel.
  if (id === 6 && c === "A" && choices[1] === "A") return { ...base, fuel: (base.fuel ?? 0) - 2 };
  return base;
}

/** Decisions that can cause each fail, as "decision + option". */
export const BLAME: Record<FailReason, string[]> = {
  time: ["1B", "4B", "5A", "8B"],
  fuel: ["2A", "3A", "6A", "7B", "8A"],
  health: ["1A", "2B", "3B", "4A", "5B", "6B"],
};

/** choices[0] is decision 1. Expects 8 choices. */
export function finalOutcome(choices: Choice[]): Outcome {
  if (choices.length !== 8) throw new Error(`finalOutcome needs 8 choices, got ${choices.length}`);
  let fuel: number = START.fuel;
  let time: number = START.time;
  let health: number = START.health;
  for (let id = 1 as DecisionId; id <= 8; id = (id + 1) as DecisionId) {
    const d = effectOf(id, choices);
    fuel += d.fuel ?? 0;
    time += d.time ?? 0;
    health += d.health ?? 0;
  }
  const reason: FailReason | null = time < 0 ? "time" : fuel < FUEL_NEEDED ? "fuel" : health <= HEALTH_FAIL ? "health" : null;
  const blame = reason
    ? ([1, 2, 3, 4, 5, 6, 7, 8] as DecisionId[]).filter((id) => {
        const key = `${id}${choices[id - 1]}`;
        if (key === "6A" && reason === "fuel") return choices[1] === "A";
        return BLAME[reason].includes(key);
      })
    : [];
  return { result: reason ? "fail" : "success", reason, fuel, time, health, blame };
}
