// Balance bots: simple players with fixed strategies. They play thousands of
// seeded runs through the real engine so we can see whether the game is fair.
import { boardOutcome, currentCard, isStormToday, optionEffects, totalBlocks, visibleOptions, availableBlocks } from "../src/engine/base";
import { createInitialState, next } from "../src/engine/flow";
import type { Action, CardOption, EndingType, GameState, Level, RoleId, SiteId, System } from "../src/engine/types";
import { RULES } from "../src/content/rules";

export type Strategy = {
  name: string;
  board: (s: GameState) => Partial<Record<System, number>>;
  pick: (s: GameState, options: CardOption[], rand: () => number) => number;
};

function lcg(seed: number) {
  let x = seed >>> 0 || 1;
  return () => ((x = (Math.imul(x, 1664525) + 1013904223) >>> 0) / 4294967296);
}

const score = (s: GameState, o: CardOption, w: { science: number; dose: number; supplies: number; power: number }) => {
  const fx = optionEffects(s, o);
  return (fx.science ?? 0) * w.science - (fx.dose ?? 0) * w.dose + (fx.supplies ?? 0) * w.supplies + (fx.power ?? 0) * w.power + (o.growth ?? 0) * 0.8;
};
const best = (s: GameState, options: CardOption[], w: Parameters<typeof score>[2]) =>
  options.reduce((bi, o, i) => (score(s, o, w) > score(s, options[bi], w) ? i : bi), 0);

const solarToday = (s: GameState) => isStormToday(s) && s.base!.storm.kind === "solar";

export const STRATEGIES: Strategy[] = [
  {
    name: "random",
    board: (s) => {
      const out = { habitat: 0, greenhouse: 0, shield: 0 };
      const sys: System[] = ["habitat", "greenhouse", "shield"];
      const n = availableBlocks(s);
      let x = (s.base!.rng >>> 0) % 997;
      for (let i = 0; i < n; i++) {
        x = (x * 31 + 7) % 997;
        if (x % 4 === 3) continue; // keep some in the battery
        out[sys[x % 3]]++;
      }
      return out;
    },
    pick: (_s, options, rand) => Math.floor(rand() * options.length),
  },
  {
    name: "turtle (always safe, no science)",
    board: (s) => ({
      habitat: RULES.habitatNeed,
      greenhouse: 1,
      shield: solarToday(s) ? availableBlocks(s) - RULES.habitatNeed - 1 : 0,
    }),
    pick: (s, options) => best(s, options, { science: 0, dose: 5, supplies: 2, power: 0.5 }),
  },
  {
    name: "shields every day",
    board: (s) => ({ habitat: RULES.habitatNeed, greenhouse: 1, shield: availableBlocks(s) - RULES.habitatNeed - 1 }),
    pick: (s, options) => best(s, options, { science: 1, dose: 2, supplies: 1, power: 0.3 }),
  },
  {
    name: "greedy (max science)",
    board: () => ({ habitat: RULES.habitatNeed, greenhouse: 1 }),
    pick: (s, options) => best(s, options, { science: 3, dose: 0, supplies: 0.2, power: 0.1 }),
  },
  {
    name: "ignores the forecast",
    board: () => ({ habitat: RULES.habitatNeed, greenhouse: 2 }),
    pick: (s, options) => best(s, options, { science: 1.5, dose: 0.7, supplies: 1, power: 0.3 }),
  },
  {
    name: "smart",
    board: (s) => {
      const b = s.base!;
      const avail = availableBlocks(s);
      const habitat = Math.min(RULES.habitatNeed, avail);
      let left = avail - habitat;
      let shield = 0;
      if (solarToday(s)) {
        const built = s.flags.includes("SHELTER_BUILT") ? RULES.shelterBuiltProtection : 0;
        shield = Math.min(left, Math.max(0, b.storm.strength - built - RULES.shelteredProtection));
        left -= shield;
      }
      const dustTomorrow = b.storm.kind === "dust" && b.storm.sol === b.sol + 1;
      let greenhouse = dustTomorrow ? Math.min(1, left) : Math.min(2, left);
      // Save power for the rocket, as Pip warns two sols ahead.
      if (b.totalSols - b.sol <= 2) {
        const reserve = 4;
        while (greenhouse > 0 && avail - habitat - shield - greenhouse < reserve) greenhouse--;
      }
      return { habitat, greenhouse, shield };
    },
    pick: (s, options) => {
      const fix = options.findIndex((o) => o.clears?.includes("PANELS_DAMAGED"));
      if (fix >= 0) return fix;
      const g = s.gauges;
      const careful = g.supplies <= 4 || g.dose >= RULES.doseLimit - 3;
      const sci = g.science >= s.base!.scienceGoal ? 0.3 : careful ? 0.8 : 1.6;
      return best(s, options, { science: sci, dose: careful ? 2.5 : 1, supplies: careful ? 1.6 : 0.8, power: 0.35 });
    },
  },
];

