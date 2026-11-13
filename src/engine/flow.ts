import { getRole } from "../content/roles";
import { getSite, sitesForLevel } from "../content/landingSites";
import { DAMAGE_LINES, RADIO_DELAY_MIN, SCRIPT } from "../content/script";
import { baseReducer, startBase } from "./base";
import { assignTask, chooseEvent, createSim, nextSol, planPlot, runSol, toggleMachine } from "../sim/engine";
import { START_GAUGES, applyEffects } from "./effects";
import type { Action, DialogueLine, GameState, SavedProgress, Stage } from "./types";

export const NAME_MAX = 16;

const DEFAULT_PROGRESS: SavedProgress = {
  level: "cadet",
  player: { name: "", role: null },
  settings: { readAloud: false, reduceMotion: false, sound: true },
  seenIntro: false,
};

/** Stages that move on when their last dialogue line is done. */
const AFTER_DIALOGUE: Partial<Record<Stage, Stage>> = {
  approach: "alarm",
  alarm: "briefing",
  briefing: "landingChoice",
  descent: "touchdown",
  touchdown: "damageReport",
};

export function createInitialState(saved?: Partial<SavedProgress>): GameState {
  const p = { ...DEFAULT_PROGRESS, ...saved };
  return {
    stage: "title",
    level: p.level,
    player: { ...p.player },
    settings: { ...DEFAULT_PROGRESS.settings, ...p.settings },
    seenIntro: p.seenIntro,
    pendingSite: null,
    site: null,
    gauges: { ...START_GAUGES },
    flags: [],
    lineIndex: 0,
    base: null,
    sim: null,
  };
}

export function toSaved(state: GameState): SavedProgress {
  return { level: state.level, player: state.player, settings: state.settings, seenIntro: state.seenIntro };
}

export function linesFor(state: GameState): DialogueLine[] {
  if (state.stage === "damageReport") return state.site ? DAMAGE_LINES[state.site] : [];
  return SCRIPT[state.stage] ?? [];
}

export function currentLine(state: GameState): DialogueLine | null {
  return linesFor(state)[state.lineIndex] ?? null;
}

export function isLastLine(state: GameState): boolean {
  return state.lineIndex >= linesFor(state).length - 1;
}

/** Fills {name}, {role} and {delay} in a line of dialogue. */
export function fillText(text: string, state: GameState): string {
  const role = state.player.role ? getRole(state.player.role).name.toLowerCase() : "astronaut";
  return text
    .replaceAll("{name}", state.player.name || "astronaut")
    .replaceAll("{role}", role)
    .replaceAll("{delay}", String(RADIO_DELAY_MIN));
}

export function canSkipIntro(state: GameState): boolean {
  return state.seenIntro && state.player.role !== null && state.player.name.trim() !== "";
}

/** Clears everything from the last run but keeps the player's badge and settings. */
function freshRun(state: GameState, stage: Stage): GameState {
  return { ...state, stage, pendingSite: null, site: null, gauges: { ...START_GAUGES }, flags: [], lineIndex: 0, base: null, sim: null };
}

function goTo(state: GameState, stage: Stage): GameState {
  return { ...state, stage, lineIndex: 0 };
}

/** The whole opening as one pure function: (state, action) → next state. Invalid actions return the same state. */
export function next(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "START":
      return state.stage === "title" ? freshRun(state, "badge") : state;

    case "SKIP_INTRO":
      return state.stage === "title" && canSkipIntro(state) ? freshRun(state, "landingChoice") : state;

    case "OPEN_ACADEMY":
      return state.stage === "title" ? goTo(state, "academy") : state;

    case "BACK_TO_TITLE":
      return state.stage === "academy" || state.stage === "badge" ? goTo(state, "title") : state;

    case "SET_LEVEL":
      return state.stage === "title" || state.stage === "badge" ? { ...state, level: action.level } : state;

    case "SET_NAME":
      return state.stage === "badge"
        ? { ...state, player: { ...state.player, name: action.name.slice(0, NAME_MAX) } }
        : state;

    case "PICK_ROLE":
      return state.stage === "badge" ? { ...state, player: { ...state.player, role: action.role } } : state;

    case "NEXT": {
      if (state.stage === "badge") {
        const ready = state.player.name.trim() !== "" && state.player.role !== null;
        return ready ? goTo({ ...state, player: { ...state.player, name: state.player.name.trim() } }, "approach") : state;
      }
      const after = AFTER_DIALOGUE[state.stage];
      if (!isLastLine(state)) return { ...state, lineIndex: state.lineIndex + 1 };
      if (after) return goTo(state, after);
      return state;
    }

    case "PICK_SITE": {
      if (state.stage !== "landingChoice") return state;
      const allowed = sitesForLevel(state.level).some((s) => s.id === action.site);
      return allowed ? { ...state, pendingSite: action.site } : state;
    }

    case "CONFIRM_SITE": {
      if (state.stage !== "landingChoice" || !state.pendingSite) return state;
      const site = getSite(state.pendingSite);
      return {
        ...goTo(state, "descent"),
        site: site.id,
        gauges: applyEffects(state.gauges, site.effects),
        flags: [...site.flags],
      };
    }

    case "BEGIN_SOL_1":
      return state.stage === "damageReport" ? startBase({ ...state, seenIntro: true, lineIndex: 0 }, action.seed ?? 1) : state;

    case "START_SIMULATION":
      return state.stage === "damageReport" ? { ...goTo(state, "simReady"), seenIntro: true } : state;

    case "BEGIN_SIM":
      return state.stage === "simReady" ? { ...goTo(state, "sim"), sim: createSim(state, action.seed ?? 1) } : state;

    case "SIM_ASSIGN":
    case "SIM_TOGGLE":
    case "SIM_PLOT":
    case "SIM_EVENT":
    case "SIM_RUN":
    case "SIM_NEXT": {
      if (state.stage !== "sim" || !state.sim) return state;
      const s = state.sim;
      const sim =
        action.type === "SIM_ASSIGN" ? assignTask(s, action.crewId, action.task)
        : action.type === "SIM_TOGGLE" ? toggleMachine(s, action.machine)
        : action.type === "SIM_PLOT" ? planPlot(s, action.plot, action.crop)
        : action.type === "SIM_EVENT" ? chooseEvent(s, action.index)
        : action.type === "SIM_RUN" ? runSol(s)
        : nextSol(s);
      return sim === s ? state : { ...state, sim };
    }

    case "ADD_BLOCK":
    case "REMOVE_BLOCK":
    case "CONFIRM_BOARD":
    case "CHOOSE_OPTION":
    case "NEXT_SOL":
      return baseReducer(state, action);

    case "REPLAY":
      return state.stage === "ending" ? freshRun(state, "landingChoice") : state;

    case "SET_SETTING":
      return { ...state, settings: { ...state.settings, [action.key]: action.value } };

    case "RESTART":
      return freshRun(state, "title");
  }
}
