import { describe, expect, it } from "vitest";
import { ROLES } from "../src/content/roles";
import { createInitialState, fillText, linesFor, next } from "../src/engine/flow";
import type { Action, GameState, Level, RoleId, SiteId } from "../src/engine/types";

function run(state: GameState, actions: Action[]): GameState {
  return actions.reduce(next, state);
}

/** Presses Next until the stage changes (or a safety limit is hit). */
function nextUntilStageChanges(state: GameState): GameState {
  const start = state.stage;
  for (let i = 0; i < 20 && state.stage === start; i++) state = next(state, { type: "NEXT" });
  return state;
}

function playToSol1(level: Level, role: RoleId, site: SiteId): GameState {
  let s = run(createInitialState({ level }), [
    { type: "START" },
    { type: "SET_NAME", name: "Nova" },
    { type: "PICK_ROLE", role },
    { type: "NEXT" },
  ]);
  expect(s.stage).toBe("approach");
  s = nextUntilStageChanges(s); // approach → alarm
  s = nextUntilStageChanges(s); // alarm → briefing
  s = nextUntilStageChanges(s); // briefing → landingChoice
  expect(s.stage).toBe("landingChoice");
  s = run(s, [{ type: "PICK_SITE", site }, { type: "CONFIRM_SITE" }]);
  expect(s.stage).toBe("descent");
  s = nextUntilStageChanges(s); // descent → touchdown
  s = nextUntilStageChanges(s); // touchdown → damageReport
  expect(s.stage).toBe("damageReport");
  return s;
}

// Hand-off table from docs/design/01-opening-sequence.md, section 9.
const HANDOFF: { level: Level; site: SiteId; power: number; supplies: number; dose: number; flags: string[] }[] = [
  { level: "cadet", site: "plains", power: 6, supplies: 8, dose: 0, flags: ["FAR_FROM_ICE"] },
  { level: "cadet", site: "iceValley", power: 3, supplies: 9, dose: 0, flags: ["NEAR_ICE", "PANELS_DAMAGED"] },
  { level: "commander", site: "holdOrbit", power: 6, supplies: 7, dose: 2, flags: ["NEAR_ICE"] },
];

