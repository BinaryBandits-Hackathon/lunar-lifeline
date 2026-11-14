// PART 1 build days (sols 1-3), after touchdown and before Part 2's sol 4.
// Owned by Person 1. A guided build: nothing here changes the hidden numbers.
// Every number shown to players is real and comes from the linked NASA page
// (checked 15 November 2026). Part 2 expects a shelter with heaters, solar
// panels, water tanks and a fuel plant to exist, with the fuel line NOT yet
// connected, so this ends before that job.

export type Who = "pip" | "mei" | "tunde";
export interface T {
  en: string;
  bn: string;
}

export type ItemId = "habitat" | "oxygen" | "panels" | "battery" | "water" | "fuel";

export interface BuildItem {
  id: ItemId;
  sol: 1 | 2 | 3;
  name: T;
  /** Who explains why we build it. */
  who: Who;
  /** Why we need it, in the crew's words. */
  why: T[];
  /** One real NASA number, shown as a data card. */
  fact: T;
  /** The highlighted number inside the fact. */
  stat: T;
  source: string;
}

export interface Sol {
  n: 1 | 2 | 3;
  title: T;
  /** Pip opens the day. */
  start: T;
  /** Someone closes the day. */
  end: { who: Who; line: T };
}

const MARS_FACTS = "https://science.nasa.gov/mars/facts/";

export const SOLS: Sol[] = [
  {
    n: 1,
    title: { en: "Sol 1 · Shelter and air", bn: "সোল ১ · ঘর আর বাতাস" },
    start: { en: "Sol 1. We are safe on the ground, but we can't live in the capsule for long. Let's build a base!", bn: "সোল ১। আমরা নিরাপদে নেমেছি, কিন্তু ক্যাপসুলে বেশিদিন থাকা যাবে না। চলো একটা বেস বানাই!" },
    end: { who: "mei", line: { en: "Warm walls and fresh air. Now everyone can rest.", bn: "গরম দেয়াল আর তাজা বাতাস। এখন সবাই একটু বিশ্রাম নিতে পারবে।" } },
  },
  {
    n: 2,
    title: { en: "Sol 2 · Power", bn: "সোল ২ · পাওয়ার" },
    start: { en: "Sol 2. The heaters and the oxygen maker need power, all day and all night.", bn: "সোল ২। হিটার আর অক্সিজেন মেশিন চালাতে পাওয়ার লাগবে, দিনে-রাতে সবসময়।" },
    end: { who: "tunde", line: { en: "The battery is full. The base will stay warm all night.", bn: "ব্যাটারি ফুল। সারা রাত বেস গরম থাকবে।" } },
  },
  {
    n: 3,
    title: { en: "Sol 3 · Water and fuel", bn: "সোল ৩ · পানি আর ফুয়েল" },
    start: { en: "Sol 3. Last jobs: water to live on, and a way to make fuel for the rocket.", bn: "সোল ৩। শেষ কাজ: বেঁচে থাকার জন্য পানি, আর রকেটের ফুয়েল বানানোর ব্যবস্থা।" },
    end: { who: "pip", line: { en: "Our base is ready! The fuel line to the rocket can wait for another day.", bn: "আমাদের বেস রেডি! রকেটের ফুয়েল লাইন জোড়া লাগানো আরেকদিন হবে।" } },
  },
];

