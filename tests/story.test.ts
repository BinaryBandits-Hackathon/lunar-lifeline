import { describe, expect, it } from "vitest";
import { DECISIONS, finalOutcome } from "../src/story/core/outcome";
import { DECISION_LABELS } from "../src/story/core/labels";
import { PART_DECISIONS, type Choice } from "../src/story/types";

// Every possible path through the 12 decisions.
const all = Array.from({ length: 4096 }, (_, i) => [...i.toString(2).padStart(12, "0")].map((c) => (c === "0" ? "A" : "B")) as Choice[]);
const run = (s: string) => finalOutcome([...s] as Choice[]);

describe("14 Sols hidden calculation (matches docs/design/04-story-plan.md)", () => {
  it("balance over all 4,096 paths", () => {
    const n = (f: (o: ReturnType<typeof finalOutcome>) => boolean) => all.map(finalOutcome).filter(f).length;
    console.log(`success ${n((o) => o.result === "success")}, fuel ${n((o) => o.reason === "fuel")}, health ${n((o) => o.reason === "health")}, time ${n((o) => o.reason === "time")}`);
    expect(n((o) => o.result === "success")).toBe(1677);
    expect(n((o) => o.reason === "fuel")).toBe(1015);
    expect(n((o) => o.reason === "health")).toBe(956);
    expect(n((o) => o.reason === "time")).toBe(448);
  });

  it("worked examples from the plan", () => {
    expect(run("AAAAAAAAAAAA")).toMatchObject({ result: "fail", reason: "fuel", fuel: 4, time: 3, health: 9 });
    expect(run("BBBBBBBBBBBB")).toMatchObject({ result: "fail", reason: "health", fuel: 12, time: 1, health: -2 });
    expect(run("AABAAAAAAAAA")).toMatchObject({ result: "success", fuel: 7, time: 3, health: 7 });
    expect(run("ABAAAAAAAAAA")).toMatchObject({ result: "success", fuel: 9, time: 3, health: 7 });
    expect(run("ABBAAAAAAAAA")).toMatchObject({ result: "success", fuel: 12, time: 3, health: 5 });
    expect(run("ABBABBBAAAAA")).toMatchObject({ result: "fail", reason: "health" });
  });

  it("every option costs something: always-A and always-B both fail", () => {
    expect(run("AAAAAAAAAAAA").result).toBe("fail");
    expect(run("BBBBBBBBBBBB").result).toBe("fail");
  });

  it("blame lists only decisions the player chose, and only on a fail", () => {
    for (const c of all) {
      const o = finalOutcome(c);
      if (o.result === "success") expect(o.blame).toEqual([]);
      else expect(o.blame.length).toBeGreaterThan(0);
    }
    expect(run("AAAAAAAAAAAA").blame).toEqual([2, 3, 5, 8, 12]);
  });

  it("the parts ask all 12 decisions, in order, and every one has labels", () => {
    expect([...PART_DECISIONS[1], ...PART_DECISIONS[2], ...PART_DECISIONS[3]]).toEqual([...DECISIONS]);
    for (const id of DECISIONS) for (const c of ["A", "B"] as Choice[]) expect(DECISION_LABELS[id][c].en.length).toBeGreaterThan(0);
  });
});