describe("opening sequence", () => {
  for (const role of ROLES) {
    for (const h of HANDOFF) {
      it(`${role.name} landing at ${h.site} (${h.level}) reaches Sol 1 with the right state`, () => {
        const report = playToSol1(h.level, role.id, h.site);
        expect(report.gauges).toEqual({ power: h.power, supplies: h.supplies, dose: h.dose, science: 0 });
        expect([...report.flags].sort()).toEqual([...h.flags].sort());
        expect(report.player.role).toBe(role.id);

        const s = next(report, { type: "BEGIN_SOL_1", seed: 42 });
        expect(s.stage).toBe("board");
        expect(s.base?.sol).toBe(1);
        // Cadets get a 2-supply cushion when the base game starts.
        expect(s.gauges.supplies).toBe(Math.min(10, h.supplies + (h.level === "cadet" ? 2 : 0)));
        expect(s.seenIntro).toBe(true);
      });
    }
  }

  it("will not leave the badge screen without a name and a role", () => {
    let s = run(createInitialState(), [{ type: "START" }, { type: "NEXT" }]);
    expect(s.stage).toBe("badge");
    s = run(s, [{ type: "SET_NAME", name: "   " }, { type: "PICK_ROLE", role: "doctor" }, { type: "NEXT" }]);
    expect(s.stage).toBe("badge");
    s = run(s, [{ type: "SET_NAME", name: "  Luna " }, { type: "NEXT" }]);
    expect(s.stage).toBe("approach");
    expect(s.player.name).toBe("Luna");
  });

  it("cuts long names to 16 characters", () => {
    const s = run(createInitialState(), [{ type: "START" }, { type: "SET_NAME", name: "A".repeat(40) }]);
    expect(s.player.name).toHaveLength(16);
  });

  it("refuses the orbit option at Cadet level", () => {
    let s = playToLandingChoice("cadet");
    s = next(s, { type: "PICK_SITE", site: "holdOrbit" });
    expect(s.pendingSite).toBeNull();
    s = next(s, { type: "CONFIRM_SITE" });
    expect(s.stage).toBe("landingChoice");
  });

  it("allows the orbit option at Commander level", () => {
    const s = next(playToLandingChoice("commander"), { type: "PICK_SITE", site: "holdOrbit" });
    expect(s.pendingSite).toBe("holdOrbit");
  });

  it("skip goes to the landing choice, not the base, and only after a first run", () => {
    expect(next(createInitialState(), { type: "SKIP_INTRO" }).stage).toBe("title");
    const done = next(playToSol1("cadet", "engineer", "iceValley"), { type: "BEGIN_SOL_1" });
    const back = next(done, { type: "RESTART" });
    expect(back.stage).toBe("title");
    expect(back.gauges.power).toBe(6);
    expect(back.flags).toEqual([]);
    const skipped = next(back, { type: "SKIP_INTRO" });
    expect(skipped.stage).toBe("landingChoice");
    expect(skipped.player.name).toBe("Nova");
  });

  it("fills the player's name and role into Pip's lines", () => {
    let s = run(createInitialState(), [
      { type: "START" },
      { type: "SET_NAME", name: "Kai" },
      { type: "PICK_ROLE", role: "scientist" },
      { type: "NEXT" },
    ]);
    const lines = linesFor(s).map((l) => fillText(l.text, s));
    expect(lines[0]).toContain("Hello, Kai!");
    expect(lines[1]).toContain("You are our scientist.");
    s = nextUntilStageChanges(nextUntilStageChanges(s));
    expect(fillText(linesFor(s)[0].text, s)).toContain("12 minutes");
  });

  it("ignores actions that don't belong to the current stage", () => {
    const s = createInitialState();
    expect(next(s, { type: "CONFIRM_SITE" })).toBe(s);
    expect(next(s, { type: "BEGIN_SOL_1" })).toBe(s);
    expect(next(s, { type: "PICK_SITE", site: "plains" })).toBe(s);
  });
});

function playToLandingChoice(level: Level): GameState {
  let s = run(createInitialState({ level }), [
    { type: "START" },
    { type: "SET_NAME", name: "Rio" },
    { type: "PICK_ROLE", role: "engineer" },
    { type: "NEXT" },
  ]);
  for (let i = 0; i < 3; i++) s = nextUntilStageChanges(s);
  return s;
}

describe("after landing", () => {
  it("the systems check leads to the simulation start, and stops there", () => {
    let s = run(createInitialState(), [
      { type: "START" },
      { type: "SET_NAME", name: "Ada" },
      { type: "PICK_ROLE", role: "doctor" },
      { type: "NEXT" },
    ]);
    for (let i = 0; i < 20 && s.stage !== "landingChoice"; i++) s = next(s, { type: "NEXT" });
    s = run(s, [{ type: "PICK_SITE", site: "plains" }, { type: "CONFIRM_SITE" }]);
    for (let i = 0; i < 20 && s.stage !== "damageReport"; i++) s = next(s, { type: "NEXT" });
    s = next(s, { type: "START_SIMULATION" });
    expect(s.stage).toBe("simReady");
    expect(s.seenIntro).toBe(true);
    expect(s.base).toBeNull();
    expect(next(s, { type: "NEXT" })).toBe(s);
  });
});

import { startQuick } from "../src/engine/quickStart";
describe("quick start", () => {
  it("starts on sol 3 of a Cadet mission with a real solar storm on sol 4", () => {
    const s = next(createInitialState(), { type: "QUICK_START" });
    expect(s.stage).toBe("sim");
    expect(s.sim!.sol).toBe(3);
    expect(s.sim!.quickStart).toBe(true);
    expect(s.sim!.storm.kind).toBe("solar");
    expect(s.sim!.storm.sol).toBe(4);
    expect(s.player.name).toBe("Nova");
    expect(startQuick(createInitialState()).level).toBe("cadet");
  });
});
