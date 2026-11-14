// PART 1: prologue, crisis 1 (decisions 1-2) and the landing. Owned by Person 1.
// Must ask exactly decisions 1 and 2 (onChoose twice), then call onDone().

import { Beats } from "../core/Beats";
import type { PartProps } from "../types";
import { PART1_ART } from "./art";
import "./part1.css";
import { PART1_BEATS } from "./content";

export function Part1({ lang, readAloud, playerName, onChoose, onDone }: PartProps) {
  return <Beats beats={PART1_BEATS} art={PART1_ART} lang={lang} readAloud={readAloud} playerName={playerName} onChoose={onChoose} onDone={onDone} />;
}
