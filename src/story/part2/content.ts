// PART 2 text: crisis 2 (decisions 3-4) and crisis 3 (decisions 5-6).
// Owned by Person 2. English must match docs/design/04-story-plan.md exactly.
// Bangla is a first draft in everyday style; Person 2 reviews it.

import type { Beat } from "../core/Beats";

export const PART2_BEATS: Beat[] = [
  // Crisis 2: The dust storm (sol 4)
  { kind: "line", art: "dustStorm", line: { en: "Sol 4. The sky turns orange-brown. A dust storm is rolling over the whole planet.", bn: "৪ নম্বর সোল। আকাশ কমলা-বাদামি হয়ে গেল। পুরো গ্রহ জুড়ে ডাস্ট স্টর্ম আসছে।" } },
  { kind: "line", line: { who: "tunde", en: "The solar panels are covered. They make almost no power.", bn: "সোলার প্যানেল ধুলায় ঢেকে গেছে। প্রায় কোনো পাওয়ারই আসছে না।" } },
  {
    kind: "decide",
    question: { who: "pip", en: "There is only enough power for one thing. What gets it?", bn: "পাওয়ার আছে শুধু একটা জিনিসের জন্য। কোনটা চালাব?" },
    a: {
      label: { en: "The heaters", bn: "হিটার" },
      detail: { en: "The crew stays warm. The fuel plant waits.", bn: "সবাই গরম থাকবে। ফুয়েল প্ল্যান্ট বন্ধ থাকবে।" },
      reaction: { en: "The base stays warm. The fuel plant goes quiet.", bn: "বেস গরম থাকল। ফুয়েল প্ল্যান্ট চুপ হয়ে গেল।" },
    },
    b: {
      label: { en: "The fuel plant", bn: "ফুয়েল প্ল্যান্ট" },
      detail: { en: "More fuel, but nights drop to −75 °C.", bn: "ফুয়েল বেশি হবে, কিন্তু রাতে তাপমাত্রা মাইনাস ৭৫ ডিগ্রিতে নামবে।" },
      reaction: { en: "The fuel plant hums. Mei wraps everyone in blankets as frost grows on the windows.", bn: "ফুয়েল প্ল্যান্ট চলছে। জানালায় বরফ জমছে, আর মেই সবাইকে কম্বলে মুড়িয়ে দিল।" },
    },
  },
  {
    kind: "decide",
    question: { who: "pip", en: "The panels are buried in dust. What now?", bn: "প্যানেলগুলো ধুলার নিচে চাপা পড়ে গেছে। এখন কী করব?" },
    a: {
      label: { en: "Wipe them in the storm", bn: "স্টর্মের মধ্যেই মুছে আসি" },
      detail: { en: "Go out into the dust with a brush.", bn: "ব্রাশ নিয়ে ধুলার মধ্যে বাইরে যাব।" },
      reaction: { en: "Someone steps into the swirling dust with a brush. The wind pushes hard.", bn: "একজন ব্রাশ হাতে ঘূর্ণি ধুলার মধ্যে বের হলো। বাতাস জোরে ধাক্কা দিচ্ছে।" },
    },
    b: {
      label: { en: "Wait it out", bn: "ওয়েট করি" },
      detail: { en: "Stay safe inside until the dust settles.", bn: "ধুলা না থামা পর্যন্ত ভিতরে সেফ থাকি।" },
      reaction: { en: "We wait inside and watch the dust race past. Two sols slip away.", bn: "আমরা ভিতরে বসে বাইরে ধুলা উড়তে দেখলাম। দুইটা সোল চলে গেল।" },
    },
  },
  {
    kind: "fact",
    fact: { en: "In 2018 a dust storm covered all of Mars. It blocked the sunlight that NASA's Opportunity rover needed for power, and the rover never woke up again.", bn: "২০১৮ সালে একটা ডাস্ট স্টর্ম পুরো মঙ্গল ঢেকে ফেলেছিল। নাসার অপরচুনিটি রোভারের পাওয়ারের জন্য যে সূর্যের আলো লাগত, সেটা আটকে গিয়েছিল, আর রোভারটা আর কখনো জাগেনি।" },
    source: "https://science.nasa.gov/missions/mer/nasas-opportunity-rover-mission-on-mars-comes-to-end/",
  },

  // Crisis 3: The solar storm (sol 8)
  { kind: "line", art: "solarStorm", line: { en: "Sol 8. A message from Earth arrives. It was sent 12 minutes ago, because radio takes that long to reach Mars.", bn: "৮ নম্বর সোল। পৃথিবী থেকে একটা মেসেজ আসল। এটা পাঠানো হয়েছিল ১২ মিনিট আগে, কারণ মঙ্গলে রেডিও পৌঁছাতে এতক্ষণ লাগে।" } },
  { kind: "line", line: { who: "earth", en: "\"NASA's space weather team saw a burst of fast particles leave the Sun. It hits Mars today.\"", bn: "\"নাসার স্পেস ওয়েদার টিম দেখেছে, সূর্য থেকে অনেক জোরে কিছু পার্টিকেল ছুটে বের হয়েছে। আজকেই মঙ্গলে লাগবে।\"" } },
  { kind: "line", line: { who: "pip", en: "Fast particles are radiation. Walls and water slow them down.", bn: "এই জোরে ছোটা পার্টিকেলগুলোই রেডিয়েশন। দেয়াল আর পানি এগুলোকে আটকায়।" } },
  {
    kind: "decide",
    question: { who: "pip", en: "The fuel line isn't connected yet. What do we do?", bn: "ফুয়েল লাইন এখনো কানেক্ট করা হয়নি। কী করব?" },
    a: {
      label: { en: "Everyone to the shelter", bn: "সবাই শেল্টারে চলো" },
      detail: { en: "Safe inside. The fuel line waits.", bn: "ভিতরে সেফ। ফুয়েল লাইনের কাজ পরে।" },
      reaction: { en: "We squeeze into the shelter and shut the door. Outside, the fuel line lies unfinished.", bn: "সবাই ঠাসাঠাসি করে শেল্টারে ঢুকে দরজা বন্ধ করলাম। বাইরে ফুয়েল লাইন অর্ধেক পড়ে রইল।" },
    },
    b: {
      label: { en: "Finish the job outside", bn: "বাইরের কাজটা শেষ করি" },
      detail: { en: "Connect the fuel line first, then shelter.", bn: "আগে ফুয়েল লাইন কানেক্ট, তারপর শেল্টার।" },
      reaction: { en: "Tunde's radiation badge beeps faster and faster as he tightens the last bolt.", bn: "তুন্দে শেষ বোল্টটা টাইট দিচ্ছে, আর ওর রেডিয়েশন ব্যাজ আরও জোরে বিপ বিপ করছে।" },
    },
  },
  {
    kind: "decide",
    question: { who: "pip", en: "Water blocks radiation. Should we build a water wall?", bn: "পানি রেডিয়েশন আটকায়। পানি দিয়ে একটা দেয়াল বানাব?" },
    a: {
      label: { en: "Stack the water tanks", bn: "পানির ট্যাংক সাজাই" },
      detail: { en: "A shield around the shelter. The water gets used up.", bn: "শেল্টারের চারপাশে একটা শিল্ড হবে। কিন্তু পানি খরচ হয়ে যাবে।" },
      reaction: { en: "We stack the water tanks around the shelter like bricks.", bn: "আমরা ইটের মতো করে শেল্টারের চারপাশে পানির ট্যাংক সাজিয়ে দিলাম।" },
    },
    b: {
      label: { en: "Keep the water", bn: "পানি রেখে দিই" },
      detail: { en: "Save it for making fuel.", bn: "ফুয়েল বানানোর জন্য রেখে দিই।" },
      reaction: { en: "We leave the water tanks by the fuel plant.", bn: "পানির ট্যাংকগুলো ফুয়েল প্ল্যান্টের পাশেই রেখে দিলাম।" },
    },
  },
  {
    kind: "fact",
    fact: { en: "In September 2017 a real solar storm hit Mars, and NASA's Curiosity rover measured the radiation on the ground more than double.", bn: "২০১৭ সালের সেপ্টেম্বরে একটা আসল সোলার স্টর্ম মঙ্গলে লেগেছিল, আর নাসার কিউরিওসিটি রোভার মেপে দেখেছিল মাটিতে রেডিয়েশন দ্বিগুণেরও বেশি হয়ে গেছে।" },
    source: "https://www.jpl.nasa.gov/news/large-solar-storm-sparks-global-aurora-and-doubles-radiation-levels-on-the-martian-surface/",
  },
];
