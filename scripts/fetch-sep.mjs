#!/usr/bin/env node
// Fetches real solar energetic particle (SEP) events from NASA's DONKI and the
// solar flares linked to them, and saves them to src/data/sep-events.json.
//
// Why SEP and not geomagnetic storms: Mars has no global magnetic field, so the
// Kp index (a measure of Earth's magnetic field) says nothing about radiation
// on Mars. SEP events are the bursts of fast particles that raise radiation in
// space and on the Martian surface, as measured by Curiosity's RAD instrument.
//
// Usage:  NASA_API_KEY=your_key node scripts/fetch-sep.mjs 2023-01-01 2025-12-31
// DONKI allows at most 60 days per request. Without a key it uses DEMO_KEY.
// Events already in the file are kept.

import { readFile, writeFile } from "node:fs/promises";

const OUT = new URL("../src/data/sep-events.json", import.meta.url);
const KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const [from, to] = process.argv.slice(2);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
if (!DATE.test(from ?? "") || !DATE.test(to ?? "")) {
  console.error("Give a start and end date, e.g. node scripts/fetch-sep.mjs 2024-01-01 2024-12-31");
  process.exit(1);
}

const DAY = 86_400_000;
function windows(start, end) {
  const out = [];
  for (let t = Date.parse(start); t <= Date.parse(end); t += 60 * DAY) {
    const stop = Math.min(t + 59 * DAY, Date.parse(end));
    out.push([new Date(t).toISOString().slice(0, 10), new Date(stop).toISOString().slice(0, 10)]);
  }
  return out;
}

async function get(type, a, b) {
  const res = await fetch(`https://api.nasa.gov/DONKI/${type}?startDate=${a}&endDate=${b}&api_key=${KEY}`);
  if (!res.ok) throw new Error(`DONKI ${type} ${a} to ${b}: HTTP ${res.status} ${(await res.text()).slice(0, 120)}`);
  const text = await res.text();
  return text.trim() === "" ? [] : JSON.parse(text);
}

let existing = { events: [] };
try {
  existing = JSON.parse(await readFile(OUT, "utf8"));
} catch {
  // first run
}
const byId = new Map(existing.events.map((e) => [e.id, e]));

for (const [a, b] of windows(from, to)) {
  const seps = await get("SEP", a, b);
  for (const s of seps) {
    const instruments = (s.instruments ?? []).map((i) => i.displayName);
    byId.set(s.sepID, {
      id: s.sepID,
      start: s.eventTime,
      // >100 MeV protons get through spacesuits and thin walls; that makes a storm "high energy".
      highEnergy: instruments.some((n) => />\s*100\s*MeV/i.test(n)),
      flare: (s.linkedEvents ?? []).some((l) => l.activityID.includes("-FLR-")),
      instruments,
      link: s.link,
    });
  }
  console.log(`${a} to ${b}: ${seps.length} SEP events`);
}

const events = [...byId.values()].sort((a, b) => a.start.localeCompare(b.start));
await writeFile(
  OUT,
  JSON.stringify(
    {
      source: "NASA DONKI, Solar Energetic Particle (SEP) records, https://kauai.ccmc.gsfc.nasa.gov/DONKI/",
      note: "Archived snapshot, not live. Events were measured near Earth; Mars is hit by the same kind of storm when it lies on the same side of the Sun.",
      fetched: new Date().toISOString().slice(0, 10),
      events,
    },
    null,
    2,
  ) + "\n",
);
console.log(`Saved ${events.length} SEP events to src/data/sep-events.json`);
