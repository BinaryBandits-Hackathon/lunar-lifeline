import { ROLES } from "../content/roles";
import { strengthFromKp } from "../content/rules";
import { STORMS, nextRandom } from "../engine/base";
import type { GameState, RoleId, StormRecord } from "../engine/types";
import { EVENTS, getEvent } from "./events";
import { getSite as getEvaSite } from "./eva";
import { isUnlocked, machineLocked, newOnSol, taskLocked } from "./unlocks";
import {
  CAPS,
  CO2_DANGER,
  CO2_EMERGENCY,
  CO2_FLOOR,
  CO2_TIRED,
  COLD_HEALTH,
  COLD_SLEEP_ENERGY,
  CRACKED_SOLAR,
  CREW_USE,
  CROPS,
  DOSE_INSIDE,
  DOSE_LIMIT,
  DOSE_OUTSIDE,
  DOSE_START,
  DUSTY_SOLAR,
  DUST_STORM_SOLAR,
  DUST_STORM_SOLS,
  EVA_MIN_ENERGY,
  EVA_RISK,
  EVA_STORM_DOSE,
  ROVER_CHARGE,
  ROVER_START,
  EVENT_CHANCE,
  EXERCISE_HEALTH,
  FUEL_PER_SOL,
  LEAK_WATER,
  LEVELS,
  MACHINES,
  MINE_WATER,
  NO_EXERCISE_HEALTH,
  OUTSIDE_TASKS,
  OXYGEN_MAKER,
  PHASES,
  PLOTS,
  PLOT_WATER,
  RECYCLE_SHARE,
  RESEARCH_SCIENCE,
  SCRUBBER_REMOVES,
  SHED_ORDER,
  SLEEP_ENERGY,
  SOLAR,
  SOLAR_CHANCE,
  TASKS,
  TASK_POWER,
  TIRED_ENERGY,
} from "./rules";
import type {
  CrewMember,
  CropId,
  LedgerEntry,
  MachineId,
  Phase,
  PhaseSnapshot,
  Plot,
  ResourceId,
  Resources,
  SimEnding,
  SimState,
  SimStorm,
  SolReport,
  TaskId,
} from "./types";

const CREWMATES: Record<RoleId, string> = { engineer: "Tunde", doctor: "Mei", scientist: "Sofia" };

function defaultTask(role: RoleId, cracked: boolean): TaskId {
  if (role === "engineer") return cracked ? "repair" : "mine";
  if (role === "scientist") return "research";
  return "farm";
}

