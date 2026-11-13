import { describe, expect, it } from "vitest";
import { RULES } from "../src/content/rules";
import { availableBlocks, boardOutcome, currentCard, nextRandom, optionEffects, visibleOptions } from "../src/engine/base";
import { createInitialState, next } from "../src/engine/flow";
import type { Action, GameState, Level, RoleId, SiteId, System } from "../src/engine/types";

function toBase(level: Level = "cadet", role: RoleId = "engineer", site: SiteId = "plains", seed = 7): GameState {
  let s = [
    { type: "START" },
    { type: "SET_NAME", name: "Test" },
    { type: "PICK_ROLE", role },
    { type: "NEXT" },
  ].reduce((acc, a) => next(acc, a as Action), createInitialState({ level }));
  while (s.stage !== "landingChoice") s = next(s, { type: "NEXT" });
  s = next(next(s, { type: "PICK_SITE", site }), { type: "CONFIRM_SITE" });
  while (s.stage !== "damageReport") s = next(s, { type: "NEXT" });
  return next(s, { type: "BEGIN_SOL_1", seed });
}

function setBoard(s: GameState, a: Partial<Record<System, number>>): GameState {
  for (const sys of ["habitat", "greenhouse", "shield"] as System[]) {
    while (s.base!.allocation[sys] > 0) s = next(s, { type: "REMOVE_BLOCK", system: sys });
    for (let i = 0; i < (a[sys] ?? 0); i++) s = next(s, { type: "ADD_BLOCK", system: sys });
  }
  return s;
}

/** Plays sols with a fixed board and the first option until the given sol starts. */
function advanceTo(s: GameState, sol: number): GameState {
  while (s.base!.sol < sol && s.stage !== "ending") {
    s = next(setBoard(s, { habitat: 2, greenhouse: 1 }), { type: "CONFIRM_BOARD" });
    s = next(s, { type: "CHOOSE_OPTION", index: 0 });
    s = next(s, { type: "NEXT_SOL" });
  }
  return s;
}

describe("base game rules", () => {
  it("the same seed gives the same game", () => {
    const a = advanceTo(toBase("commander", "doctor", "plains", 99), 6);
    const b = advanceTo(toBase("commander", "doctor", "plains", 99), 6);
    expect(a.base!.seen).toEqual(b.base!.seen);
    expect(a.gauges).toEqual(b.gauges);
    expect(nextRandom(5)).toEqual(nextRandom(5));
  });

  it("cannot place more blocks than there is power", () => {
    let s = toBase();
    const avail = availableBlocks(s);
    for (let i = 0; i < avail + 5; i++) s = next(s, { type: "ADD_BLOCK", system: "greenhouse" });
    const a = s.base!.allocation;
    expect(a.habitat + a.greenhouse + a.shield).toBe(avail);
  });

  it("an underpowered habitat costs supplies", () => {
    const s = setBoard(toBase(), { habitat: 0, greenhouse: 0 });
    const out = boardOutcome(s);
    expect(out.supplies).toBe(-RULES.habitatNeed);
    expect(out.lines[0].tone).toBe("bad");
  });

  it("shield blocks are wasted when there is no solar storm", () => {
    const s = setBoard(toBase(), { habitat: 2, shield: 2 });
    expect(s.base!.storm.sol).not.toBe(1);
    expect(boardOutcome(s).lines.some((l) => l.text.includes("used up for nothing"))).toBe(true);
  });

  it("each shield block stops one point of solar storm radiation", () => {
    // Find a seed whose storm is solar, then play to the storm sol.
    let seed = 1;
    while (toBase("cadet", "engineer", "plains", seed).base!.storm.kind !== "solar") seed++;
    let s = advanceTo(toBase("cadet", "engineer", "plains", seed), toBase("cadet", "engineer", "plains", seed).base!.storm.sol);
    expect(s.base!.cardId).toBe("solar_storm");
    const strength = s.base!.storm.strength;
    const built = s.flags.includes("SHELTER_BUILT") ? RULES.shelterBuiltProtection : 0;
    s = setBoard(s, { habitat: 2, shield: 1 });
    expect(boardOutcome(s).dose).toBe(Math.max(0, strength - 1 - built));
  });

  it("warns two sols before launch, using the launch card's real costs", () => {
    const s = advanceTo(toBase("cadet"), 5);
    expect(s.base!.morning.some((l) => l.text.startsWith("Launch in 2 sols"))).toBe(true);
  });

  it("role perks change option costs", () => {
    const eng = toBase("cadet", "engineer", "iceValley");
    expect(eng.base!.cardId).toBe("repair_panels");
    const fix = visibleOptions(eng, currentCard(eng)!)[0];
    expect(fix.effects.power).toBe(-2);
    expect(optionEffects(eng, fix).power).toBe(-1);
    const doc = toBase("cadet", "doctor", "iceValley");
    expect(optionEffects(doc, fix).power).toBe(-2);
  });

  it("Cadet hides Commander-only options", () => {
    const s = toBase("cadet", "engineer", "iceValley");
    const card = currentCard(s)!;
    expect(visibleOptions(s, card).every((o) => !o.commander)).toBe(true);
  });

  it("running out of supplies ends the mission early", () => {
    let s = toBase("commander", "engineer", "plains", 3);
    for (let i = 0; i < 20 && s.stage !== "ending"; i++) {
      if (s.stage === "board") s = next(setBoard(s, {}), { type: "CONFIRM_BOARD" });
      else if (s.stage === "card") s = next(s, { type: "CHOOSE_OPTION", index: 0 });
      else s = next(s, { type: "NEXT_SOL" });
    }
    expect(s.stage).toBe("ending");
    expect(s.base!.ending!.type).toBe("early");
    expect(s.base!.ending!.sol).toBeLessThan(s.base!.totalSols);
  });

  it("replay goes back to the landing choice with a fresh base", () => {
    let s = toBase("cadet");
    s = advanceTo(s, 99);
    expect(s.stage).toBe("ending");
    s = next(s, { type: "REPLAY" });
    expect(s.stage).toBe("landingChoice");
    expect(s.base).toBeNull();
    expect(s.player.name).toBe("Test");
  });
});
