import { POOL, getCard } from "../content/cards";
import { getRole } from "../content/roles";
import { LEVEL_RULES, RULES, strengthFromKp } from "../content/rules";
import stormData from "../data/solar-storms.json";
import { applyEffects } from "./effects";
import type {
  Action,
  Allocation,
  BaseState,
  Card,
  CardOption,
  Ending,
  Flag,
  GameState,
  Gauges,
  LogLine,
  StormRecord,
  System,
} from "./types";

export const STORMS: StormRecord[] = stormData.storms as StormRecord[];

const launchCard = getCard("launch");
/** What the rocket's oxygen costs, read from the launch card so the warning always matches. */
export const LAUNCH_POWER = -(launchCard.options[0].effects.power ?? 0);
export const LAUNCH_SUPPLIES = -(launchCard.options[1].effects.supplies ?? 0);
export const SYSTEMS: System[] = ["habitat", "greenhouse", "shield"];
const EFFECT_LABEL = { power: "Power", supplies: "Supplies", dose: "Radiation", science: "Science" } as const;

// ---------- seeded random numbers (mulberry32) ----------

/** Returns a number in [0, 1) and the next seed. Same seed, same game. */
export function nextRandom(seed: number): [number, number] {
  const t = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return [((r ^ (r >>> 14)) >>> 0) / 4294967296, t];
}

// ---------- helpers ----------

const has = (flags: Flag[], f: Flag) => flags.includes(f);
const plural = (n: number, word: string) =>
  n === 1 ? `${n} ${word}` : word.endsWith("y") ? `${n} ${word.slice(0, -1)}ies` : `${n} ${word}s`;

export function totalBlocks(a: Allocation): number {
  return a.habitat + a.greenhouse + a.shield;
}

/** Battery power plus what the panels made this sol. */
export function availableBlocks(state: GameState): number {
  return state.base ? state.gauges.power + state.base.production : 0;
}

export function isStormToday(state: GameState): boolean {
  return !!state.base && state.base.storm.sol === state.base.sol;
}

export function visibleOptions(state: GameState, card: Card): CardOption[] {
  return card.options.filter(
    (o) =>
      (!o.commander || state.level === "commander") &&
      (o.requires ?? []).every((f) => has(state.flags, f)) &&
      !(o.excludes ?? []).some((f) => has(state.flags, f)),
  );
}

export function currentCard(state: GameState): Card | null {
  return state.base ? getCard(state.base.cardId) : null;
}

/** The option's effects after the player's role perk and any stocked shelter. */
export function optionEffects(state: GameState, option: CardOption): Partial<Gauges> {
  const fx = { ...option.effects };
  const tags = option.tags ?? [];
  const perk = state.player.role ? getRole(state.player.role).perk : null;
  if (perk?.kind === "repairDiscount" && tags.includes("repair") && (fx.power ?? 0) < 0) {
    fx.power = Math.min(0, fx.power! + perk.power);
  }
  if (tags.includes("shelter") && (fx.supplies ?? 0) < 0) {
    if (has(state.flags, "SHELTER_STOCKED")) fx.supplies = 0;
    else if (perk?.kind === "shelterDiscount") fx.supplies = Math.min(0, fx.supplies! + perk.supplies);
  }
  if (perk?.kind === "scienceBonus" && tags.includes("research") && (fx.science ?? 0) > 0) {
    fx.science = fx.science! + perk.science;
  }
  return fx;
}

function suggestedAllocation(state: GameState, available: number): Allocation {
  const b = state.base!;
  let left = available;
  const habitat = Math.min(RULES.habitatNeed, left);
  left -= habitat;
  const solarToday = b.storm.sol === b.sol && b.storm.kind === "solar";
  const shield = solarToday ? Math.min(b.storm.strength, left) : 0;
  left -= shield;
  const greenhouse = Math.min(1, left);
  return { habitat, greenhouse, shield };
}

function clampAllocation(a: Allocation, available: number): Allocation {
  const out = { ...a };
  for (const sys of ["shield", "greenhouse", "habitat"] as System[]) {
    while (totalBlocks(out) > available && out[sys] > 0) out[sys]--;
  }
  return out;
}

// ---------- what the power board will do ----------

