import sepData from "../data/sep-events.json";

// Real solar particle storms from NASA DONKI, used for radiation on Mars.
//
// Why not geomagnetic storms (Kp)? Kp measures how much Earth's magnetic field
// is shaken. Mars has no global magnetic field, so Kp says nothing about Mars.
// What raises radiation on Mars is a burst of fast particles from the Sun: a
// solar energetic particle (SEP) event. Curiosity's RAD instrument has measured
// these on the Martian surface.
//
// DONKI lists one record per instrument, so records within 3 days are grouped
// into one storm.

interface SepRecord {
  id: string;
  start: string;
  highEnergy: boolean;
  flare: boolean;
  instruments: string[];
  link: string;
}

export interface SepStorm {
  id: string;
  start: string;
  /** Protons above 100 MeV were seen: they get through suits and thin walls. */
  highEnergy: boolean;
  /** Linked to a solar flare in DONKI. */
  flare: boolean;
  /** How many spacecraft instruments saw it (model estimates not counted). */
  instruments: number;
  link: string;
}

const GROUP_MS = 3 * 86_400_000;

/** Real spacecraft detections only: DONKI also lists model estimates ("MODEL: ..."), which are not counted. */
const observed = (r: SepRecord) => r.instruments.filter((n) => !n.startsWith("MODEL:")).length;

export function groupStorms(records: SepRecord[]): SepStorm[] {
  const sorted = [...records].sort((a, b) => a.start.localeCompare(b.start));
  const out: SepStorm[] = [];
  let last = -Infinity;
  for (const r of sorted) {
    const t = Date.parse(r.start);
    const cur = out[out.length - 1];
    if (cur && t - last <= GROUP_MS) {
      cur.highEnergy ||= r.highEnergy;
      cur.flare ||= r.flare;
      cur.instruments += observed(r);
    } else {
      out.push({ id: r.id, start: r.start, highEnergy: r.highEnergy, flare: r.flare, instruments: observed(r), link: r.link });
    }
    last = t;
  }
  return out;
}

/**
 * Game strength 3-6. Every SEP event is at least a 3. Seen by several
 * instruments (widespread) adds 1, a linked flare adds 1, and high-energy
 * protons add 2, because those are the ones shielding struggles to stop.
 */
export function sepStrength(s: Pick<SepStorm, "highEnergy" | "flare" | "instruments">): number {
  return Math.min(6, 3 + (s.instruments >= 3 ? 1 : 0) + (s.flare ? 1 : 0) + (s.highEnergy ? 2 : 0));
}

export const SEP_STORMS: SepStorm[] = groupStorms((sepData as { events: SepRecord[] }).events);

// ---------- what Curiosity measured on Mars (RAD) ----------
// Sources: Hassler et al., Science 2014 (doi:10.1126/science.1244797);
// Zeitlin et al., Science 2013 (doi:10.1126/science.1235989); NASA/JPL news, 29 Sept 2017.
export const RAD_FACTS = {
  /** Dose equivalent on the Martian surface, mSv per day (about 0.64). */
  surfacePerDay: 0.64,
  /** During the cruise from Earth to Mars, mSv per day (about 1.8). */
  cruisePerDay: 1.8,
  /** The September 2017 storm: RAD saw surface radiation more than double. */
  sept2017: "In September 2017 a solar storm hit Mars. Curiosity measured the radiation on the ground more than double.",
};
