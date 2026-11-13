import { describe, expect, it } from "vitest";
import { createInitialState, next } from "../src/engine/flow";
import type { Action, GameState, Level, RoleId, SiteId } from "../src/engine/types";
import { assignTask, chooseEvent, createSim, nextSol, planPlot, powerForecast, runSol, stormStatus, summarize, toggleMachine } from "../src/sim/engine";
import type { SimState } from "../src/sim/types";

function landed(level: Level = "cadet", role: RoleId = "engineer", site: SiteId = "iceValley"): GameState {
  let s = [
    { type: "START" },
    { type: "SET_NAME", name: "Nova" },
    { type: "PICK_ROLE", role },
    { type: "NEXT" },
  ].reduce((acc, a) => next(acc, a as Action), createInitialState({ level }));
  while (s.stage !== "landingChoice") s = next(s, { type: "NEXT" });
  s = next(next(s, { type: "PICK_SITE", site }), { type: "CONFIRM_SITE" });
  while (s.stage !== "damageReport") s = next(s, { type: "NEXT" });
  return s;
}

type Bot = (sim: SimState) => SimState;

/** Everyone rests, machines stay as they start, nothing planned. */
const idle: Bot = (sim) => sim.crew.reduce((s, c) => assignTask(s, c.id, "rest"), sim);

/** A careful player who watches the levels. */
const sensible: Bot = (sim) => {
  let s = sim;
  const want = (id: Parameters<typeof toggleMachine>[1], on: boolean) => (s.machines[id] !== on ? toggleMachine(s, id) : s);
  s = { ...s };
  s = want("fuelPlant", s.res.battery > 25);
  s = want("oxygenMaker", s.res.oxygen < 45);
  s = want("recycler", s.res.water < 100);
  const solarToday = s.storm.kind === "solar" && stormStatus(s) === "today";
  const needsRepair = s.panelsCracked || s.broken.length > 0 || s.leak || s.dusty;
  for (const c of s.crew) {
    let task = c.task;
    if (solarToday) task = "shelter";
    else if (c.energy < 40) task = "rest";
    else if (c.role === "engineer") task = needsRepair ? "repair" : s.res.water < 90 ? "mine" : "exercise";
    else if (c.role === "scientist") task = "research";
    else task = s.plots.some((p) => !p.crop || p.growth >= (p.crop === "lettuce" ? 3 : 5)) ? "farm" : "exercise";
    s = assignTask(s, c.id, task);
  }
  return s;
};

/** Switches everything on and does science all day. */
const greedy: Bot = (sim) => {
  let s = sim.machines.fuelPlant ? sim : toggleMachine(sim, "fuelPlant");
  for (const c of s.crew) s = assignTask(s, c.id, "research");
  return s;
};

function play(start: GameState, bot: Bot, seed = 1): SimState {
  let sim = createSim(start, seed);
  for (let i = 0; i < 30 && sim.mode !== "ended"; i++) {
    if (sim.eventId) sim = chooseEvent(sim, 0);
    sim = runSol(bot(sim));
    sim = nextSol(sim);
  }
  return sim;
}

