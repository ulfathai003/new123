import Link from "next/link";
import { SERVICES, HOME_FAQS, AGENTS_SHOWCASE } from "@/lib/data";
import HomeFX from "@/components/fx/HomeFX";
import MagneticButton from "@/components/MagneticButton";
import Faq from "@/components/Faq";

export const metadata = {
  title: "SoftiIntel — AI-Native Creative Technology Agency | AI Agents, CRM, Web & Automation",
  description:
    "SoftiIntel builds AI agents, custom CRMs, immersive websites, mobile apps and automation for ambitious businesses. A horizontal journey through what intelligence can do for you.",
  alternates: { canonical: "/" },
};

const STATS = [
  [120, "+", "systems shipped"],
  [38000, "+", "hours automated / yr"],
  [11, "", "days avg. automation payback"],
  [97, "%", "client retention"],
];

export default function Home() {
  return (
    <main>
      {/* ════ THE HORIZONTAL JOURNEY ════ */}
      <section id="journey" aria-label="SoftiIntel story">
        <div id="journey-track" className="htrack">

          {/* 00 · ARRIVAL */}
          <div className="hpanel px-6 md:px-[8vw]">
            <div className="max-w-5xl">
              <p className="mono-label mb-6 h-reveal" data-px="0.55">
                softiintel — ai-native creative technology agency
              </p>
              <h1 className="display text-[12vw] md:text-[7vw]" data-split data-px="0.3">
                We design intelligence you can feel.
              </h1>
              <p className="mt-8 max-w-xl text-mist text-base md:text-lg font-light leading-relaxed h-reveal" data-px="0.45">
                AI agents, custom CRMs, immersive websites and automation —
                engineered by a studio that treats every build like a story
                worth telling sideways.
              </p>
              <div className="mt-10 flex items-center gap-6 h-reveal" data-px="0.6">
                <MagneticButton href="/contact" className="cta">
                  <span className="dot" />
                  Begin the build
                </MagneticButton>
                <p className="mono-label hidden md:block">scroll → the story moves sideways</p>
              </div>
            </div>
            <div className="absolute bottom-8 left-6 md:left-[8vw] mono-label !text-snow/40 h-reveal" data-px="0.8">
              00 / arrival
            </div>
          </div>

          {/* 01 · IDENTITY */}
          <div className="hpanel px-6 md:px-[8vw]">
            <div className="max-w-4xl">
              <p className="mono-label !text-signal mb-6 h-reveal" data-px="0.55">01 / identity</p>
              <h2 className="display text-4xl md:text-6xl mb-10 h-reveal" data-px="0.3">
                Where creativity
                <br />
                <span className="text-mist">computes.</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6" data-px="0.12">
                {[
                  ["Story-first", "Every interface is a narrative. We design journeys, not pages — which is why you're reading this sideways."],
                  ["AI-native", "Intelligence isn't a feature we bolt on. Agents, automation and models are load-bearing parts of everything we ship."],
                  ["Built, not decked", "No 200-page strategy theatre. Working software every week, measured in hours saved and revenue moved."],
                ].map(([t, b]) => (
                  <div key={t} className="h-reveal border border-snow/10 rounded-[10px] p-6 bg-void/60 backdrop-blur-sm">
                    <h3 className="display text-lg mb-3 text-snow">{t}</h3>
                    <p className="text-mist text-sm font-light leading-relaxed">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 02 · CAPABILITIES */}
          <div className="hpanel px-6 md:px-[6vw]">
            <div className="w-full max-w-6xl">
              <p className="mono-label !text-signal mb-6 h-reveal" data-px="0.55">02 / capabilities</p>
              <h2 className="display text-4xl md:text-6xl mb-12 h-reveal" data-px="0.3">
                Eight ways in.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" data-px="0.12">
                {SERVICES.map((s, i) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="svc-card h-reveal group border border-snow/10 rounded-[10px] p-5 bg-void/60 backdrop-blur-sm transition-colors hover:border-snow/30"
                    style={{ "--accent": s.accent }}
                  >
                    <span className="mono-label !text-snow/40">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="display text-lg md:text-xl mt-6 mb-2 text-snow group-hover:text-[var(--accent)] transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-mist text-xs font-light leading-relaxed">{s.short}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 03 · THE AGENTS */}
          <div className="hpanel px-6 md:px-[8vw]">
            <div className="max-w-5xl">
              <p className="mono-label !text-signal mb-6 h-reveal" data-px="0.55">03 / the agents</p>
              <h2 className="display text-4xl md:text-6xl mb-4 h-reveal" data-px="0.3">
                Meet the workforce
                <br />
                <span className="text-mist">that never clocks out.</span>
              </h2>
              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4" data-px="0.12">
                {AGENTS_SHOWCASE.map((a) => (
                  <div key={a.name} className="h-reveal border border-snow/10 rounded-[10px] p-5 bg-void/60 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-signal mb-4 agent-pulse" />
                    <h3 className="display text-lg text-snow">{a.name}</h3>
                    <p className="mono-label !text-snow/50 mt-1 mb-3">{a.role}</p>
                    <p className="text-mist text-xs font-light leading-relaxed">{a.desc}</p>
                  </div>
                ))}
              </div>
              <Link href="/ai-agents" className="draw-link mono-label !text-signal inline-block mt-10 h-reveal" data-px="0.5">
                inspect the agent fleet →
              </Link>
            </div>
          </div>

          {/* 04 · PROOF */}
          <div className="hpanel px-6 md:px-[8vw]">
            <div className="max-w-5xl w-full">
              <p className="mono-label !text-signal mb-6 h-reveal" data-px="0.55">04 / proof</p>
              <h2 className="display text-4xl md:text-6xl mb-14 h-reveal" data-px="0.3">
                Numbers, not adjectives.
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8" data-px="0.12">
                {STATS.map(([n, suffix, label]) => (
                  <div key={label} className="h-reveal">
                    <p className="display text-5xl md:text-6xl text-snow tabular-nums">
                      <span data-hcount={n} data-suffix={suffix}>0</span>
                    </p>
                    <p className="mono-label mt-3">{label}</p>
                  </div>
                ))}
              </div>
              <Link href="/work" className="draw-link mono-label !text-signal inline-block mt-14 h-reveal" data-px="0.5">
                see the case studies →
              </Link>
            </div>
          </div>

          {/* 05 · INVITATION */}
          <div className="hpanel px-6 md:px-[8vw]">
            <div className="max-w-4xl text-center mx-auto" data-px="0.25">
              <p className="mono-label mb-8 h-reveal">05 / your move</p>
              <h2 className="display text-[10vw] md:text-[5.5vw] h-reveal">
                The future belongs to businesses
                <span className="text-mist"> that automate the boring parts.</span>
              </h2>
              <div className="mt-12 flex justify-center h-reveal">
                <MagneticButton href="/contact" className="cta" burstColor="#7c6cff">
                  <span className="dot" />
                  Start your transformation
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* journey progress rail (desktop) */}
      <div
        id="journey-rail"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 hidden md:block w-44 h-px bg-snow/15"
        aria-hidden="true"
      >
        <div id="journey-rail-fill" className="h-full w-full bg-signal origin-left scale-x-0" />
      </div>

      {/* ════ VERTICAL CODA: FAQ for SEO depth ════ */}
      <Faq items={HOME_FAQS} title="SoftiIntel, explained." />

      <HomeFX />
    </main>
  );
}
