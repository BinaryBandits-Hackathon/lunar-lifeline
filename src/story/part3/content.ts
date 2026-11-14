// PART 3 text: crisis 4 (decisions 7-8) and both endings.
// Owned by Person 3. English must match docs/design/04-story-plan.md exactly.
// Bangla is a first draft in everyday style; Person 3 reviews it.

import type { Beat } from "../core/Beats";
import type { FailReason } from "../types";

export const PART3_BEATS: Beat[] = [
  // Crisis 4: Launch day (sol 13)
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
      detail: { en: "Science is why we came.", bn: "সায়েন্সের জন্যই তো আসছি।" },
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
      health: { en: "The crew was too hurt or too cold to fly the rocket safely.", bn: "ক্রুরা এত অসুস্থ আর ঠান্ডায় কাহিল ছিল যে রকেট সেফলি চালানো গেল না।" },
    } satisfies Record<FailReason, { en: string; bn: string }>,
    led: { en: "These choices led here:", bn: "এই সিদ্ধান্তগুলোর কারণে এমন হলো:" },
  },
  path: { en: "The path you chose", bn: "তুমি যে পথ বেছে নিয়েছিলে" },
  tryAgain: { en: "Try again", bn: "আবার চেষ্টা করো" },
  title: { en: "Back to title", bn: "শুরুতে ফিরে যাও" },
  crisis: { en: "Crisis", bn: "ক্রাইসিস" },
  crises: [
    { en: "The broken ship", bn: "ভাঙা স্পেসশিপ" },
    { en: "The dust storm", bn: "ডাস্ট স্টর্ম" },
    { en: "The solar storm", bn: "সোলার স্টর্ম" },
    { en: "Launch day", bn: "লঞ্চের দিন" },
  ],
  why: { en: "This choice cost us", bn: "এই সিদ্ধান্তের দাম দিতে হয়েছে" },
};
