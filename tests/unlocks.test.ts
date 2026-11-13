import { describe, expect, it } from "vitest";
import { createInitialState, next } from "../src/engine/flow";
import type { Action, GameState, Level } from "../src/engine/types";
import { assignTask, chooseEvent, createSim, dismissUnlocks, nextSol, planEva, runSol, toggleMachine } from "../src/sim/engine";
import { FEATURE_ORDER, UNLOCK_SOL, isUnlocked } from "../src/sim/unlocks";
import type { SimState } from "../src/sim/types";

function landed(level: Level): GameState {
  let s = [
    { type: "START" },
    { type: "SET_NAME", name: "Nova" },
    { type: "PICK_ROLE", role: "doctor" },
    { type: "NEXT" },
  ].reduce((acc, a) => next(acc, a as Action), createInitialState({ level }));
  while (s.stage !== "landingChoice") s = next(s, { type: "NEXT" });
  s = next(next(s, { type: "PICK_SITE", site: "plains" }), { type: "CONFIRM_SITE" });
  while (s.stage !== "damageReport") s = next(s, { type: "NEXT" });
  return s;
}

function toSol(sim: SimState, sol: number): SimState {
  while (sim.sol < sol && sim.mode !== "ended") {
    if (sim.eventId) sim = chooseEvent(sim, 0);
    sim = nextSol(runSol(dismissUnlocks(sim)));
  }
  return sim;
}

describe("unlocks", () => {
  it("cadets start with only life support; locked jobs and machines are refused", () => {
    const sim = createSim(landed("cadet"), 5);
    expect(isUnlocked(sim, "greenhouse")).toBe(false);
    expect(sim.machines.greenhouseLights).toBe(false);
    expect(sim.crew.some((c) => c.task === "farm" || c.task === "mine" || c.task === "eva")).toBe(false);
    expect(assignTask(sim, "player", "farm")).toBe(sim);
    expect(assignTask(sim, "player", "eva")).toBe(sim);
    expect(toggleMachine(sim, "fuelPlant")).toBe(sim);
    expect(toggleMachine(sim, "roverCharger")).toBe(sim);
  });

  it("each system opens on its sol with a 'new on the base' card", () => {
    let sim = createSim(landed("cadet"), 5);
    sim = toSol(sim, 2);
    expect(sim.newUnlocks).toEqual(["greenhouse"]);
    expect(sim.machines.greenhouseLights).toBe(true);
    expect(assignTask(sim, "player", "farm").crew[0].task).toBe("farm");
    expect(dismissUnlocks(sim).newUnlocks).toEqual([]);

    sim = toSol(sim, 3);
    expect(sim.newUnlocks).toEqual(["mine", "fuel"]);
    sim = toSol(sim, 4);
    expect(sim.newUnlocks).toEqual(["eva"]);
    expect(planEva(assignTask(sim, "player", "eva"), "layeredCliffs").evaSite).toBeNull();
    sim = toSol(sim, 5);
    expect(sim.newUnlocks).toEqual(["rover"]);
    expect(planEva(sim, "layeredCliffs").evaSite).toBe("layeredCliffs");
  });

  it("commanders have every system from sol 1", () => {
    const sim = createSim(landed("commander"), 5);
    for (const f of FEATURE_ORDER) expect(isUnlocked(sim, f)).toBe(true);
    expect(sim.newUnlocks).toEqual([]);
  });

  it("everything opens within a Cadet mission", () => {
    for (const f of FEATURE_ORDER) expect(UNLOCK_SOL.cadet[f]).toBeLessThan(7);
  });
});