/** Builds the base right after the systems check, from the landing choice. */
export function createSim(state: GameState, seed = 1): SimState {
  const cracked = state.flags.includes("PANELS_DAMAGED");
  const farIce = state.flags.includes("FAR_FROM_ICE");
  const waited = state.site === "holdOrbit";
  const level = LEVELS[state.level];
  const playerRole: RoleId = state.player.role ?? "engineer";
  const roles: RoleId[] = [playerRole, ...ROLES.map((r) => r.id).filter((r) => r !== playerRole)];

  let rng = seed >>> 0 || 1;
  let r: number;
  [r, rng] = nextRandom(rng);
  const kind = r < SOLAR_CHANCE ? "solar" : "dust";
  [r, rng] = nextRandom(rng);
  const stormSol = level.stormSols[0] + Math.floor(r * (level.stormSols[1] - level.stormSols[0] + 1));
  let record: StormRecord | null = null;
  let strength = kind === "solar" ? 4 : DUST_STORM_SOLS;
  if (kind === "solar" && STORMS.length > 0) {
    [r, rng] = nextRandom(rng);
    record = STORMS[Math.floor(r * STORMS.length)];
    strength = strengthFromKp(record.maxKp);
  }

  const crew: CrewMember[] = roles.map((role, i) => ({
    id: i === 0 ? "player" : role,
    name: i === 0 ? state.player.name || "You" : CREWMATES[role],
    role,
    isPlayer: i === 0,
    energy: 60,
    health: 92,
    dose: DOSE_START + (waited ? 30 : 0),
    task: defaultTask(role, cracked),
  }));
  const startsAt = { level: state.level, sol: 1 };
  for (const c of crew) if (taskLocked(startsAt, c.task)) c.task = c.role === "doctor" ? "exercise" : "research";

  return {
    rng,
    storm: { sol: stormSol, kind, strength, record },
    dusty: false,
    broken: [],
    leak: false,
    eventId: null,
    eventsSeen: [],
    bonusScience: 0,
    mustRest: [],
    eventResult: null,
    rover: { battery: ROVER_START, broken: false },
    newUnlocks: [],
    evaSite: null,
    visited: [],
    sol: 1,
    totalSols: level.sols,
    level: state.level,
    mode: "plan",
    res: {
      battery: waited ? 64 : 78,
      oxygen: waited ? 70 : 85,
      co2: 0.4,
      water: farIce ? 120 : 180,
      food: 24,
      fuel: 8,
      science: 0,
    },
    machines: { heaters: true, scrubber: true, oxygenMaker: true, recycler: true, greenhouseLights: isUnlocked(startsAt, "greenhouse"), fuelPlant: false, roverCharger: false },
    panelsCracked: cracked,
    nearIce: !farIce,
    crew,
    plots: Array.from({ length: PLOTS }, (_, i): Plot => ({ crop: null, growth: 0, plan: i === 1 ? "potato" : "lettuce" })),
    goals: { fuel: level.fuelGoal, science: level.scienceGoal },
    report: null,
    history: [],
    ending: null,
  };
}

// ---------- storms ----------

export function isDustStormSol(storm: SimStorm, sol: number): boolean {
  return storm.kind === "dust" && sol >= storm.sol && sol < storm.sol + DUST_STORM_SOLS;
}

/** "today", "tomorrow", or null, for the storm's warning. */
export function stormStatus(sim: SimState): "today" | "tomorrow" | null {
  const s = sim.storm;
  if (s.kind === "solar") return s.sol === sim.sol ? "today" : s.sol === sim.sol + 1 ? "tomorrow" : null;
  if (isDustStormSol(s, sim.sol)) return "today";
  return s.sol === sim.sol + 1 ? "tomorrow" : null;
}

function solarFactor(sim: SimState, cracked: boolean): number {
  if (isDustStormSol(sim.storm, sim.sol)) return DUST_STORM_SOLAR;
  return (cracked ? CRACKED_SOLAR : 1) * (sim.dusty ? DUSTY_SOLAR : 1);
}

// ---------- planning actions ----------

export function assignTask(sim: SimState, crewId: string, task: TaskId): SimState {
  if (sim.mode !== "plan" || sim.mustRest.includes(crewId) || taskLocked(sim, task)) return sim;
  return { ...sim, crew: sim.crew.map((c) => (c.id === crewId ? { ...c, task } : c)) };
}

export function toggleMachine(sim: SimState, id: MachineId): SimState {
  if (sim.mode !== "plan" || !MACHINES[id].canSwitchOff || sim.broken.includes(id) || machineLocked(sim, id)) return sim;
  return { ...sim, machines: { ...sim.machines, [id]: !sim.machines[id] } };
}

export function planPlot(sim: SimState, index: number, crop: CropId | null): SimState {
  if (sim.mode !== "plan" || !sim.plots[index]) return sim;
  return { ...sim, plots: sim.plots.map((p, i) => (i === index ? { ...p, plan: crop } : p)) };
}

/** Closes the "new on the base" card. */
export function dismissUnlocks(sim: SimState): SimState {
  return sim.newUnlocks.length ? { ...sim, newUnlocks: [] } : sim;
}

