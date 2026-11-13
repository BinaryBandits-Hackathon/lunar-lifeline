import { FLAG_TEXT, getSite } from "../content/landingSites";
import { getRole } from "../content/roles";
import { BaseScene } from "../ui/BaseScene";
import { Gauges } from "../ui/Gauges";
import type { ScreenProps } from "../ui/screen";

/** End of the prototype: shows the state the opening hands to the base game. */
export function Sol1({ state, dispatch }: ScreenProps) {
  const role = state.player.role ? getRole(state.player.role) : null;
  const site = state.site ? getSite(state.site) : null;
  return (
    <main className="screen sol1-screen">
      <p className="eyebrow">Sol 1 of {state.level === "cadet" ? 7 : 10}</p>
      <h2 className="screen-title">Welcome to Mars Base 1, {state.player.name}!</h2>
      <div className="report-layout">
        <BaseScene flags={state.flags} />
        <aside className="report-side">
          <Gauges gauges={state.gauges} />
          <div className="report-card">
            <span className="eyebrow">Your mission so far</span>
            <ul className="facts">
              {role && (
                <li>
                  {role.icon} {role.name}: {role.perkText}
                </li>
              )}
              {site && <li>📍 Landed at {site.name}</li>}
              {state.flags.map((f) => (
                <li key={f} className={FLAG_TEXT[f].good ? "good" : "bad"}>
                  {FLAG_TEXT[f].label}
                </li>
              ))}
            </ul>
          </div>
          <div className="report-card prototype-note">
            <strong>End of the prototype</strong>
            <p>The base game (power board, event cards and real NASA storms) starts here.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: "RESTART" })}>
            ↺ Play the opening again
          </button>
        </aside>
      </div>
    </main>
  );
}
