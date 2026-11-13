import type { IconName } from "../engine/types";

// Astronaut Academy: short drills that practise the decisions the base
// simulation asks for, plus the badges and ranks a player earns.
// Real-world facts must be checked against NASA sources before release.

export interface DrillOption {
  text: string;
  correct: boolean;
  /** Shown after answering, right or wrong. */
  why: string;
}

export interface DrillQuestion {
  q: string;
  options: DrillOption[];
}

export interface Drill {
  id: string;
  title: string;
  icon: IconName;
  intro: string;
  questions: DrillQuestion[];
}

export const DRILLS: Drill[] = [
  {
    id: "power",
    title: "Power planning",
    icon: "power",
    intro: "Solar panels only work in sunlight. Can you keep the lights on all night?",
    questions: [
      {
        q: "The panels make 50 power today. The machines use 60. What happens to the battery?",
        options: [
          { text: "It goes down by 10", correct: true, why: "Using more than you make takes the difference from the battery." },
          { text: "It goes up by 10", correct: false, why: "It only goes up if the panels make more than the machines use." },
          { text: "Nothing changes", correct: false, why: "Every machine that runs uses power from somewhere." },
        ],
      },
      {
        q: "Which part of the sol needs the battery most?",
        options: [
          { text: "Night", correct: true, why: "At night there is no sunlight, and the heaters work hardest in the cold." },
          { text: "Midday", correct: false, why: "At midday the panels make the most power." },
          { text: "Morning", correct: false, why: "In the morning the Sun is already up, so the panels help." },
        ],
      },
      {
        q: "A dust storm is coming tomorrow. What is the smart move today?",
        options: [
          { text: "Switch off extras and save battery", correct: true, why: "Dust blocks the Sun, so tomorrow the panels will make very little." },
          { text: "Run every machine while you can", correct: false, why: "An empty battery before a dust storm can leave the base cold and dark." },
          { text: "Clean the panels tonight", correct: false, why: "Cleaning helps after the storm, not before it." },
        ],
      },
    ],
  },
  {
    id: "lifeSupport",
    title: "Life support",
    icon: "supplies",
    intro: "Air, water and food keep the crew alive. Learn how a base makes and saves them.",
    questions: [
      {
        q: "What does the CO₂ scrubber do?",
        options: [
          { text: "Removes the carbon dioxide we breathe out", correct: true, why: "Too much carbon dioxide gives the crew headaches, so it must be removed all day." },
          { text: "Makes oxygen", correct: false, why: "The oxygen maker does that, by splitting water." },
          { text: "Cleans dirty water", correct: false, why: "That's the water recycler's job." },
        ],
      },
      {
        q: "How can a Mars base make oxygen?",
        options: [
          { text: "By splitting water with electricity", correct: true, why: "Water is made of hydrogen and oxygen. Electricity can split them apart." },
          { text: "By opening a window", correct: false, why: "Mars air is very thin and almost all carbon dioxide. Opening the base would be dangerous." },
          { text: "By heating rocks", correct: false, why: "That doesn't release breathable oxygen." },
        ],
      },
      {
        q: "Why do space stations recycle their water?",
        options: [
          { text: "Sending water from Earth is very hard and heavy", correct: true, why: "The Space Station recycles about 98% of its water, even sweat." },
          { text: "Recycled water tastes better", correct: false, why: "It's about saving water, not taste." },
          { text: "Because it's free to send more", correct: false, why: "Every litre launched from Earth costs a lot of fuel." },
        ],
      },
    ],
  },
  {
    id: "radiation",
    title: "Radiation safety",
    icon: "dose",
    intro: "Space radiation is invisible. Astronauts track it and hide from storms.",
    questions: [
      {
        q: "A solar storm hits today. Where is the crew safest?",
        options: [
          { text: "In the shielded shelter", correct: true, why: "Thick walls and supplies around the shelter block the most radiation." },
          { text: "Outside, finishing a job quickly", correct: false, why: "Outside gives the most radiation of all." },
          { text: "In the greenhouse", correct: false, why: "Glass blocks very little radiation." },
        ],
      },
      {
        q: "Radiation dose adds up. Can it go back down?",
        options: [
          { text: "No, it only adds up over a career", correct: true, why: "That's why astronauts have a career limit and plan to stay below it." },
          { text: "Yes, after a good sleep", correct: false, why: "Sleep helps energy, not radiation dose." },
          { text: "Yes, by drinking water", correct: false, why: "Nothing removes dose already received." },
        ],
      },
      {
        q: "Who warns astronauts that a solar storm is coming?",
        options: [
          { text: "Space weather scientists watching the Sun", correct: true, why: "NASA keeps records of solar storms, like the ones this game uses." },
          { text: "Nobody, it's a surprise", correct: false, why: "Storms can often be seen leaving the Sun hours or days before they arrive." },
          { text: "The rover", correct: false, why: "The rover can't see the Sun's activity." },
        ],
      },
    ],
  },
  {
    id: "spacewalk",
    title: "Spacewalk checklist",
    icon: "astronaut",
    intro: "Before every spacewalk, the crew checks the plan together. Can you spot the problems?",
    questions: [
      {
        q: "One astronaut wants to go outside alone to save time. Is that OK?",
        options: [
          { text: "No, always go with a buddy", correct: true, why: "A buddy can help if a suit has a problem. Real crews always go in pairs." },
          { text: "Yes, if they're quick", correct: false, why: "Problems can happen fast. Being alone outside is too risky." },
          { text: "Yes, if it's a short walk", correct: false, why: "Even short walks follow the buddy rule." },
        ],
      },
      {
        q: "The tanks have 25% oxygen. The suits need 10%. What do you do?",
        options: [
          { text: "Wait and make more oxygen first", correct: true, why: "Filling the suits would leave too little air for the crew back at the base." },
          { text: "Go anyway", correct: false, why: "Always keep enough oxygen at the base for everyone else." },
          { text: "Take only half the oxygen", correct: false, why: "A suit without enough oxygen is never safe." },
        ],
      },
      {
        q: "The rover has 30% battery. The trip needs 40%. What happens if you go?",
        options: [
          { text: "The rover can't make it there and back", correct: true, why: "Charge the rover first, or pick a closer place." },
          { text: "It will charge on the way", correct: false, why: "The rover only charges at the base." },
          { text: "Nothing, 30% is close enough", correct: false, why: "Running out of power far from the base is very dangerous." },
        ],
      },
    ],
  },
];

