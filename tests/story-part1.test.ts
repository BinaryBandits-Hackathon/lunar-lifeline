// Part 1 checks (owned by Person 1): the text matches the master story and the
// part asks exactly decisions 1 and 2.

import { describe, expect, it } from "vitest";
import { PART1_BEATS, PART1_CHAPTERS } from "../src/story/part1/content";
import type { Line } from "../src/story/core/Beats";

// The master story, read as plain text (Vite ?raw import, no Node types needed).
import master from "../docs/design/04-story-plan.md?raw";

const lines: Line[] = PART1_BEATS.flatMap((b) =>
  b.kind === "line" ? [b.line] : b.kind === "fact" ? [b.fact] : [b.question, b.a.label, b.a.detail, b.a.reaction, b.b.label, b.b.detail, b.b.reaction],
);

describe("Part 1: The fall", () => {
  it("asks exactly two decisions (1 and 2)", () => {
    expect(PART1_BEATS.filter((b) => b.kind === "decide")).toHaveLength(2);
  });

  it("uses the master story's English word for word", () => {
    for (const l of lines) expect(master, `not in the master story: "${l.en}"`).toContain(l.en);
  });

  it("has Bangla for every line, with Bangla digits only", () => {
    for (const l of lines) {
      expect(l.bn.trim().length).toBeGreaterThan(0);
      expect(l.bn, `Latin digits in: ${l.bn}`).not.toMatch(/[0-9]/);
    }
  });

  it("avoids the bookish Bangla words the style guide bans", () => {
    for (const l of lines) for (const word of ["বিকিরণ", "অবতরণ", "মহাকাশযান", "সৌরঝড়", "মহাকাশে"]) expect(l.bn).not.toContain(word);
  });

  it("ends with a NASA fact that links to its source", () => {
    const last = PART1_BEATS[PART1_BEATS.length - 1];
    expect(last.kind).toBe("fact");
    if (last.kind === "fact") expect(last.source).toMatch(/^https:\/\/[a-z.]*nasa\.gov\//);
  });

  it("chapter labels start at the prologue and stay in order", () => {
    expect(PART1_CHAPTERS[0].from).toBe(0);
    const starts = PART1_CHAPTERS.map((c) => c.from);
    expect([...starts].sort((a, b) => a - b)).toEqual(starts);
  });
});

import { ITEMS, SOLS } from "../src/story/part1/buildContent";

describe("Part 1 build days (sols 1-3)", () => {
  const texts = [...SOLS.flatMap((s) => [s.title, s.start, s.end.line]), ...ITEMS.flatMap((it) => [it.name, it.fact, it.stat, ...it.why])];

  it("has three sols with two things to build on each", () => {
    expect(SOLS.map((s) => s.n)).toEqual([1, 2, 3]);
    for (const s of SOLS) expect(ITEMS.filter((it) => it.sol === s.n)).toHaveLength(2);
  });

  it("builds everything Part 2 expects to exist on sol 4", () => {
    const ids = ITEMS.map((it) => it.id);
    for (const needed of ["habitat", "panels", "water", "fuel"] as const) expect(ids).toContain(needed);
  });

  it("has Bangla for every line, with Bangla digits only", () => {
    for (const t of texts) {
      expect(t.en.trim().length).toBeGreaterThan(0);
      expect(t.bn.trim().length).toBeGreaterThan(0);
      expect(t.bn, `Latin digits in: ${t.bn}`).not.toMatch(/[0-9]/);
    }
  });

  it("every fact links to a NASA page", () => {
    for (const it of ITEMS) expect(it.source).toMatch(/^https:\/\/([a-z]+\.)*nasa\.gov\//);
  });
});
