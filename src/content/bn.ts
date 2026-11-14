// Bangla (বাংলা) for Pip's narration, hints and the crew story.
// The game's buttons and labels stay in English; when Pip names a button
// it keeps the English word in quotes so the player can find it.
// To review: a native speaker on the team should read every line.

import type { RoleId } from "../engine/types";

/** Pip's opening lines, keyed by the English text. */
export const BN_LINES: Record<string, string> = {
  "Hello, {name}! I'm Pip, your ship's computer. We have been flying for seven months. That's Mars ahead!":
    "হ্যালো, {name}! আমি পিপ, তোমার মহাকাশযানের কম্পিউটার। আমরা সাত মাস ধরে উড়ছি। ওই যে সামনে মঙ্গল গ্রহ!",
  "You are our {role}. Once we land, you'll help keep the crew safe on the base.":
    "তুমি আমাদের {role}। নামার পর তুমি ঘাঁটিতে সবাইকে নিরাপদ রাখতে সাহায্য করবে।",
  "Uh oh. A dust storm is blowing over our landing spot!": "ওহ না! আমাদের নামার জায়গার উপর দিয়ে ধুলোর ঝড় বইছে!",
  "A radio message takes {delay} minutes to reach Earth, but landing takes only 7. Earth can't help in time: we decide ourselves.":
    "রেডিও বার্তা পৃথিবীতে পৌঁছাতে {delay} মিনিট লাগে, কিন্তু নামতে লাগে মাত্র ৭ মিনিট। পৃথিবী সময়মতো সাহায্য করতে পারবে না, তাই সিদ্ধান্ত আমাদেরই নিতে হবে।",
  "Let's look at the map together. Every choice has a cost. There's no perfect answer.":
    "চলো একসাথে মানচিত্রটা দেখি। প্রতিটি সিদ্ধান্তের একটা দাম আছে। একদম নিখুঁত উত্তর বলে কিছু নেই।",
  "Heat shield on! The air outside is glowing hot.": "তাপ-ঢাল চালু! বাইরের বাতাস গরমে জ্বলছে।",
  "Parachute open! We're slowing down.": "প্যারাশুট খুলেছে! আমাদের গতি কমছে।",
  "Rockets firing for a soft landing!": "আলতো করে নামার জন্য রকেট চালু!",
  "Touchdown! Everyone is safe.": "আমরা নেমে পড়েছি! সবাই নিরাপদ।",
  "What a smooth landing! But the ice is far away, so we must be careful with water.":
    "কী সুন্দর অবতরণ! কিন্তু বরফ অনেক দূরে, তাই পানি খরচে সাবধান থাকতে হবে।",
  "Before the training starts, let's check every system on the base. Tap any reading.":
    "প্রশিক্ষণ শুরুর আগে চলো ঘাঁটির প্রতিটি যন্ত্র পরীক্ষা করি। যেকোনো রিডিংয়ে চাপ দাও।",
  "We made it! But the bumps cracked two solar panels, so we have less power.":
    "আমরা পৌঁছে গেছি! কিন্তু ঝাঁকুনিতে দুটো সোলার প্যানেল ফেটে গেছে, তাই বিদ্যুৎ কম পাব।",
  "The good news: there's ice right next to us. Ice means water!": "ভালো খবর: ঠিক পাশেই বরফ আছে। বরফ মানেই পানি!",
  "We waited, and the storm cleared. A soft landing next to the ice!": "আমরা অপেক্ষা করলাম, আর ঝড় থেমে গেল। বরফের পাশে আলতো অবতরণ!",
  "But waiting used supplies, and the crew soaked up extra space radiation.":
    "কিন্তু অপেক্ষায় রসদ খরচ হয়েছে, আর সবাই মহাকাশের বাড়তি বিকিরণ শুষে নিয়েছে।",
};

export const BN_ROLE: Record<RoleId, string> = { engineer: "প্রকৌশলী", doctor: "ডাক্তার", scientist: "বিজ্ঞানী" };

const bnDigits = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