// ---------- badges earned in missions ----------

export type BadgeId = "stormSafe" | "buddy" | "powerPlanner" | "greenThumb" | "explorer" | "commander";

export const BADGES: Record<BadgeId, { name: string; icon: IconName; what: string }> = {
  stormSafe: { name: "Storm safe", icon: "dose", what: "Kept everyone in the shelter during a solar storm." },
  buddy: { name: "Buddy system", icon: "astronaut", what: "Every spacewalk had at least two astronauts." },
  powerPlanner: { name: "Power planner", icon: "power", what: "No machine ever switched off for lack of power." },
  greenThumb: { name: "Green thumb", icon: "flask", what: "Harvested food from the greenhouse." },
  explorer: { name: "Explorer", icon: "pin", what: "Explored two or more places on spacewalks." },
  commander: { name: "Mission commander", icon: "science", what: "Finished a mission with 3 stars." },
};

// ---------- ranks ----------

export const RANKS = [
  { name: "Trainee", points: 0 },
  { name: "Cadet Astronaut", points: 20 },
  { name: "Mission Specialist", points: 50 },
  { name: "Flight Engineer", points: 90 },
  { name: "Commander", points: 140 },
] as const;

export const POINTS = { star: 10, badge: 5, drillPass: 5, drillPerfect: 10 } as const;

export function rankFor(points: number): { name: string; next: { name: string; points: number } | null; index: number } {
  let index = 0;
  for (let i = 0; i < RANKS.length; i++) if (points >= RANKS[i].points) index = i;
  const next = RANKS[index + 1] ?? null;
  return { name: RANKS[index].name, next: next ? { name: next.name, points: next.points } : null, index };
}
