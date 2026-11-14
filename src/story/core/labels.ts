// Short labels for every option, used by the ending (path and blame list).
// Must match the option labels in docs/design/04-story-plan.md.

import type { Choice, DecisionId } from "../types";

type L = { en: string; bn: string };

export const DECISION_LABELS: Record<DecisionId, Record<Choice, L>> = {
  1: { A: { en: "Land right away", bn: "এখনই ল্যান্ড করি" }, B: { en: "Patch the leak first", bn: "আগে লিকটা সারাই" } },
  2: { A: { en: "Flat ground by the rocket", bn: "রকেটের পাশে সমান জায়গায়" }, B: { en: "The ice crater", bn: "বরফের ক্রেটারে" } },
  3: { A: { en: "The heaters", bn: "হিটার" }, B: { en: "The fuel plant", bn: "ফুয়েল প্ল্যান্ট" } },
  4: { A: { en: "Wipe them in the storm", bn: "স্টর্মের মধ্যেই মুছে আসি" }, B: { en: "Wait it out", bn: "ওয়েট করি" } },
  5: { A: { en: "Take power from the fuel plant", bn: "ফুয়েল প্ল্যান্টের পাওয়ার নিই" }, B: { en: "Open the spare oxygen", bn: "বাড়তি অক্সিজেন খুলে দিই" } },
  6: { A: { en: "Clean every suit", bn: "সব স্যুট পরিষ্কার করি" }, B: { en: "Skip the cleaning", bn: "পরিষ্কার বাদ দিই" } },
  7: { A: { en: "Everyone to the shelter", bn: "সবাই শেল্টারে চলো" }, B: { en: "Finish the job outside", bn: "বাইরের কাজটা শেষ করি" } },
  8: { A: { en: "Stack the water tanks", bn: "পানির ট্যাংক সাজাই" }, B: { en: "Keep the water", bn: "পানি রেখে দিই" } },
  9: { A: { en: "Tunde rests", bn: "তুন্দে বিশ্রাম নিক" }, B: { en: "Tunde keeps working", bn: "তুন্দে কাজ চালিয়ে যাক" } },
  10: { A: { en: "Fix the seal properly", bn: "সিলটা ঠিকমতো সারাই" }, B: { en: "A quick patch", bn: "তাড়াতাড়ি জোড়াতালি দিই" } },
  11: { A: { en: "Leave them behind", bn: "রেখে যাই" }, B: { en: "Keep them", bn: "সাথে নিই" } },
  12: { A: { en: "Launch now", bn: "এখনই লঞ্চ" }, B: { en: "Wait one more sol", bn: "আরেক সোল ওয়েট" } },
};

/** The crisis each decision belongs to (for drawing the path). */
export const CRISIS_OF: Record<DecisionId, 1 | 2 | 3 | 4 | 5 | 6> = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6 };
