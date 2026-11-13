import type { ScreenProps } from "../ui/screen";

// Optional reading for curious kids, parents and classrooms.
// Every fact must be checked against a NASA or ESA source before release.
const PAGES = [
  {
    icon: "🏊",
    title: "Training underwater",
    text: "Astronauts practise spacewalks in a giant swimming pool. Floating in water feels a bit like floating in space.",
  },
  {
    icon: "🏋️",
    title: "Staying strong",
    text: "In space, muscles and bones get weaker. Astronauts on the Space Station exercise about two hours every day.",
  },
  {
    icon: "🧑‍🔬",
    title: "Many paths to space",
    text: "Astronauts have been pilots, doctors, engineers, scientists and teachers. Many say it started with being curious as a kid.",
  },
];

export function Academy({ dispatch }: ScreenProps) {
  return (
    <main className="screen academy-screen">
      <h2 className="screen-title">🎓 Astronaut Academy</h2>
      <p className="academy-sub">How real astronauts get ready for space.</p>
      <div className="academy-grid">
        {PAGES.map((p) => (
          <article key={p.title} className="academy-card">
            <span className="academy-icon" aria-hidden="true">{p.icon}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </article>
        ))}
      </div>
      <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: "BACK_TO_TITLE" })}>
        ◀ Back to start
      </button>
    </main>
  );
}