function setBoard(s: GameState, want: Partial<Record<System, number>>): GameState {
  for (const sys of ["habitat", "greenhouse", "shield"] as System[]) {
    while (s.base!.allocation[sys] > 0) s = next(s, { type: "REMOVE_BLOCK", system: sys });
  }
  for (const sys of ["habitat", "greenhouse", "shield"] as System[]) {
    for (let i = 0; i < Math.max(0, want[sys] ?? 0); i++) {
      if (totalBlocks(s.base!.allocation) >= availableBlocks(s)) break;
      s = next(s, { type: "ADD_BLOCK", system: sys });
    }
  }
  return s;
}

/** Plays the opening quickly, then a whole base game with one strategy. */
export function playRun(level: Level, role: RoleId, site: SiteId, strategy: Strategy, seed: number): GameState {
  const rand = lcg(seed * 7919 + 13);
  let s = createInitialState({ level });
  const opening: Action[] = [{ type: "START" }, { type: "SET_NAME", name: "Bot" }, { type: "PICK_ROLE", role }, { type: "NEXT" }];
  s = opening.reduce(next, s);
  while (s.stage !== "landingChoice") s = next(s, { type: "NEXT" });
  s = next(next(s, { type: "PICK_SITE", site }), { type: "CONFIRM_SITE" });
  while (s.stage !== "damageReport") s = next(s, { type: "NEXT" });
  s = next(s, { type: "BEGIN_SOL_1", seed });
  for (let guard = 0; guard < 40 && s.stage !== "ending"; guard++) {
    if (s.stage === "board") {
      s = setBoard(s, strategy.board(s));
      boardOutcome(s); // must not throw
      s = next(s, { type: "CONFIRM_BOARD" });
    } else if (s.stage === "card") {
      const options = visibleOptions(s, currentCard(s)!);
      s = next(s, { type: "CHOOSE_OPTION", index: strategy.pick(s, options, rand) });
    } else if (s.stage === "result") {
      s = next(s, { type: "NEXT_SOL" });
    } else {
      throw new Error(`Bot stuck at stage ${s.stage}`);
    }
  }
  return s;
}

export interface Report {
  runs: number;
  endings: Record<EndingType, number>;
  threeStar: number;
}

export function simulate(level: Level, strategy: Strategy, runs: number): Report {
  const roles: RoleId[] = ["engineer", "doctor", "scientist"];
  const sites: SiteId[] = level === "commander" ? ["plains", "iceValley", "holdOrbit"] : ["plains", "iceValley"];
  const endings: Record<EndingType, number> = { commander: 0, safe: 0, grounded: 0, early: 0 };
  for (let i = 0; i < runs; i++) {
    const s = playRun(level, roles[i % roles.length], sites[Math.floor(i / roles.length) % sites.length], strategy, i + 1);
    endings[s.base!.ending!.type]++;
  }
  return { runs, endings, threeStar: endings.commander / runs };
}
