import { describe, expect, it } from "vitest";
import { finalOutcome } from "../src/story/core/outcome";
import type { Choice } from "../src/story/types";

const all = Array.from({ length: 256 }, (_, i) => [...i.toString(2).padStart(8, "0")].map((c) => (c === "0" ? "A" : "B")) as Choice[]);
const run = (s: string) => finalOutcome([...s] as Choice[]);

describe("14 Sols hidden calculation (FROZEN: matches docs/design/04-story-plan.md)", () => {
  it("balance over all 256 paths", () => {
    const n = (f: (o: ReturnType<typeof finalOutcome>) => boolean) => all.map(finalOutcome).filter(f).length;
    console.log(`success ${n((o) => o.result === "success")}, fuel ${n((o) => o.reason === "fuel")}, health ${n((o) => o.reason === "health")}, time ${n((o) => o.reason === "time")}`);
    expect(n((o) => o.result === "success")).toBe(111);
    expect(n((o) => o.reason === "fuel")).toBe(61);
    expect(n((o) => o.reason === "health")).toBe(68);
    expect(n((o) => o.reason === "time")).toBe(16);
  });

  it("worked examples from the plan", () => {
    expect(run("AAAAAAAA")).toMatchObject({ result: "fail", reason: "fuel", fuel: 4, time: 5, health: 6 });
    expect(run("BBBBBBBB")).toMatchObject({ result: "fail", reason: "health", fuel: 12, time: 0, health: 0 });
    expect(run("AABAAAAA")).toMatchObject({ result: "success", fuel: 7, time: 5, health: 4 });
    expect(run("ABAAAAAA")).toMatchObject({ result: "success", fuel: 9, time: 5, health: 4 });
    expect(run("ABBAAAAA")).toMatchObject({ result: "success", fuel: 12, time: 5, health: 2 });
    expect(run("ABBABAAA")).toMatchObject({ result: "fail", reason: "health" });
  });

  it("blame lists only decisions the player chose, and only on a fail", () => {
    for (const c of all) {
      const o = finalOutcome(c);
      if (o.result === "success") expect(o.blame).toEqual([]);
      else expect(o.blame.length).toBeGreaterThan(0);
    }
    expect(run("AAAAAAAA").blame).toEqual([2, 3, 6, 8]);
  });
});
