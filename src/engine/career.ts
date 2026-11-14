import { BADGES, DRILLS, POINTS, type BadgeId } from "../content/academy";
import type { SimState } from "../sim/types";

// A player's progress across missions and drills. Saved on this device only.

export interface MissionRecord {
  date: string;
  level: "cadet" | "commander";
  stars: number;
  ending: string;
  badges: BadgeId[];
  points: number;
}

export interface Career {
  points: number;
  missions: MissionRecord[];
  /** Best score per drill (number of correct answers). */
  drills: Record<string, number>;
  /** Every badge ever earned, once each. */
  badges: BadgeId[];
}

export const EMPTY_CAREER: Career = { points: 0, missions: [], drills: {}, badges: [] };

const BADGE_IDS = Object.keys(BADGES) as BadgeId[];

/** Skills the player showed in a finished mission. */
export function missionBadges(sim: SimState): BadgeId[] {
  const out: BadgeId[] = [];
  const reports = sim.history;
  const notes = reports.flatMap((r) => r.notes.map((n) => n.text));
  const ledger = reports.flatMap((r) => r.ledger);

  const stormReport = sim.storm.kind === "solar" ? reports.find((r) => r.sol === sim.storm.sol) : undefined;
  if (stormReport && !stormReport.notes.some((n) => n.text.includes("during the storm") && n.text.includes("got"))) out.push("stormSafe");

  const walked = ledger.some((l) => l.cause === "Filling spacesuits");
  if (walked && !notes.some((t) => t.startsWith("Going outside alone"))) out.push("buddy");

  if (sim.ending && sim.ending.type !== "emergency" && !notes.some((t) => t.includes("not enough power"))) out.push("powerPlanner");
  if (ledger.some((l) => l.cause === "Greenhouse harvest")) out.push("greenThumb");
  if (sim.visited.length >= 2) out.push("explorer");
  if (sim.ending?.stars === 3) out.push("commander");
  return out;
}

/** Field work: points for exploring on foot and, after that, by rover. */
export function fieldPoints(sim: SimState): { walk: number; rover: number } {
  const onFoot = sim.visited.some((id) => id === "craterRim" || id === "iceCliff");
  const byRover = sim.visited.some((id) => id !== "craterRim" && id !== "iceCliff");
  return { walk: onFoot ? POINTS.firstWalk : 0, rover: byRover ? POINTS.roverTrip : 0 };
}

export function missionPoints(sim: SimState): number {
  const field = fieldPoints(sim);
  return (sim.ending?.stars ?? 0) * POINTS.star + missionBadges(sim).length * POINTS.badge + field.walk + field.rover;
}

export function recordMission(career: Career, sim: SimState, date = new Date().toISOString()): Career {
  if (!sim.ending) return career;
  const badges = missionBadges(sim);
  const points = missionPoints(sim);
  return {
    ...career,
    points: career.points + points,
    missions: [...career.missions, { date, level: sim.level, stars: sim.ending.stars, ending: sim.ending.type, badges, points }].slice(-20),
    badges: [...new Set([...career.badges, ...badges])],
  };
}

function drillValue(score: number, total: number): number {
  if (score >= total) return POINTS.drillPerfect;
  if (score >= Math.ceil(total * 0.66)) return POINTS.drillPass;
  return 0;
}

/** Keeps the best score; only an improvement earns new points. */
export function recordDrill(career: Career, id: string, score: number): Career {
  const drill = DRILLS.find((d) => d.id === id);
  if (!drill) return career;
  const total = drill.questions.length;
  const before = career.drills[id] ?? 0;
  if (score <= before) return career;
  const gained = drillValue(score, total) - drillValue(before, total);
  return { ...career, points: career.points + gained, drills: { ...career.drills, [id]: score } };
}

/** Checks a saved career from storage; anything odd becomes an empty career. */
export function readCareer(raw: unknown): Career {
  if (!raw || typeof raw !== "object") return EMPTY_CAREER;
  const c = raw as Partial<Career>;
  const points = typeof c.points === "number" && c.points >= 0 ? Math.floor(c.points) : 0;
  const drills: Record<string, number> = {};
  if (c.drills && typeof c.drills === "object") {
    for (const d of DRILLS) {
      const v = (c.drills as Record<string, unknown>)[d.id];
      if (typeof v === "number" && v >= 0 && v <= d.questions.length) drills[d.id] = v;
    }
  }
  const badges = Array.isArray(c.badges) ? c.badges.filter((b): b is BadgeId => BADGE_IDS.includes(b as BadgeId)) : [];
  const missions = Array.isArray(c.missions)
    ? c.missions
        .filter((m): m is MissionRecord => !!m && typeof m === "object" && typeof (m as MissionRecord).stars === "number")
        .slice(-20)
    : [];
  return { points, drills, badges, missions };
}