export interface BoardOutcome {
  battery: number;
  supplies: number;
  dose: number;
  growth: number;
  lines: LogLine[];
}

/**
 * The effect of the current power split, without the event card.
 * The screen shows this as a live preview; the engine uses it at the end of the sol.
 */
export function boardOutcome(state: GameState, flags: Flag[] = state.flags): BoardOutcome {
  const b = state.base!;
  const a = b.allocation;
  const lines: LogLine[] = [];
  const available = availableBlocks(state);
  const leftover = available - totalBlocks(a);
  let supplies = 0;
  let dose = 0;

  if (a.habitat >= RULES.habitatNeed) {
    lines.push({ tone: "good", text: "Habitat powered: the air and water stayed clean." });
    if (a.habitat > RULES.habitatNeed) {
      lines.push({ tone: "info", text: `${plural(a.habitat - RULES.habitatNeed, "extra block")} in the habitat did nothing.` });
    }
  } else {
    const missing = RULES.habitatNeed - a.habitat;
    supplies -= missing;
    lines.push({
      tone: "bad",
      text: `Habitat got ${a.habitat} of ${RULES.habitatNeed} blocks: air and water ran low. Supplies −${missing}.`,
    });
  }

  const growth = b.growth + a.greenhouse;
  if (a.greenhouse > 0) {
    lines.push({ tone: "good", text: `Greenhouse lit: plants grew (${Math.min(growth, RULES.growTo)} of ${RULES.growTo} toward a harvest).` });
  } else {
    lines.push({ tone: "info", text: "Greenhouse dark: the plants didn't grow." });
  }

  const solarToday = b.storm.sol === b.sol && b.storm.kind === "solar";
  if (solarToday) {
    const protection =
      a.shield +
      (has(flags, "SHELTER_BUILT") ? RULES.shelterBuiltProtection : 0) +
      (has(flags, "SHELTERED") ? RULES.shelteredProtection : 0);
    dose = Math.max(0, b.storm.strength - protection);
    lines.push(
      dose > 0
        ? { tone: "bad", text: `The storm hit with strength ${b.storm.strength}. Protection blocked ${Math.min(protection, b.storm.strength)}. Radiation +${dose}.` }
        : { tone: "good", text: `The storm hit with strength ${b.storm.strength}, but the crew was fully protected!` },
    );
  } else if (a.shield > 0) {
    lines.push({ tone: "info", text: `No radiation storm today: ${plural(a.shield, "shield block")} used up for nothing.` });
  }

  const battery = Math.min(RULES.batteryCap, leftover);
  if (leftover > RULES.batteryCap) {
    lines.push({ tone: "info", text: `Battery full: ${plural(leftover - RULES.batteryCap, "block")} wasted.` });
  } else if (leftover > 0) {
    lines.push({ tone: "info", text: `${plural(leftover, "block")} saved in the battery.` });
  }

  return { battery, supplies, dose, growth, lines };
}

// ---------- starting the base and each sol ----------

export function startBase(state: GameState, seed: number): GameState {
  const L = LEVEL_RULES[state.level];
  let rng = seed >>> 0 || 1;
  let r: number;
  [r, rng] = nextRandom(rng);
  const kind = r < RULES.solarChance ? "solar" : "dust";
  [r, rng] = nextRandom(rng);
  const stormSol = L.stormSols[0] + Math.floor(r * (L.stormSols[1] - L.stormSols[0] + 1));
  let record: StormRecord | null = null;
  let strength: number = RULES.defaultSolarStrength;
  if (kind === "solar" && STORMS.length > 0) {
    [r, rng] = nextRandom(rng);
    record = STORMS[Math.floor(r * STORMS.length)];
    strength = strengthFromKp(record.maxKp);
  }
  const base: BaseState = {
    sol: 0,
    totalSols: L.sols,
    scienceGoal: L.scienceGoal,
    rng,
    storm: { sol: stormSol, kind, strength, record },
    production: 0,
    allocation: { habitat: 0, greenhouse: 0, shield: 0 },
    growth: 0,
    cardId: "",
    seen: [],
    delayed: [],
    morning: [],
    today: [],
    history: [],
    ending: null,
  };
  const gauges = applyEffects(state.gauges, { supplies: L.bonusSupplies });
  return beginSol({ ...state, gauges, base }, 1);
}

