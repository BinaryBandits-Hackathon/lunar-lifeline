// Short labels for every option, used by the ending (path and blame list).
// FROZEN: must match the option labels in docs/design/04-story-plan.md.

import type { Choice, DecisionId } from "../types";

type L = { en: string; bn: string };

export const DECISION_LABELS: Record<DecisionId, Record<Choice, L>> = {
  1: { A: { en: "Land right away", bn: "এখনই ল্যান্ড করি" }, B: { en: "Patch the leak first", bn: "আগে লিকটা সারাই" } },
  2: { A: { en: "Flat ground by the rocket", bn: "রকেটের পাশে সমান জায়গায়" }, B: { en: "The ice crater", bn: "বরফের ক্রেটারে" } },
  3: { A: { en: "The heaters", bn: "হিটার" }, B: { en: "The fuel plant", bn: "ফুয়েল প্ল্যান্ট" } },
  4: { A: { en: "Wipe them in the storm", bn: "স্টর্মের মধ্যেই মুছে আসি" }, B: { en: "Wait it out", bn: "ওয়েট করি" } },
  5: { A: { en: "Everyone to the shelter", bn: "সবাই শেল্টারে চলো" }, B: { en: "Finish the job outside", bn: "বাইরের কাজটা শেষ করি" } },
  6: { A: { en: "Stack the water tanks", bn: "পানির ট্যাংক সাজাই" }, B: { en: "Keep the water", bn: "পানি রেখে দিই" } },
  7: { A: { en: "Leave them behind", bn: "রেখে যাই" }, B: { en: "Keep them", bn: "সাথে নিই" } },
  8: { A: { en: "Launch now", bn: "এখনই লঞ্চ" }, B: { en: "Wait one more sol", bn: "আরেক সোল ওয়েট" } },
};

/** The crisis each decision belongs to (for drawing the path). */
export const CRISIS_OF: Record<DecisionId, 1 | 2 | 3 | 4> = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4 };
