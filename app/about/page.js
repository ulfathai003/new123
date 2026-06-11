import Link from "next/link";
import Faq from "@/components/Faq";
import MagneticButton from "@/components/MagneticButton";
import AboutFX from "@/components/fx/AboutFX";

export const metadata = {
  title: "About SoftiIntel — The Story of an AI-Native Agency",
  description:
    "SoftiIntel is a creative technology agency built AI-first: humans for judgement and taste, agents for tireless execution. Our story, mission and the team behind the intelligence.",
  alternates: { canonical: "/about" },
};

const TIMELINE = [
  ["Origin", "Started as a two-person web studio with an allergy to templates, building handcrafted sites for businesses the big agencies ignored."],
  ["The automation turn", "A client asked us to 'make the follow-ups stop falling through the cracks.' The bot we built recovered more revenue than the website did. We noticed."],
  ["AI-native rebuild", "We rebuilt the studio around a new premise: every system we ship should think. CRMs that nudge, sites that adapt, agents that act."],
  ["The fleet era", "Today our human senate designs and our agent fleet executes — research, QA, reporting, follow-ups — so clients get agency quality at SME speed."],
];

const FAQS = [
  ["What kind of agency is SoftiIntel?", "An AI-native creative technology agency: equal parts design studio and engineering shop, with AI agents woven through everything we deliver and how we ourselves operate."],
  ["How big is the SoftiIntel team?", "Deliberately small on humans, deliberately large on agents. A senior core of designers and engineers, multiplied by an internal fleet of AI agents handling research, QA and operations."],
  ["What is SoftiIntel's mission?", "To give ambitious small and mid-sized businesses the operating leverage of enterprise — intelligence working for them around the clock."],
  ["Does SoftiIntel work with startups and SMEs?", "Yes — they're our centre of gravity. We scope tight, ship weekly, and price for businesses that count their money."],
];

export default function About() {
  return (
    <main className="pt-32">
      {/* hero */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-5xl mx-auto" data-depth="0.3">
          <p className="mono-label mb-6 reveal">about — the story so far</p>
          <h1 className="display text-[11vw] md:text-[6.5vw]" data-split>
            Half studio. Half machine. Fully deliberate.
          </h1>
          <p className="mt-8 max-w-2xl text-mist text-lg font-light leading-relaxed reveal">
            SoftiIntel exists because most businesses don&rsquo;t have a software
            problem — they have a <em className="not-italic text-snow">leverage</em> problem.
            We fix it with taste, engineering, and a workforce that never sleeps.
          </p>
        </div>
      </section>

      {/* mission / vision */}
      <section className="px-6 md:px-10 py-24 border-t border-snow/10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10" data-speed="0.12">
          <div className="reveal border border-snow/10 rounded-[10px] p-8 bg-void/60 backdrop-blur-sm">
            <p className="mono-label !text-signal mb-4">mission</p>
            <p className="display text-2xl md:text-3xl leading-[1.2]">
              Give every ambitious SME the operating leverage of an enterprise.
            </p>
          </div>
          <div className="reveal border border-snow/10 rounded-[10px] p-8 bg-void/60 backdrop-blur-sm">
            <p className="mono-label !text-signal2 mb-4">vision</p>
            <p className="display text-2xl md:text-3xl leading-[1.2]">
              A web where software adapts to people — never the reverse.
            </p>
          </div>
        </div>
      </section>

      {/* interactive timeline */}
      <section className="px-6 md:px-10 py-24">
        <div className="max-w-4xl mx-auto">
          <p className="mono-label mb-4 reveal">the journey</p>
          <h2 className="display text-4xl md:text-6xl mb-20" data-split>
            How we got here.
          </h2>
          <ol id="tl-list" className="relative border-l border-snow/10" data-speed="0.07">
            {TIMELINE.map(([title, body], i) => (
              <li key={title} className="tl-step relative pl-10 md:pl-16 pb-20 last:pb-0">
                <span className="tl-dot absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full bg-rock" aria-hidden="true" />
                <p className="mono-label mb-3">chapter {i + 1}</p>
                <h3 className="display text-2xl md:text-4xl mb-4">{title}</h3>
                <p className="text-mist font-light leading-relaxed max-w-xl">{body}</p>
              </li>
            ))}
            <span id="tl-progress" className="absolute left-[-1px] top-0 w-px h-full bg-signal origin-top scale-y-0" aria-hidden="true" />
          </ol>
        </div>
      </section>

      {/* team constellation */}
      <section className="px-6 md:px-10 py-24 border-t border-snow/10">
        <div className="max-w-5xl mx-auto">
          <p className="mono-label mb-4 reveal">the constellation</p>
          <h2 className="display text-4xl md:text-6xl mb-6" data-split>
            Humans for judgement.
            <br />
            <span className="text-mist">Agents for momentum.</span>
          </h2>
          <p className="max-w-2xl text-mist font-light leading-relaxed mb-14 reveal">
            We organise as pairs: every human discipline runs with an agent
            counterpart that handles its repetitive half. It&rsquo;s not the org
            chart of the future — it&rsquo;s ours, today.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-speed="0.14">
            {[
              ["Design", "renders, audits, asset prep"],
              ["Engineering", "tests, reviews, scaffolds"],
              ["Strategy", "research, briefs, benchmarks"],
              ["Delivery", "status, QA sweeps, reports"],
            ].map(([human, agent]) => (
              <div key={human} className="reveal border border-snow/10 rounded-[10px] p-6 bg-void/60 backdrop-blur-sm text-center">
                <p className="display text-xl mb-1">{human}</p>
                <p className="mono-label !text-snow/40 mb-4">human lead</p>
                <div className="w-px h-6 bg-snow/15 mx-auto mb-4" />
                <p className="mono-label !text-signal">+ agent</p>
                <p className="text-mist text-xs font-light mt-2">{agent}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Faq items={FAQS} title="About us, answered." />

      <section className="px-6 md:px-10 pb-32 text-center">
        <MagneticButton href="/work" className="cta reveal">
          <span className="dot" />
          See what this produces
        </MagneticButton>
      </section>

      <AboutFX />
    </main>
  );
}
