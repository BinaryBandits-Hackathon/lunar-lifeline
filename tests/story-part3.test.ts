// Part 3 checks: the text, the debrief science and their NASA sources.

import { describe, expect, it } from "vitest";
import type { Line } from "../src/story/core/Beats";
import { DEBRIEF, PART3_BEATS, SCIENCE } from "../src/story/part3/content";

const lines: Line[] = PART3_BEATS.flatMap((b) =>
  b.kind === "line" ? [b.line] : b.kind === "fact" ? [b.fact] : [b.question, b.a.label, b.a.detail, b.a.reaction, b.b.label, b.b.detail, b.b.reaction],
);
const texts = [...lines, ...SCIENCE.flatMap((c) => [c.title, c.body]), ...Object.values(DEBRIEF)];

describe("Part 3: the way home", () => {
  it("asks exactly four decisions (9-12)", () => {
    expect(PART3_BEATS.filter((b) => b.kind === "decide")).toHaveLength(4);
  });

  it("has Bangla for every line, with Bangla digits only", () => {
    for (const t of texts) {
      expect(t.bn.trim().length).toBeGreaterThan(0);
      expect(t.bn, `Latin digits in: ${t.bn}`).not.toMatch(/[0-9]/);
    }
  });

  it("every fact and science card links to a NASA page", () => {
    for (const b of PART3_BEATS) if (b.kind === "fact") expect(b.source).toMatch(/^https:\/\/([a-z]+\.)*nasa\.gov\//);
    for (const c of SCIENCE) expect(c.source).toMatch(/^https:\/\/([a-z]+\.)*nasa\.gov\//);
  });
});
