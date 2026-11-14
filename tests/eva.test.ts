import { describe, expect, it } from "vitest";
import { createInitialState, next } from "../src/engine/flow";
import type { Action, GameState, Level, RoleId, SiteId } from "../src/engine/types";
import { assignTask, chooseEvent, createSim, nextSol, planEva, runSol, stormStatus, toggleMachine } from "../src/sim/engine";
import { evaChecklist, sitesFor } from "../src/sim/eva";
import { roverReady } from "../src/sim/unlocks";
import { missionPoints } from "../src/engine/career";
import type { SimState } from "../src/sim/types";

function landed(level: Level = "commander", role: RoleId = "scientist", site: SiteId = "plains"): GameState {
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
/** Two suits already checked, as after a sol of Suit checks. */
const suited = (sim: SimState): SimState => ({ ...sim, suitsReady: 2 });
/** Suits ready and one walk on foot done, so the rover may drive. */
const roverCrew = (sim: SimState): SimState => ({ ...sim, suitsReady: 2, visited: ["craterRim"] });

describe("spacewalks and the rover", () => {
  it("a planned walk with a buddy earns science, uses suit oxygen and adds radiation", () => {
    const start = planEva(twoWalkers(suited(calmStart())), "craterRim");
    const after = runSol(start);
    expect(after.res.science).toBeGreaterThan(start.res.science);
    expect(after.report!.ledger.some((l) => l.cause === "Filling spacesuits")).toBe(true);
    expect(after.crew[0].dose).toBeGreaterThan(start.crew[0].dose);
    expect(after.visited).toContain("craterRim");
  });

  it("with no destination, the spacewalk is cancelled", () => {
    const after = runSol(twoWalkers(suited(calmStart())));
    expect(after.report!.notes.some((n) => n.text.startsWith("Spacewalk cancelled"))).toBe(true);
  });

  it("far sites need enough rover charge, and the charger fills the rover", () => {
    let sim = planEva(twoWalkers(roverCrew(calmStart())), "oldLander");
    expect(sim.rover.battery).toBeLessThan(55);
    const blocked = runSol(sim);
    expect(blocked.report!.notes.some((n) => n.text.includes("rover needs"))).toBe(true);

    sim = toggleMachine(calmStart(), "roverCharger");
    const charged = runSol(sim);
    expect(charged.rover.battery).toBeGreaterThan(sim.rover.battery);
  });

  it("a second visit to the same place gives little new science", () => {
    let sim = planEva(twoWalkers(suited(calmStart())), "craterRim");
    sim = runSol(sim);
    const first = sim.res.science;
    sim = nextSol(sim);
    if (sim.eventId) sim = chooseEvent(sim, 0);
    sim = planEva(twoWalkers(sim), "craterRim");
    sim = runSol(sim);
    expect(sim.res.science - first).toBeLessThanOrEqual(2);
  });

  it("the checklist flags going alone, a missing destination and low rover charge", () => {
    let sim = assignTask(roverCrew(calmStart()), "player", "eva");
    let list = evaChecklist(sim, false);
    expect(list.find((i) => i.id === "buddy")!.ok).toBe(false);
    expect(list.find((i) => i.id === "destination")!.ok).toBe(false);
    sim = planEva(twoWalkers(sim), "oldLander");
    list = evaChecklist(sim, false);
    expect(list.find((i) => i.id === "buddy")!.ok).toBe(true);
    expect(list.find((i) => i.id === "rover")!.ok).toBe(false);
    expect(evaChecklist(sim, true).find((i) => i.id === "weather")!.ok).toBe(false);
  });

  it("every walker needs a checked suit, and the Suit check job readies one", () => {
    const none = runSol(planEva(twoWalkers(calmStart()), "craterRim"));
    expect(none.report!.notes.some((n) => n.text.includes("spacesuit"))).toBe(true);
    expect(none.visited).toEqual([]);
    const prepped = runSol(assignTask(assignTask(calmStart(), "player", "suitPrep"), calmStart().crew[1].id, "suitPrep"));
    expect(prepped.suitsReady).toBe(2);
    expect(evaChecklist(twoWalkers(calmStart()), false).find((i) => i.id === "suits")!.ok).toBe(false);
  });

  it("the rover only drives after one walk on foot", () => {
    const sim = suited(calmStart());
    expect(roverReady(sim)).toBe(false);
    expect(planEva(twoWalkers(sim), "layeredCliffs").evaSite).toBeNull();
    const walked = { ...sim, visited: ["craterRim"] };
    expect(planEva(twoWalkers(walked), "layeredCliffs").evaSite).toBe("layeredCliffs");
  });

  it("passing the Academy spacewalk drill gives one ready suit", () => {
    const s = landed();
    expect(createSim(s, 3).suitsReady).toBe(0);
    expect(createSim({ ...s, career: { ...s.career, drills: { spacewalk: 3 } } }, 3).suitsReady).toBe(1);
  });

  it("field work earns career points: on foot, then by rover", () => {
    const base = { ...calmStart(), ending: { type: "survived" as const, stars: 1 as const, sol: 10, reason: "" }, history: [] };
    const foot = missionPoints({ ...base, visited: ["craterRim"] });
    const both = missionPoints({ ...base, visited: ["craterRim", "layeredCliffs"] });
    expect(foot).toBeGreaterThan(missionPoints(base));
    expect(both).toBeGreaterThan(foot);
  });

  it("the ice cliff is only offered when the base is near ice", () => {
    expect(sitesFor(createSim(landed("commander", "scientist", "plains"), 3)).some((s) => s.id === "iceCliff")).toBe(false);
    expect(sitesFor(createSim(landed("commander", "scientist", "iceValley"), 3)).some((s) => s.id === "iceCliff")).toBe(true);
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
    const after = runSol(planEva(twoWalkers(suited(sim)), "craterRim"));
    expect(after.report!.notes.some((n) => n.text.includes("too much dust"))).toBe(true);
  });

  it("over many missions, spacewalks pay off but sometimes go wrong", () => {
    const play = (walk: boolean) => {
      let wins = 0;
      let incidents = 0;
      let walks = 0;
      for (let seed = 1; seed <= 60; seed++) {
        let sim = createSim(landed(), seed);
        for (let i = 0; i < 12 && sim.mode !== "ended"; i++) {
          if (sim.eventId) sim = chooseEvent(sim, 0);
          const calm = stormStatus(sim) !== "today";
          const site = sitesFor(sim).find((s) => !sim.visited.includes(s.id) && s.rover <= sim.rover.battery && (s.rover === 0 || roverReady(sim)));
          if (walk && calm && sim.suitsReady < 2) {
            sim = assignTask(assignTask(sim, "player", "suitPrep"), sim.crew[1].id, "suitPrep");
          } else if (walk && calm && site && sim.crew[0].energy >= 50 && sim.crew[1].energy >= 50 && sim.res.oxygen > 40) {
            sim = planEva(twoWalkers(sim), site.id);
            walks++;
          } else {
            sim = assignTask(assignTask(sim, "player", sim.crew[0].energy < 50 ? "rest" : "research"), sim.crew[1].id, sim.crew[1].energy < 50 ? "rest" : "research");
          }
          if (walk && !sim.machines.roverCharger && sim.res.battery > 40) sim = toggleMachine(sim, "roverCharger");
          sim = runSol(sim);
          incidents += sim.report!.notes.filter((n) => n.text.includes("suit alarm") || n.text.includes("rover wheel")).length;
          sim = nextSol(sim);
        }
        if (sim.ending && sim.ending.stars >= 2) wins++;
      }
      return { wins, incidents, walks };
    };
    const withWalks = play(true);
    const without = play(false);
    expect(withWalks.walks).toBeGreaterThan(50);
    expect(withWalks.incidents).toBeGreaterThan(0);
    expect(withWalks.incidents / withWalks.walks).toBeLessThan(0.35);
    expect(withWalks.wins).toBeGreaterThan(without.wins);
  });
});
