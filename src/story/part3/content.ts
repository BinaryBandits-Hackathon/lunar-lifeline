// PART 3 text: crisis 5 (marsquake, sol 11, decisions 9-10), crisis 6 (launch
// day, sol 13, decisions 11-12), both endings and the mission debrief.
// English must match docs/design/04-story-plan.md exactly.
// Every fact is real and links to the NASA page it comes from.

import type { Beat } from "../core/Beats";
import type { FailReason } from "../types";

export type Part3ArtKey = "quake" | "launch";

export interface Chapter {
  from: number;
  en: string;
  bn: string;
}

type T = { en: string; bn: string };

export const PART3_BEATS: Beat[] = [
  // ---------- Crisis 5: The ground shakes (sol 11) ----------
  { kind: "line", art: "quake", line: { en: "Sol 11. The ground shakes. Cups rattle, and dust falls from the ceiling.", bn: "১১ নম্বর সোল। মাটি কেঁপে উঠল। কাপগুলো ঠকঠক করছে, ছাদ থেকে ধুলা পড়ছে।" } },
  { kind: "line", line: { who: "pip", en: "Was that a marsquake, or a meteorite hitting nearby? NASA's InSight lander felt both.", bn: "এটা কি মার্সকোয়েক, নাকি কাছে কোথাও উল্কা পড়ল? নাসার ইনসাইট ল্যান্ডার দুটোই টের পেয়েছিল।" } },
  { kind: "line", line: { who: "tunde", en: "Ow, my wrist! And the fuel tank seal has a crack.", bn: "আহ, আমার কবজি! আর ফুয়েল ট্যাংকের সিলে একটা ফাটল।" } },
  { kind: "line", line: { who: "mei", en: "No doctor can fly here from Earth. On Mars, I am the hospital.", bn: "পৃথিবী থেকে কোনো ডাক্তার এখানে আসতে পারবে না। মঙ্গলে আমিই হাসপাতাল।" } },
  {
    kind: "decide",
    question: { who: "pip", en: "Tunde is hurt. What should he do?", bn: "তুন্দে ব্যথা পেয়েছে। ও এখন কী করবে?" },
    a: {
      label: { en: "Tunde rests", bn: "তুন্দে বিশ্রাম নিক" },
      detail: { en: "Mei treats him. The work waits.", bn: "মেই ওর চিকিৎসা করবে। কাজ একটু পিছাবে।" },
      reaction: { en: "Mei splints his wrist. Tunde rests while the others work slowly.", bn: "মেই ওর কবজিতে স্প্লিন্ট বেঁধে দিল। তুন্দে বিশ্রাম নিচ্ছে, বাকিরা ধীরে কাজ করছে।" },
    },
    b: {
      label: { en: "Tunde keeps working", bn: "তুন্দে কাজ চালিয়ে যাক" },
      detail: { en: "A brace, and back to work. It may hurt more.", bn: "একটা ব্রেস পরে আবার কাজে। ব্যথা বাড়তে পারে।" },
      reaction: { en: "Tunde straps on a brace and grits his teeth.", bn: "তুন্দে একটা ব্রেস বেঁধে দাঁতে দাঁত চেপে কাজে লাগল।" },
    },
  },
  {
    kind: "decide",
    question: { who: "pip", en: "The fuel tank seal is cracked. How do we fix it?", bn: "ফুয়েল ট্যাংকের সিল ফেটে গেছে। কীভাবে সারাব?" },
    a: {
      label: { en: "Fix the seal properly", bn: "সিলটা ঠিকমতো সারাই" },
      detail: { en: "Take it apart and do it right. It takes time.", bn: "খুলে ঠিকমতো লাগাই। সময় লাগবে।" },
      reaction: { en: "We drain the tank, fit a new seal, and fill it again.", bn: "ট্যাংক খালি করে নতুন সিল লাগিয়ে আবার ভরলাম।" },
    },
    b: {
      label: { en: "A quick patch", bn: "তাড়াতাড়ি জোড়াতালি দিই" },
      detail: { en: "Tape it now. A little fuel may leak.", bn: "এখনই টেপ মেরে দিই। একটু ফুয়েল লিক হতে পারে।" },
      reaction: { en: "The patch holds, but a thin hiss of fuel escapes.", bn: "জোড়াতালি টিকে আছে, কিন্তু সরু হিসহিস শব্দে একটু ফুয়েল বের হয়ে যাচ্ছে।" },
    },
  },
  {
    kind: "fact",
    fact: { en: "NASA's InSight lander recorded 1,319 marsquakes, including quakes caused by meteorites hitting Mars.", bn: "নাসার ইনসাইট ল্যান্ডার ১,৩১৯টা মার্সকোয়েক রেকর্ড করেছে, যার মধ্যে মঙ্গলে উল্কা পড়ার কারণে হওয়া কম্পনও আছে।" },
    source: "https://www.nasa.gov/missions/insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/",
  },

  // ---------- Crisis 6: Launch day (sol 13) ----------
  { kind: "line", art: "launch", line: { en: "Sol 13. The return rocket stands ready. Its fuel tanks are almost full. Almost.", bn: "১৩ নম্বর সোল। রিটার্ন রকেট রেডি। ফুয়েল ট্যাংক প্রায় ভরা। প্রায়।" } },
  { kind: "line", line: { who: "pip", en: "Tomorrow the planets start to move out of line.", bn: "কালকে থেকে গ্রহগুলো লাইন থেকে সরে যেতে শুরু করবে।" } },
  {
    kind: "decide",
    question: { who: "pip", en: "The rocket is heavy. What about the Mars rocks we collected?", bn: "রকেটটা ভারী। যে মঙ্গলের পাথরগুলো জোগাড় করেছি, ওগুলোর কী হবে?" },
    a: {
      label: { en: "Leave them behind", bn: "রেখে যাই" },
      detail: { en: "A lighter rocket needs less fuel.", bn: "রকেট হালকা হলে ফুয়েল কম লাগবে।" },
      reaction: { en: "We set the rock boxes down on the red ground. Maybe the next crew will take them home.", bn: "পাথরের বাক্সগুলো লাল মাটিতে নামিয়ে রাখলাম। হয়তো পরের ক্রু এগুলো নিয়ে যাবে।" },
    },
    b: {
      label: { en: "Keep them", bn: "সাথে নিই" },
      detail: { en: "Science is why we came.", bn: "সায়েন্সের জন্যই তো এসেছি।" },
      reaction: { en: "We strap the rock boxes in tight.", bn: "পাথরের বাক্সগুলো শক্ত করে বেঁধে নিলাম।" },
    },
  },
  {
    kind: "decide",
    question: { who: "pip", en: "Launch now, or wait one more sol for fuel?", bn: "এখনই লঞ্চ করব, নাকি ফুয়েলের জন্য আরেক সোল ওয়েট করব?" },
    a: {
      label: { en: "Launch now", bn: "এখনই লঞ্চ" },
      detail: { en: "Go with the fuel we have.", bn: "যতটুকু ফুয়েল আছে, তাই নিয়ে যাই।" },
      reaction: { en: "Countdown: 3... 2... 1...", bn: "কাউন্টডাউন: ৩... ২... ১..." },
    },
    b: {
      label: { en: "Wait one more sol", bn: "আরেক সোল ওয়েট" },
      detail: { en: "More fuel, but less time.", bn: "ফুয়েল বাড়বে, কিন্তু সময় কমবে।" },
      reaction: { en: "One more night on Mars. The fuel plant hums until morning. Then: 3... 2... 1...", bn: "মঙ্গলে আরও এক রাত। সকাল পর্যন্ত ফুয়েল প্ল্যান্ট চলল। তারপর: ৩... ২... ১..." },
    },
  },
  {
    kind: "fact",
    fact: { en: "NASA's MOXIE experiment on the Perseverance rover made oxygen from Mars air, the first step toward making rocket fuel on Mars.", bn: "নাসার পারসিভিয়ারেন্স রোভারের MOXIE এক্সপেরিমেন্ট মঙ্গলের বাতাস থেকে অক্সিজেন বানিয়েছে। মঙ্গলে রকেট ফুয়েল বানানোর এটাই প্রথম ধাপ।" },
    source: "https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/",
  },
];

