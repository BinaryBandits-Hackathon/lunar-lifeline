import { getCard } from "../content/cards";
import { RULES } from "../content/rules";
import type { EndingType } from "../engine/types";
import { Dialogue } from "../ui/Dialogue";
import { Gauges } from "../ui/Gauges";
import { Icon } from "../ui/Icon";
import { useSpeak, type ScreenProps } from "../ui/screen";

const ENDINGS: Record<EndingType, { title: string; pip: string }> = {
  commander: { title: "Mission Commander", pip: "You took smart risks and brought the discoveries home. That's what real astronauts do!" },
  safe: { title: "Safe Return", pip: "Everyone is safe. But we came to Mars to discover things. Which risk would you take next time?" },
  grounded: { title: "Grounded", pip: "Your radiation badge is full. Real astronauts have a lifetime limit, so this was your last flight." },
  early: { title: "Early Return", pip: "We ran out of supplies and had to launch early. Everyone is safe. Look at the log to see what happened." },
};

function Star({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="44" height="44" className={`star${on ? " on" : ""}`} aria-hidden="true">
      <path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.6l-6 3.3 1.3-6.7-5-4.7 6.8-.8z" />
    </svg>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function Ending({ state, dispatch }: ScreenProps) {
  const b = state.base!;
  const ending = b.ending!;
  const info = ENDINGS[ending.type];
  const lessons = [...new Set(b.seen.map((id) => getCard(id).teaches))];
  const storm = b.storm;
  useSpeak(info.pip, state.settings.readAloud);

  return (
    <main className="screen base-screen ending-screen">
      <header className="ending-head">
        <span className="label">Mission report · {ending.type === "early" ? `Ended on sol ${ending.sol}` : `${b.totalSols} sols`}</span>
        <h2>{info.title}</h2>
        <div className="ending-stars" role="img" aria-label={`${ending.stars} of 3 stars`}>
          {[1, 2, 3].map((n) => (
            <Star key={n} on={n <= ending.stars} />
          ))}
        </div>
      </header>

      <Gauges gauges={state.gauges} scienceGoal={b.scienceGoal} />

      <div className="result-layout">
        <section className="panel">
          <div className="panel-head">
            <span>What you learned</span>
          </div>
          <ul className="log panel-body">
            {lessons.map((l) => (
              <li key={l} className="good">
                <Icon name="check" size={18} />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="ending-side">
          <section className="panel">
            <div className="panel-head">
              <span>The real science</span>
            </div>
            <div className="panel-body">
              {storm.kind === "solar" && storm.record ? (
                <p>
                  Your solar storm was based on a <strong>real storm NASA recorded on {formatDate(storm.record.start)}</strong>, measured at
                  Kp {storm.record.maxKp} on a scale of 0 to 9.{" "}
                  <a href={storm.record.link} target="_blank" rel="noreferrer">
                    See NASA's record
                  </a>
                  .
                </p>
              ) : storm.kind === "solar" ? (
                <p>Your solar storm used an example strength. Real NASA storm data will appear here once it is loaded.</p>
              ) : (
                <p>Your mission had a dust storm. In 2018 a real dust storm covered all of Mars.</p>
              )}
              <p className="hint">
                Radiation limit {RULES.doseLimit}. Science goal {b.scienceGoal}. Source: NASA DONKI space weather database.
              </p>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <span>Sol by sol</span>
            </div>
            <ol className="timeline panel-body">
              {b.history.map((h) => {
                const bad = h.lines.filter((l) => l.tone === "bad");
                return (
                  <li key={h.sol} className={bad.length ? "bad" : "good"}>
                    <span className="mono">Sol {h.sol}</span>
                    <span>{bad.length ? bad.map((l) => l.text).join(" ") : "Everything worked."}</span>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </div>

      <Dialogue text={info.pip} mood={ending.stars >= 2 ? "happy" : "calm"} form="rover" readAloud={state.settings.readAloud}>
        <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: "RESTART" })}>
          <Icon name="home" size={18} />
          Start screen
        </button>
        <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: "REPLAY" })}>
          <Icon name="replay" size={18} />
          Try again
        </button>
      </Dialogue>
    </main>
  );
}
