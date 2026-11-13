import { getRole } from "../content/roles";
import { getSite } from "../content/landingSites";
import { Dialogue } from "../ui/Dialogue";
import { Icon } from "../ui/Icon";
import type { ScreenProps } from "../ui/screen";

/** Mission brief right before the base simulation starts. */
export function SimReady({ state, dispatch }: ScreenProps) {
  const role = state.player.role ? getRole(state.player.role) : null;
  const site = state.site ? getSite(state.site) : null;
  return (
    <main className="screen simready-screen">
      <header className="screen-head">
        <span className="label">Training simulation</span>
        <h2>Ready to begin, {state.player.name}</h2>
      </header>
      <section className="panel">
        <div className="panel-head">
          <span>Mission brief</span>
          <span className="mono">Sol 1 starts next</span>
        </div>
        <ul className="log panel-body">
          {role && (
            <li>
              <Icon name={role.icon} size={18} />
              <span>
                You are the crew's {role.name.toLowerCase()}. {role.perkText}
              </span>
            </li>
          )}
          {site && (
            <li>
              <Icon name="pin" size={18} />
              <span>Base set up at {site.name}. All systems checked.</span>
            </li>
          )}
          <li>
            <Icon name="check" size={18} />
            <span>Keep the crew alive: power, air, water and food. Make rocket fuel for the trip home, and do science.</span>
          </li>
        </ul>
      </section>
      <Dialogue
        text={`Systems are ready, ${state.player.name}. Your training on Mars starts now.`}
        mood="happy"
        form="rover"
        readAloud={state.settings.readAloud}
      >
        <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: "BEGIN_SIM", seed: Date.now() })} autoFocus>
          Begin sol 1
          <Icon name="next" size={18} />
        </button>
      </Dialogue>
    </main>
  );
}