function pickCard(state: GameState, sol: number, rng: number): [string, number] {
  const b = state.base!;
  if (sol === b.totalSols) return ["launch", rng];
  if (b.storm.sol === sol) return [b.storm.kind === "solar" ? "solar_storm" : "dust_storm", rng];
  if (b.storm.sol === sol + 1) return [b.storm.kind === "solar" ? "solar_forecast" : "dust_forecast", rng];
  // Cracked panels keep asking to be fixed every other sol.
  if (has(state.flags, "PANELS_DAMAGED") && sol % 2 === 1) return ["repair_panels", rng];
  const eligible = POOL.filter(
    (c) =>
      !b.seen.includes(c.id) &&
      (c.requires ?? []).every((f) => has(state.flags, f)) &&
      visibleOptions(state, c).length >= 2,
  );
  if (eligible.length === 0) return ["quiet_sol", rng];
  const [r, next] = nextRandom(rng);
  return [eligible[Math.floor(r * eligible.length)].id, next];
}

function beginSol(state: GameState, sol: number): GameState {
  const b = { ...state.base!, sol };
  let gauges = state.gauges;
  let flags = state.flags;
  const morning: LogLine[] = [];

  let production: number = RULES.production;
  if (b.storm.sol === sol && b.storm.kind === "dust") {
    production = RULES.dustStormProduction;
    morning.push({ tone: "bad", text: `Dust storm! The sky is dark and the panels made only ${plural(production, "block")}.` });
  } else {
    const reasons: string[] = [];
    if (has(flags, "PANELS_DAMAGED")) {
      production -= RULES.damagedPenalty;
      reasons.push(`cracked panels −${RULES.damagedPenalty}`);
    }
    if (has(flags, "DUSTY_PANELS")) {
      production -= RULES.dustyPenalty;
      reasons.push(`dusty panels −${RULES.dustyPenalty}`);
      flags = flags.filter((f) => f !== "DUSTY_PANELS");
    }
    production = Math.max(0, production);
    morning.push({
      tone: reasons.length ? "bad" : "info",
      text: `The solar panels made ${plural(production, "power block")}${reasons.length ? ` (${reasons.join(", ")})` : ""}.`,
    });
  }

  const due = b.delayed.filter((d) => d.sol === sol);
  for (const d of due) {
    gauges = applyEffects(gauges, d.effects);
    morning.push({ tone: "good", text: d.text });
  }

  const solsToLaunch = b.totalSols - sol;
  if (solsToLaunch === 0) {
    morning.push({ tone: "info", text: `Launch day! The rocket needs oxygen: ${LAUNCH_POWER} power or ${LAUNCH_SUPPLIES} supplies.` });
  } else if (solsToLaunch <= 2) {
    morning.push({
      tone: "info",
      text: `Launch in ${plural(solsToLaunch, "sol")}. Save ${LAUNCH_POWER} power or ${LAUNCH_SUPPLIES} supplies for the rocket's oxygen.`,
    });
  }

  if (b.storm.sol === sol && b.storm.kind === "solar") {
    morning.push({
      tone: "bad",
      text: `Solar storm today! Strength ${b.storm.strength}. Each block in the shield stops 1 point of radiation.`,
    });
  }

  const withSol: GameState = { ...state, gauges, flags, base: { ...b, production, delayed: b.delayed.filter((d) => d.sol !== sol) } };
  const [cardId, rng] = pickCard(withSol, sol, b.rng);
  const available = gauges.power + production;
  const allocation =
    sol === 1 || state.level === "cadet"
      ? suggestedAllocation(withSol, available)
      : clampAllocation(b.allocation, available);

  return {
    ...withSol,
    stage: "board",
    base: {
      ...withSol.base!,
      rng,
      cardId,
      seen: [...b.seen, cardId],
      allocation,
      morning,
      today: [],
    },
  };
}

// ---------- the end of a sol ----------

function finalEnding(state: GameState, gauges: Gauges, sol: number): Ending | null {
  const b = state.base!;
  if (gauges.supplies <= 0) return { type: "early", stars: 0, sol };
  if (sol < b.totalSols) return null;
  if (gauges.dose >= RULES.doseLimit) return { type: "grounded", stars: 0, sol };
  if (gauges.science >= b.scienceGoal) return { type: "commander", stars: 3, sol };
  return { type: "safe", stars: gauges.science >= Math.ceil(b.scienceGoal / 2) ? 2 : 1, sol };
}

