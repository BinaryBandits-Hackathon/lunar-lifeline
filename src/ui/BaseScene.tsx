import type { Flag } from "../engine/types";
import { Pip } from "./Pip";

// Placeholder for the angled 2D base. Each building sits in a fixed slot so
// real art can replace these shapes without moving anything else.
interface SceneProps {
  flags: Flag[];
  /** Today's weather on the base. */
  weather?: "clear" | "dust" | "solar";
  /** Blocks in each system, to show what is switched on. Omit in the opening. */
  power?: { habitat: number; greenhouse: number; shield: number; habitatNeed: number };
}

export function BaseScene({ flags, weather = "clear", power }: SceneProps) {
  const cracked = flags.includes("PANELS_DAMAGED");
  const dusty = flags.includes("DUSTY_PANELS");
  const nearIce = flags.includes("NEAR_ICE");
  const roof = flags.includes("SHELTER_BUILT");
  const panels = [0, 1, 2, 3];
  const habitatLow = power ? power.habitat < power.habitatNeed : false;
  const greenhouseDark = power ? power.greenhouse === 0 : false;
  const shieldOn = power ? power.shield > 0 : false;

  const label = [
    "Your Mars base",
    cracked && "two solar panels are cracked",
    nearIce && "ice is nearby",
    weather === "dust" && "a dust storm darkens the sky",
    weather === "solar" && "a solar storm is hitting",
    shieldOn && "the radiation shield is on",
    habitatLow && "the habitat lights are dim",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <svg className={`base-scene weather-${weather}`} viewBox="0 0 480 280" role="img" aria-label={label}>
      <rect width="480" height="280" className="base-sky" />
      {weather === "solar" && (
        <g className="solar-rays">
          {[60, 130, 200, 270, 340, 410].map((x) => (
            <line key={x} x1={x + 30} y1="0" x2={x - 10} y2="90" />
          ))}
        </g>
      )}
      <path d="M0 110 L60 80 L120 100 L190 70 L260 95 L330 65 L400 90 L480 72 V140 H0 Z" className="base-hills" />
      {/* ground plate, drawn at an angle */}
      <path d="M240 112 L470 190 L240 268 L10 190 Z" className="base-ground" />

      {nearIce ? (
        <ellipse cx="402" cy="183" rx="26" ry="8" className="base-ice" />
      ) : (
        <g className="base-far-ice">
          <ellipse cx="415" cy="104" rx="18" ry="5" className="base-ice" />
          <text x="415" y="96" textAnchor="middle">ice, far away</text>
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
              <path d={`M${x} ${y} L${x + 30} ${y - 10} L${x + 30} ${y + 12} L${x} ${y + 22} Z`} className={broken ? "solar broken" : dusty ? "solar dusty" : "solar"} />
              {broken && <path d={`M${x + 6} ${y + 4} L${x + 15} ${y + 9} L${x + 11} ${y + 14} L${x + 24} ${y + 6}`} className="panel-crack" />}
            </g>
          );
        })}
      </g>

      {/* habitat slot */}
      <g className={`slot-habitat${habitatLow ? " dim" : ""}`}>
        <ellipse cx="245" cy="185" rx="62" ry="22" className="hab-base" />
        <path d="M183 185 A62 52 0 0 1 307 185 Z" className="hab-dome" />
        {roof && <path d="M188 172 A58 40 0 0 1 302 172 L307 185 A62 52 0 0 0 183 185 Z" className="hab-soil" />}
        <rect x="236" y="168" width="18" height="17" rx="3" className="hab-door" />
        <circle cx="215" cy="172" r="3" className="hab-light" />
        <circle cx="275" cy="172" r="3" className="hab-light" />
      </g>
      {shieldOn && <path d="M172 186 A73 62 0 0 1 318 186" className="shield-field" />}

      {/* greenhouse slot */}
      <g className={`slot-greenhouse${greenhouseDark ? " dark" : ""}`}>
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
        <Pip form="rover" mood={cracked || weather !== "clear" || habitatLow ? "alert" : "happy"} size={64} />
      </g>
      {weather === "dust" && <rect width="480" height="280" className="dust-haze" />}
    </svg>
  );
}
