import { CAPS, CROPS } from "../sim/rules";
import type { CropId, Phase, Resources, SimState, TaskId } from "../sim/types";

// The Mars base as a lit technical illustration (viewBox 1200 x 680).
// Layers, back to front: sky, terrain, structures, time-of-day light,
// then everything that glows (windows, LEDs, grow lights, readouts).
// Levels in the tanks and the battery bank follow the live readings.

type Weather = "clear" | "solar" | "dust";

const OUTSIDE: TaskId[] = ["mine", "repair", "eva"];
const IN_WINDOWS: TaskId[] = ["research", "exercise", "rest", "shelter"];

const frac = (v: number, max: number) => Math.max(0, Math.min(1, v / max));

/** A suited astronaut, about 46 units tall, standing at (x, y). */
function Suit({ x, y, player, flip }: { x: number; y: number; player: boolean; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} className="suit">
      <ellipse cx="0" cy="1" rx="14" ry="3.5" className="shadow-soft" />
      <rect x="-9" y="-30" width="9" height="20" rx="3" className="suit-pack" />
      <path d="M-6 -2 L-5 -14 L5 -14 L6 -2 Z" className="suit-legs" />
      <rect x="-8" y="-31" width="16" height="19" rx="6" className="suit-body" />
      <path d="M8 -27 Q15 -22 12 -15" className="suit-arm" />
      <circle cx="1" cy="-38" r="8.5" className="suit-helmet" />
      <path d="M-3 -42 A6 6 0 0 1 8.5 -37 L8.5 -34 A6 5 0 0 1 -3 -35 Z" className={`suit-visor${player ? " player" : ""}`} />
      {player && <path d="M-3 -54 L1 -49 L5 -54 Z" className="player-mark" />}
    </g>
  );
}

function Lettuce({ x, y, f, ripe }: { x: number; y: number; f: number; ripe: boolean }) {
  const r = 4 + 12 * f;
  return (
    <g transform={`translate(${x} ${y})`} className={`plant lettuce${ripe ? " ripe" : ""}`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r * 0.45} rx={r * 0.55} ry={r * 0.9} transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.45} className="heart" />
    </g>
  );
}

function Potato({ x, y, f, ripe }: { x: number; y: number; f: number; ripe: boolean }) {
  const h = 8 + 36 * f;
  return (
    <g transform={`translate(${x} ${y})`} className={`plant potato${ripe ? " ripe" : ""}`}>
      {[-6, 0, 6].map((dx, i) => (
        <g key={dx}>
          <line x1={dx * 0.4} y1="0" x2={dx} y2={-h + i * 3} className="stem" />
          <ellipse cx={dx - 3} cy={-h * 0.55 + i * 2} rx={2 + 3 * f} ry={1.4 + 1.6 * f} transform={`rotate(-30 ${dx - 3} ${-h * 0.55})`} />
          <ellipse cx={dx + 3} cy={-h * 0.75 + i * 2} rx={2 + 3 * f} ry={1.4 + 1.6 * f} transform={`rotate(30 ${dx + 3} ${-h * 0.75})`} />
          <ellipse cx={dx} cy={-h + i * 3} rx={1.8 + 2.4 * f} ry={1.4 + 1.6 * f} />
          {ripe && <circle cx={dx} cy={-h - 3 + i * 3} r="1.8" className="flower" />}
        </g>
      ))}
    </g>
  );
}

function Crop({ crop, growth, x, y }: { crop: CropId; growth: number; x: number; y: number }) {
  const sols = CROPS[crop].sols;
  const f = Math.min(1, growth / sols);
  const ripe = growth >= sols;
  return crop === "lettuce" ? (
    <>
      <Lettuce x={x - 14} y={y} f={f} ripe={ripe} />
      <Lettuce x={x + 14} y={y} f={f} ripe={ripe} />
    </>
  ) : (
    <Potato x={x} y={y} f={f} ripe={ripe} />
  );
}

