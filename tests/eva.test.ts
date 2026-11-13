import { describe, expect, it } from "vitest";
import { createInitialState, next } from "../src/engine/flow";
import type { Action, GameState, Level, RoleId, SiteId } from "../src/engine/types";
import { assignTask, chooseEvent, createSim, nextSol, planEva, runSol, stormStatus, toggleMachine } from "../src/sim/engine";
import { evaChecklist, sitesFor } from "../src/sim/eva";
import type { SimState } from "../src/sim/types";

function landed(level: Level = "cadet", role: RoleId = "scientist", site: SiteId = "plains"): GameState {
  let s = [
    { type: "START" },
    { type: "SET_NAME", name: "Nova" },
    { type: "PICK_ROLE", role },
    { type: "NEXT" },
  ].reduce((acc, a) => next(acc, a as Action), createInitialState({ level }));
  while (s.stage !== "landingChoice") s = next(s, { type: "NEXT" });
  s = next(next(s, { type: "PICK_SITE", site }), { type: "CONFIRM_SITE" });
  while (s.stage !== "damageReport") s = next(s, { type: "NEXT" });
  return s;
}

/** A clear-weather sol 1 with no surprise waiting. */
function calmStart(seed = 3): SimState {
  for (let s = seed; s < seed + 200; s++) {
    const sim = createSim(landed(), s);
    if (sim.storm.sol > 2) return sim;
  }
  throw new Error("no calm start");
}

const twoWalkers = (sim: SimState) => assignTask(assignTask(sim, "player", "eva"), sim.crew[1].id, "eva");

describe("spacewalks and the rover", () => {
  it("a planned walk with a buddy earns science, uses suit oxygen and adds radiation", () => {
    const start = planEva(twoWalkers(calmStart()), "craterRim");
    const after = runSol(start);
    expect(after.res.science).toBeGreaterThan(start.res.science);
    expect(after.report!.ledger.some((l) => l.cause === "Filling spacesuits")).toBe(true);
    expect(after.crew[0].dose).toBeGreaterThan(start.crew[0].dose);
    expect(after.visited).toContain("craterRim");
  });

  it("with no destination, the spacewalk is cancelled", () => {
    const after = runSol(twoWalkers(calmStart()));
    expect(after.report!.notes.some((n) => n.text.startsWith("Spacewalk cancelled"))).toBe(true);
  });

  it("far sites need enough rover charge, and the charger fills the rover", () => {
    let sim = planEva(twoWalkers(calmStart()), "oldLander");
    expect(sim.rover.battery).toBeLessThan(55);
    const blocked = runSol(sim);
    expect(blocked.report!.notes.some((n) => n.text.includes("rover needs"))).toBe(true);

    sim = toggleMachine(calmStart(), "roverCharger");
    const charged = runSol(sim);
    expect(charged.rover.battery).toBeGreaterThan(sim.rover.battery);
  });

  it("a second visit to the same place gives little new science", () => {
    let sim = planEva(twoWalkers(calmStart()), "craterRim");
    sim = runSol(sim);
    const first = sim.res.science;
    sim = nextSol(sim);
    if (sim.eventId) sim = chooseEvent(sim, 0);
    sim = planEva(twoWalkers(sim), "craterRim");
    sim = runSol(sim);
    expect(sim.res.science - first).toBeLessThanOrEqual(2);
  });

  it("the checklist flags going alone, a missing destination and low rover charge", () => {
    let sim = assignTask(calmStart(), "player", "eva");
    let list = evaChecklist(sim, false);
    expect(list.find((i) => i.id === "buddy")!.ok).toBe(false);
    expect(list.find((i) => i.id === "destination")!.ok).toBe(false);
    sim = planEva(twoWalkers(sim), "oldLander");
    list = evaChecklist(sim, false);
    expect(list.find((i) => i.id === "buddy")!.ok).toBe(true);
    expect(list.find((i) => i.id === "rover")!.ok).toBe(false);
    expect(evaChecklist(sim, true).find((i) => i.id === "weather")!.ok).toBe(false);
  });

  it("the ice cliff is only offered when the base is near ice", () => {
    expect(sitesFor(createSim(landed("cadet", "scientist", "plains"), 3)).some((s) => s.id === "iceCliff")).toBe(false);
    expect(sitesFor(createSim(landed("cadet", "scientist", "iceValley"), 3)).some((s) => s.id === "iceCliff")).toBe(true);
  });

  it("going out during a dust storm is cancelled", () => {
    let seed = 1;
    while (createSim(landed(), seed).storm.kind !== "dust") seed++;
    let sim = createSim(landed(), seed);
    while (stormStatus(sim) !== "today") {
      if (sim.eventId) sim = chooseEvent(sim, 0);
      sim = nextSol(runSol(sim));
    }
    if (sim.eventId) sim = chooseEvent(sim, 0);
    const after = runSol(planEva(twoWalkers(sim), "craterRim"));
    expect(after.report!.notes.some((n) => n.text.includes("too much dust"))).toBe(true);
  });

  it("over many missions, spacewalks pay off but sometimes go wrong", () => {
    let wins = 0;
    let incidents = 0;
    let walks = 0;
    for (let seed = 1; seed <= 60; seed++) {
      let sim = createSim(landed(), seed);
      for (let i = 0; i < 12 && sim.mode !== "ended"; i++) {
        if (sim.eventId) sim = chooseEvent(sim, 0);
        const calm = stormStatus(sim) !== "today";
        if (calm && sim.crew[0].energy >= 50 && sim.crew[1].energy >= 50 && sim.res.oxygen > 40) {
          const site = sitesFor(sim).find((s) => !sim.visited.includes(s.id) && s.rover <= sim.rover.battery);
          if (site) {
            sim = planEva(twoWalkers(sim), site.id);
            walks++;
          }
        } else {
          sim = assignTask(assignTask(sim, "player", "rest"), sim.crew[1].id, "rest");
        }
        if (!sim.machines.roverCharger && sim.res.battery > 40) sim = toggleMachine(sim, "roverCharger");
        sim = runSol(sim);
        incidents += sim.report!.notes.filter((n) => n.text.includes("suit alarm") || n.text.includes("rover wheel")).length;
        sim = nextSol(sim);
      }
      if (sim.ending && sim.ending.stars >= 2) wins++;
    }
    expect(walks).toBeGreaterThan(60);
    expect(incidents).toBeGreaterThan(0);
    expect(incidents / walks).toBeLessThan(0.35);
    expect(wins / 60).toBeGreaterThan(0.5);
  });
});
