import { describe, expect, it } from "vitest";
import type { Level } from "../src/engine/types";
import { STRATEGIES, simulate } from "./bots";

const RUNS = 600;
const pct = (n: number, d: number) => `${Math.round((100 * n) / d)}%`.padStart(5);

function table(level: Level) {
  const rows = STRATEGIES.map((st) => ({ st, r: simulate(level, st, RUNS) }));
  console.log(
    `\n${level.toUpperCase()} (${RUNS} runs each)\n` +
      "strategy                         3-star   safe  grounded  early\n" +
      rows
        .map(({ st, r }) => `${st.name.padEnd(32)} ${pct(r.endings.commander, RUNS)}  ${pct(r.endings.safe, RUNS)}  ${pct(r.endings.grounded, RUNS)}    ${pct(r.endings.early, RUNS)}`)
        .join("\n"),
  );
  return Object.fromEntries(rows.map(({ st, r }) => [st.name.split(" ")[0], r]));
}

describe.each(["cadet", "commander"] as Level[])("balance at %s level", (level) => {
  const r = table(level);

  it("a thoughtful player usually wins", () => {
    expect(r.smart.threeStar).toBeGreaterThan(level === "cadet" ? 0.6 : 0.45);
  });

  it("playing it totally safe never earns 3 stars", () => {
    expect(r.turtle.threeStar).toBeLessThan(0.1);
  });

  it("chasing only science is risky", () => {
    expect(r.greedy.threeStar).toBeLessThan(r.smart.threeStar - 0.15);
  });

  it("ignoring the forecast does worse than a thoughtful player", () => {
    expect(r.ignores.threeStar).toBeLessThan(r.smart.threeStar);
  });

  it("random play loses often but not always", () => {
    const lost = (r.random.endings.early + r.random.endings.grounded) / r.random.runs;
    expect(lost).toBeGreaterThan(0.25);
    expect(lost).toBeLessThan(0.9);
  });
});