/** Sets where today's spacewalk goes (or clears it). */
export function planEva(sim: SimState, siteId: string | null): SimState {
  if (sim.mode !== "plan") return sim;
  if (siteId) {
    const site = getEvaSite(siteId);
    if (site.only && !site.only(sim)) return sim;
    if (site.rover > 0 && !isUnlocked(sim, "rover")) return sim;
  }
  return { ...sim, evaSite: siteId };
}

/** Picks one option of the surprise waiting at the start of the sol. */
export function chooseEvent(sim: SimState, index: number): SimState {
  if (sim.mode !== "plan" || !sim.eventId) return sim;
  const option = getEvent(sim.eventId).options[index];
  if (!option) return sim;
  return { ...option.apply(sim), eventId: null, eventResult: `${getEvent(sim.eventId).title}: ${option.result}` };
}

const isOn = (sim: SimState, id: MachineId) => sim.machines[id] && !sim.broken.includes(id);

/** Battery the switched-on machines and today's jobs will use, and what the panels will make. */
export function powerForecast(sim: SimState): { make: number; use: number } {
  const factor = solarFactor(sim, sim.panelsCracked);
  const make = Math.round(PHASES.reduce((n, p) => n + SOLAR[p] * factor, 0));
  let use = 0;
  for (const id of Object.keys(MACHINES) as MachineId[]) {
    if (isOn(sim, id)) use += PHASES.reduce((n, p) => n + MACHINES[id].use[p], 0);
  }
  for (const c of sim.crew) {
    if (c.task === "mine") use += TASK_POWER.mine;
    if (c.task === "research") use += TASK_POWER.research;
  }
  return { make, use };
}

// ---------- running a sol ----------

const round1 = (n: number) => Math.round(n * 10) / 10;

