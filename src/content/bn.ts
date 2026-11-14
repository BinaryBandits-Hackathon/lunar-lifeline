// Bangla (বাংলা) for Pip's narration, hints and the crew story.
//
// Style: everyday spoken Bangla, the way people in Bangladesh actually talk.
// Technical words stay in English, written in Bangla letters (হিট শিল্ড,
// রেডিয়েশন, সোলার প্যানেল, অক্সিজেন), because that is what we say, not the
// bookish Bangla terms. Short sentences, no formal words.
// Buttons stay in English; when Pip names one, it is in quotes so the
// player can find it.

import type { RoleId } from "../engine/types";

/** Pip's opening lines, keyed by the English text. */
export const BN_LINES: Record<string, string> = {
  "Hello, {name}! I'm Pip, your ship's computer. We have been flying for seven months. That's Mars ahead!":
    "হাই {name}! আমি পিপ, এই স্পেসশিপের কম্পিউটার। সাত মাস ধরে আমরা উড়ছি। ওই দেখো, সামনেই মঙ্গল গ্রহ!",
  "You are our {role}. Once we land, you'll help keep the crew safe on the base.":
    "তুমি আমাদের টিমের {role}। ল্যান্ড করার পর বেসে সবাইকে সেফ রাখার কাজে তুমি হেল্প করবে।",
  "Uh oh. A dust storm is blowing over our landing spot!": "ওহ নো! আমরা যেখানে ল্যান্ড করব, ঠিক সেখানেই ডাস্ট স্টর্ম চলছে!",
  "A radio message takes {delay} minutes to reach Earth, but landing takes only 7. Earth can't help in time: we decide ourselves.":
    "পৃথিবীতে একটা মেসেজ পৌঁছাতে {delay} মিনিট লাগে, আর ল্যান্ডিং শেষ হয় মাত্র ৭ মিনিটে। মানে পৃথিবী টাইমমতো হেল্প করতে পারবে না, ডিসিশন আমাদেরই নিতে হবে।",
  "Let's look at the map together. Every choice has a cost. There's no perfect answer.":
    "চলো ম্যাপটা একসাথে দেখি। যেটাই বেছে নাও, কিছু না কিছু ছাড়তে হবে। একদম পারফেক্ট অপশন বলে কিছু নেই।",
  "Heat shield on! The air outside is glowing hot.": "হিট শিল্ড অন! বাইরে বাতাস এত গরম যে আগুনের মতো জ্বলছে।",
  "Parachute open! We're slowing down.": "প্যারাশুট খুলে গেছে! স্পিড কমে আসছে।",
  "Rockets firing for a soft landing!": "আস্তে নামার জন্য রকেট চালু হয়ে গেছে!",
  "Touchdown! Everyone is safe.": "ল্যান্ডিং ডান! সবাই সেফ আছে।",
  "What a smooth landing! But the ice is far away, so we must be careful with water.":
    "দারুণ স্মুথ ল্যান্ডিং! কিন্তু বরফ অনেক দূরে, তাই পানি খুব হিসাব করে খরচ করতে হবে।",
  "Before the training starts, let's check every system on the base. Tap any reading.":
    "ট্রেনিং শুরুর আগে চলো বেসের সব সিস্টেম একবার চেক করে নিই। যেকোনো রিডিংয়ে ট্যাপ করো।",
  "We made it! But the bumps cracked two solar panels, so we have less power.":
    "আমরা পৌঁছে গেছি! কিন্তু ঝাঁকুনিতে দুইটা সোলার প্যানেল ফেটে গেছে, তাই পাওয়ার কম পাব।",
  "The good news: there's ice right next to us. Ice means water!": "গুড নিউজ হলো, ঠিক পাশেই বরফ আছে। বরফ মানেই পানি!",
  "We waited, and the storm cleared. A soft landing next to the ice!": "আমরা ওয়েট করলাম, আর স্টর্ম থেমে গেল। বরফের পাশেই সুন্দরভাবে নেমেছি!",
  "But waiting used supplies, and the crew soaked up extra space radiation.":
    "কিন্তু ওয়েট করতে গিয়ে সাপ্লাই খরচ হয়েছে, আর সবার গায়ে স্পেসের রেডিয়েশন একটু বেশি লেগেছে।",
};

/** The landing map and the "ready" line. */
export const BN_MAP = {
  prompt: "ম্যাপে একটা ল্যান্ডিং স্পট ট্যাপ করো, দেখো কোনটায় কী লাভ আর কী লস।",
  sites: {
    plains: { name: "সমতল মাঠ", pitch: "মাটি সমান, তাই ল্যান্ডিং সেফ। কিন্তু বরফ অনেক দূরে।" },
    iceValley: { name: "বরফের ভ্যালি", pitch: "পাশেই বরফ, মানে পানি! কিন্তু জায়গাটা পাথুরে, তাই ল্যান্ডিংয়ে ঝাঁকুনি লাগবে।" },
    holdOrbit: { name: "অরবিটে ওয়েট করা", pitch: "স্টর্ম না থামা পর্যন্ত মঙ্গলের চারপাশে ঘুরতে থাকি, তারপর বরফের পাশে নামি।" },
  } as Record<string, { name: string; pitch: string }>,
  ready: (name: string) => `সব সিস্টেম রেডি, ${name}। মঙ্গলে তোমার ট্রেনিং এখন শুরু!`,
};

