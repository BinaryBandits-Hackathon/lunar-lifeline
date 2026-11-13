#!/usr/bin/env node
// Fetches real solar storm records from NASA's DONKI (Space Weather Database
// Of Notifications, Knowledge, Information) and saves the strong ones to
// src/data/solar-storms.json for the game.
//
// Usage:  NASA_API_KEY=your_key node scripts/fetch-donki.mjs 2023-01-01 2025-12-31
// DONKI allows at most 60 days per request, so the range is fetched in pieces.
// Without a key it uses DEMO_KEY, which allows only 10 calls per hour.
// Storms already in the file are kept.

import { readFile, writeFile } from "node:fs/promises";

const OUT = new URL("../src/data/solar-storms.json", import.meta.url);
const KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const MIN_KP = 6; // Kp 6+ is a "strong" geomagnetic storm on NOAA's scale (G2 and up)

const [from, to] = process.argv.slice(2);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
if (!DATE.test(from ?? "") || !DATE.test(to ?? "")) {
  console.error("Give a start and end date, e.g. node scripts/fetch-donki.mjs 2024-01-01 2024-12-31");
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

async function fetchRange(a, b) {
  const url = `https://api.nasa.gov/DONKI/GST?startDate=${a}&endDate=${b}&api_key=${KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DONKI ${a} to ${b}: HTTP ${res.status} ${(await res.text()).slice(0, 120)}`);
  const text = await res.text();
  const data = text.trim() === "" ? [] : JSON.parse(text);
  if (!Array.isArray(data)) throw new Error(`DONKI ${a} to ${b}: unexpected response`);
  return data
    .map((g) => ({
      id: g.gstID,
      start: g.startTime,
      maxKp: Math.max(...(g.allKpIndex ?? []).map((k) => k.kpIndex)),
      link: g.link,
    }))
    .filter((s) => typeof s.id === "string" && Number.isFinite(s.maxKp) && s.maxKp >= MIN_KP);
}

let existing = { source: "", fetched: "", storms: [] };
try {
  existing = JSON.parse(await readFile(OUT, "utf8"));
} catch {
  // first run
}

const byId = new Map(existing.storms.map((s) => [s.id, s]));
for (const [a, b] of windows(from, to)) {
  const storms = await fetchRange(a, b);
  storms.forEach((s) => byId.set(s.id, s));
  console.log(`${a} to ${b}: ${storms.length} storms with Kp >= ${MIN_KP}`);
}

const storms = [...byId.values()].sort((a, b) => a.start.localeCompare(b.start));
const out = {
  source: "NASA DONKI, Geomagnetic Storm (GST) records, https://kauai.ccmc.gsfc.nasa.gov/DONKI/",
  note: "Archived snapshot, not live. Kp is measured at Earth; the game uses it as the storm's strength.",
  fetched: new Date().toISOString().slice(0, 10),
  storms,
};
await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`Saved ${storms.length} storms to src/data/solar-storms.json`);
