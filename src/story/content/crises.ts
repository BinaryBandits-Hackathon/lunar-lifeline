// The "14 Sols" story in English. Owned by Person 3 (content).
// First draft taken from docs/design/04-story-plan.md; Person 3 polishes it.
// Rules: short sentences for ages 7-12; reactions describe the scene, never
// whether a choice was good or bad. Bangla lives in src/story/content/bn.ts.

import type { Crisis, StoryText } from "../types";

export const CRISES: Crisis[] = [
  {
    id: 1,
    title: "The broken ship",
    sol: 0,
    art: "orbit",
    scene: ["CRACK! A tiny meteoroid smashes into the ship.", "The main engine stops. An oxygen tank starts to hiss.", "Mars fills the window below us."],
    decisions: [
      {
        id: 1,
        question: "The oxygen tank is leaking. What do we do?",
        a: { label: "Land right away", detail: "The leak keeps hissing until we touch down.", reaction: "We dive toward Mars. The hiss gets louder as we fall." },
        b: { label: "Patch the leak first", detail: "A spacewalk to fix it. It takes time.", reaction: "Tunde floats outside with a patch kit. The hiss stops, but the clock keeps ticking." },
      },
      {
        id: 2,
        question: "Where should we land?",
        a: { label: "Flat ground by the rocket", detail: "A safe landing, but the ice is far away.", reaction: "A soft landing on smooth red ground. The rocket stands right next to us." },
        b: { label: "The ice crater", detail: "Water for fuel nearby, but a rough landing.", reaction: "BUMP! BUMP! We land hard on the rocky crater floor. Ice glitters close by." },
      },
    ],
    nasaFact: { text: "Space Station crews have tracked down and fixed real air leaks.", source: "https://blogs.nasa.gov/spacestation/2020/09/29/crew-continues-troubleshooting-as-tests-isolate-small-leak" },
  },
  {
    id: 2,
    title: "The dust storm",
    sol: 4,
    art: "dustStorm",
    scene: ["The sky turns orange-brown.", "Dust covers the solar panels. They make almost no power."],
    decisions: [
      {
        id: 3,
        question: "There is only enough power for one. What gets it?",
        a: { label: "The heaters", detail: "The crew stays warm. The fuel plant waits.", reaction: "The base stays warm. The fuel plant goes quiet." },
        b: { label: "The fuel plant", detail: "More fuel, but nights fall to −75 °C.", reaction: "The fuel plant hums. Mei wraps everyone in blankets as frost grows on the windows." },
      },
      {
        id: 4,
        question: "The panels are covered in dust. What now?",
        a: { label: "Wipe them in the storm", detail: "Go out into the dust with a brush.", reaction: "Someone steps into the swirling dust with a brush. The wind pushes hard." },
        b: { label: "Wait it out", detail: "Stay safe inside until the dust settles.", reaction: "We wait inside and watch the dust race past. Sols slip by." },
      },
    ],
    nasaFact: { text: "In 2018 a dust storm covered all of Mars and ended the Opportunity rover's mission.", source: "" },
  },
  {
    id: 3,
    title: "The solar storm",
    sol: 8,
    art: "solarStorm",
    scene: ["A message from Earth, sent 12 minutes ago:", "\"A burst of fast particles has left the Sun. It hits Mars today.\""],
    decisions: [
      {
        id: 5,
        question: "The fuel line isn't connected yet. What do we do?",
        a: { label: "Everyone to the shelter", detail: "Safe inside. The fuel line waits.", reaction: "We squeeze into the shelter and close the door. Outside, the fuel line lies unfinished." },
        b: { label: "Finish the job outside", detail: "Connect the fuel line first, then shelter.", reaction: "Tunde's radiation badge beeps fast as he tightens the last bolt." },
      },
      {
        id: 6,
        question: "Water blocks radiation. Should we build a water wall?",
        a: { label: "Stack the water tanks", detail: "A shield around the shelter. The water is used up.", reaction: "We stack the water tanks around the shelter like bricks." },
        b: { label: "Keep the water", detail: "Save it for making fuel.", reaction: "We keep the water tanks by the fuel plant." },
      },
    ],
    nasaFact: { text: "In September 2017 a solar storm hit Mars, and NASA's Curiosity rover measured the radiation on the ground more than double.", source: "https://www.jpl.nasa.gov/news/large-solar-storm-sparks-global-aurora-and-doubles-radiation-levels-on-the-martian-surface/" },
  },
  {
    id: 4,
    title: "Launch day",
    sol: 13,
    art: "launch",
    scene: ["The rocket is almost full. Almost.", "Tomorrow the planets start to move out of line."],
    decisions: [
      {
        id: 7,
        question: "The rocket is heavy. What about the Mars rocks we collected?",
        a: { label: "Leave them behind", detail: "A lighter rocket needs less fuel.", reaction: "We set the rock boxes down on the red ground. Maybe the next crew will take them." },
        b: { label: "Keep them", detail: "Science is why we came.", reaction: "We strap the rock boxes in tight." },
      },
      {
        id: 8,
        question: "Launch now, or wait one more sol for fuel?",
        a: { label: "Launch now", detail: "Go with the fuel we have.", reaction: "Countdown: 3... 2... 1..." },
        b: { label: "Wait one more sol", detail: "More fuel, less time.", reaction: "One more night on Mars. The fuel plant hums until morning. Then: 3... 2... 1..." },
      },
    ],
    nasaFact: { text: "NASA's MOXIE experiment made oxygen from Mars air, the first step to making rocket fuel on Mars.", source: "https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/" },
  },
];

export const STORY_TEXT: StoryText = {
  prologue: [
    "Our crew of three is orbiting Mars, ready to fly home.",
    "There is one way home if anything goes wrong: an empty return rocket NASA left on Mars. It can make its own fuel from Mars air and water.",
    "The planets line up for the trip home in 14 sols. Miss that, and the next chance is two years away.",
  ],
  success: { title: "Home", lines: ["The rocket climbs through the pink Mars sky.", "Next stop, Earth!"] },
  fail: {
    title: "Stranded",
    reasons: {
      time: "We ran out of time. The planets moved out of line for the trip home.",
      fuel: "The rocket didn't have enough fuel to reach orbit.",
      health: "The crew was too hurt or too cold to fly the rocket safely.",
    },
    tryAgain: "Try again",
  },
};
