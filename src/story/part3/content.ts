// PART 3 text: crisis 5 (marsquake, decisions 9-10), crisis 6 (launch day,
// decisions 11-12) and both endings. The marsquake text is in place so the
// 12-decision game reaches its ending; its pictures come in the next round.
// Owned by Person 3. English must match docs/design/04-story-plan.md exactly.
// Bangla is a first draft in everyday style; Person 3 reviews it.

import type { Beat } from "../core/Beats";
import type { FailReason } from "../types";

export const PART3_BEATS: Beat[] = [
  // Crisis 5: The ground shakes (sol 11)
  { kind: "line", art: "launch", line: { en: "Sol 11. The ground shakes. Cups rattle, and dust falls from the ceiling.", bn: "১১ নম্বর সোল। মাটি কেঁপে উঠল। কাপগুলো ঠকঠক করছে, ছাদ থেকে ধুলা পড়ছে।" } },
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

  // Crisis 6: Launch day (sol 13)
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
    } satisfies Record<FailReason, { en: string; bn: string }>,
    led: { en: "These choices led here:", bn: "এই সিদ্ধান্তগুলোর কারণে এমন হলো:" },
  },
  path: { en: "The path you chose", bn: "তুমি যে পথ বেছে নিয়েছিলে" },
  tryAgain: { en: "Try again", bn: "আবার চেষ্টা করো" },
  title: { en: "Back to title", bn: "শুরুর পেজে ফিরে যাও" },
};