export const PART3_CHAPTERS: Chapter[] = [
  { from: 0, en: "Crisis 5 · The ground shakes · Sol 11", bn: "বিপদ ৫ · মাটি কাঁপছে · সোল ১১" },
  { from: 7, en: "Crisis 6 · Launch day · Sol 13", bn: "বিপদ ৬ · লঞ্চের দিন · সোল ১৩" },
];

export const ENDING_TEXT = {
  success: {
    title: { en: "Home", bn: "বাসায় ফেরা" },
    lines: [
      { en: "The rocket roars up through the pink Mars sky.", bn: "গোলাপি আকাশ চিরে রকেট গর্জন করে উপরে উঠে গেল।" },
      { en: "We're in orbit! Next stop, Earth.", bn: "আমরা অরবিটে! নেক্সট স্টপ, পৃথিবী।" },
    ],
  },
  fail: {
    title: { en: "Stranded", bn: "আটকা পড়লাম" },
    reasons: {
      time: { en: "We ran out of time. The planets moved out of line for the trip home.", bn: "সময় শেষ। বাসায় ফেরার জন্য গ্রহগুলো আর লাইনে নেই।" },
      fuel: { en: "The rocket didn't have enough fuel to reach orbit.", bn: "অরবিটে পৌঁছানোর মতো যথেষ্ট ফুয়েল রকেটে ছিল না।" },
      health: { en: "The crew was too hurt or too cold to fly the rocket safely.", bn: "ক্রুরা এতটাই অসুস্থ বা ঠান্ডায় কাবু ছিল যে রকেট সেফলি চালানো সম্ভব হয়নি।" },
    } satisfies Record<FailReason, T>,
    led: { en: "These choices led here:", bn: "এই সিদ্ধান্তগুলোর কারণে এমন হলো:" },
  },
  path: { en: "The path you chose", bn: "তুমি যে পথ বেছে নিয়েছিলে" },
  tryAgain: { en: "Try again", bn: "আবার চেষ্টা করো" },
  title: { en: "Back to title", bn: "শুরুর পেজে ফিরে যাও" },
};