/** A vertical tank with a see-through level gauge and a readout. */
function Tank({ x, y, w, h, level, kind, label, value }: { x: number; y: number; w: number; h: number; level: number; kind: string; label: string; value: string }) {
  const gx = x + w * 0.62;
  const gw = w * 0.2;
  const top = y + 10;
  const gh = h - 22;
  return (
    <g className={`tank tank-${kind}`}>
      <ellipse cx={x + w / 2} cy={y + h + 4} rx={w * 0.75} ry="6" className="shadow-soft" />
      <rect x={x} y={y} width={w} height={h} rx={w / 2.4} className="tank-shell" />
      <rect x={x + 4} y={y + 6} width={w * 0.18} height={h - 12} rx="3" className="tank-shine" />
      <rect x={gx} y={top} width={gw} height={gh} rx="2" className="gauge-glass" />
      <rect x={gx} y={top} width={gw} height={gh} rx="2" className="gauge-fill" style={{ transform: `scaleY(${level})` }} />
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1={gx - 3} y1={top + gh * (1 - t)} x2={gx} y2={top + gh * (1 - t)} className="gauge-tick" />
      ))}
      <rect x={x - 2} y={y + h - 8} width={w + 4} height="8" rx="2" className="tank-base" />
      <g className="readout" transform={`translate(${x + w / 2} ${y - 22})`}>
        <rect x="-46" y="-17" width="92" height="32" rx="3" />
        <text y="-4" className="readout-label">{label}</text>
        <text y="10" className="readout-value">{value}</text>
      </g>
    </g>
  );
}

