import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { part2Art } from "../src/story/part2/art";
import { PART2_BEATS } from "../src/story/part2/content";
import { PART_DECISIONS, type Choice } from "../src/story/types";

const lines = PART2_BEATS.flatMap((b) =>
  b.kind === "line" ? [b.line] : b.kind === "fact" ? [b.fact] : [b.question, ...[b.a, b.b].flatMap((o) => [o.label, o.detail, o.reaction])],
);

describe("Part 2: Surviving Mars", () => {
  it("asks exactly its four decisions", () => {
    expect(PART2_BEATS.filter((b) => b.kind === "decide")).toHaveLength(PART_DECISIONS[2].length);
  });

  it("has every line in English and Bangla, with Bangla digits", () => {
    for (const l of lines) {
      expect(l.en.trim()).not.toBe("");
      expect(l.bn.trim()).not.toBe("");
      expect(l.bn).not.toMatch(/[0-9]/);
    }
  });

  it("shows one NASA fact per crisis, each with a source", () => {
    const facts = PART2_BEATS.filter((b) => b.kind === "fact");
    expect(facts).toHaveLength(2);
    for (const f of facts) expect(f.kind === "fact" && f.source).toMatch(/^https:\/\/.*nasa\.gov\//);
  });

  it("draws both scenes for every path, without words", () => {
    const keys = PART2_BEATS.flatMap((b) => (b.art ? [b.art] : []));
    expect(keys).toEqual(["dustStorm", "solarStorm"]);
    for (let n = 0; n <= 4; n++) {
      for (let i = 0; i < 1 << n; i++) {
        const mine = Array.from({ length: n }, (_, k) => ((i >> k) & 1 ? "B" : "A")) as Choice[];
        const art = part2Art({ choices: ["A", "B", ...mine] });
        for (const k of keys) {
          const svg = renderToStaticMarkup(createElement("div", null, art[k]()));
          expect(svg).toContain('viewBox="0 0 1600 900"');
          expect(svg).not.toMatch(/<text|<image/);
        }
      }
    }
  });
});