describe("base simulation", () => {
  it("starts from the systems check readings and the landing", () => {
    const sim = createSim(landed("cadet", "doctor", "iceValley"));
    expect(sim.res.battery).toBe(78);
    expect(sim.res.water).toBe(180);
    expect(sim.panelsCracked).toBe(true);
    expect(sim.crew).toHaveLength(3);
    expect(sim.crew[0]).toMatchObject({ name: "Nova", role: "doctor", isPlayer: true });
    expect(new Set(sim.crew.map((c) => c.role)).size).toBe(3);
  });

  it("cracked panels make half the power, and a repair fixes them", () => {
    let sim = createSim(landed());
    expect(powerForecast(sim).make).toBe(25);
    sim = assignTask(sim, "player", "repair");
    sim = runSol(sim);
    expect(sim.panelsCracked).toBe(false);
    expect(powerForecast(nextSol(sim)).make).toBe(50);
  });

  it("heaters can't be switched off, other machines can", () => {
    const sim = createSim(landed());
    expect(toggleMachine(sim, "heaters").machines.heaters).toBe(true);
    expect(toggleMachine(sim, "fuelPlant").machines.fuelPlant).toBe(true);
  });

  it("the fuel plant makes fuel but costs power", () => {
    const base = assignTask(createSim(landed()), "player", "rest");
    const off = runSol(base);
    const on = runSol(toggleMachine(base, "fuelPlant"));
    expect(on.res.fuel).toBeGreaterThan(off.res.fuel);
    expect(on.res.battery).toBeLessThan(off.res.battery);
  });

  it("switching off the scrubber lets carbon dioxide build up", () => {
    let sim = toggleMachine(createSim(landed()), "scrubber");
    sim = runSol(sim);
    expect(sim.res.co2).toBeGreaterThan(0.4);
  });

  it("planted crops grow under lights and can be harvested", () => {
    let sim = createSim(landed("cadet", "doctor", "plains"));
    sim = planPlot(sim, 0, "lettuce");
    for (let sol = 0; sol < 4; sol++) {
      sim = runSol(assignTask(sim, "player", "farm"));
      sim = nextSol(sim);
    }
    const harvest = sim.history.flatMap((r) => r.ledger).filter((e) => e.cause === "Greenhouse harvest");
    expect(harvest.length).toBeGreaterThan(0);
  });

  it("the evening report explains every change with a cause", () => {
    const sim = runSol(createSim(landed()));
    const lines = summarize(sim.report!);
    expect(lines.some((l) => l.res === "battery" && l.cause.startsWith("Solar panels"))).toBe(true);
    expect(lines.some((l) => l.res === "oxygen" && l.cause === "Crew breathing")).toBe(true);
    expect(sim.report!.timeline.map((t) => t.phase)).toEqual(["morning", "day", "evening", "night"]);
  });

  describe.each(["cadet", "commander"] as Level[])("balance at %s level", (level) => {
    const runs = (["engineer", "doctor", "scientist"] as RoleId[]).flatMap((role) =>
      (["plains", "iceValley"] as SiteId[]).map((site) => landed(level, role, site)),
    );

    const SEEDS = Array.from({ length: 40 }, (_, i) => i + 1);
    const all = (bot: Bot) => runs.flatMap((start) => SEEDS.map((seed) => play(start, bot, seed).ending!));
    const careful = all(sensible);
    const lazy = all(idle);
    const greed = all(greedy);
    const share = (list: typeof careful, test: (e: (typeof careful)[number]) => boolean) => list.filter(test).length / list.length;
    console.log(
      `${level}: careful 3★ ${Math.round(100 * share(careful, (e) => e.stars === 3))}% lost ${Math.round(100 * share(careful, (e) => e.stars === 0))}%` +
        ` | idle lost ${Math.round(100 * share(lazy, (e) => e.stars === 0))}% | greedy 3★ ${Math.round(100 * share(greed, (e) => e.stars === 3))}% lost ${Math.round(100 * share(greed, (e) => e.stars === 0))}%`,
    );

    it("a careful player almost always survives", () => {
      expect(share(careful, (e) => e.stars === 0)).toBeLessThan(0.05);
      expect(share(careful, (e) => e.stars >= 2)).toBeGreaterThan(0.8);
    });

    it("doing nothing never earns more than 1 star", () => {
      expect(lazy.every((e) => e.stars <= 1)).toBe(true);
    });

    it("switching everything on and only doing science rarely wins", () => {
      // Cadet is gentler on purpose, so a risky player wins more often there.
      expect(share(greed, (e) => e.stars === 3)).toBeLessThan(level === "cadet" ? 0.3 : 0.1);
    });
  });
});

describe("storms and surprises", () => {
  it("a solar storm adds radiation unless the crew shelters", () => {
    let seed = 1;
    while (createSim(landed(), seed).storm.kind !== "solar") seed++;
    let sim = createSim(landed(), seed);
    while (sim.sol < sim.storm.sol) {
      if (sim.eventId) sim = chooseEvent(sim, 0);
      sim = nextSol(runSol(sim));
    }
    if (sim.eventId) sim = chooseEvent(sim, 0);
    const before = sim.crew.map((c) => c.dose);
    let safe = sim;
    for (const c of sim.crew) safe = assignTask(safe, c.id, "shelter");
    safe = runSol(safe);
    expect(safe.crew.map((c) => c.dose)).toEqual(before);
    const exposed = runSol(assignTask(sim, "player", "mine"));
    expect(exposed.crew[0].dose).toBeGreaterThan(before[0]);
  });

  it("a dust storm cuts solar power and leaves dusty panels", () => {
    let seed = 1;
    while (createSim(landed("cadet", "doctor", "plains"), seed).storm.kind !== "dust") seed++;
    let sim = createSim(landed("cadet", "doctor", "plains"), seed);
    const clear = powerForecast(sim).make;
    while (sim.sol < sim.storm.sol) {
      if (sim.eventId) sim = chooseEvent(sim, 0);
      sim = nextSol(runSol(sim));
    }
    expect(stormStatus(sim)).toBe("today");
    expect(powerForecast(sim).make).toBeLessThan(clear / 2);
    for (let i = 0; i < 2; i++) sim = nextSol(runSol(sim.eventId ? chooseEvent(sim, 0) : sim));
    expect(sim.dusty).toBe(true);
  });

  it("a surprise must be answered before the sol can run", () => {
    let sim = createSim(landed());
    for (let seed = 1; seed < 50 && !sim.eventId; seed++) {
      sim = createSim(landed(), seed);
      for (let i = 0; i < 3 && !sim.eventId && sim.mode !== "ended"; i++) sim = nextSol(runSol(sim));
    }
    expect(sim.eventId).not.toBeNull();
    expect(runSol(sim)).toBe(sim);
    expect(chooseEvent(sim, 0).eventId).toBeNull();
  });

  it("a repair job fixes a broken machine", () => {
    let sim: SimState = { ...createSim(landed("cadet", "doctor", "plains")), broken: ["scrubber"] };
    expect(toggleMachine(sim, "scrubber")).toBe(sim);
    sim = runSol(assignTask(sim, "player", "repair"));
    expect(sim.broken).toEqual([]);
  });
});
