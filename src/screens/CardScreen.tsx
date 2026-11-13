import { FLAG_TEXT } from "../content/landingSites";
import { boardOutcome, currentCard, optionEffects, visibleOptions } from "../engine/base";
import { EffectChips } from "../ui/Chips";
import { Dialogue } from "../ui/Dialogue";
import { Gauges } from "../ui/Gauges";
import { Icon } from "../ui/Icon";
import { useSpeak, type ScreenProps } from "../ui/screen";

export function CardScreen({ state, dispatch }: ScreenProps) {
  const b = state.base!;
  const card = currentCard(state)!;
  const options = visibleOptions(state, card);
  const batteryAfterBoard = boardOutcome(state).battery;
  useSpeak(`${card.title}. ${card.text}`, state.settings.readAloud);

  return (
    <main className="screen base-screen">
      <header className="screen-head">
        <span className="label">
          Sol {b.sol} of {b.totalSols} · Decision
        </span>
        <h2>{card.title}</h2>
      </header>

      <Gauges gauges={{ ...state.gauges, power: batteryAfterBoard }} scienceGoal={b.scienceGoal} />

      <section className="panel card-panel">
        <div className="panel-head">
          <span>Incoming</span>
          <span className="mono">Battery after power board: {batteryAfterBoard}</span>
        </div>
        <div className="panel-body">
          <p className="card-text">{card.text}</p>
          <div className="options">
            {options.map((o, i) => {
              const fx = optionEffects(state, o);
              const short = (fx.power ?? 0) < 0 && -(fx.power ?? 0) > batteryAfterBoard;
              const discounted = JSON.stringify(fx) !== JSON.stringify(o.effects);
              return (
                <button key={o.label + i} type="button" className="option" onClick={() => dispatch({ type: "CHOOSE_OPTION", index: i })}>
                  <span className="option-key">{String.fromCharCode(65 + i)}</span>
                  <span className="option-body">
                    <strong>{o.label}</strong>
                    <EffectChips effects={fx} flags={(o.sets ?? []).filter((f) => f !== "SHELTERED" && FLAG_TEXT[f])} />
                    {o.later && <span className="option-note">Later: {o.later.text}</span>}
                    {o.note && <span className="option-note">{o.note}</span>}
                    {discounted && <span className="option-note perk">Your job makes this cheaper or better.</span>}
                    {short && (
                      <span className="option-note warn">
                        Not enough battery: the missing power will cost supplies.
                      </span>
                    )}
                  </span>
                  <Icon name="next" size={20} />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <Dialogue
        text="Every choice has a cost. What will you do?"
        mood="calm"
        form="rover"
        readAloud={state.settings.readAloud}
      />
    </main>
  );
}
