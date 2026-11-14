import { BN_MAP } from "../content/bn";
import { LANDING_SITES, getSite } from "../content/landingSites";
import type { SiteId } from "../engine/types";
import { speak } from "../services/speech";
import { EffectChips } from "../ui/Chips";
import { Dialogue } from "../ui/Dialogue";
import type { ScreenProps } from "../ui/screen";

// Marker positions on the placeholder map (viewBox 0 0 400 240).
const MARKERS: Record<SiteId, { x: number; y: number; code: string }> = {
  plains: { x: 110, y: 160, code: "A" },
  iceValley: { x: 290, y: 150, code: "B" },
  holdOrbit: { x: 200, y: 34, code: "C" },
};

export function LandingMap({ state, dispatch }: ScreenProps) {
  const bangla = state.settings.bangla;
  const siteText = (id: SiteId) => (bangla ? BN_MAP.sites[id] : getSite(id));
  const pending = state.pendingSite ? getSite(state.pendingSite) : null;
  const isAllowed = (id: SiteId) => getSite(id).levels.includes(state.level);

  const pick = (id: SiteId) => {
    dispatch({ type: "PICK_SITE", site: id });
    const s = siteText(id);
    if (state.settings.readAloud) speak(`${s.name}. ${s.pitch}`);
  };

  return (
    <main className="screen landing-screen">
      <header className="screen-head">
        <span className="label">Decision</span>
        <h2>Where should we land?</h2>
      </header>
      <div className="landing-layout">
        <div className="panel scene-panel">
          <div className="panel-head">
            <span>Landing site survey</span>
            <span className="mono tag tag-warn">Dust storm</span>
          </div>
          <svg className="landing-map" viewBox="0 0 400 240" role="img" aria-label="Map of the landing area with a dust storm in the middle">
            <rect width="400" height="240" className="map-ground" />
            <g className="map-grid">
              {[80, 160, 240, 320].map((x) => <line key={`x${x}`} x1={x} y1="0" x2={x} y2="240" />)}
              {[60, 120, 180].map((y) => <line key={`y${y}`} x1="0" y1={y} x2="400" y2={y} />)}
            </g>
            <ellipse cx="200" cy="34" rx="150" ry="18" className="map-orbit" />
            <path d="M0 200 Q100 180 200 205 T400 190 V240 H0 Z" className="map-low" />
            <path d="M230 120 l20 -30 l15 25 l20 -35 l18 30 l20 -20 l25 40 Z" className="map-rocks" />
            <ellipse cx="300" cy="175" rx="38" ry="14" className="map-ice" />
            <circle cx="205" cy="125" r="52" className="map-storm" />
            <text x="205" y="129" textAnchor="middle" className="map-storm-label">DUST STORM</text>
            {LANDING_SITES.map((s) => {
              const m = MARKERS[s.id];
              const allowed = isAllowed(s.id);
              return (
                <g
                  key={s.id}
                  className={`map-marker${state.pendingSite === s.id ? " selected" : ""}${allowed ? "" : " locked"}`}
                  onClick={() => allowed && pick(s.id)}
                >
                  <circle cx={m.x} cy={m.y} r="13" />
                  <text x={m.x} y={m.y + 4.5} textAnchor="middle" className="map-code">{m.code}</text>
                  <text x={m.x} y={m.y + 30} textAnchor="middle" className="map-name">
                    {allowed ? s.name : `${s.name} (Commander)`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="site-list">
          {LANDING_SITES.filter((s) => isAllowed(s.id)).map((s) => (
            <button
              key={s.id}
              type="button"
              className="site-card"
              aria-pressed={state.pendingSite === s.id}
              onClick={() => pick(s.id)}
            >
              <span className="site-head">
                <span className="site-code">{MARKERS[s.id].code}</span>
                <strong>{s.name}</strong>
              </span>
              <span className="site-pitch">{s.pitch}</span>
              <EffectChips effects={s.effects} flags={s.flags} />
            </button>
          ))}
        </div>
      </div>

      <Dialogue
        text={pending ? `${siteText(pending.id).name}: ${siteText(pending.id).pitch}` : bangla ? BN_MAP.prompt : "Tap a landing spot to see what it costs."}
        mood="calm"
        readAloud={state.settings.readAloud}
        onNext={pending ? () => dispatch({ type: "CONFIRM_SITE" }) : undefined}
        nextLabel={pending ? `Land at ${pending.name}` : undefined}
      />
    </main>
  );
}