export function runSol(sim: SimState): SimState {
  if (sim.mode !== "plan" || sim.eventId) return sim;
  const res: Resources = { ...sim.res };
  let crew = sim.crew.map((c) => ({ ...c }));
  let plots = sim.plots.map((p) => ({ ...p }));
  let panelsCracked = sim.panelsCracked;
  let broken = [...sim.broken];
  let leak = sim.leak;
  let dusty = sim.dusty;
  let rover = { ...sim.rover };
  let visited = [...sim.visited];
  let rng = sim.rng;
  const ledger: LedgerEntry[] = [];
  const notes: SolReport["notes"] = [];
  const timeline: PhaseSnapshot[] = [];
  const lightsRan = new Set<Phase>();
  let heatersAtNight = true;
  const exercised = new Set<string>();
  let researched = false;
  const dustStorm = isDustStormSol(sim.storm, sim.sol);
  const solarStorm = sim.storm.kind === "solar" && sim.storm.sol === sim.sol;

  if (sim.eventResult) notes.push({ tone: "info", text: sim.eventResult });
  for (const id of broken) notes.push({ tone: "bad", text: `${MACHINES[id].name} is broken and couldn't run. Send someone to Repair it.` });

  const add = (r: ResourceId, amount: number, cause: string) => {
    if (amount === 0) return;
    res[r] += amount;
    ledger.push({ res: r, amount, cause });
  };

  for (const phase of PHASES) {
    // 1. Solar power.
    const factor = solarFactor({ ...sim, dusty }, panelsCracked);
    const cause = dustStorm ? "Solar panels (dust storm)" : panelsCracked ? "Solar panels (2 cracked)" : dusty ? "Solar panels (dusty)" : "Solar panels";
    add("battery", round1(SOLAR[phase] * factor), cause);

    // 2. Power demands, most important first.
    type Demand = { key: MachineId | "mine" | "research"; amount: number; label: string };
    const demands: Demand[] = [];
    for (const id of [...SHED_ORDER].reverse()) {
      const amount = sim.machines[id] && !broken.includes(id) ? MACHINES[id].use[phase] : 0;
      if (amount > 0) demands.push({ key: id, amount, label: MACHINES[id].name });
    }
    if (phase === "day") {
      const miners = crew.filter((c) => c.task === "mine").length;
      const researchers = crew.filter((c) => c.task === "research").length;
      const at = demands.length - (demands.some((d) => d.key === "fuelPlant") ? 1 : 0);
      if (researchers) demands.splice(at, 0, { key: "research", amount: TASK_POWER.research * researchers, label: "Lab" });
      if (miners) demands.splice(at, 0, { key: "mine", amount: TASK_POWER.mine * miners, label: "Ice drill" });
    }
    const ran = new Set<string>();
    const unpowered: MachineId[] = [];
    for (const d of demands) {
      if (res.battery >= d.amount) {
        add("battery", -d.amount, d.label);
        ran.add(d.key);
      } else if (d.key !== "mine" && d.key !== "research") {
        unpowered.push(d.key);
      }
    }
    for (const id of unpowered) notes.push({ tone: "bad", text: `${MACHINES[id].name} switched off in the ${phase}: not enough power.` });

    // 3. What the machines did.
    if (ran.has("oxygenMaker")) {
      add("oxygen", OXYGEN_MAKER.oxygen, "Oxygen maker");
      add("water", -OXYGEN_MAKER.water, "Oxygen maker");
    }
    if (ran.has("scrubber")) {
      const removed = Math.min(SCRUBBER_REMOVES, Math.max(0, res.co2 - CO2_FLOOR));
      add("co2", -removed, "CO₂ scrubber");
    }
    if (ran.has("fuelPlant")) add("fuel", FUEL_PER_SOL / 2, "Fuel plant");
    if (ran.has("roverCharger")) rover.battery = Math.min(100, rover.battery + ROVER_CHARGE);
    if (ran.has("greenhouseLights")) lightsRan.add(phase);
    if (phase === "night" && !ran.has("heaters")) heatersAtNight = false;
    if (leak) add("water", -LEAK_WATER / 4, "Leaking pipe");

    // 4. The crew breathes, drinks and eats.
    add("oxygen", -CREW_USE.oxygen / 4, "Crew breathing");
    add("co2", CREW_USE.co2 / 4, "Crew breathing");
    add("water", -CREW_USE.water / 4, "Crew drinking and washing");
    if (ran.has("recycler")) add("water", (CREW_USE.water / 4) * RECYCLE_SHARE, "Water recycler");
    add("food", -CREW_USE.food / 4, "Crew meals");

    // 5. Bad air.
    if (res.co2 > CO2_TIRED) crew = crew.map((c) => ({ ...c, energy: c.energy - 5 }));
    if (res.co2 > CO2_DANGER) crew = crew.map((c) => ({ ...c, health: c.health - 5 }));

    // 6. Jobs and the solar storm happen during the day.
    if (phase === "day") {
      if (solarStorm) {
        for (const c of crew) {
          const per = c.task === "shelter" ? 0 : OUTSIDE_TASKS.includes(c.task) ? DOSE_OUTSIDE : DOSE_INSIDE;
          const dose = per * sim.storm.strength;
          c.dose += dose;
          notes.push(
            dose === 0
              ? { tone: "good", text: `${c.name} was safe in the shelter during the solar storm.` }
              : { tone: "bad", text: `${c.name} got ${dose} mSv of radiation ${OUTSIDE_TASKS.includes(c.task) ? "outside" : "inside"} during the storm.` },
          );
        }
      }
      const evaGoers: CrewMember[] = [];
      for (const c of crew) {
        const task = TASKS[c.task];
        if (c.task === "shelter") continue;
        if (c.task !== "rest" && c.energy < Math.max(task.energy, TIRED_ENERGY)) {
          notes.push({ tone: "bad", text: `${c.name} was too tired to ${task.name.toLowerCase()}.` });
          continue;
        }
        c.energy -= task.energy;
        switch (c.task) {
          case "farm": {
            let harvested = 0;
            plots = plots.map((p) => {
              if (p.crop && p.growth >= CROPS[p.crop].sols) {
                harvested += CROPS[p.crop].meals;
                return { ...p, crop: null, growth: 0 };
              }
              return p;
            });
            if (harvested) add("food", harvested, "Greenhouse harvest");
            let planted = 0;
            plots = plots.map((p) => {
              if (!p.crop && p.plan) {
                planted++;
                return { ...p, crop: p.plan, growth: 0 };
              }
              return p;
            });
            if (planted) notes.push({ tone: "good", text: `${c.name} planted ${planted} bed${planted > 1 ? "s" : ""}.` });
            if (!harvested && !planted) notes.push({ tone: "info", text: `${c.name} tended the plants. Nothing to plant or harvest.` });
            break;
          }
          case "mine":
            if (ran.has("mine")) {
              const water = (sim.nearIce ? MINE_WATER.near : MINE_WATER.far) + (c.role === "engineer" ? 5 : 0);
              add("water", water, `${c.name} mined ice`);
            } else notes.push({ tone: "bad", text: `${c.name} couldn't run the ice drill: not enough power.` });
            break;
          case "repair":
            if (panelsCracked) {
              panelsCracked = false;
              notes.push({ tone: "good", text: `${c.name} fixed the cracked solar panels. Full power again!` });
            } else if (broken.length) {
              const fixed = broken[0];
              broken = broken.slice(1);
              notes.push({ tone: "good", text: `${c.name} repaired the ${MACHINES[fixed].name.toLowerCase()}.` });
            } else if (rover.broken) {
              rover.broken = false;
              notes.push({ tone: "good", text: `${c.name} fixed the rover. It can drive again.` });
            } else if (leak) {
              leak = false;
              notes.push({ tone: "good", text: `${c.name} fixed the leaking pipe.` });
            } else if (dusty && !dustStorm) {
              dusty = false;
              notes.push({ tone: "good", text: `${c.name} cleaned the dusty solar panels.` });
            } else notes.push({ tone: "info", text: `${c.name} checked the machines. Nothing was broken.` });
            break;
          case "research":
            if (ran.has("research")) {
              add("science", RESEARCH_SCIENCE + (c.role === "scientist" ? 1 : 0), `${c.name}'s research`);
              researched = true;
            } else notes.push({ tone: "bad", text: `${c.name} couldn't use the lab: not enough power.` });
            break;
          case "exercise":
            c.health += EXERCISE_HEALTH + (c.role === "doctor" ? 2 : 0);
            exercised.add(c.id);
            break;
          case "rest":
            break;
          case "eva":
            evaGoers.push(c);
            break;
        }
      }
      if (researched && sim.bonusScience) add("science", sim.bonusScience, "Earth's experiment");

      // The spacewalk.
      const walkers = evaGoers;
      if (walkers.length) {
        const site = sim.evaSite ? getEvaSite(sim.evaSite) : null;
        const cancel = (why: string) => {
          notes.push({ tone: "bad", text: `Spacewalk cancelled: ${why}` });
          for (const w of walkers) w.energy += TASKS.eva.energy;
        };
        if (!site) cancel("no destination was planned.");
        else if (dustStorm) cancel("too much dust to see the way back.");
        else if (site.rover && rover.broken) cancel("the rover is broken.");
        else if (site.rover && rover.battery < site.rover) cancel(`the rover needs ${site.rover}% battery but has ${Math.round(rover.battery)}%.`);
        else {
          const n = walkers.length;
          add("oxygen", -site.suitO2 * n, "Filling spacesuits");
          if (site.rover) rover.battery = Math.max(0, rover.battery - site.rover);
          for (const w of walkers) {
            const dose = site.dose * (solarStorm ? EVA_STORM_DOSE : 1);
            w.dose += dose;
          }
          let risk = EVA_RISK.base;
          if (n < 2) risk += EVA_RISK.solo;
          if (walkers.some((w) => w.energy < EVA_MIN_ENERGY - TASKS.eva.energy)) risk += EVA_RISK.tired;
          if (site.km > 6) risk += EVA_RISK.far;
          let r: number;
          [r, rng] = nextRandom(rng);
          const firstVisit = !visited.includes(site.id);
          let science = firstVisit ? site.science + (walkers.some((w) => w.role === "scientist") ? 1 : 0) : 1;
          if (r < risk) {
            science = Math.ceil(science / 2);
            if (site.rover) {
              rover.broken = true;
              notes.push({ tone: "bad", text: `A rover wheel broke at the ${site.name.toLowerCase()}. The crew drove back slowly. Someone must Repair the rover.` });
            } else {
              add("oxygen", -3, "Suit alarm");
              notes.push({ tone: "bad", text: `A suit alarm went off at the ${site.name.toLowerCase()}, so the crew came back early.` });
            }
          } else {
            notes.push({ tone: "good", text: `${walkers.map((w) => w.name).join(" and ")} explored the ${site.name.toLowerCase()} (${site.km} km${site.rover ? " by rover" : " on foot"}).` });
          }
          if (n < 2) notes.push({ tone: "bad", text: "Going outside alone broke the buddy rule and made the spacewalk riskier." });
          if (solarStorm) notes.push({ tone: "bad", text: "A spacewalk during a solar storm gave the crew three times the radiation." });
          add("science", science, firstVisit ? `Spacewalk: ${site.name}` : `Spacewalk: ${site.name} (visited before)`);
          if (firstVisit && site.bonus) for (const [k, v] of Object.entries(site.bonus)) add(k as ResourceId, v as number, `Spacewalk: ${site.name}`);
          if (!visited.includes(site.id)) visited = [...visited, site.id];
        }
      }
    }

    clamp(res);
    timeline.push({ phase, res: { ...res }, unpowered });
  }

  // Night sleep, exercise and the greenhouse.
  crew = crew.map((c) => {
    let { energy, health } = c;
    energy += heatersAtNight ? SLEEP_ENERGY : COLD_SLEEP_ENERGY;
    if (!heatersAtNight) health -= COLD_HEALTH;
    if (!exercised.has(c.id)) health -= NO_EXERCISE_HEALTH;
    return { ...c, energy: Math.max(0, Math.min(100, energy)), health: Math.max(0, Math.min(100, health)) };
  });
  if (!heatersAtNight) notes.push({ tone: "bad", text: "The heaters ran out of power at night. The crew slept badly in the cold." });
  const skipped = crew.filter((c) => !exercised.has(c.id)).length;
  if (skipped) notes.push({ tone: "info", text: `${skipped} crew didn't exercise: their muscles got a little weaker.` });

  const growing = plots.filter((p) => p.crop).length;
  const lit = lightsRan.has("morning") && lightsRan.has("day");
  if (growing) {
    if (lit && res.water >= growing * PLOT_WATER) {
      add("water", -growing * PLOT_WATER, "Watering plants");
      plots = plots.map((p) => (p.crop ? { ...p, growth: p.growth + 1 } : p));
      const ripe = plots.filter((p) => p.crop && p.growth >= CROPS[p.crop].sols).length;
      notes.push({ tone: "good", text: ripe ? `${ripe} crop${ripe > 1 ? "s are" : " is"} ripe! Send someone to farm.` : "The plants grew." });
    } else {
      notes.push({ tone: "bad", text: lit ? "Not enough water for the plants: they didn't grow." : "The greenhouse was dark: the plants didn't grow." });
    }
  }

  // A dust storm leaves the panels dusty when it ends.
  if (sim.storm.kind === "dust" && sim.sol === sim.storm.sol + DUST_STORM_SOLS - 1) {
    dusty = true;
    notes.push({ tone: "bad", text: "The dust storm is over, but the panels are covered in dust. A Repair job will clean them." });
  }
  clamp(res);

  const report: SolReport = { sol: sim.sol, ledger, notes, timeline };
  const after: SimState = {
    ...sim,
    res,
    crew,
    plots,
    panelsCracked,
    broken,
    leak,
    dusty,
    rover,
    visited,
    rng,
    report,
    history: [...sim.history, report],
    mode: "report",
  };
  return { ...after, ending: checkEnding(after) };
}

