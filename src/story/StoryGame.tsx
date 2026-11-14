// The shell that runs the three parts of "14 Sols" in order. FROZEN.
// Part 1 asks decisions 1-2, part 2 asks 3-8, part 3 asks 9-12 and shows the ending.

import { useMemo, useState } from "react";
import { DECISIONS, finalOutcome } from "./core/outcome";
import { Part1 } from "./part1";
import { Part2 } from "./part2";
import { Part3 } from "./part3";
import type { Choice, Lang } from "./types";
import "./core/story.css";

export interface StoryGameProps {
  lang: Lang;
  readAloud: boolean;
  reduceMotion: boolean;
  playerName: string;
  onExit: () => void;
}

export function StoryGame({ lang, readAloud, reduceMotion, playerName, onExit }: StoryGameProps) {
  const [part, setPart] = useState<1 | 2 | 3>(1);
  const [choices, setChoices] = useState<Choice[]>([]);
  // A new key restarts every part's own state on "Try again".
  const [run, setRun] = useState(0);

  const outcome = useMemo(() => (choices.length === DECISIONS.length ? finalOutcome(choices) : null), [choices]);
  const common = {
    choices,
    lang,
    readAloud,
    reduceMotion,
    playerName: playerName.trim() || (lang === "bn" ? "কমান্ডার" : "Commander"),
    onChoose: (c: Choice) => setChoices((prev) => (prev.length < DECISIONS.length ? [...prev, c] : prev)),
  };

  return (
    <main className={`screen story-screen${reduceMotion ? " story-still" : ""}`} key={run}>
      {part === 1 && <Part1 {...common} onDone={() => setPart(2)} />}
      {part === 2 && <Part2 {...common} onDone={() => setPart(3)} />}
      {part === 3 && (
        <Part3
          {...common}
          outcome={outcome}
          onDone={onExit}
          onExit={onExit}
          onRestart={() => {
            setChoices([]);
            setPart(1);
            setRun((n) => n + 1);
          }}
        />
      )}
    </main>
  );
}