/** Pip's hints during the base game, the same situations as the English ones. */
export const BN_HINT = {
  quickStart: (date: string) =>
    `দ্রুত শুরু: মঙ্গলে তৃতীয় সোলে স্বাগতম! আগামীকাল সূর্য থেকে একটি সত্যিকারের ঝড় আসছে${date ? ` (নাসা এটি ${date} তারিখে রেকর্ড করেছিল)` : ""}। আজ: সবাইকে কাজ দাও, বিদ্যুৎ দেখো, আর স্পেসস্যুট তৈরি করো। কাল: "Shelter"!`,
  solarToday: (date: string) =>
    `আজ সৌরঝড়! সবাইকে "Shelter"-এ পাঠাও। বাইরে থাকলে সবচেয়ে বেশি বিকিরণ লাগবে।${date ? ` এই ঝড়টি সূর্য থেকে আসা কণার একটি সত্যিকারের ঝাপটার উপর ভিত্তি করে, যা নাসা ${date} তারিখে রেকর্ড করেছিল।` : ""}`,
  dustToday: "ধুলোর ঝড়! প্যানেল খুব কম বিদ্যুৎ বানাচ্ছে। যা পারো বন্ধ করো।",
  solarTomorrow: (date: string) => `পৃথিবী থেকে সতর্কবার্তা: কাল সৌরঝড় আসছে${date ? ` (${date} তারিখের সত্যিকারের ঝড়ের মতো)` : ""}। আশ্রয়ে যাওয়ার পরিকল্পনা করো।`,
  dustTomorrow: "আবহাওয়া সতর্কতা: কাল ধুলোর ঝড় আসবে, চলবে ২ সোল। আজ ব্যাটারি বাঁচাও!",
  noSite: "কেউ স্পেসওয়াকে যাচ্ছে। \"Plan spacewalk\" খুলে গন্তব্য বেছে নাও।",
  alone: "নভোচারীরা কখনো একা বাইরে যায় না। সাথে একজন সঙ্গীও পাঠাও।",
  suits: (n: number) => `মাত্র ${bnDigits(n)}টি স্পেসস্যুট তৈরি। আগে কাউকে "Suit check" কাজ দাও, তারপর পরের সোলে বাইরে যাও।`,
  walkInStorm: "আজ ঝড়। এখন স্পেসওয়াক বিপজ্জনক: অপেক্ষা করার কথা ভাবো।",
  broken: (machine: string) => `${machine} নষ্ট হয়ে গেছে। কাউকে "Repair" কাজে পাঠাও।`,
  leak: "একটা পাইপ দিয়ে প্রতি সোলে পানি পড়ছে। কাউকে \"Repair\" কাজে পাঠাও।",
  dusty: "প্যানেলে ধুলো জমেছে, তাই বিদ্যুৎ কম হচ্ছে। \"Repair\" কাজে প্যানেল পরিষ্কার হবে।",
  cracked: "দুটো সোলার প্যানেল ফাটা। পুরো বিদ্যুৎ পেতে কাউকে \"Repair\" কাজে পাঠাও।",
  oxygen: "অক্সিজেন কমে যাচ্ছে। \"Oxygen maker\" চালু করো।",
  water: "পানি কম। বরফ খুঁড়ে আনো (\"Mine ice\"), অথবা \"Water recycler\" চালু করো।",
  food: "খাবার ফুরিয়ে আসছে। ফসল লাগাও আর কাউকে \"Farm\" কাজে পাঠাও।",
  tired: (name: string) => `${name} খুব ক্লান্ত। আজ তাকে "Rest" করতে দাও।`,
  ripe: "ফসল পেকে গেছে! কাউকে \"Farm\" কাজে পাঠিয়ে তুলে আনো।",
  power: "সাবধান: যন্ত্র আর কাজে যত বিদ্যুৎ লাগবে, তত তোমার কাছে নেই। রাতে হিটারের বিদ্যুৎ লাগবে।",
  suitsFirst: (n: number) => `স্পেসওয়াক খুলে গেছে! আগে "Suit check" কাজ দিয়ে ২টি স্যুট তৈরি করো। এখন তৈরি: ${bnDigits(n)}টি।`,
  fuel: "বাড়ি ফিরতে জ্বালানি লাগবে। \"Fuel plant\" অনেক বিদ্যুৎ খায়, তাই হিসাব করে চালাও।",
  plan: "সোলের পরিকল্পনা করো: সবাইকে কাজ দাও আর কোন যন্ত্র চলবে বেছে নাও। তারপর \"Run sol\" চাপো।",
  playing: "মঙ্গলে সময় এগোচ্ছে...",
  done: "সোল শেষ।",
};

