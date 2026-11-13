import type { Flag } from "../engine/types";
import { Pip } from "./Pip";

// Placeholder for the angled 2D base. Each building sits in a fixed slot so
// real art can replace these shapes without moving anything else.
export function BaseScene({ flags }: { flags: Flag[] }) {
  const cracked = flags.includes("PANELS_DAMAGED");
  const nearIce = flags.includes("NEAR_ICE");
  const panels = [0, 1, 2, 3];

  return (
    <svg className="base-scene" viewBox="0 0 480 280" role="img" aria-label={`Your Mars base${cracked ? ", with two cracked solar panels" : ""}${nearIce ? ", next to a patch of ice" : ""}`}>
      <rect width="480" height="280" className="base-sky" />
      <path d="M0 110 L60 80 L120 100 L190 70 L260 95 L330 65 L400 90 L480 72 V140 H0 Z" className="base-hills" />
      {/* ground plate, drawn at an angle */}
      <path d="M240 112 L470 190 L240 268 L10 190 Z" className="base-ground" />

      {nearIce ? (
        <ellipse cx="402" cy="183" rx="26" ry="8" className="base-ice" />
      ) : (
        <g className="base-far-ice">
          <ellipse cx="452" cy="104" rx="18" ry="5" className="base-ice" />
          <text x="452" y="96" textAnchor="middle">ice, far away</text>
        </g>
      )}

      {/* solar panels slot */}
      <g className="slot-panels">
        {panels.map((i) => {
          const x = 70 + i * 34;
          const y = 175 - i * 11;
          const broken = cracked && (i === 1 || i === 2);
          return (
            <g key={i}>
              <line x1={x + 14} y1={y + 18} x2={x + 14} y2={y + 30} className="panel-leg" />
              <path d={`M${x} ${y} L${x + 30} ${y - 10} L${x + 30} ${y + 12} L${x} ${y + 22} Z`} className={broken ? "panel broken" : "panel"} />
              {broken && <path d={`M${x + 6} ${y + 4} L${x + 15} ${y + 9} L${x + 11} ${y + 14} L${x + 24} ${y + 6}`} className="panel-crack" />}
            </g>
          );
        })}
      </g>

      {/* habitat slot */}
      <g className="slot-habitat">
        <ellipse cx="245" cy="185" rx="62" ry="22" className="hab-base" />
        <path d="M183 185 A62 52 0 0 1 307 185 Z" className="hab-dome" />
        <rect x="236" y="168" width="18" height="17" rx="3" className="hab-door" />
      </g>

      {/* greenhouse slot */}
      <g className="slot-greenhouse">
        <path d="M318 222 L368 205 L368 186 L318 203 Z" className="gh-glass" />
        <path d="M318 203 L340 192 L368 186 L346 196 Z" className="gh-roof" />
        <circle cx="332" cy="208" r="4" className="gh-plant" />
        <circle cx="348" cy="203" r="4" className="gh-plant" />
      </g>

      {/* lander */}
      <g className="slot-lander">
        <path d="M150 238 L165 205 L195 205 L210 238 Z" className="lander-body" />
        <line x1="150" y1="238" x2="140" y2="250" className="panel-leg" />
        <line x1="210" y1="238" x2="220" y2="250" className="panel-leg" />
      </g>

      <g transform="translate(266 206) scale(0.62)">
        <Pip form="rover" mood={cracked ? "alert" : "happy"} size={64} />
      </g>
    </svg>
  );
}