function resolveSol(state: GameState, option: CardOption): GameState {
  const b = state.base!;
  let flags = [...state.flags];
  for (const f of option.sets ?? []) if (!flags.includes(f)) flags.push(f);
  flags = flags.filter((f) => !(option.clears ?? []).includes(f));

  const board = boardOutcome(state, flags);
  const lines: LogLine[] = [...board.lines];
  const g: Gauges = {
    power: board.battery,
    supplies: state.gauges.supplies + board.supplies,
    dose: state.gauges.dose + board.dose,
    science: state.gauges.science,
  };

  const fx = optionEffects({ ...state, flags }, option);
  const costs = (["power", "supplies", "dose", "science"] as const)
    .filter((k) => fx[k])
    .map((k) => `${EFFECT_LABEL[k]} ${fx[k]! > 0 ? "+" : "−"}${Math.abs(fx[k]!)}`);
  lines.push({ tone: "info", text: costs.length ? `${option.outcome} (${costs.join(", ")})` : option.outcome });
  g.power += fx.power ?? 0;
  if (g.power < 0) {
    lines.push({ tone: "bad", text: `Not enough power! The base ran short, and that cost ${plural(-g.power, "supply")}.` });
    g.supplies += g.power;
    g.power = 0;
  }
  g.supplies += fx.supplies ?? 0;
  g.dose = Math.max(0, g.dose + (fx.dose ?? 0));
  g.science = Math.max(0, g.science + (fx.science ?? 0));

  let growth = Math.max(0, board.growth + (option.growth ?? 0));
  if (growth >= RULES.growTo) {
    growth -= RULES.growTo;
    g.supplies += RULES.harvest;
    lines.push({ tone: "good", text: `Harvest! Fresh food from the greenhouse. Supplies +${RULES.harvest}.` });
  }

  g.supplies -= RULES.upkeep;
  lines.push({ tone: "info", text: `The crew used ${plural(RULES.upkeep, "supply")} of air, water and food.` });

  g.power = Math.min(RULES.batteryCap, g.power);
  g.supplies = Math.min(RULES.batteryCap, g.supplies);

  const delayed = option.later
    ? [...b.delayed, { sol: b.sol + option.later.inSols, effects: option.later.effects, text: option.later.text }]
    : b.delayed;

  flags = flags.filter((f) => f !== "SHELTERED");
  const ending = finalEnding(state, g, b.sol);
  const gauges = { ...g, supplies: Math.max(0, g.supplies) };

  return {
    ...state,
    stage: "result",
    flags,
    gauges,
    base: {
      ...b,
      growth,
      delayed,
      today: lines,
      history: [...b.history, { sol: b.sol, lines, gauges }],
      ending,
    },
  };
}

// ---------- actions ----------

export function baseReducer(state: GameState, action: Action): GameState {
  const b = state.base;
  if (!b) return state;
  switch (action.type) {
    case "ADD_BLOCK": {
      if (state.stage !== "board" || totalBlocks(b.allocation) >= availableBlocks(state)) return state;
      return { ...state, base: { ...b, allocation: { ...b.allocation, [action.system]: b.allocation[action.system] + 1 } } };
    }
    case "REMOVE_BLOCK": {
      if (state.stage !== "board" || b.allocation[action.system] === 0) return state;
      return { ...state, base: { ...b, allocation: { ...b.allocation, [action.system]: b.allocation[action.system] - 1 } } };
    }
    case "CONFIRM_BOARD":
      return state.stage === "board" ? { ...state, stage: "card" } : state;
    case "CHOOSE_OPTION": {
      if (state.stage !== "card") return state;
      const option = visibleOptions(state, getCard(b.cardId))[action.index];
      return option ? resolveSol(state, option) : state;
    }
    case "NEXT_SOL": {
      if (state.stage !== "result") return state;
      if (b.ending) return { ...state, stage: "ending" };
      return beginSol(state, b.sol + 1);
    }
    default:
      return state;
  }
}
