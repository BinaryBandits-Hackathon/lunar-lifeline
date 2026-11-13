import { describe, expect, it } from "vitest";
import { DRILLS, POINTS, rankFor } from "../src/content/academy";
import { EMPTY_CAREER, missionBadges, readCareer, recordDrill, recordMission } from "../src/engine/career";
import { createInitialState, next } from "../src/engine/flow";
import type { Action, GameState } from "../src/engine/types";
import { assignTask, chooseEvent, createSim, nextSol, runSol, stormStatus } from "../src/sim/engine";
import type { SimState } from "../src/sim/types";

function landed(): GameState {
  let s = [
    { type: "START" },
    { type: "SET_NAME", name: "Nova" },
    { type: "PICK_ROLE", role: "doctor" },
    { type: "NEXT" },
  ].reduce((acc, a) => next(acc, a as Action), createInitialState({ level: "cadet" }));
  while (s.stage !== "landingChoice") s = next(s, { type: "NEXT" });
  s = next(next(s, { type: "PICK_SITE", site: "plains" }), { type: "CONFIRM_SITE" });
  while (s.stage !== "damageReport") s = next(s, { type: "NEXT" });
  return s;
}

/** Plays a whole mission, sheltering everyone on solar storm days. */
function playMission(seed: number): SimState {
  let sim = createSim(landed(), seed);
  for (let i = 0; i < 20 && !sim.ending; i++) {
    sim = { ...sim, newUnlocks: [] };
    if (sim.eventId) sim = chooseEvent(sim, 0);
    if (stormStatus(sim) === "today" && sim.storm.kind === "solar") for (const c of sim.crew) sim = assignTask(sim, c.id, "shelter");
    sim = runSol(sim);
    if (!sim.ending) sim = nextSol(sim);
  }
  return sim;
}

describe("career, badges and ranks", () => {
  it("ranks go up with points", () => {
    expect(rankFor(0).name).toBe("Trainee");
    expect(rankFor(25).name).toBe("Cadet Astronaut");
    expect(rankFor(500).name).toBe("Commander");
    expect(rankFor(500).next).toBeNull();
  });

  it("a finished mission adds stars, badges and points once", () => {
    const sim = playMission(4);
    expect(sim.ending).not.toBeNull();
    const career = recordMission(EMPTY_CAREER, sim, "2026-11-14T00:00:00Z");
    const badges = missionBadges(sim);
    expect(career.points).toBe(sim.ending!.stars * POINTS.star + badges.length * POINTS.badge);
    expect(career.missions).toHaveLength(1);
    expect(career.badges).toEqual(badges);
  });

  it("sheltering through a solar storm earns 'Storm safe'", () => {
    let seed = 1;
    while (createSim(landed(), seed).storm.kind !== "solar") seed++;
    expect(missionBadges(playMission(seed))).toContain("stormSafe");
  });

  it("drills keep the best score and only improvements earn points", () => {
    const id = DRILLS[0].id;
    const total = DRILLS[0].questions.length;
    let c = recordDrill(EMPTY_CAREER, id, total - 1);
    expect(c.points).toBe(POINTS.drillPass);
    c = recordDrill(c, id, 1);
    expect(c.drills[id]).toBe(total - 1);
    expect(c.points).toBe(POINTS.drillPass);
    c = recordDrill(c, id, total);
    expect(c.points).toBe(POINTS.drillPerfect);
  });

  it("the game records a mission when it ends", () => {
    let s = next(landed(), { type: "START_SIMULATION" });
    s = next(s, { type: "BEGIN_SIM", seed: 4 });
    for (let i = 0; i < 40 && !s.sim!.ending; i++) {
      if (s.sim!.newUnlocks.length) s = next(s, { type: "SIM_DISMISS_UNLOCKS" });
      if (s.sim!.eventId) s = next(s, { type: "SIM_EVENT", index: 0 });
      s = next(s, { type: "SIM_RUN" });
      if (!s.sim!.ending) s = next(s, { type: "SIM_NEXT" });
    }
    expect(s.career.missions).toHaveLength(1);
    expect(s.career.points).toBeGreaterThan(0);
  });

  it("a damaged or strange saved career is cleaned up", () => {
    expect(readCareer(null)).toEqual(EMPTY_CAREER);
    const c = readCareer({ points: -5, drills: { power: 99, nope: 2 }, badges: ["buddy", "fake"], missions: "x" });
    expect(c.points).toBe(0);
    expect(c.drills).toEqual({});
    expect(c.badges).toEqual(["buddy"]);
    expect(c.missions).toEqual([]);
  });
});
