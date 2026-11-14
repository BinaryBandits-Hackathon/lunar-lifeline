import { chooseEvent, createSim, nextSol, runSol } from "../sim/engine";
import type { GameState } from "./types";

// Quick start: skip the flight and landing and start on sol 3 of a Cadet mission, just as the ice drill, fuel
// plant and spacewalks open and a solar storm is coming on sol 4.

export const QUICK_START_SOL = 3;

/** First seed whose mission has a real solar storm on sol 4, so a quick start always shows one. */
function quickStartSeed(state: GameState): number {
  for (let seed = 1; seed < 500; seed++) {
    const sim = createSim(state, seed);
    if (sim.storm.kind === "solar" && sim.storm.sol === 4 && sim.storm.record) return seed;
  }
  return 1;
}

export function startQuick(state: GameState): GameState {
  const ready: GameState = {
    ...state,
    level: "cadet",
    player: { name: state.player.name.trim() || "Nova", role: state.player.role ?? "engineer" },
    site: "plains",
    pendingSite: null,
    flags: ["FAR_FROM_ICE"],
    lineIndex: 0,
    base: null,
  };
  let sim = createSim(ready, quickStartSeed(ready));
  // Play sols 1 and 2 with the default jobs so the base has a short history.
  while (sim.sol < QUICK_START_SOL && sim.mode !== "ended") {
    if (sim.eventId) sim = chooseEvent(sim, 0);
    sim = nextSol(runSol(sim));
  }
  return { ...ready, stage: "sim", sim: { ...sim, quickStart: true } };
}
