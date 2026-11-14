// The hidden calculation for "14 Sols". It must match
// docs/design/04-story-plan.md, section 5, and tests/story.test.ts.
// 12 decisions in 6 crises (team OK, November 2026). Every existing decision
// keeps its effect; old decisions 5-8 are now 7, 8, 11 and 12.

import type { Choice, DecisionId, FailReason, Outcome } from "../types";

export const DECISIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const satisfies readonly DecisionId[];
export const START = { fuel: 5, time: 7, health: 11 } as const;
export const FUEL_NEEDED = 7;
/** Health at or below this means the crew can't fly. */
export const HEALTH_FAIL = 1;

type Delta = { fuel?: number; time?: number; health?: number };

/** Effect of each option. Decision 8A's fuel cost depends on decision 2 (see effectOf). */
export const EFFECTS: Record<DecisionId, Record<Choice, Delta>> = {
  1: { A: { health: -2 }, B: { time: -2 } }, // the leak
  2: { A: {}, B: { fuel: 3, health: -2 } }, // where to land
  3: { A: {}, B: { fuel: 3, health: -2 } }, // dust storm: who gets the power
  4: { A: { health: -1 }, B: { time: -2 } }, // dust storm: the dusty panels
  5: { A: { fuel: -1 }, B: { health: -2 } }, // bad air: power for the CO2 cleaner
  6: { A: { time: -1 }, B: { health: -1 } }, // bad air: toxic dust on the suits
  7: { A: { time: -1 }, B: { health: -3 } }, // solar storm: shelter or finish the job
  8: { A: { health: 1 }, B: { health: -1 } }, // solar storm: a water wall
  9: { A: { time: -1 }, B: { health: -2 } }, // marsquake: Tunde's injury
  10: { A: { time: -1 }, B: { fuel: -1 } }, // marsquake: the cracked seal
  11: { A: { fuel: 2 }, B: {} }, // launch: the Mars rocks
  12: { A: {}, B: { time: -2, fuel: 2 } }, // launch: now or one more sol
};

/** The effect of one decision, given all choices (for the 8A / 2A link). */
export function effectOf(id: DecisionId, choices: Choice[]): Delta {
  const c = choices[id - 1];
  const base = EFFECTS[id][c];
  // Water wall: on flat ground (2A) the water can't be refilled, so it costs fuel.
  if (id === 8 && c === "A" && choices[1] === "A") return { ...base, fuel: (base.fuel ?? 0) - 2 };
  return base;
}

/** Decisions that can cause each fail, as "decision + option". */
export const BLAME: Record<FailReason, string[]> = {
  time: ["1B", "4B", "6A", "7A", "9A", "10A", "12B"],
  fuel: ["2A", "3A", "5A", "8A", "10B", "11B", "12A"],
  health: ["1A", "2B", "3B", "4A", "5B", "6B", "7B", "8B", "9B"],
};

/** choices[0] is decision 1. Expects 12 choices. */
export function finalOutcome(choices: Choice[]): Outcome {
  if (choices.length !== DECISIONS.length) throw new Error(`finalOutcome needs ${DECISIONS.length} choices, got ${choices.length}`);
  let fuel: number = START.fuel;
  let time: number = START.time;
  let health: number = START.health;
  for (const id of DECISIONS) {
    const d = effectOf(id, choices);
    fuel += d.fuel ?? 0;
    time += d.time ?? 0;
    health += d.health ?? 0;
  }
  const reason: FailReason | null = time < 0 ? "time" : fuel < FUEL_NEEDED ? "fuel" : health <= HEALTH_FAIL ? "health" : null;
  const blame = reason
    ? DECISIONS.filter((id) => {
        const key = `${id}${choices[id - 1]}`;
        if (key === "8A" && reason === "fuel") return choices[1] === "A";
        return BLAME[reason].includes(key);
      })
    : [];
  return { result: reason ? "fail" : "success", reason, fuel, time, health, blame };
}
