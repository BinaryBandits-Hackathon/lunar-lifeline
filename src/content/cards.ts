import type { Card } from "../engine/types";

// Every card must teach one true thing, and every option must cost something
// (even if the cost is only a missed chance). "real" facts must be checked
// against a NASA source before release.

export const CARDS: Card[] = [
  // ---------- fixed cards, placed by the engine ----------
  {
    id: "repair_panels",
    kind: "fixed",
    title: "Cracked solar panels",
    text: "Two panels cracked in the bumpy landing. Fixing them means climbing outside in a spacesuit.",
    options: [
      {
        label: "Go outside and fix them",
        effects: { power: -2, dose: 1 },
        clears: ["PANELS_DAMAGED"],
        tags: ["repair", "outside"],
        outcome: "Panels fixed! They make full power again. The crew got a little radiation outside.",
      },
      {
        label: "Leave them cracked for now",
        effects: {},
        outcome: "The panels stay cracked and make 2 fewer blocks every sol.",
        note: "Panels make 2 fewer blocks every sol until fixed.",
      },
    ],
    teaches: "Everything on the base runs on power, and going outside adds radiation.",
    real: "Astronauts have done spacewalks to repair torn solar panels on the Space Station.",
  },
  {
    id: "solar_forecast",
    kind: "fixed",
    title: "Space weather warning",
    text: "Earth sends a warning: a solar storm will reach Mars tomorrow. It will shoot radiation at the base.",
    options: [
      {
        label: "Pile soil on the roof",
        effects: { power: -3 },
        sets: ["SHELTER_BUILT"],
        tags: ["repair"],
        outcome: "The digger piled soil on the roof. It will block radiation from now on.",
      },
      {
        label: "Explore while it's still calm",
        effects: { power: -1, dose: 1, science: 2 },
        tags: ["research", "outside"],
        outcome: "Great samples collected before the storm!",
      },
      {
        label: "Stock the shelter with food and water",
        effects: { supplies: -1 },
        sets: ["SHELTER_STOCKED"],
        commander: true,
        outcome: "The shelter is stocked. Hiding there during the storm will cost no supplies.",
      },
    ],
    teaches: "Read the forecast and prepare before the danger arrives.",
    real: "NASA's space weather team watches the Sun and warns astronauts when a storm is coming.",
  },
  {
    id: "dust_forecast",
    kind: "fixed",
    title: "Dust storm coming",
    text: "Weather satellites see a dust storm heading our way. Tomorrow the sky goes dark and the panels will barely work.",
    options: [
      {
        label: "Switch off the lab to save power",
        effects: { power: 2, science: -1 },
        outcome: "The lab is off and the battery has extra power for tomorrow. Some samples spoiled.",
      },
      {
        label: "One last trip out before the dust",
        effects: { power: -1, dose: 1, science: 2 },
        tags: ["research", "outside"],
        outcome: "The crew got great samples just in time.",
      },
      {
        label: "Cover the greenhouse plants",
        effects: { power: -1 },
        growth: 1,
        commander: true,
        outcome: "The plants are protected and keep growing.",
      },
    ],
    teaches: "Solar panels need sunlight. Save power before a dust storm.",
    real: "Spacecraft orbiting Mars send home daily weather maps that show dust storms forming.",
  },
  {
    id: "solar_storm",
    kind: "fixed",
    title: "Solar storm!",
    text: "The storm has arrived. Radiation is pouring down on the base. How does the crew spend the day?",
    options: [
      {
        label: "Everyone into the shelter",
        effects: { supplies: -1 },
        sets: ["SHELTERED"],
        tags: ["shelter"],
        outcome: "The crew stayed in the shelter all day. No work got done.",
      },
      {
        label: "Keep working inside the base",
        effects: { science: 1 },
        tags: ["research"],
        outcome: "Work went on inside the base.",
      },
      {
        label: "Finish the outdoor experiment",
        effects: { dose: 2, science: 2 },
        tags: ["research", "outside"],
        commander: true,
        outcome: "The experiment is finished, but being outside in a storm added radiation.",
      },
    ],
    teaches: "Radiation adds up and never goes back down. Hiding costs a day of work.",
    real: "During strong solar storms, Space Station crews move to the best-shielded parts of the station.",
  },
  {
    id: "dust_storm",
    kind: "fixed",
    title: "Dust storm!",
    text: "Dust blocks the Sun. The panels make almost no power today.",
    options: [
      {
        label: "Wait it out quietly",
        effects: {},
        outcome: "The crew rested and saved their strength.",
      },
      {
        label: "Study the dust in the lab",
        effects: { power: -1, science: 2 },
        tags: ["research"],
        outcome: "Dust samples studied! But the lab used precious power.",
      },
      {
        label: "Wipe the panels in a calm moment",
        effects: { power: 2, dose: 1 },
        tags: ["outside"],
        commander: true,
        outcome: "Cleaner panels squeezed out a little more power.",
      },
    ],
    teaches: "When the Sun is blocked, every bit of power counts.",
    real: "In 2018 a dust storm covered all of Mars and ended the Opportunity rover's mission.",
  },
  {
    id: "launch",
    kind: "fixed",
    title: "Launch day",
    text: "Time to go home! The rocket needs oxygen for the trip.",
    options: [
      {
        label: "Make oxygen from Mars air",
        effects: { power: -4 },
        outcome: "The oxygen machine filled the tanks using power.",
      },
      {
        label: "Use stored oxygen, run one last experiment",
        effects: { supplies: -3, science: 2 },
        tags: ["research"],
        outcome: "Stored oxygen filled the tanks, and the last experiment is done.",
      },
      {
        label: "Make oxygen and run the experiment",
        effects: { power: -6, science: 2 },
        tags: ["research"],
        commander: true,
        outcome: "Tanks full and the experiment done, but it took a lot of power.",
      },
    ],
    teaches: "Always save enough for the trip home. On Mars you can even make oxygen from the air.",
    real: "MOXIE, a machine on the Perseverance rover, made oxygen from Mars air 16 times.",
  },
  {
    id: "quiet_sol",
    kind: "fixed",
    title: "A calm sol",
    text: "Nothing is going wrong today. How should the crew use the time?",
    options: [
      {
        label: "Do maintenance on the base",
        effects: { power: -1, supplies: 1 },
        tags: ["repair"],
        outcome: "Everything is tidy and working well.",
      },
      {
        label: "Study rock samples",
        effects: { power: -1, science: 1 },
        tags: ["research"],
        outcome: "New things learned about Mars rocks.",
      },
    ],
    teaches: "Even calm days are a choice between looking after the base and doing science.",
    real: "Astronauts on the Space Station spend part of every week on maintenance.",
  },

  // ---------- pool cards, drawn at random ----------
  {
    id: "water_recycler",
    kind: "pool",
    title: "Water runs low",
    text: "The water tank is getting low. The recycler can clean used water, but it needs power.",
    options: [
      {
        label: "Run the water recycler",
        effects: { power: -2, supplies: 2 },
        outcome: "Clean water! The recycler used power.",
      },
      {
        label: "Drink the stored water",
        effects: { supplies: -1 },
        excludes: ["FAR_FROM_ICE"],
        outcome: "The crew drank from the stored water.",
      },
      {
        label: "Drink the stored water",
        effects: { supplies: -2 },
        requires: ["FAR_FROM_ICE"],
        outcome: "With the ice far away, stored water ran down fast.",
        note: "The ice is far away, so this costs more.",
      },
      {
        label: "Melt ice from next door",
        effects: { power: -1, supplies: 2 },
        requires: ["NEAR_ICE"],
        outcome: "Ice melted into fresh water. Landing near the ice paid off!",
      },
    ],
    teaches: "In space you reuse almost every drop of water, and cleaning it takes power.",
    real: "The Space Station recycles about 98% of its water, even sweat.",
  },
  {
    id: "rock_layers",
    kind: "pool",
    title: "Layered rocks",
    text: "The rover spotted rocks with layers 3 km away. They might have formed in an ancient lake.",
    options: [
      {
        label: "Drive the crew out to study them",
        effects: { power: -2, dose: 2, science: 3 },
        tags: ["research", "outside"],
        outcome: "Amazing discovery! But the long drive added radiation.",
      },
      {
        label: "Send the rover alone",
        effects: { power: -2, science: 1 },
        tags: ["research"],
        outcome: "The rover sent back photos. Not as good as a person looking, but safer.",
      },
      {
        label: "Stay in and look after the base",
        effects: { supplies: 1 },
        commander: true,
        outcome: "The base is in good shape. The rocks will have to wait.",
      },
    ],
    teaches: "People explore faster than robots, but every trip outside adds radiation.",
    real: "The Curiosity rover found rock layers on Mars that formed in ancient lakes.",
  },
  {
    id: "air_filter",
    kind: "pool",
    title: "Air filter alarm",
    text: "The air filter is clogged. Earth knows how to fix it, but a message takes minutes to cross space.",
    options: [
      {
        label: "Patch it yourself right now",
        effects: { power: -1, supplies: -1, science: 1 },
        tags: ["repair"],
        outcome: "Patched! It leaks a little, but the crew learned a lot fixing it.",
      },
      {
        label: "Ask Earth and wait for the answer",
        effects: { supplies: -2 },
        later: { inSols: 1, effects: { supplies: 3 }, text: "Earth's answer arrived and the filter works perfectly. Supplies +3." },
        outcome: "Message sent. The filter works badly until Earth answers.",
        note: "Earth's fix arrives next sol.",
      },
    ],
    teaches: "Messages between Mars and Earth take minutes, so astronauts must solve problems without instant help.",
    real: "On Apollo 13, the crew built an air filter adapter from spare parts, following steps radioed from Earth.",
  },
  {
    id: "dust_devil",
    kind: "pool",
    title: "Dust devil",
    text: "A spinning dust devil swept over the base and coated the solar panels in dust.",
    options: [
      {
        label: "Go out and brush them clean",
        effects: { dose: 1 },
        tags: ["outside"],
        outcome: "Panels clean. The crew got a little radiation outside.",
      },
      {
        label: "Leave the dust",
        effects: {},
        sets: ["DUSTY_PANELS"],
        outcome: "The dusty panels will make 1 fewer block tomorrow.",
        note: "1 fewer block tomorrow.",
      },
    ],
    teaches: "Dust on solar panels means less power.",
    real: "Dust devils sometimes blew the solar panels of the Spirit and Opportunity rovers clean.",
  },
  {
    id: "ice_core",
    kind: "pool",
    title: "Ancient ice",
    requires: ["NEAR_ICE"],
    text: "The ice next to the base may hold bubbles of air from long ago. Drilling it takes power.",
    options: [
      {
        label: "Drill an ice core",
        effects: { power: -2, science: 2 },
        tags: ["research"],
        outcome: "An ice core! Scientists on Earth will be thrilled.",
      },
      {
        label: "Save the power",
        effects: {},
        outcome: "The ice will still be there another day.",
      },
    ],
    teaches: "Water ice on Mars is a resource and a record of the planet's past.",
    real: "The Phoenix lander dug up water ice on Mars in 2008.",
  },
  {
    id: "wilting_plants",
    kind: "pool",
    title: "Wilting plants",
    text: "The greenhouse plants look droopy. They need more light.",
    options: [
      {
        label: "Give them extra light",
        effects: { power: -2 },
        growth: 1,
        outcome: "The plants perked up and grew faster.",
      },
      {
        label: "Let them recover on their own",
        effects: {},
        growth: -1,
        outcome: "The plants slowed down. The harvest will come later.",
      },
    ],
    teaches: "Plants need light to grow, and light needs power.",
    real: "Astronauts grew lettuce under LED lights on the Space Station and ate it in 2015.",
  },
  {
    id: "marsquake",
    kind: "pool",
    title: "Marsquake!",
    text: "The ground shook a little. The quake sensor outside recorded it, but its cable came loose.",
    options: [
      {
        label: "Go out and fix the sensor",
        effects: { dose: 1, science: 2 },
        tags: ["research", "outside", "repair"],
        outcome: "Sensor fixed. The quake data is safe!",
      },
      {
        label: "Read what you can from inside",
        effects: { power: -1, science: 1 },
        tags: ["research"],
        outcome: "Some data saved from inside.",
      },
    ],
    teaches: "Scientists study quakes to learn what is deep inside a planet.",
    real: "NASA's InSight lander recorded more than 1,300 marsquakes.",
  },
  {
    id: "rover_stuck",
    kind: "pool",
    title: "Rover stuck",
    text: "The rover is stuck in soft sand and can't get back to the base.",
    options: [
      {
        label: "Walk out and dig it free",
        effects: { power: -1, dose: 1 },
        tags: ["repair", "outside"],
        outcome: "The rover is free and back at the base.",
      },
      {
        label: "Leave it stuck",
        effects: { science: -1 },
        outcome: "The rover is stuck. Its experiments are lost.",
      },
    ],
    teaches: "Soft sand on Mars can trap a rover for good.",
    real: "The Spirit rover got stuck in soft sand in 2009 and never got free.",
  },
  {
    id: "water_leak",
    kind: "pool",
    title: "Leaking pipe",
    text: "A water pipe in the habitat is dripping.",
    options: [
      {
        label: "Fix it now",
        effects: { power: -2 },
        tags: ["repair"],
        outcome: "Leak fixed. The welding tool used power.",
      },
      {
        label: "Put a bucket under it",
        effects: { supplies: -2 },
        outcome: "The bucket caught some, but a lot of water was lost.",
      },
    ],
    teaches: "Small problems grow if you ignore them, and every drop counts.",
    real: "Space Station crews have hunted down and fixed small air leaks.",
  },
  {
    id: "earth_view",
    kind: "pool",
    title: "Earth in the sky",
    text: "Tonight the sky is clear. Earth looks like a bright star. A perfect night for the telescope.",
    options: [
      {
        label: "Stay up and observe",
        effects: { supplies: -1, science: 2 },
        tags: ["research"],
        outcome: "Beautiful observations! The late night used extra food and water.",
      },
      {
        label: "Get a good night's sleep",
        effects: {},
        outcome: "The crew is well rested. The telescope stayed packed away.",
      },
    ],
    teaches: "From Mars, Earth is just a bright dot in the night sky.",
    real: "The Curiosity rover photographed Earth as a bright dot in the Martian sky in 2014.",
  },
];

export function getCard(id: string): Card {
  const card = CARDS.find((c) => c.id === id);
  if (!card) throw new Error(`Unknown card: ${id}`);
  return card;
}

export const POOL = CARDS.filter((c) => c.kind === "pool");