export const BN_ROLE: Record<RoleId, string> = { engineer: "ইঞ্জিনিয়ার", doctor: "ডাক্তার", scientist: "সায়েন্টিস্ট" };

const bnDigits = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

/** Pip's hints during the base game, the same situations as the English ones. */
export const BN_HINT = {
  quickStart: (date: string) =>
    `কুইক স্টার্ট: মঙ্গলে আজ তোমার তিন নম্বর সোল! কালকে সূর্য থেকে একটা সত্যিকারের সোলার স্টর্ম আসছে${date ? ` (নাসা এটা রেকর্ড করেছিল ${date})` : ""}। আজকে সবাইকে কাজ দাও, পাওয়ার চেক করো, আর স্পেসস্যুট রেডি করো। কালকে সবাই "Shelter"-এ!`,
  solarToday: (date: string) =>
    `আজকে সোলার স্টর্ম! সবাইকে "Shelter"-এ পাঠাও। বাইরে থাকলে সবচেয়ে বেশি রেডিয়েশন লাগবে।${date ? ` এই স্টর্মটা সূর্য থেকে আসা আসল একটা পার্টিকেল স্টর্মের মতো, যেটা নাসা রেকর্ড করেছিল ${date}।` : ""}`,
  dustToday: "ডাস্ট স্টর্ম! সোলার প্যানেল এখন খুব কম পাওয়ার বানাচ্ছে। যেগুলো পারো বন্ধ রাখো।",
  solarTomorrow: (date: string) => `পৃথিবী থেকে ওয়ার্নিং: কালকে সোলার স্টর্ম আসছে${date ? ` (${date}-এর আসল স্টর্মটার মতো)` : ""}। শেল্টারে যাওয়ার প্ল্যান করে রাখো।`,
  dustTomorrow: "ওয়েদার ওয়ার্নিং: কালকে ডাস্ট স্টর্ম আসছে, চলবে ২ সোল। আজকে ব্যাটারি বাঁচাও!",
  noSite: "কেউ একজন স্পেসওয়াকে যাচ্ছে। \"Plan spacewalk\" খুলে ঠিক করো কোথায় যাবে।",
  alone: "অ্যাস্ট্রোনটরা কখনো একা বাইরে যায় না। সাথে একজন বাডি পাঠাও।",
  suits: (n: number) => `মাত্র ${bnDigits(n)}টা স্পেসস্যুট রেডি আছে। আগে কাউকে "Suit check" কাজ দাও, তারপর পরের সোলে বাইরে যাও।`,
  walkInStorm: "আজকে স্টর্ম চলছে। এখন স্পেসওয়াকে যাওয়া রিস্কি, একটু ওয়েট করো।",
  broken: (machine: string) => `${machine} নষ্ট হয়ে গেছে। কাউকে "Repair" কাজে পাঠাও।`,
  leak: "একটা পাইপ লিক করছে, প্রতি সোলে পানি নষ্ট হচ্ছে। কাউকে \"Repair\" কাজে পাঠাও।",
  dusty: "সোলার প্যানেলে ধুলা জমে গেছে, তাই পাওয়ার কম আসছে। \"Repair\" দিলে পরিষ্কার হয়ে যাবে।",
  cracked: "দুইটা সোলার প্যানেল ফাটা। ফুল পাওয়ার পেতে কাউকে \"Repair\" কাজে পাঠাও।",
  oxygen: "অক্সিজেন কমে যাচ্ছে। \"Oxygen maker\" অন করো।",
  water: "পানি কমে গেছে। বরফ তুলে আনো (\"Mine ice\"), নাহলে \"Water recycler\" অন করো।",
  food: "খাবার শেষের দিকে। ফসল লাগাও আর কাউকে \"Farm\" কাজে পাঠাও।",
  tired: (name: string) => `${name} একদম টায়ার্ড। আজকে ওকে "Rest" নিতে দাও।`,
  ripe: "ফসল রেডি হয়ে গেছে! কাউকে \"Farm\" কাজে পাঠাও, তুলে আনুক।",
  power: "সাবধান: মেশিন আর কাজে যত পাওয়ার লাগবে, তোমার কাছে তত নেই। রাতে হিটার চালাতে পাওয়ার লাগবেই।",
  suitsFirst: (n: number) => `স্পেসওয়াক এখন খোলা! আগে "Suit check" দিয়ে ২টা স্যুট রেডি করো। এখন রেডি আছে ${bnDigits(n)}টা।`,
  fuel: "বাসায় ফিরতে রকেটের ফুয়েল লাগবে। \"Fuel plant\" অনেক পাওয়ার খায়, তাই হিসাব করে চালাও।",
  plan: "আজকের প্ল্যান করো: সবাইকে কাজ দাও, কোন মেশিন চলবে ঠিক করো। তারপর \"Run sol\" চাপো।",
  playing: "মঙ্গলে দিন চলছে...",
  done: "আজকের সোল শেষ।",
};

