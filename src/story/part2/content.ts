// PART 2 text, sols 4-8: crisis 2 (dust storm, decisions 3-4), crisis 3 (bad
// air, decisions 5-6) and crisis 4 (solar storm, decisions 7-8).
// English must match docs/design/04-story-plan.md exactly.
// Every fact is real and links to the NASA page it comes from.

import type { Beat } from "../core/Beats";

export type Part2ArtKey = "dustStorm" | "dustClear" | "badAir" | "warning" | "solarStorm";

export interface Chapter {
  from: number;
  en: string;
  bn: string;
}

export const PART2_BEATS: Beat[] = [
  // ---------- Crisis 2: The dust storm (sol 4) ----------
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
  { kind: "line", art: "dustClear", line: { en: "When the storm passes, a gust of wind sweeps across the base and blows some dust off the panels.", bn: "স্টর্ম থামার পর এক ঝটকা বাতাস বেসের উপর দিয়ে বয়ে গেল, আর প্যানেলের কিছু ধুলা উড়িয়ে নিয়ে গেল।" } },
  { kind: "line", line: { who: "tunde", en: "Lucky! Wind did the same for NASA's Spirit rover. It cleaned its panels more than once.", bn: "লাকি! নাসার স্পিরিট রোভারের সাথেও বাতাস এমন করেছিল। একাধিকবার ওর প্যানেল পরিষ্কার করে দিয়েছিল।" } },
  {
    kind: "fact",
    fact: { en: "In 2018 a dust storm covered all of Mars. It blocked the sunlight that NASA's Opportunity rover needed for power, and the rover never woke up again.", bn: "২০১৮ সালে একটা ডাস্ট স্টর্ম পুরো মঙ্গল ঢেকে ফেলেছিল। নাসার অপরচুনিটি রোভারের পাওয়ারের জন্য যে সূর্যের আলো লাগত, সেটা আটকে গিয়েছিল, আর রোভারটা আর কখনো জাগেনি।" },
    source: "https://science.nasa.gov/missions/mer/nasas-opportunity-rover-mission-on-mars-comes-to-end/",
  },

  // ---------- Crisis 3: Bad air (sol 6) ----------
  { kind: "line", art: "badAir", line: { en: "Sol 6. Inside the base, everyone feels tired, and heads start to ache.", bn: "৬ নম্বর সোল। বেসের ভিতরে সবাই ক্লান্ত লাগছে, আর মাথা ব্যথা শুরু হয়েছে।" } },
  { kind: "line", line: { who: "mei", en: "It's carbon dioxide, the gas we breathe out. It is building up in here.", bn: "এটা কার্বন ডাই-অক্সাইড, যেটা আমরা নিঃশ্বাসে ছাড়ি। এখানে জমে যাচ্ছে।" } },
  { kind: "line", line: { who: "tunde", en: "The CO₂ cleaner is clogged with storm dust. It needs more power to keep up.", bn: "CO₂ ক্লিনারটা স্টর্মের ধুলায় আটকে গেছে। ঠিকমতো চালাতে আরও পাওয়ার লাগবে।" } },
  {
    kind: "decide",
    question: { who: "pip", en: "Where does the CO₂ cleaner get its power?", bn: "CO₂ ক্লিনারের পাওয়ার কোথা থেকে আসবে?" },
    a: {
      label: { en: "Take power from the fuel plant", bn: "ফুয়েল প্ল্যান্টের পাওয়ার নিই" },
      detail: { en: "Clean air now. Less fuel made today.", bn: "এখনই পরিষ্কার বাতাস। আজ ফুয়েল কম বানানো হবে।" },
      reaction: { en: "The fuel plant slows down. The cleaner whirs, and the headaches fade.", bn: "ফুয়েল প্ল্যান্ট ধীর হয়ে গেল। ক্লিনারটা ঘুরছে, আর মাথা ব্যথা কমে আসছে।" },
    },
    b: {
      label: { en: "Open the spare oxygen", bn: "বাড়তি অক্সিজেন খুলে দিই" },
      detail: { en: "More oxygen, but the CO₂ stays.", bn: "অক্সিজেন বাড়বে, কিন্তু CO₂ থেকেই যাবে।" },
      reaction: { en: "Fresh oxygen hisses in. The fuel plant keeps humming, but the air still feels stuffy.", bn: "তাজা অক্সিজেন ঢুকছে। ফুয়েল প্ল্যান্ট চলছে, কিন্তু বাতাস এখনো ভারী লাগছে।" },
    },
  },
  { kind: "line", line: { who: "pip", en: "There is another problem. Mars dust has perchlorate in it, a chemical that is bad for people. It comes in on our suits.", bn: "আরেকটা সমস্যা আছে। মঙ্গলের ধুলায় পারক্লোরেট আছে, যেটা মানুষের শরীরের জন্য খারাপ। এটা আমাদের স্যুটে লেগে ভিতরে ঢোকে।" } },
  {
    kind: "decide",
    question: { who: "pip", en: "What do we do about the dust on our suits?", bn: "স্যুটের ধুলা নিয়ে কী করব?" },
    a: {
      label: { en: "Clean every suit", bn: "সব স্যুট পরিষ্কার করি" },
      detail: { en: "Brush them off in the airlock every time. It takes time.", bn: "প্রতিবার এয়ারলকে ব্রাশ দিয়ে ঝেড়ে ফেলি। সময় লাগবে।" },
      reaction: { en: "Everyone brushes their suit in the airlock. Every trip outside takes longer.", bn: "সবাই এয়ারলকে নিজের স্যুট ঝাড়ছে। বাইরের প্রতিটা কাজে সময় বেশি লাগছে।" },
    },
    b: {
      label: { en: "Skip the cleaning", bn: "পরিষ্কার বাদ দিই" },
      detail: { en: "Save time. Some dust gets inside.", bn: "সময় বাঁচবে। কিছু ধুলা ভিতরে ঢুকবে।" },
      reaction: { en: "We hurry inside. A thin red film settles on the floor.", bn: "আমরা তাড়াতাড়ি ভিতরে ঢুকলাম। মেঝেতে পাতলা লাল ধুলার আস্তর জমল।" },
    },
  },
  {
    kind: "fact",
    fact: { en: "On the Space Station, astronauts have had headaches when carbon dioxide builds up, so NASA keeps it very low.", bn: "স্পেস স্টেশনে কার্বন ডাই-অক্সাইড জমে গেলে অ্যাস্ট্রোনটদের মাথা ব্যথা হয়েছে, তাই নাসা এটা খুব কম রাখে।" },
    source: "https://ntrs.nasa.gov/citations/20150019624",
  },
  {
    kind: "fact",
    fact: { en: "NASA's Phoenix lander found perchlorate in Mars soil. NASA says large amounts could harm astronauts if breathed in or swallowed.", bn: "নাসার ফিনিক্স ল্যান্ডার মঙ্গলের মাটিতে পারক্লোরেট খুঁজে পেয়েছে। নাসা বলে, বেশি পরিমাণে শ্বাসের সাথে বা খাবারের সাথে গেলে এটা অ্যাস্ট্রোনটদের ক্ষতি করতে পারে।" },
    source: "https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-perseverance-rover-gets-the-dirt-on-mars/",
  },

  // ---------- Crisis 4: The solar storm (sols 7-8) ----------
  { kind: "line", art: "warning", line: { en: "Sol 7. A message from Earth arrives. It was sent 12 minutes ago, because radio takes that long to reach Mars.", bn: "৭ নম্বর সোল। পৃথিবী থেকে একটা মেসেজ আসল। এটা পাঠানো হয়েছিল ১২ মিনিট আগে, কারণ মঙ্গলে রেডিও পৌঁছাতে এতক্ষণ লাগে।" } },
  { kind: "line", line: { who: "earth", en: "\"A huge cloud just blasted off the Sun at 2,650 kilometres a second. Its fastest particles reach Mars tomorrow.\"", bn: "\"সূর্য থেকে এইমাত্র একটা বিশাল মেঘ সেকেন্ডে ২,৬৫০ কিলোমিটার বেগে ছিটকে বের হয়েছে। এর সবচেয়ে দ্রুত পার্টিকেলগুলো কালকে মঙ্গলে পৌঁছাবে।\"" } },
  { kind: "line", line: { who: "pip", en: "Fast particles are radiation. Walls and water slow them down.", bn: "এই জোরে ছোটা পার্টিকেলগুলোই রেডিয়েশন। দেয়াল আর পানি এগুলোকে আটকায়।" } },
  { kind: "line", line: { who: "pip", en: "Light from the Sun reaches us in minutes. The particles come next, and the big cloud a few sols later. We have one sol to get ready.", bn: "সূর্যের আলো কয়েক মিনিটেই আমাদের কাছে পৌঁছায়। তারপর আসে পার্টিকেল, আর বড় মেঘটা আসে কয়েক সোল পরে। রেডি হওয়ার জন্য আমাদের হাতে এক সোল আছে।" } },
  { kind: "line", art: "solarStorm", line: { en: "Sol 8. The particles arrive. Pip's radiation counter clicks faster and faster.", bn: "৮ নম্বর সোল। পার্টিকেলগুলো এসে গেছে। পিপের রেডিয়েশন কাউন্টার আরও জোরে টিক টিক করছে।" } },
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
  {
    kind: "fact",
    fact: { en: "That storm is in NASA's space weather database, DONKI: a giant cloud left the Sun on 10 September 2017 at 2,650 kilometres a second.", bn: "এই স্টর্মটা নাসার স্পেস ওয়েদার ডেটাবেস DONKI-তে আছে: ২০১৭ সালের ১০ সেপ্টেম্বর একটা বিশাল মেঘ সেকেন্ডে ২,৬৫০ কিলোমিটার বেগে সূর্য থেকে বের হয়েছিল।" },
    source: "https://ccmc.gsfc.nasa.gov/DONKI/view/CME/13107/-1",
  },
];

export const PART2_CHAPTERS: Chapter[] = [
  { from: 0, en: "Crisis 2 · The dust storm · Sol 4", bn: "বিপদ ২ · ডাস্ট স্টর্ম · সোল ৪" },
  { from: 7, en: "Crisis 3 · Bad air · Sol 6", bn: "বিপদ ৩ · খারাপ বাতাস · সোল ৬" },
  { from: 15, en: "Crisis 4 · The solar storm · Sols 7–8", bn: "বিপদ ৪ · সোলার স্টর্ম · সোল ৭–৮" },
];