function clamp(res: Resources) {
  for (const k of Object.keys(res) as ResourceId[]) {
    res[k] = round1(Math.max(0, Math.min(CAPS[k], res[k])));
  }
}

function checkEnding(sim: SimState): SimEnding | null {
  const { res, sol } = sim;
  const emergency = (reason: string): SimEnding => ({ type: "emergency", stars: 0, sol, reason });
  if (res.oxygen <= 0) return emergency("The oxygen tanks ran empty.");
  if (res.water <= 0) return emergency("The water ran out.");
  if (res.food <= 0) return emergency("The food ran out.");
  if (res.co2 >= CO2_EMERGENCY) return emergency("Carbon dioxide in the air got dangerous.");
  if (sim.crew.some((c) => c.health <= 0)) return emergency("A crew member became too sick to continue.");
  const over = sim.crew.find((c) => c.dose >= DOSE_LIMIT);
  if (over) return { type: "grounded", stars: 0, sol, reason: `${over.name} reached the radiation limit of ${DOSE_LIMIT} mSv and must fly home.` };
  if (sol < sim.totalSols) return null;
  const stars = (1 + (res.fuel >= sim.goals.fuel ? 1 : 0) + (res.science >= sim.goals.science ? 1 : 0)) as 1 | 2 | 3;
  return { type: stars === 3 ? "commander" : "survived", stars, sol, reason: "" };
}