/** The crew's lines after a sol and the messages from Earth (see src/sim/story.ts). */
export const BN_STORY: Record<string, string> = {
  "My radiation badge beeped all day. Next time I'm going straight to the shelter.": "আমার রেডিয়েশন ব্যাজ সারাদিন বিপ বিপ করছিল। নেক্সট টাইম সোজা শেল্টারে চলে যাব।",
  "Squeezed into the shelter with everyone. Tight, but the storm couldn't touch us.": "সবাই মিলে শেল্টারে ঠাসাঠাসি করে ছিলাম। জায়গা কম, কিন্তু স্টর্ম আমাদের কিছু করতে পারেনি।",
  "I've never seen rocks like that. My boots are full of red dust!": "এমন পাথর আগে কখনো দেখিনি! বুট পুরা লাল ধুলায় ভরে গেছে।",
  "Fresh lettuce! After months of space food, it tastes like a party.": "ফ্রেশ লেটুস! এতদিন প্যাকেটের খাবার খাওয়ার পর মনে হচ্ছে ঈদ!",
  "When that suit alarm went off, my heart jumped. Good thing we had a buddy.": "স্যুটের অ্যালার্ম বাজতেই বুকটা ধক করে উঠছিল। ভাগ্যিস সাথে বাডি ছিল।",
  "Brr. The heaters went off in the night. I slept in my jacket.": "উফ, কী ঠান্ডা! রাতে হিটার বন্ধ হয়ে গেছিল। জ্যাকেট পরেই ঘুমাইছি।",
  "Some machines switched off today. We need to plan our power better.": "আজকে কয়েকটা মেশিন বন্ধ হয়ে গেছে। পাওয়ারের প্ল্যানটা আরেকটু ভালো করতে হবে।",
  "I'm so tired. Can I rest tomorrow, please?": "আমি অনেক টায়ার্ড। কালকে একটু রেস্ট নিতে পারি, প্লিজ?",
  "We had our helmets on and then had to stop. Let's fix the plan and try again.": "হেলমেট পরে রেডি ছিলাম, তারপর থামতে হলো। প্ল্যানটা ঠিক করে আবার ট্রাই করি।",
  "Look at the sunset: on Mars it's blue! I took a picture for my family.": "সানসেটটা দেখো, মঙ্গলে এটা নীল! বাসার সবার জন্য একটা ছবি তুলে রাখছি।",
  "I can see Earth tonight. It's just a tiny bright dot.": "আজ রাতে পৃথিবী দেখা যাচ্ছে। ছোট্ট একটা উজ্জ্বল বিন্দুর মতো।",
  "Everything worked today. That's the best kind of sol.": "আজকে সব ঠিকঠাক চলছে। এমন সোলই সবচেয়ে ভালো।",
  "I miss rain. Mars is so quiet and dry.": "বৃষ্টির কথা খুব মনে পড়ে। মঙ্গল এত চুপচাপ আর শুকনা।",
  "We saw your landing on our screens. The whole room cheered! You're in charge now: we can't answer fast enough to help.":
    "আমরা স্ক্রিনে তোমাদের ল্যান্ডিং দেখছি। পুরা রুম খুশিতে চিৎকার দিছে! এখন থেকে সব তোমাদের হাতে, আমরা এত তাড়াতাড়ি রিপ্লাই দিতে পারব না।",
  "We put a photo of you on the fridge. The cat sits next to it every day.": "ফ্রিজে তোমার একটা ছবি লাগায়ে রাখছি। বিড়ালটা প্রতিদিন ওটার পাশে বসে থাকে।",
  "A burst of fast particles left the Sun. It reaches Mars tomorrow. Stay in the shelter.":
    "সূর্য থেকে অনেক জোরে কিছু পার্টিকেল ছুটে আসছে। কালকে মঙ্গলে পৌঁছাবে। সবাই শেল্টারে থাকবা।",
  "Our class follows your mission every morning. What does Mars smell like?": "আমাদের ক্লাসে প্রতিদিন সকালে তোমাদের মিশনের খবর দেখি। আচ্ছা, মঙ্গলের গন্ধ কেমন?",
  "Mission Control": "মিশন কন্ট্রোল",
  "family": "ফ্যামিলি",
  "NASA space weather team": "নাসার স্পেস ওয়েদার টিম",
  "A school on Earth": "পৃথিবীর একটা স্কুল",
};

export const bnSent = (minutes: number) => `${bnDigits(minutes)} মিনিট আগে পাঠানো`;
export { bnDigits };