export function SimScene({ sim, phase, weather = "clear", res = sim.res }: { sim: SimState; phase: Phase; weather?: Weather; res?: Resources }) {
  const m = sim.machines;
  const broken = (id: keyof SimState["machines"]) => sim.broken.includes(id);
  const running = (id: keyof SimState["machines"]) => m[id] && !broken(id) && res.battery > 0;
  const dark = phase === "night";
  const powerOut = res.battery <= 0;
  const batteryCells = Math.round(frac(res.battery, CAPS.battery) * 10);
  const sunX = phase === "morning" ? 180 : phase === "day" ? 620 : phase === "evening" ? 1040 : -100;
  const sunY = phase === "day" ? 70 : 170;

  const outside = sim.crew.filter((c) => OUTSIDE.includes(c.task));
  const farmers = sim.crew.filter((c) => c.task === "farm");
  const inside = sim.crew.filter((c) => IN_WINDOWS.includes(c.task));
  const mining = sim.crew.some((c) => c.task === "mine");
  const researching = sim.crew.some((c) => c.task === "research");

  return (
    <svg className={`sim-scene time-${phase} weather-${weather}`} viewBox="0 0 1200 680" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Mars base during the ${phase}`}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="sky-top" />
          <stop offset="0.75" className="sky-mid" />
          <stop offset="1" className="sky-bottom" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b8734a" />
          <stop offset="0.35" stopColor="#a35d36" />
          <stop offset="1" stopColor="#7a3f22" />
        </linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8d9096" />
          <stop offset="0.35" stopColor="#e9eaec" />
          <stop offset="0.6" stopColor="#c9cbcf" />
          <stop offset="1" stopColor="#7c7f86" />
        </linearGradient>
        <linearGradient id="metalV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2f3f4" />
          <stop offset="0.55" stopColor="#c4c6ca" />
          <stop offset="1" stopColor="#7e8188" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="0.4" stopColor="#cfe8f2" stopOpacity="0.04" />
          <stop offset="1" stopColor="#9fc7d8" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="visor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="0.5" stopColor="#c98a1f" />
          <stop offset="1" stopColor="#6b3f08" />
        </linearGradient>
        <pattern id="cells" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#1b2b4a" />
          <path d="M0 0 H10 M0 0 V10" stroke="#5f7aa8" strokeWidth="0.8" />
        </pattern>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.12  0 0 0 0 0.05  0 0 0 0.55 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="blur4">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="sunGlow">
          <stop offset="0" stopColor="#fff6dc" stopOpacity="0.95" />
          <stop offset="0.25" stopColor="#ffe7b0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffe7b0" stopOpacity="0" />
        </radialGradient>
        <clipPath id="frame">
          <rect width="1200" height="680" />
        </clipPath>
      </defs>
      <g clipPath="url(#frame)">

      {/* ---------- sky and horizon ---------- */}
      <rect width="1200" height="680" fill="url(#sky)" />
      <g className="stars">
        {[[60, 40], [150, 95], [240, 30], [330, 120], [410, 60], [520, 25], [600, 110], [690, 55], [780, 140], [860, 35], [950, 90], [1040, 20], [1120, 120], [1170, 60], [300, 170], [760, 190]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 1.8 : 1.1} />
        ))}
      </g>
      {!dark && (
        <g>
          <circle cx={sunX} cy={sunY} r="70" fill="url(#sunGlow)" />
          <circle cx={sunX} cy={sunY} r="11" className="sun" />
        </g>
      )}
      <path d="M0 262 L70 240 L120 246 L190 214 L260 220 L300 236 L380 230 L460 200 L520 206 L560 226 L640 222 L720 196 L800 204 L860 230 L940 224 L1010 206 L1080 214 L1140 236 L1200 228 V300 H0 Z" className="mesa-far" />
      <path d="M0 292 L90 270 L170 282 L250 262 L340 284 L430 276 L520 292 L610 278 L700 290 L790 270 L880 286 L980 274 L1080 290 L1200 276 V330 H0 Z" className="mesa-near" />

      {/* ---------- ground ---------- */}
      <rect y="292" width="1200" height="388" fill="url(#ground)" />
      <rect y="292" width="1200" height="388" filter="url(#grain)" className="grain" />
      <g className="rocks">
        {[[60, 560, 18], [130, 640, 26], [330, 600, 12], [700, 640, 20], [1010, 610, 16], [1150, 560, 22], [470, 330, 8], [905, 320, 10], [40, 380, 10], [1180, 400, 9]].map(([x, y, r], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y + r * 0.35} rx={r * 1.3} ry={r * 0.3} className="shadow-soft" />
            <path d={`M${x - r} ${y} Q${x - r * 0.6} ${y - r * 0.9} ${x} ${y - r * 0.8} Q${x + r * 0.8} ${y - r * 0.7} ${x + r} ${y} Z`} className="rock" />
          </g>
        ))}
      </g>
      <path d="M560 680 Q600 560 640 470" className="track" />
      <path d="M590 680 Q630 560 668 470" className="track" />

      {/* ice field */}
      {sim.nearIce ? (
        <g className="ice-field">
          <ellipse cx="880" cy="330" rx="90" ry="16" className="ice" />
          <ellipse cx="860" cy="327" rx="40" ry="5" className="ice-shine" />
        </g>
      ) : (
        <g className="ice-field far">
          <ellipse cx="1110" cy="296" rx="40" ry="6" className="ice" />
        </g>
      )}

      {/* ice drill */}
      <g className={`drill${mining ? " on" : ""}`}>
        <ellipse cx="840" cy="336" rx="26" ry="5" className="shadow-soft" />
        <path d="M818 334 L840 262 L862 334" className="rig" />
        <line x1="828" y1="300" x2="852" y2="300" className="rig" />
        <line x1="840" y1="262" x2="840" y2="345" className="rig-bit" />
        <rect x="832" y="268" width="16" height="14" rx="2" className="metal-box" />
      </g>

      {/* ---------- solar array ---------- */}
      <g className={`solar${sim.panelsCracked ? " cracked" : ""}${sim.dusty || weather === "dust" ? " dusty" : ""}`}>
        {[0, 1].map((row) =>
          [0, 1, 2].map((col) => {
            const x = 30 + col * 92 + row * 26;
            const y = 318 + row * 52;
            const crackedPanel = sim.panelsCracked && row === 0 && col > 0;
            return (
              <g key={`${row}-${col}`}>
                <ellipse cx={x + 44} cy={y + 46} rx="44" ry="6" className="shadow-soft" />
                <line x1={x + 44} y1={y + 18} x2={x + 44} y2={y + 44} className="post" />
                <path d={`M${x} ${y + 24} L${x + 16} ${y - 6} L${x + 96} ${y - 6} L${x + 80} ${y + 24} Z`} fill="url(#cells)" className="panel-face" />
                <path d={`M${x} ${y + 24} L${x + 16} ${y - 6} L${x + 96} ${y - 6} L${x + 80} ${y + 24} Z`} className="panel-frame" />
                <path d={`M${x + 4} ${y + 20} L${x + 18} ${y - 3} L${x + 40} ${y - 3} L${x + 26} ${y + 20} Z`} className="panel-sheen" />
                <path d={`M${x} ${y + 24} L${x + 16} ${y - 6} L${x + 96} ${y - 6} L${x + 80} ${y + 24} Z`} className="panel-dust" />
                {crackedPanel && <path d={`M${x + 30} ${y} L${x + 44} ${y + 8} L${x + 38} ${y + 14} L${x + 60} ${y + 18}`} className="crack" />}
              </g>
            );
          }),
        )}
      </g>

      {/* battery bank */}
      <g className="battery-bank">
        <ellipse cx="135" cy="498" rx="62" ry="7" className="shadow-soft" />
        <rect x="80" y="436" width="110" height="60" rx="4" fill="url(#metalV)" className="box-edge" />
        <rect x="88" y="446" width="94" height="16" rx="2" className="cell-window" />
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={90 + i * 9.2} y="448" width="7.4" height="12" rx="1" className={`cell${i < batteryCells ? " full" : ""}${batteryCells <= 2 ? " low" : ""}`} />
        ))}
        <rect x="88" y="468" width="94" height="20" rx="2" className="vent-grille" />
      </g>

      {/* life-support module: oxygen maker, CO2 scrubber, water recycler */}
      <g className="life-support">
        <ellipse cx="290" cy="472" rx="68" ry="7" className="shadow-soft" />
        <rect x="232" y="404" width="118" height="66" rx="5" fill="url(#metalV)" className="box-edge" />
        <rect x="232" y="404" width="118" height="10" rx="3" className="box-top" />
        <line x1="350" y1="430" x2="390" y2="430" className="pipe" />
        {running("oxygenMaker") && (
          <g className="steam">
            <circle cx="255" cy="392" r="7" />
            <circle cx="262" cy="380" r="9" />
          </g>
        )}
      </g>

      {/* lab module and dish */}
      <g className={`lab${researching ? " on" : ""}`}>
        <ellipse cx="700" cy="306" rx="62" ry="7" className="shadow-soft" />
        <rect x="650" y="262" width="100" height="42" rx="20" fill="url(#metal)" className="box-edge" />
        <line x1="728" y1="262" x2="728" y2="226" className="post" />
        <path d="M704 226 A24 12 0 0 0 752 226 Z" fill="url(#metalV)" className="box-edge" />
        <line x1="728" y1="226" x2="728" y2="212" className="post thin" />
      </g>

      {/* ---------- habitat ---------- */}
      <g className={`habitat${powerOut ? " out" : ""}`}>
        <ellipse cx="560" cy="434" rx="190" ry="14" className="shadow-soft" filter="url(#blur4)" />
        <rect x="390" y="320" width="340" height="110" rx="55" fill="url(#metalV)" className="hab-shell" />
        {[460, 530, 600, 670].map((x) => (
          <line key={x} x1={x} y1="322" x2={x} y2="428" className="seam" />
        ))}
        <rect x="390" y="404" width="340" height="18" rx="6" className="hab-skirt" />
        <rect x="372" y="346" width="40" height="62" rx="10" fill="url(#metal)" className="airlock" />
        <rect x="381" y="358" width="22" height="40" rx="4" className="airlock-door" />
        {[480, 550, 620, 690].map((x) => (
          <circle key={x} cx={x} cy="360" r="15" className="window-frame" />
        ))}
      </g>

      {/* ---------- greenhouse (glass) ---------- */}
      <g className="greenhouse">
        <ellipse cx="906" cy="528" rx="150" ry="10" className="shadow-soft" filter="url(#blur4)" />
      </g>

      {/* ---------- tank farm ---------- */}
      <g className="pipes">
        <path d="M730 400 H748 V480 H766" className="pipe" />
        <path d="M1046 470 H1062" className="pipe" />
      </g>
      <Tank x={1062} y={400} w={54} h={126} level={frac(res.oxygen, CAPS.oxygen)} kind="oxygen" label="OXYGEN" value={`${Math.round(res.oxygen)}%`} />
      <Tank x={1128} y={356} w={64} h={170} level={frac(res.water, CAPS.water)} kind="water" label="WATER" value={`${Math.round(res.water)} L`} />

      {/* fuel plant and rocket fuel tank */}
      <g className={`fuel-plant${running("fuelPlant") ? " on" : ""}`}>
        <ellipse cx="985" cy="370" rx="60" ry="6" className="shadow-soft" />
        <rect x="940" y="320" width="64" height="46" rx="4" fill="url(#metalV)" className="box-edge" />
        <line x1="1004" y1="344" x2="1028" y2="344" className="pipe" />
        <line x1="958" y1="320" x2="958" y2="296" className="post" />
        {running("fuelPlant") && <circle cx="958" cy="292" r="5" className="flare" />}
      </g>
      <Tank x={1022} y={238} w={54} h={132} level={frac(res.fuel, CAPS.fuel)} kind="fuel" label="FUEL" value={`${Math.round(res.fuel)}%`} />

      {/* rover */}
      <g className="rover" transform="translate(470 560)">
        <ellipse cx="0" cy="22" rx="70" ry="8" className="shadow-soft" />
        <rect x="-58" y="-18" width="116" height="26" rx="6" fill="url(#metalV)" className="box-edge" />
        <rect x="-50" y="-30" width="58" height="14" rx="3" className="rover-deck" />
        <line x1="34" y1="-18" x2="34" y2="-48" className="post" />
        <rect x="26" y="-56" width="18" height="10" rx="2" className="metal-box" />
        <rect x="-50" y="-44" width="58" height="7" rx="2" className="rover-charge-bg" />
        <rect x="-50" y="-44" width={58 * Math.min(1, sim.rover.battery / 100)} height="7" rx="2" className={`rover-charge${sim.rover.broken ? " broken" : ""}`} />
        {[-42, 0, 42].map((x) => (
          <g key={x}>
            <circle cx={x} cy="14" r="12" className="wheel" />
            <circle cx={x} cy="14" r="4" className="hub" />
          </g>
        ))}
      </g>

      {/* crew outside, in spacesuits */}
      {outside.map((c, i) => {
        const spot = c.task === "mine" ? { x: 800 + i * 26, y: 344 } : c.task === "eva" ? { x: 360 + i * 30, y: 584 } : { x: 210 + i * 30, y: 430 };
        return <Suit key={c.id} x={spot.x} y={spot.y} player={c.isPlayer} flip={c.task === "repair"} />;
      })}

      {/* ---------- time-of-day light and weather ---------- */}
      <rect width="1200" height="680" className="light" />
      {weather === "dust" && (
        <g className="dust">
          <rect width="1200" height="680" className="dust-haze" />
          {[90, 230, 400, 560, 720, 880, 1040].map((y, i) => (
            <line key={y} x1={-200 + i * 40} y1={y * 0.6 + 120} x2={200 + i * 40} y2={y * 0.6 + 110} className="dust-streak" />
          ))}
        </g>
      )}
      {weather === "solar" && (
        <g className="solar-storm">
          {[100, 260, 420, 580, 740, 900, 1060].map((x) => (
            <line key={x} x1={x + 60} y1="0" x2={x - 40} y2="250" className="particle" />
          ))}
        </g>
      )}

      {/* ---------- things that glow ---------- */}
      <g className="emissive">
        {[480, 550, 620, 690].map((x, i) => {
          const person = inside[i];
          return (
            <g key={x}>
              <circle cx={x} cy="360" r="11" className={`window${powerOut ? " off" : ""}`} />
              {person && (
                <path
                  d={`M${x - 7} 371 Q${x - 7} 362 ${x} 362 Q${x + 7} 362 ${x + 7} 371 Z M${x - 4} 357 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0`}
                  className={`person${person.isPlayer ? " player" : ""}`}
                />
              )}
            </g>
          );
        })}
        {/* greenhouse interior, lit from inside so it stays visible in any light */}
        <g className={`gh-interior${!running("greenhouseLights") && (dark || phase === "evening") ? " dim" : ""}`}>
        <path d="M766 524 V452 Q766 408 812 408 H1000 Q1046 408 1046 452 V524 Z" className="gh-floor-back" />
        {sim.plots.map((p, i) => {
          const x = 816 + i * 90;
          return (
            <g key={i}>
              <rect x={x - 34} y="500" width="68" height="14" rx="2" className="bed" />
              <rect x={x - 34} y="500" width="68" height="4" className="bed-soil" />
              {p.crop && <Crop crop={p.crop} growth={p.growth} x={x} y={501} />}
            </g>
          );
        })}
        {farmers.map((c, i) => (
          <g key={c.id} transform={`translate(${862 + i * 90} 498)`} className={`farmer${c.isPlayer ? " player" : ""}`}>
            <rect x="-6" y="-26" width="12" height="20" rx="4" className="farmer-body" />
            <circle cx="0" cy="-32" r="6" className="farmer-head" />
            <path d="M-5 -6 L-4 0 M5 -6 L4 0" className="farmer-legs" />
          </g>
        ))}
        </g>
        <path d="M769 521 V452 Q769 411 812 411 H1000 Q1043 411 1043 452 V521 Z" className={`grow-light${running("greenhouseLights") ? " on" : ""}`} />
        <path d="M766 524 V452 Q766 408 812 408 H1000 Q1046 408 1046 452 V524 Z" fill="url(#glass)" className="gh-glass" />
        {[812, 859, 906, 953, 1000].map((x) => (
          <line key={x} x1={x} y1="409" x2={x} y2="524" className="gh-rib" />
        ))}
        <path d="M776 470 Q778 425 816 418" className="gh-glint" />

        {(
          [
            ["oxygenMaker", 254, "O₂"],
            ["scrubber", 290, "CO₂"],
            ["recycler", 326, "H₂O"],
          ] as const
        ).map(([id, x, label]) => (
          <g key={id}>
            <circle cx={x} cy="438" r="7" className={`lamp ${broken(id) ? "broken" : running(id) ? "on" : "off"}`} />
            <text x={x} y="458" className="lamp-label">{label}</text>
          </g>
        ))}
        {mining && <circle cx="840" cy="275" r="4" className="lamp on drill-lamp" />}
        {researching && <circle cx="728" cy="210" r="4" className="lamp on" />}
        <g className="readout" transform="translate(135 420)">
          <rect x="-46" y="-17" width="92" height="32" rx="3" />
          <text y="-4" className="readout-label">BATTERY</text>
          <text y="10" className="readout-value">{Math.round(res.battery)}%</text>
        </g>
      </g>
      </g>
    </svg>
  );
}
