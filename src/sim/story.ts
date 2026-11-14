import { BN_STORY, bnSent } from "../content/bn";
import { RADIO_DELAY_MIN } from "../content/script";
import type { SimState } from "./types";

// Small story beats so the crew feel like people, not bars.
// One crew line after each sol (what happened to them), and a message from
// Earth on a few sols, always arriving late because of the radio delay.

export interface StoryBeat {
  crew: { name: string; line: string } | null;
  earth: { from: string; text: string } | null;
}

/** What a crewmate says after the sol, picked from what really happened. */
function crewLine(sim: SimState): StoryBeat["crew"] {
  const r = sim.report;
  if (!r) return null;
  const notes = r.notes.map((n) => n.text);
  const others = sim.crew.filter((c) => !c.isPlayer);
  const pick = others[(sim.sol + others.length) % others.length] ?? sim.crew[0];
  const has = (s: string) => notes.some((t) => t.toLowerCase().includes(s.toLowerCase()));

  if (has("during the storm") && has("got")) return { name: pick.name, line: "My radiation badge beeped all day. Next time I'm going straight to the shelter." };
  if (has("safe in the shelter")) return { name: pick.name, line: "Squeezed into the shelter with everyone. Tight, but the storm couldn't touch us." };
  if (has("explored the")) return { name: pick.name, line: "I've never seen rocks like that. My boots are full of red dust!" };
  if (has("Greenhouse harvest") || r.ledger.some((l) => l.cause === "Greenhouse harvest")) return { name: pick.name, line: "Fresh lettuce! After months of space food, it tastes like a party." };
  if (has("suit alarm")) return { name: pick.name, line: "When that suit alarm went off, my heart jumped. Good thing we had a buddy." };
  if (has("heaters") && has("power")) return { name: pick.name, line: "Brr. The heaters went off in the night. I slept in my jacket." };
  if (has("not enough power")) return { name: pick.name, line: "Some machines switched off today. We need to plan our power better." };
  if (sim.crew.some((c) => c.energy < 30)) return { name: sim.crew.find((c) => c.energy < 30)!.name, line: "I'm so tired. Can I rest tomorrow, please?" };
  if (has("Spacewalk cancelled")) return { name: pick.name, line: "We had our helmets on and then had to stop. Let's fix the plan and try again." };
  const quiet = [
    "Look at the sunset: on Mars it's blue! I took a picture for my family.",
    "I can see Earth tonight. It's just a tiny bright dot.",
    "Everything worked today. That's the best kind of sol.",
    "I miss rain. Mars is so quiet and dry.",
  ];
  return { name: pick.name, line: quiet[sim.sol % quiet.length] };
}

/** Messages from Earth on a few sols. They always arrive late: the radio delay is real. */
function earthMessage(sim: SimState, bangla: boolean): StoryBeat["earth"] {
  const late = bangla ? bnSent(RADIO_DELAY_MIN) : `sent ${RADIO_DELAY_MIN} minutes ago`;
  const w = (en: string) => (bangla ? (BN_STORY[en] ?? en) : en);
  const last = sim.totalSols;
  if (sim.sol === 1) return { from: `${w("Mission Control")} (${late})`, text: w("We saw your landing on our screens. The whole room cheered! You're in charge now: we can't answer fast enough to help.") };
  if (sim.sol === 2) return { from: bangla ? `${sim.crew[1]?.name ?? "Mei"}-এর ${w("family")} (${late})` : `${sim.crew[1]?.name ?? "Mei"}'s family (${late})`, text: w("We put a photo of you on the fridge. The cat sits next to it every day.") };
  if (sim.storm.kind === "solar" && sim.sol === sim.storm.sol - 1)
    return { from: `${w("NASA space weather team")} (${late})`, text: w("A burst of fast particles left the Sun. It reaches Mars tomorrow. Stay in the shelter.") };
  if (sim.sol === last - 1) return { from: `${w("A school on Earth")} (${late})`, text: w("Our class follows your mission every morning. What does Mars smell like?") };
  return null;
}

export function storyFor(sim: SimState, bangla = false): StoryBeat {
  const crew = crewLine(sim);
  return { crew: crew && bangla ? { ...crew, line: BN_STORY[crew.line] ?? crew.line } : crew, earth: earthMessage(sim, bangla) };
}
