#!/usr/bin/env node
// Draws the app icons and the Play Store feature graphic as PNG files.
// Usage: node scripts/make-icons.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";

const ORANGE = "#ff5b1f";
const INK = "#f4f4f1";
const BG = "#0b0b0c";

/** The icon artwork: Mars with a helmeted astronaut, centred in a 512 box. */
function iconSvg({ maskable = false } = {}) {
  // Maskable icons get cropped to a circle or squircle, so keep the art in the middle 80%.
  const s = maskable ? 0.72 : 0.9;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="mars" cx="0.36" cy="0.32" r="0.75">
      <stop offset="0" stop-color="#f29a63"/>
      <stop offset="0.45" stop-color="#d4612d"/>
      <stop offset="1" stop-color="#5a2210"/>
    </radialGradient>
    <linearGradient id="visor" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffe08a"/>
      <stop offset="0.55" stop-color="#c98a1f"/>
      <stop offset="1" stop-color="#6b3f08"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" ${maskable ? "" : 'rx="112"'} fill="${BG}"/>
  <g transform="translate(256 256) scale(${s}) translate(-256 -256)">
    <circle cx="300" cy="230" r="170" fill="url(#mars)"/>
    <circle cx="300" cy="230" r="186" fill="none" stroke="${INK}" stroke-opacity="0.18" stroke-width="3"/>
    <circle cx="250" cy="180" r="18" fill="#9e4a22" opacity="0.6"/>
    <circle cx="350" cy="290" r="26" fill="#9e4a22" opacity="0.5"/>
    <g transform="translate(176 300)">
      <path d="M-92 150 Q-92 66 0 66 Q92 66 92 150 Z" fill="${INK}" stroke="#2a2d33" stroke-width="6"/>
      <circle cx="0" cy="0" r="92" fill="${INK}" stroke="#2a2d33" stroke-width="6"/>
      <path d="M-62 -18 A64 54 0 0 1 64 -18 L64 22 A64 44 0 0 1 -62 22 Z" fill="url(#visor)" stroke="#2a2d33" stroke-width="5"/>
      <path d="M-40 -16 Q-20 -36 10 -30" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="8" stroke-linecap="round"/>
      <rect x="-14" y="96" width="28" height="28" rx="6" fill="${ORANGE}"/>
    </g>
  </g>
</svg>`;
}

/** 1024 x 500 banner shown at the top of the Play Store listing. */
function featureSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
  <defs>
    <radialGradient id="mars" cx="0.36" cy="0.32" r="0.75">
      <stop offset="0" stop-color="#f29a63"/>
      <stop offset="0.45" stop-color="#d4612d"/>
      <stop offset="1" stop-color="#3a1408"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="500" fill="${BG}"/>
  <circle cx="930" cy="250" r="220" fill="url(#mars)"/>
  <circle cx="930" cy="250" r="240" fill="none" stroke="${INK}" stroke-opacity="0.15" stroke-width="2"/>
  <text x="64" y="150" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="30" letter-spacing="6" fill="${ORANGE}">NASA SPACE APPS 2026</text>
  <text x="64" y="235" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="70" fill="${INK}">JUNIOR ASTRONAUT</text>
  <text x="64" y="310" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="70" fill="${ORANGE}">MISSION TRAINER</text>
  <text x="66" y="370" font-family="Arial, sans-serif" font-size="26" fill="${INK}" fill-opacity="0.8">Run a base on Mars. Learn what real astronauts do.</text>
</svg>`;
}

function png(svg, width) {
  return new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { loadSystemFonts: true } }).render().asPng();
}

await mkdir(new URL("../public/icons/", import.meta.url), { recursive: true });
await mkdir(new URL("../docs/play-store/", import.meta.url), { recursive: true });
await writeFile(new URL("../public/icons/icon-192.png", import.meta.url), png(iconSvg(), 192));
await writeFile(new URL("../public/icons/icon-512.png", import.meta.url), png(iconSvg(), 512));
await writeFile(new URL("../public/icons/maskable-512.png", import.meta.url), png(iconSvg({ maskable: true }), 512));
await writeFile(new URL("../docs/play-store/icon-512.png", import.meta.url), png(iconSvg(), 512));
await writeFile(new URL("../docs/play-store/feature-graphic-1024x500.png", import.meta.url), png(featureSvg(), 1024));
console.log("Icons and feature graphic written.");