/** The mission debrief shown after the ending: consequences and real science. */
export const DEBRIEF = {
  open: { en: "Mission debrief", bn: "মিশন রিপোর্ট" },
  next: { en: "See the debrief", bn: "রিপোর্ট দেখো" },
  numbersTitle: { en: "What decided your mission", bn: "তোমার মিশন কীসে ঠিক হলো" },
  numbersNote: { en: "Every choice quietly changed these three numbers. To get home you needed all three.", bn: "প্রতিটা সিদ্ধান্ত চুপচাপ এই তিনটা সংখ্যা বদলেছে। বাসায় ফিরতে তিনটাই দরকার ছিল।" },
  fuel: { en: "Fuel", bn: "ফুয়েল" },
  time: { en: "Spare sols", bn: "হাতে থাকা সোল" },
  health: { en: "Crew health", bn: "ক্রুদের স্বাস্থ্য" },
  needFuel: { en: "Needed: 7 or more", bn: "লাগবে: ৭ বা বেশি" },
  needTime: { en: "Needed: 0 or more", bn: "লাগবে: ০ বা বেশি" },
  needHealth: { en: "Needed: 2 or more", bn: "লাগবে: ২ বা বেশি" },
  ok: { en: "Enough", bn: "যথেষ্ট" },
  short: { en: "Not enough", bn: "যথেষ্ট না" },
  choicesTitle: { en: "Your 12 choices and what they cost", bn: "তোমার ১২টা সিদ্ধান্ত আর তার দাম" },
  choicesNote: { en: "Every option had a price. That is real mission planning: there is no free choice.", bn: "প্রতিটা অপশনের একটা দাম ছিল। আসল মিশন প্ল্যানিং এমনই: কোনো সিদ্ধান্ত ফ্রি না।" },
  caused: { en: "Caused the fail", bn: "এটার কারণে ব্যর্থ" },
  noChange: { en: "No change", bn: "কোনো পরিবর্তন নেই" },
  crisis: { en: "Crisis", bn: "বিপদ" },
  oneTitle: { en: "One choice can change everything", bn: "একটা সিদ্ধান্তেই সব বদলে যেতে পারে" },
  oneSaved: { en: "If you had chosen “{b}” instead of “{a}”, the crew would have made it home.", bn: "“{a}”-এর বদলে “{b}” বেছে নিলে ক্রুরা বাসায় ফিরতে পারত।" },
  oneLost: { en: "If you had chosen “{b}” instead of “{a}”, the crew would have been stranded.", bn: "“{a}”-এর বদলে “{b}” বেছে নিলে ক্রুরা আটকা পড়ত।" },
  oneNone: { en: "No single change would have flipped this ending. It took several choices together.", bn: "একটা সিদ্ধান্ত বদলালেও এই ফল বদলাত না। কয়েকটা সিদ্ধান্ত মিলে এমন হয়েছে।" },
  scienceTitle: { en: "Real science from your mission", bn: "তোমার মিশনের আসল বিজ্ঞান" },
  source: { en: "NASA source", bn: "নাসার সোর্স" },
  again: { en: "Try a different path", bn: "অন্য পথে চেষ্টা করো" },
};

