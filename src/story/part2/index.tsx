// PART 2: crisis 2 (decisions 3-4) and crisis 3 (decisions 5-6). Owned by Person 2.
// Must ask exactly decisions 3, 4, 5 and 6 (onChoose four times), then call onDone().

import { Beats } from "../core/Beats";
import type { PartProps } from "../types";
import { PART2_ART } from "./art";
import "./part2.css";
import { PART2_BEATS } from "./content";

export function Part2({ lang, readAloud, playerName, onChoose, onDone }: PartProps) {
  return <Beats beats={PART2_BEATS} art={PART2_ART} lang={lang} readAloud={readAloud} playerName={playerName} onChoose={onChoose} onDone={onDone} />;
}