/** The crew's lines after a sol and the messages from Earth (see src/sim/story.ts). */
export const BN_STORY: Record<string, string> = {
  "My radiation badge beeped all day. Next time I'm going straight to the shelter.": "আমার বিকিরণ-ব্যাজ সারাদিন বিপ বিপ করেছে। পরের বার সোজা আশ্রয়ে চলে যাব।",
  "Squeezed into the shelter with everyone. Tight, but the storm couldn't touch us.": "সবাই মিলে আশ্রয়ে গাদাগাদি করে ছিলাম। জায়গা কম, কিন্তু ঝড় আমাদের ছুঁতে পারেনি।",
  "I've never seen rocks like that. My boots are full of red dust!": "এমন পাথর আগে কখনো দেখিনি। আমার বুট লাল ধুলোয় ভরে গেছে!",
  "Fresh lettuce! After months of space food, it tastes like a party.": "তাজা লেটুস! মাসের পর মাস মহাকাশের খাবারের পর এটা যেন উৎসব!",
  "When that suit alarm went off, my heart jumped. Good thing we had a buddy.": "স্যুটের অ্যালার্ম বাজতেই বুকটা ধক করে উঠেছিল। ভাগ্যিস সাথে সঙ্গী ছিল।",
  "Brr. The heaters went off in the night. I slept in my jacket.": "উফ, কী ঠান্ডা! রাতে হিটার বন্ধ হয়ে গিয়েছিল। জ্যাকেট পরে ঘুমিয়েছি।",
  "Some machines switched off today. We need to plan our power better.": "আজ কিছু যন্ত্র বন্ধ হয়ে গেছে। বিদ্যুতের পরিকল্পনা আরও ভালো করতে হবে।",
  "I'm so tired. Can I rest tomorrow, please?": "আমি খুব ক্লান্ত। কাল একটু বিশ্রাম নিতে পারি?",
  "We had our helmets on and then had to stop. Let's fix the plan and try again.": "হেলমেট পরে ফেলেছিলাম, তারপর থামতে হলো। পরিকল্পনা ঠিক করে আবার চেষ্টা করি।",
  "Look at the sunset: on Mars it's blue! I took a picture for my family.": "সূর্যাস্তটা দেখো: মঙ্গলে এটা নীল! পরিবারের জন্য একটা ছবি তুলেছি।",
  "I can see Earth tonight. It's just a tiny bright dot.": "আজ রাতে পৃথিবী দেখা যাচ্ছে। শুধু একটা ছোট্ট উজ্জ্বল বিন্দু।",
  "Everything worked today. That's the best kind of sol.": "আজ সব ঠিকঠাক চলেছে। এটাই সবচেয়ে ভালো সোল।",
  "I miss rain. Mars is so quiet and dry.": "বৃষ্টির কথা খুব মনে পড়ে। মঙ্গল এত চুপচাপ আর শুকনো।",
  "We saw your landing on our screens. The whole room cheered! You're in charge now: we can't answer fast enough to help.":
    "আমরা পর্দায় তোমাদের অবতরণ দেখেছি। পুরো ঘর আনন্দে চিৎকার করেছে! এখন দায়িত্ব তোমাদের: আমরা এত তাড়াতাড়ি উত্তর দিতে পারব না।",
  "We put a photo of you on the fridge. The cat sits next to it every day.": "আমরা ফ্রিজে তোমার একটা ছবি লাগিয়েছি। বিড়ালটা রোজ ওটার পাশে বসে থাকে।",
  "A burst of fast particles left the Sun. It reaches Mars tomorrow. Stay in the shelter.":
    "সূর্য থেকে দ্রুতগামী কণার একটা ঝাপটা বেরিয়েছে। কাল এটা মঙ্গলে পৌঁছাবে। আশ্রয়ে থেকো।",
  "Our class follows your mission every morning. What does Mars smell like?": "আমাদের ক্লাস প্রতিদিন সকালে তোমাদের অভিযান দেখে। মঙ্গলের গন্ধ কেমন?",
  "Mission Control": "মিশন কন্ট্রোল",
  "family": "পরিবার",
  "NASA space weather team": "নাসার মহাকাশ আবহাওয়া দল",
  "A school on Earth": "পৃথিবীর একটি স্কুল",
};

export const bnSent = (minutes: number) => `${bnDigits(minutes)} মিনিট আগে পাঠানো`;
export { bnDigits };
