import { LANDING_SITES, getSite } from "../content/landingSites";
import type { SiteId } from "../engine/types";
import { speak } from "../services/speech";
import { EffectChips } from "../ui/Chips";
import { Dialogue } from "../ui/Dialogue";
import type { ScreenProps } from "../ui/screen";

// Marker positions on the placeholder map (viewBox 0 0 400 240).
const MARKERS: Record<SiteId, { x: number; y: number }> = {
  plains: { x: 110, y: 160 },
  iceValley: { x: 290, y: 150 },
  holdOrbit: { x: 200, y: 34 },
};

export function LandingMap({ state, dispatch }: ScreenProps) {
  const pending = state.pendingSite ? getSite(state.pendingSite) : null;
  const isAllowed = (id: SiteId) => getSite(id).levels.includes(state.level);

  const pick = (id: SiteId) => {
    dispatch({ type: "PICK_SITE", site: id });
    if (state.settings.readAloud) speak(`${getSite(id).name}. ${getSite(id).pitch}`);
  };

  return (
    <main className="screen landing-screen">
      <h2 className="screen-title">Where should we land?</h2>
      <div className="landing-layout">
        <svg className="landing-map" viewBox="0 0 400 240" role="img" aria-label="Map of the landing area with a dust storm in the middle">
          <rect width="400" height="240" className="map-ground" />
          <ellipse cx="200" cy="34" rx="150" ry="18" className="map-orbit" />
          <path d="M0 200 Q100 180 200 205 T400 190 V240 H0 Z" className="map-low" />
          <path d="M230 120 l20 -30 l15 25 l20 -35 l18 30 l20 -20 l25 40 Z" className="map-rocks" />
          <ellipse cx="300" cy="175" rx="38" ry="14" className="map-ice" />
          <circle cx="205" cy="125" r="52" className="map-storm" />
          <text x="205" y="129" textAnchor="middle" className="map-storm-label">Dust storm</text>
          {LANDING_SITES.map((s) => {
            const m = MARKERS[s.id];
            const allowed = isAllowed(s.id);
            return (
              <g
                key={s.id}
                className={`map-marker${state.pendingSite === s.id ? " selected" : ""}${allowed ? "" : " locked"}`}
                onClick={() => allowed && pick(s.id)}
              >
                <circle cx={m.x} cy={m.y} r="14" />
                <text x={m.x} y={m.y + 30} textAnchor="middle">
                  {allowed ? s.name : `${s.name} (Commander)`}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="site-list">
          {LANDING_SITES.filter((s) => isAllowed(s.id)).map((s) => (
            <button
              key={s.id}
              type="button"
              className="site-card"
              aria-pressed={state.pendingSite === s.id}
              onClick={() => pick(s.id)}
            >
              <strong>{s.name}</strong>
              <span>{s.pitch}</span>
              <EffectChips effects={s.effects} flags={s.flags} />
            </button>
          ))}
        </div>
      </div>

      <Dialogue
        text={pending ? `${pending.name}: ${pending.pitch}` : "Tap a landing spot to see what it costs."}
        mood="calm"
        readAloud={state.settings.readAloud}
        onNext={pending ? () => dispatch({ type: "CONFIRM_SITE" }) : undefined}
        nextLabel={pending ? `Land at ${pending.name}` : undefined}
      />
    </main>
  );
}
