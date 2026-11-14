// PART 2: crisis 2 (decisions 3-4) and crisis 3 (decisions 5-6). Owned by Person 2.
// Must ask exactly decisions 3, 4, 5 and 6 (onChoose four times), then call onDone().
// Uses the shared Beats player so it looks like the rest of the story; the
// pictures follow the player's choices (see art.tsx).

import { useMemo } from "react";
import { Beats } from "../core/Beats";
import type { PartProps } from "../types";
import { part2Art } from "./art";
import "./part2.css";
import { PART2_BEATS } from "./content";

export function Part2({ choices, lang, readAloud, reduceMotion, playerName, onChoose, onDone }: PartProps) {
  const art = useMemo(() => part2Art({ choices }), [choices]);
  return (
    <div className={`story-p2${reduceMotion ? " story-p2-still" : ""}`}>
      <Beats beats={PART2_BEATS} art={art} lang={lang} readAloud={readAloud} playerName={playerName} onChoose={onChoose} onDone={onDone} />
    </div>
  );
}
