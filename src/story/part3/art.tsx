// PART 3 pictures: the marsquake (here) plus launch day and both endings (scenes.tsx).
// Inline SVG, 1600x900, no words inside pictures. Outdoor scenes reuse the
// base built in Part 1. Anything that moves carries a story-p3-anim-* or
// story-p1-anim-* class (off for reduce motion).

import type { ReactNode } from "react";
import { Particles } from "../part1/art";
import { FinishedBase } from "../part1/build";
import type { Choice } from "../types";
import type { Part3ArtKey } from "./content";
import { HomeScene, LaunchScene, StrandedScene } from "./scenes";

const Overlay = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="story-p3-overlay" aria-hidden="true">
    {children}
  </svg>
);

/** Sol 11: the ground shakes; dust falls, the ground cracks, fuel hisses out. */
function Quake() {
  return (
    <div className="story-p3-anim-quake story-p3-fill">
      <FinishedBase />
      <Overlay>
        {/* a fresh crack across the ground */}
        <path d="M120 760 L260 742 L330 770 L470 748 L560 776 L700 754 L820 780 L960 760 L1080 786 L1240 764 L1420 790" fill="none" stroke="#2a1208" strokeWidth="5" strokeLinejoin="round" opacity="0.8" />
        <path d="M330 770 L360 800 M700 754 L690 790 M1080 786 L1110 816" stroke="#2a1208" strokeWidth="3" opacity="0.6" />
        {/* dust shaken loose, falling and drifting */}
        <Particles n={40} seed={91} box={[0, 0, 1600, 520]} dx={[-30, 30]} dy={[120, 260]} r={[1.4, 3.2]} color="#e2b08a" dur={[1.2, 2.6]} />
        {/* fuel hissing from the cracked seal at the fuel plant */}
        <Particles n={18} seed={44} box={[332, 532, 342, 544]} dx={[-90, -20]} dy={[-90, -30]} r={[3, 8]} color="#e9f2ff" dur={[0.9, 1.8]} />
        <g stroke="#ffd08a" strokeWidth="3" strokeLinecap="round" className="story-p1-anim-blink">
          <path d="M344 536 L360 526 M346 540 L366 542 M344 546 L358 558" />
        </g>
        {/* a few rocks bouncing loose */}
        {[
          [520, 690, 9],
          [1180, 700, 7],
          [860, 720, 6],
        ].map(([x, y, r]) => (
          <g key={x} className="story-p3-anim-hop" style={{ animationDelay: `${(x % 7) / 10}s` }}>
            <circle cx={x} cy={y} r={r} fill="#4a2410" />
          </g>
        ))}
      </Overlay>
    </div>
  );
}

/** Part 3 pictures. The marsquake is Labib's; launch, home and stranded are Tijul's scenes (scenes.tsx). */
export function Part3Art({ k, rocks = null, launch = null }: { k: Part3ArtKey | "home" | "stranded"; rocks?: Choice | null; launch?: Choice | null }): ReactNode {
  switch (k) {
    case "quake":
      return <Quake />;
    case "launch":
      return <LaunchScene rocks={rocks} launch={launch} />;
    case "home":
      return <HomeScene />;
    case "stranded":
      return <StrandedScene />;
  }
}
