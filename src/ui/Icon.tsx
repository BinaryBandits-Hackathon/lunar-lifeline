import type { IconName } from "../engine/types";

// One consistent line-icon set (24 px grid, 1.75 stroke), drawn in code.
// Replaces emoji, which look different on every device.
const STROKE: Partial<Record<IconName, string>> = {
  power: "M13 2 4 14h7l-1 8 9-12h-7l1-8z",
  supplies: "M12 3c3.5 4.2 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 2.5-6.8 6-11z",
  science: "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6l-5.4 2.9 1.2-6-4.5-4.2 6.1-.7z",
  wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5a1.5 1.5 0 0 0 2.1 2.1l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.1-.6-.6-2.1 2.6-2.6z",
  medical: "M8 3h8v5h5v8h-5v5H8v-5H3V8h5z",
  flask: "M9 3h6 M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3 M7.2 15h9.6",
  speaker: "M4 9v6h4l5 4V5L8 9H4z M16.5 8.5a5 5 0 0 1 0 7 M19 6a8.5 8.5 0 0 1 0 12",
  speakerOff: "M4 9v6h4l5 4V5L8 9H4z M17 9.5l5 5 M22 9.5l-5 5",
  home: "M3 11 12 4l9 7 M5.5 9.5V20h13V9.5 M10 20v-5h4v5",
  rocket: "M12 2.5c3 2.4 4.5 5.8 4.5 9.5L14 15h-4l-2.5-3c0-3.7 1.5-7.1 4.5-9.5z M10 15l-2.5 4.5 M14 15l2.5 4.5 M12 15v5",
  academy: "M2 9.5 12 4.5l10 5-10 5z M6 11.5v5c3.5 2.3 8.5 2.3 12 0v-5 M22 9.5V15",
  pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z",
  replay: "M4 4v6h6 M4.6 15a8 8 0 1 0 1.9-8.4L4 10",
  next: "M9 6l6 6-6 6",
  back: "M15 6l-6 6 6 6",
  check: "M5 12.5l4.5 4.5L19 7",
  water: "M2 10c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2 M2 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2",
  strength: "M6.5 6.5v11 M17.5 6.5v11 M3.5 9.5v5 M20.5 9.5v5 M6.5 12h11",
  paths: "M12 21v-8 M12 13 6 7 M12 13l6-6 M6 7V3 M18 7V3 M12 13V3",
  astronaut: "M12 3a8 8 0 0 1 8 8v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3a8 8 0 0 1 8-8z M7.5 10.5a4.5 3.5 0 0 1 9 0v1a4.5 2.5 0 0 1-9 0z M7 18v3h10v-3",
};

const RADIATION_BLADE = "M10.4 9.23 7.25 3.77A9.5 9.5 0 0 1 16.75 3.77L13.6 9.23A3.2 3.2 0 0 0 10.4 9.23z";

interface Props {
  name: IconName;
  size?: number;
  className?: string;
  title?: string;
}

export function Icon({ name, size = 20, className, title }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    className: `icon${className ? ` ${className}` : ""}`,
    role: title ? "img" : undefined,
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
  } as const;

  if (name === "dose") {
    return (
      <svg {...common} fill="currentColor">
        {[0, 120, 240].map((a) => (
          <path key={a} d={RADIATION_BLADE} transform={`rotate(${a} 12 12)`} />
        ))}
        <circle cx="12" cy="12" r="1.8" />
      </svg>
    );
  }

  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={STROKE[name]} />
      {name === "pin" && <circle cx="12" cy="10" r="2.2" />}
      {name === "rocket" && <circle cx="12" cy="9.5" r="1.6" />}
    </svg>
  );
}
