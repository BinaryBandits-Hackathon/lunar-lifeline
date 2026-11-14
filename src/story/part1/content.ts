// PART 1 text: prologue, crisis 1 (decisions 1-2) and the landing.
// Owned by Person 1. English must match docs/design/04-story-plan.md exactly.
// Bangla is a first draft in everyday style; Person 1 reviews it.

import type { Beat } from "../core/Beats";

export const PART1_BEATS: Beat[] = [
  // Prologue
  { kind: "line", art: "ship", line: { who: "pip", en: "Good morning, {name}! Day 412 of our mission. We are orbiting Mars.", bn: "গুড মর্নিং, {name}! আমাদের মিশনের ৪১২ নম্বর দিন। আমরা এখন মঙ্গলের চারপাশে ঘুরছি।" } },
  { kind: "line", line: { who: "pip", en: "Tomorrow we start the long trip home to Earth.", bn: "কালকে আমরা পৃথিবীতে ফেরার লম্বা জার্নি শুরু করব।" } },
  { kind: "line", line: { en: "CRACK! A tiny meteoroid, smaller than a pea, smashes into the ship at 10 kilometres a second.", bn: "ঠাস! মটরদানার চেয়েও ছোট একটা উল্কা সেকেন্ডে ১০ কিলোমিটার স্পিডে স্পেসশিপে এসে লাগল।" } },
  { kind: "line", line: { who: "tunde", en: "The main engine is dead! And an oxygen tank is leaking!", bn: "মেইন ইঞ্জিন বন্ধ হয়ে গেছে! আর একটা অক্সিজেন ট্যাংক লিক করছে!" } },
  { kind: "line", line: { who: "pip", en: "There is one way home. Years ago NASA landed an empty return rocket on Mars, ready for a crew like us. It can make its own fuel from Mars air and water.", bn: "বাসায় ফেরার একটাই রাস্তা আছে। অনেক বছর আগে নাসা মঙ্গলে একটা খালি রিটার্ন রকেট নামিয়ে রেখেছিল, আমাদের মতো ক্রুদের জন্য। ওটা মঙ্গলের বাতাস আর পানি দিয়ে নিজের ফুয়েল নিজেই বানাতে পারে।" } },
  { kind: "line", line: { who: "pip", en: "But Earth and Mars line up for the trip home only once every 26 months. Our window closes in 14 sols. A sol is one day on Mars.", bn: "কিন্তু বাসায় ফেরার জন্য পৃথিবী আর মঙ্গল ঠিক লাইনে আসে ২৬ মাসে মাত্র একবার। আমাদের হাতে আছে ১৪ সোল। সোল মানে মঙ্গলের এক দিন।" } },

  // Crisis 1: The broken ship
  { kind: "line", art: "orbit", line: { en: "The oxygen tank hisses. Mars fills the window below.", bn: "অক্সিজেন ট্যাংক থেকে শোঁ শোঁ আওয়াজ আসছে। নিচে জানালা জুড়ে শুধু মঙ্গল।" } },
  {
    kind: "decide",
    question: { who: "pip", en: "The oxygen tank is leaking. What do we do?", bn: "অক্সিজেন ট্যাংক লিক করছে। এখন কী করব?" },
    a: {
      label: { en: "Land right away", bn: "এখনই ল্যান্ড করি" },
      detail: { en: "The leak keeps hissing until we touch down.", bn: "নামা পর্যন্ত লিক চলতেই থাকবে।" },
      reaction: { en: "We dive toward Mars. The hiss grows louder all the way down.", bn: "আমরা মঙ্গলের দিকে নামতে শুরু করলাম। নামতে নামতে শোঁ শোঁ আওয়াজ আরও বাড়তে থাকল।" },
    },
    b: {
      label: { en: "Patch the leak first", bn: "আগে লিকটা সারাই" },
      detail: { en: "A spacewalk to fix it. It takes time.", bn: "স্পেসওয়াক করে ঠিক করতে হবে। সময় লাগবে।" },
      reaction: { en: "Tunde floats outside with a patch kit. The hiss stops, but the clock keeps ticking.", bn: "তুন্দে প্যাচ কিট নিয়ে বাইরে ভেসে গেল। আওয়াজ থামল, কিন্তু ঘড়ি তো চলছেই।" },
    },
  },
  {
    kind: "decide",
    question: { who: "pip", en: "Where should we land?", bn: "কোথায় ল্যান্ড করব?" },
    a: {
      label: { en: "Flat ground by the rocket", bn: "রকেটের পাশে সমান জায়গায়" },
      detail: { en: "A safe landing, but the ice is far away.", bn: "ল্যান্ডিং সেফ, কিন্তু বরফ অনেক দূরে।" },
      reaction: { en: "A soft landing on smooth red ground. The rocket stands right beside us.", bn: "সমান লাল মাটিতে আস্তে করে নামলাম। রকেটটা একদম পাশেই দাঁড়িয়ে আছে।" },
    },
    b: {
      label: { en: "The ice crater", bn: "বরফের ক্রেটারে" },
      detail: { en: "Water for fuel nearby, but a rough landing.", bn: "ফুয়েলের জন্য পানি কাছেই, কিন্তু ল্যান্ডিংয়ে ঝাঁকুনি লাগবে।" },
      reaction: { en: "BUMP! BUMP! We land hard on the rocky crater floor. Ice glitters close by.", bn: "ধাম! ধাম! পাথুরে ক্রেটারে জোরে নামলাম। পাশেই বরফ চকচক করছে।" },
    },
  },

  // Landing
  { kind: "line", art: "descent", line: { who: "pip", en: "Heat shield on! The air outside glows hot.", bn: "হিট শিল্ড অন! বাইরের বাতাস গরমে জ্বলছে।" } },
  { kind: "line", line: { who: "pip", en: "Parachute open!", bn: "প্যারাশুট খুলে গেছে!" } },
  { kind: "line", line: { who: "pip", en: "Rockets firing... touchdown!", bn: "রকেট চালু... ল্যান্ডিং ডান!" } },

  {
    kind: "fact",
    fact: { en: "Space Station crews have tracked down and fixed real air leaks in space.", bn: "স্পেস স্টেশনের অ্যাস্ট্রোনটরা সত্যি সত্যি মহাকাশে বাতাসের লিক খুঁজে বের করে ঠিক করেছে।" },
    source: "https://blogs.nasa.gov/spacestation/2020/09/29/crew-continues-troubleshooting-as-tests-isolate-small-leak",
  },
];
