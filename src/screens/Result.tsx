import { currentCard } from "../engine/base";
import { Dialogue } from "../ui/Dialogue";
import { Gauges } from "../ui/Gauges";
import { useSpeak, type ScreenProps } from "../ui/screen";

export function Result({ state, dispatch }: ScreenProps) {
  const b = state.base!;
  const card = currentCard(state)!;
  const done = b.ending !== null;
  const lesson = card.teaches;
  useSpeak(lesson, state.settings.readAloud);

  return (
    <main className="screen base-screen">
      <header className="screen-head">
        <span className="label">
          Sol {b.sol} of {b.totalSols} · End of sol
        </span>
        <h2>What happened</h2>
      </header>

      <Gauges gauges={state.gauges} scienceGoal={b.scienceGoal} />

      <div className="result-layout">
        <section className="panel">
          <div className="panel-head">
            <span>Sol {b.sol} log</span>
          </div>
          <ul className="log panel-body">
            {b.today.map((l, i) => (
              <li key={i} className={l.tone}>
                <span className="dot" aria-hidden="true" />
                <span>{l.text}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel lesson">
          <div className="panel-head">
            <span>Astronaut lesson</span>
          </div>
          <div className="panel-body">
            <p className="lesson-text">{lesson}</p>
            <p className="real">
              <span className="label">Real mission</span>
              {card.real}
            </p>
          </div>
        </section>
      </div>

      <Dialogue
        text={lesson}
        mood={done && b.ending!.type === "early" ? "alert" : "happy"}
        form="rover"
        readAloud={state.settings.readAloud}
        onNext={() => dispatch({ type: "NEXT_SOL" })}
        nextLabel={done ? "Mission report" : `Start Sol ${b.sol + 1}`}
      />
    </main>
  );
}
