import type { DialogueLine, GaugeId, IconName, SiteId, Stage } from "../engine/types";

/** Working name, to be decided by the team. */
export const MASCOT_NAME = "Pip";

/**
 * One-way radio delay between Earth and Mars in minutes. The real value
 * changes with the planets' positions (about 3 to 22 minutes).
 */
export const RADIO_DELAY_MIN = 12;

// Placeholders: {name}, {role}, {delay}. Keep lines short: they are read aloud.
export const SCRIPT: Partial<Record<Stage, DialogueLine[]>> = {
  approach: [
    {
      speaker: "pip",
      mood: "happy",
      text: "Hello, {name}! I'm Pip, your ship's computer. We have been flying for seven months. That's Mars ahead!",
    },
    {
      speaker: "pip",
      mood: "calm",
      text: "You are our {role}. Once we land, you'll help keep the crew safe on the base.",
    },
  ],
  alarm: [{ speaker: "pip", mood: "alert", text: "Uh oh. A dust storm is blowing over our landing spot!" }],
  briefing: [
    {
      speaker: "pip",
      mood: "calm",
      text: "Earth is so far away that a radio message takes {delay} minutes to get there. Landing takes about 7 minutes.",
    },
    { speaker: "pip", mood: "calm", text: "So Earth can't help us in time. We have to decide ourselves." },
    {
      speaker: "pip",
      mood: "calm",
      text: "Let's look at the map together. Every choice has a cost. There's no perfect answer.",
    },
  ],
  descent: [
    { speaker: "pip", mood: "alert", text: "Heat shield on! The air outside is glowing hot." },
    { speaker: "pip", mood: "alert", text: "Parachute open! We're slowing down." },
    { speaker: "pip", mood: "alert", text: "Rockets firing for a soft landing!" },
  ],
  touchdown: [{ speaker: "pip", mood: "happy", text: "Touchdown! Everyone is safe." }],
};

export const DAMAGE_LINES: Record<SiteId, DialogueLine[]> = {
  plains: [
    { speaker: "pip", mood: "happy", text: "What a smooth landing! But the ice is far away, so we must be careful with water." },
    { speaker: "pip", mood: "calm", text: "Before the training starts, let's check every system on the base. Tap any reading." },
  ],
  iceValley: [
    { speaker: "pip", mood: "alert", text: "We made it! But the bumps cracked two solar panels, so we have less power." },
    { speaker: "pip", mood: "happy", text: "The good news: there's ice right next to us. Ice means water!" },
    { speaker: "pip", mood: "calm", text: "Before the training starts, let's check every system on the base. Tap any reading." },
  ],
  holdOrbit: [
    { speaker: "pip", mood: "calm", text: "We waited, and the storm cleared. A soft landing next to the ice!" },
    { speaker: "pip", mood: "alert", text: "But waiting used supplies, and the crew soaked up extra space radiation." },
    { speaker: "pip", mood: "calm", text: "Before the training starts, let's check every system on the base. Tap any reading." },
  ],
};

export const GAUGE_INFO: Record<GaugeId, { label: string; icon: IconName; max: number; explain: string }> = {
  power: {
    label: "Power",
    icon: "power",
    max: 10,
    explain: "Power runs everything on the base. Our solar panels make it from sunlight.",
  },
  supplies: {
    label: "Supplies",
    icon: "supplies",
    max: 10,
    explain: "Supplies are our air, water and food. We use some every sol. A sol is one day on Mars.",
  },
  dose: {
    label: "Radiation",
    icon: "dose",
    max: 7,
    explain: "This shows how much space radiation the crew has soaked up. It only goes up, never down.",
  },
  science: {
    label: "Science",
    icon: "science",
    max: 5,
    explain: "Science is what we came to discover. It's your mission score.",
  },
};