export const ITEMS: BuildItem[] = [
  {
    id: "habitat",
    sol: 1,
    name: { en: "Habitat", bn: "হ্যাবিট্যাট" },
    who: "mei",
    why: [
      { en: "First, a home. The air outside is far too thin to breathe, so we need a sealed room full of air.", bn: "প্রথমে একটা ঘর। বাইরের বাতাস এত পাতলা যে শ্বাস নেওয়া যায় না, তাই বাতাসে ভরা একটা বন্ধ ঘর লাগবে।" },
      { en: "It has heaters too. Mars nights are colder than any freezer on Earth.", bn: "এতে হিটারও আছে। মঙ্গলের রাত পৃথিবীর যেকোনো ফ্রিজের চেয়েও ঠান্ডা।" },
    ],
    fact: { en: "NASA's Curiosity rover measured the air on Mars dropping to −75 °C at night.", bn: "নাসার কিউরিওসিটি রোভার মেপেছে, মঙ্গলে রাতে বাতাস −৭৫ °সে পর্যন্ত ঠান্ডা হয়।" },
    stat: { en: "−75 °C", bn: "−৭৫ °সে" },
    source: "https://science.nasa.gov/resource/taking-mars-temperature/",
  },
  {
    id: "oxygen",
    sol: 1,
    name: { en: "Oxygen maker", bn: "অক্সিজেন মেশিন" },
    who: "pip",
    why: [
      { en: "This box breathes in Mars air and splits it apart to make oxygen for us to breathe.", bn: "এই বাক্সটা মঙ্গলের বাতাস টেনে নিয়ে ভেঙে আমাদের শ্বাস নেওয়ার জন্য অক্সিজেন বানায়।" },
      { en: "NASA tested this idea for real on Mars, with a machine called MOXIE.", bn: "নাসা মঙ্গলে সত্যি সত্যি এটা পরীক্ষা করেছে, মক্সি নামের একটা মেশিন দিয়ে।" },
    ],
    fact: { en: "MOXIE made 122 grams of oxygen on Mars, about what a small dog breathes in 10 hours.", bn: "মক্সি মঙ্গলে ১২২ গ্রাম অক্সিজেন বানিয়েছে, একটা ছোট কুকুর ১০ ঘণ্টায় যতটা শ্বাস নেয় প্রায় ততটা।" },
    stat: { en: "122 g", bn: "১২২ গ্রাম" },
    source: "https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/",
  },
  {
    id: "panels",
    sol: 2,
    name: { en: "Solar panels", bn: "সোলার প্যানেল" },
    who: "tunde",
    why: [
      { en: "Mars is much farther from the Sun than Earth, so the sunlight here is weak.", bn: "মঙ্গল পৃথিবীর চেয়ে সূর্য থেকে অনেক দূরে, তাই এখানে রোদ দুর্বল।" },
      { en: "Weak sunlight means we need lots of panels to get enough power.", bn: "রোদ দুর্বল মানে যথেষ্ট পাওয়ার পেতে অনেকগুলো প্যানেল লাগবে।" },
    ],
    fact: { en: "Mars is 1.5 times as far from the Sun as Earth, so its sunlight is less than half as strong.", bn: "মঙ্গল সূর্য থেকে পৃথিবীর চেয়ে দেড় গুণ দূরে, তাই ওখানকার রোদ অর্ধেকেরও কম জোরালো।" },
    stat: { en: "1.5×", bn: "১.৫ গুণ" },
    source: MARS_FACTS,
  },
  {
    id: "battery",
    sol: 2,
    name: { en: "Battery bank", bn: "ব্যাটারি" },
    who: "tunde",
    why: [
      { en: "Solar panels sleep at night, but the heaters can't.", bn: "রাতে সোলার প্যানেল ঘুমায়, কিন্তু হিটার ঘুমাতে পারে না।" },
      { en: "The battery saves power in the day and keeps us warm until sunrise.", bn: "ব্যাটারি দিনে পাওয়ার জমায়, আর সকাল পর্যন্ত আমাদের গরম রাখে।" },
    ],
    fact: { en: "A day on Mars is called a sol. It lasts about 24.6 hours, a little longer than a day on Earth.", bn: "মঙ্গলের এক দিনকে বলে সোল। এটা প্রায় ২৪.৬ ঘণ্টা, পৃথিবীর দিনের চেয়ে একটু লম্বা।" },
    stat: { en: "24.6 h", bn: "২৪.৬ ঘণ্টা" },
    source: MARS_FACTS,
  },
  {
    id: "water",
    sol: 3,
    name: { en: "Water tanks", bn: "পানির ট্যাংক" },
    who: "mei",
    why: [
      { en: "We need water to drink, to wash, and to make more air.", bn: "পানি লাগবে খাওয়ার জন্য, ধোয়ার জন্য, আর আরও বাতাস বানানোর জন্য।" },
      { en: "Our rover brings back ice, and we melt it and store it in these tanks.", bn: "আমাদের রোভার বরফ নিয়ে আসে, আমরা সেটা গলিয়ে এই ট্যাংকে রাখি।" },
    ],
    fact: { en: "NASA's Mars Reconnaissance Orbiter found cliffs of water ice hidden just under the Martian ground.", bn: "নাসার মার্স রিকনেসান্স অরবিটার মঙ্গলের মাটির ঠিক নিচে লুকানো বরফের খাড়া দেয়াল খুঁজে পেয়েছে।" },
    stat: { en: "Ice", bn: "বরফ" },
    source: "https://www.jpl.nasa.gov/news/steep-slopes-on-mars-reveal-structure-of-buried-ice/",
  },
  {
    id: "fuel",
    sol: 3,
    name: { en: "Fuel plant", bn: "ফুয়েল প্লান্ট" },
    who: "pip",
    why: [
      { en: "The rocket home is empty. This plant mixes water with Mars air to make rocket fuel.", bn: "বাসায় ফেরার রকেটটা খালি। এই প্লান্ট পানি আর মঙ্গলের বাতাস মিশিয়ে রকেটের ফুয়েল বানায়।" },
      { en: "It works slowly, drop by drop, so it starts today.", bn: "এটা খুব ধীরে, ফোঁটা ফোঁটা করে কাজ করে, তাই আজ থেকেই চালু।" },
    ],
    fact: { en: "Mars air is mostly carbon dioxide, the gas this plant turns into fuel.", bn: "মঙ্গলের বাতাস বেশিরভাগই কার্বন ডাই-অক্সাইড, এই প্লান্ট সেটা দিয়েই ফুয়েল বানায়।" },
    stat: { en: "CO₂", bn: "CO₂" },
    source: MARS_FACTS,
  },
];
