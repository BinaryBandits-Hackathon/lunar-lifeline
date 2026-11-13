import { FLAG_TEXT, getSite } from "../content/landingSites";
import { getRole } from "../content/roles";
import { BaseScene } from "../ui/BaseScene";
import { Gauges } from "../ui/Gauges";
import { Icon } from "../ui/Icon";
import type { ScreenProps } from "../ui/screen";

/** End of the prototype: shows the state the opening hands to the base game. */
export function Sol1({ state, dispatch }: ScreenProps) {
  const role = state.player.role ? getRole(state.player.role) : null;
  const site = state.site ? getSite(state.site) : null;
  return (
    <main className="screen sol1-screen">
      <header className="screen-head">
        <span className="label">Sol 1 of {state.level === "cadet" ? 7 : 10}</span>
        <h2>Welcome to Mars Base 1, {state.player.name}</h2>
      </header>
      <div className="report-layout">
        <div className="panel scene-panel">
          <div className="panel-head">
            <span>Base camera</span>
            <span className="mono">{site?.name ?? ""}</span>
          </div>
          <BaseScene flags={state.flags} />
        </div>
        <aside className="report-side">
          <Gauges gauges={state.gauges} />
          <section className="panel">
            <div className="panel-head">
              <span>Mission log</span>
            </div>
            <ul className="log panel-body">
              {role && (
                <li>
                  <Icon name={role.icon} size={18} />
                  <span>
                    {role.name}: {role.perkText}
                  </span>
                </li>
              )}
              {site && (
                <li>
                  <Icon name="pin" size={18} />
                  <span>Landed at {site.name}</span>
                </li>
              )}
              {state.flags.map((f) => (
                <li key={f} className={FLAG_TEXT[f].good ? "good" : "bad"}>
                  <span className="dot" aria-hidden="true" />
                  <span>{FLAG_TEXT[f].label}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="panel panel-dashed">
            <div className="panel-body">
              <strong>End of the prototype</strong>
              <p className="hint">The base game (power board, event cards and real NASA storms) starts here.</p>
            </div>
          </section>
          <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: "RESTART" })}>
            <Icon name="replay" size={18} />
            Play the opening again
          </button>
        </aside>
      </div>
    </main>
  );
}