/** After reading the report: start the next sol (maybe with a surprise), or show the ending. */
export function nextSol(sim: SimState): SimState {
  if (sim.mode !== "report") return sim;
  if (sim.ending) return { ...sim, mode: "ended" };
  const sol = sim.sol + 1;
  let rng = sim.rng;
  let eventId: string | null = null;
  const stormNear = stormStatus({ ...sim, sol }) !== null;
  if (!stormNear) {
    let r: number;
    [r, rng] = nextRandom(rng);
    if (r < EVENT_CHANCE) {
      const pool = EVENTS.filter((e) => !sim.eventsSeen.includes(e.id) && (!e.when || e.when(sim)));
      if (pool.length) {
        [r, rng] = nextRandom(rng);
        eventId = pool[Math.floor(r * pool.length)].id;
      }
    }
  }
  const crew = sim.crew.map((c) => (sim.mustRest.includes(c.id) ? { ...c, task: "research" as TaskId } : c));
  const newUnlocks = newOnSol(sim.level, sol);
  const machines = newUnlocks.includes("greenhouse") ? { ...sim.machines, greenhouseLights: true } : sim.machines;
  return {
    ...sim,
    sol,
    rng,
    crew,
    mode: "plan",
    report: null,
    eventId,
    eventsSeen: eventId ? [...sim.eventsSeen, eventId] : sim.eventsSeen,
    bonusScience: 0,
    mustRest: [],
    eventResult: null,
    evaSite: null,
    newUnlocks,
    machines,
  };
}

/** Totals per resource and cause for the evening report. */
export function summarize(report: SolReport): { res: LedgerEntry["res"]; cause: string; amount: number }[] {
  const map = new Map<string, { res: LedgerEntry["res"]; cause: string; amount: number }>();
  for (const e of report.ledger) {
    const key = `${e.res}|${e.cause}`;
    const cur = map.get(key) ?? { res: e.res, cause: e.cause, amount: 0 };
    cur.amount = round1(cur.amount + e.amount);
    map.set(key, cur);
  }
  return [...map.values()].filter((e) => e.amount !== 0);
}