/** Real numbers for the radiation meter (mSv = millisieverts). */
export const RADIATION = {
  surfacePerSol: 0.67, // Curiosity RAD, Gale Crater, Aug 2012 - Jun 2013
  spacePerDay: 1.8, // Curiosity RAD on the cruise to Mars
  tripDays: 210, // about seven months home
  careerLimit: 600, // NASA-STD-3001
};

export interface ScienceCard {
  id: string;
  title: T;
  body: T;
  source: string;
}

export const SCIENCE: ScienceCard[] = [
  {
    id: "radiation",
    title: { en: "Radiation", bn: "রেডিয়েশন" },
    body: { en: "On Mars' surface, NASA's Curiosity rover measured about 0.67 mSv of radiation a sol. In space it measured about 1.8 mSv a day, almost three times more. NASA's career limit for an astronaut is 600 mSv.", bn: "মঙ্গলের মাটিতে নাসার কিউরিওসিটি রোভার প্রতি সোলে প্রায় ০.৬৭ mSv রেডিয়েশন মেপেছে। স্পেসে প্রতিদিন প্রায় ১.৮ mSv, প্রায় তিন গুণ বেশি। একজন অ্যাস্ট্রোনটের সারা ক্যারিয়ারের জন্য নাসার লিমিট ৬০০ mSv।" },
    source: "https://www.jpl.nasa.gov/news/nasa-curiosity-first-mars-age-measurement-and-human-exploration-help/",
  },
  {
    id: "bones",
    title: { en: "Bones and muscles", bn: "হাড় আর মাসল" },
    body: { en: "In weightless space, astronauts can lose about 1 to 2% of their bone mass every month. Exercise machines slow it down, so the 7-month trip home means a lot of time on the space treadmill.", bn: "ওজনহীন স্পেসে অ্যাস্ট্রোনটদের হাড়ের ভর প্রতি মাসে প্রায় ১ থেকে ২% কমে যেতে পারে। ব্যায়ামের মেশিন এটা ধীর করে, তাই ৭ মাসের ফেরার পথে অনেক সময় ট্রেডমিলে কাটাতে হবে।" },
    source: "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/human-health-performance/computational-modeling/musculoskeletal/",
  },
  {
    id: "eyes",
    title: { en: "Eyes", bn: "চোখ" },
    body: { en: "Without gravity, body fluids float up toward the head. About 70% of Space Station astronauts get some swelling at the back of their eyes. NASA checks their eyes often.", bn: "মাধ্যাকর্ষণ না থাকলে শরীরের তরল মাথার দিকে উঠে যায়। স্পেস স্টেশনের প্রায় ৭০% অ্যাস্ট্রোনটের চোখের পেছনে কিছুটা ফোলা দেখা যায়। নাসা ঘন ঘন তাদের চোখ পরীক্ষা করে।" },
    source: "https://www.nasa.gov/reference/risk-of-spaceflight-associated-neuro-ocular-syndrome-sans/",
  },
  {
    id: "alone",
    title: { en: "Far from home", bn: "বাসা থেকে অনেক দূরে" },
    body: { en: "Living far from everyone is hard. NASA's CHAPEA crews lived for a whole year in a pretend Mars base in Houston to learn how teams stay healthy and work together.", bn: "সবার থেকে দূরে থাকা কঠিন। নাসার CHAPEA ক্রুরা হিউস্টনে একটা নকল মঙ্গল বেসে পুরো এক বছর থেকেছে, দল কীভাবে সুস্থ থেকে একসাথে কাজ করে সেটা শিখতে।" },
    source: "https://www.nasa.gov/humans-in-space/chapea/",
  },
  {
    id: "sol",
    title: { en: "A longer day", bn: "একটু লম্বা দিন" },
    body: { en: "A sol lasts about 24.6 hours, about 40 minutes longer than a day on Earth. Living on Mars time means slowly shifting when you sleep.", bn: "এক সোল প্রায় ২৪.৬ ঘণ্টা, পৃথিবীর দিনের চেয়ে প্রায় ৪০ মিনিট বেশি। মঙ্গলের সময়ে থাকা মানে ঘুমের সময় ধীরে ধীরে সরে যাওয়া।" },
    source: "https://science.nasa.gov/mars/facts/",
  },
];
