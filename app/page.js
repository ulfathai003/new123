import Link from "next/link";
import { SERVICES, HOME_FAQS } from "../lib/data";
import HomeFX from "../components/fx/HomeFX";
import MagneticButton from "../components/MagneticButton";
import Faq from "../components/Faq";

export const metadata = {
  title: "SoftiIntel — AI-Native Creative Technology Agency | AI Agents, CRM, Web & Automation",
  description:
    "SoftiIntel is the all-in-one intelligence engine for ambitious businesses: AI agents, custom CRMs, immersive websites, mobile apps and WhatsApp automation — one team for your whole operation.",
  alternates: { canonical: "/" },
};

const TOOLBOX_CHIPS = [
  "AI Agents", "Custom CRM", "WebGL Stories", "WhatsApp Flows",
  "Mobile Apps", "Document AI", "Ops Platforms", "SEO Engines",
  "Lead Scoring", "Auto Follow-ups", "Owner Dashboards", "Booking Systems",
];

const LEVERAGE = [
  ["Customer replies", 38, "#5b46e8"],
  ["Follow-ups", 22, "#0bb6d4"],
  ["Reporting", 16, "#e8a23d"],
  ["Data entry", 14, "#34b87c"],
  ["Scheduling", 10, "#d4569e"],
];

/* the agile delivery rhythm — from the day you come aboard to handover */
const PIPELINE = [
  ["day 0 · kickoff", "You come aboard", "A discovery call, an NDA if you want one, and access to the one workflow that's costing you the most. No proposal theatre — we start by listening."],
  ["week 1 · discovery sprint", "We map the terrain", "A focused sprint to chart how your business actually runs and pinpoint the highest-leverage build. You get a clear, costed plan — fixed, not hourly."],
  ["week 2 · design & roadmap", "The route is agreed", "Sitemap, design system and a sprint plan you sign off on. You see the whole climb before a line of production code is written."],
  ["sprints · build", "Working software every Friday", "Short, roped pitches. Each week ships something you can click, test and steer — a live demo, never a six-month silence followed by a 'big reveal.'"],
  ["hardening · qa", "We make it bulletproof", "Performance budgets, accessibility, security headers and cross-device QA — the unglamorous work that separates a demo from a product."],
  ["launch · delivery", "Go live, fully handed over", "Deployed, analytics wired, your team trained on everything we built. Launch is a checkpoint, not a goodbye."],
  ["after · iterate", "The next peak", "Sites and systems compound or decay. We stay on retainer for the businesses we believe in — measuring, refining, finding the next line up."],
];

export default function Home() {
  return (
    <main>
      {/* ════ INTRO — the engine headline over the peaks ════ */}
      <section id="intro" data-chapter="intro" className="relative min-h-svh flex items-center px-6 md:px-10">
        <div className="max-w-6xl mx-auto w-full" data-depth="0.25">
          <h1 className="display text-[14vw] md:text-[7.2rem] leading-[0.98]" data-split>
            All-in-one intelligence engine
          </h1>
          <span className="sr-only">— SoftiIntel, the AI-native creative technology agency</span>
          <p className="mt-8 max-w-md text-mist text-base md:text-lg font-light leading-relaxed reveal">
            A fast and tireless team to automate{" "}
            <em className="not-italic text-snow border-b-2 border-signal">your business</em>.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4 md:gap-5 reveal">
            <pre className="mono-label !text-snow bg-void-soft/80 border border-line rounded-full px-5 py-3.5">
              <code>{`> softiintel deploy --agents`}</code>
            </pre>
            <MagneticButton href="/contact" className="cta">
              <span className="dot" />
              Start a project
            </MagneticButton>
          </div>
        </div>
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal">
          <p className="mono-label">scroll — the camera flies</p>
          <p className="mono-label !text-snow/40 hidden md:block">hold + drag — the world turns</p>
          <div className="w-px h-9 bg-gradient-to-b from-snow/50 to-transparent" />
        </div>
      </section>

      {/* ════ TOOLBOX — everything, one team ════ */}
      <section id="toolbox" data-chapter="toolbox" className="relative px-6 md:px-10 py-32 md:py-48 text-center overflow-clip">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="display text-4xl md:text-6xl" data-split>
            The complete operator&rsquo;s toolbox
          </h2>
          <p className="mt-6 text-mist font-light leading-relaxed max-w-xl mx-auto reveal">
            Break free from manual operations. Automate anything in your
            business with a single team and a single point of contact.
          </p>
        </div>
        <div className="toolbox-cloud mt-14 max-w-4xl mx-auto flex flex-wrap justify-center gap-x-7 gap-y-4" aria-hidden="true">
          {TOOLBOX_CHIPS.map((chip) => (
            <span key={chip} className="toolbox-chip mono-label !text-snow/60">
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* ════ THE STORY — eight acts, pure type over the scene ════ */}
      <section id="features" aria-label="Services">
        {SERVICES.map((s, i) => (
          <section
            key={s.slug}
            id={`ch-${s.slug}`}
            data-chapter={`${String(i + 1).padStart(2, "0")} / ${s.title.toLowerCase()}`}
            className="relative min-h-[88svh] flex items-center px-6 md:px-10 py-20 overflow-clip"
            style={{ "--accent": s.accent }}
          >
            {/* ghosted act number, drifting on its own plane */}
            <span
              className="act-index absolute right-[2vw] top-1/2 -translate-y-1/2 display select-none pointer-events-none"
              data-speed={i % 2 ? "-0.2" : "0.2"}
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className={`relative max-w-6xl mx-auto w-full ${i % 2 ? "md:text-right" : ""}`}>
              <p className="mono-label mb-5 reveal" style={{ color: s.accent }}>
                act {String(i + 1).padStart(2, "0")} — {s.slug.replace(/-/g, " ")}
              </p>
              <h2 className={`display text-[10vw] md:text-[5.2vw] max-w-3xl ${i % 2 ? "md:ml-auto" : ""}`} data-split data-depth="0.12">
                {s.hero}
              </h2>
              <p className={`mt-6 text-mist font-light leading-relaxed max-w-md reveal ${i % 2 ? "md:ml-auto" : ""}`}>
                {s.short}
              </p>
              <ul className={`mt-8 flex flex-col gap-3 reveal ${i % 2 ? "md:items-end" : ""}`}>
                {s.deliverables.slice(0, 3).map((d) => (
                  <li key={d}>
                    <Link href={`/services/${s.slug}`} className="feature-link group text-sm font-light text-snow/85 hover:text-snow">
                      <span className="feature-arrow" style={{ color: s.accent }} aria-hidden="true">→</span>
                      {d}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </section>

      {/* ════ LEVERAGE — where the hours go back, drawn in lines ════ */}
      <section id="leverage" data-chapter="the dividend" className="relative px-6 md:px-10 py-32 md:py-48">
        <div className="max-w-4xl mx-auto">
          <h2 className="display text-4xl md:text-6xl" data-split>
            A lightweight, modular engagement
          </h2>
          <p className="mt-6 text-mist font-light leading-relaxed max-w-md reveal">
            Start with the workflow that bleeds the most hours — typically{" "}
            <span className="text-snow tabular-nums" data-count="160" data-suffix="+">0</span>{" "}
            hours reclaimed per month. Add modules only when the previous one
            has paid for itself.
          </p>
          <div className="mt-14 flex flex-col gap-6">
            {LEVERAGE.map(([label, size, color]) => (
              <div key={label} className="reveal">
                <div className="flex items-baseline justify-between mb-2.5">
                  <p className="text-sm font-light text-snow/85">{label}</p>
                  <p className="mono-label !text-snow/50">{size}%</p>
                </div>
                <div className="h-px bg-line relative">
                  <div className="lev-bar absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full" data-size={size} style={{ background: color, width: 0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ TIMELINE — the agile delivery journey ════ */}
      <section id="timeline" data-chapter="the journey" className="relative px-6 md:px-10 py-32 md:py-48">
        <div className="max-w-4xl mx-auto">
          <p className="mono-label mb-4 reveal">how a project flows</p>
          <h2 className="display text-4xl md:text-6xl" data-split>
            From hello to handover.
          </h2>
          <p className="mt-6 text-mist font-light leading-relaxed max-w-md reveal">
            An agile rhythm with no surprises: you see working software every
            week and steer it as it grows. Scroll the climb.
          </p>

          <ol id="pm-list" className="relative border-l border-line mt-16 md:mt-20">
            {PIPELINE.map(([tag, title, body], i) => (
              <li key={title} className="pm-step relative pl-9 md:pl-16 pb-14 md:pb-16 last:pb-0">
                <span
                  className="pm-dot absolute -left-[6px] top-1.5 w-[11px] h-[11px] rounded-full bg-rock"
                  aria-hidden="true"
                />
                <div className="reveal">
                  <p className="mono-label mb-2.5" style={{ color: i === 0 || i === PIPELINE.length - 1 ? undefined : "var(--signal)" }}>
                    {tag}
                  </p>
                  <h3 className="display text-2xl md:text-4xl mb-3">{title}</h3>
                  <p className="text-mist font-light leading-relaxed max-w-xl">{body}</p>
                </div>
              </li>
            ))}
            {/* the signal line climbs the timeline as you scroll */}
            <span
              id="pm-progress"
              className="absolute left-[-1px] top-0 w-px h-full bg-signal origin-top scale-y-0"
              aria-hidden="true"
            />
          </ol>
        </div>
      </section>

      {/* ════ GET STARTED — the launch lines ════ */}
      <section id="get-started" data-chapter="your move" className="relative px-6 md:px-10 py-32">
        <div className="max-w-4xl mx-auto">
          <h2 className="display text-5xl md:text-7xl text-center" data-split>
            Start automating
          </h2>
          <p className="mt-5 text-mist font-light text-center reveal">
            Pick the door closest to your bottleneck.
          </p>
          <ul className="reveal mt-14">
            {[...SERVICES.map((s) => [s.title, `/services/${s.slug}`, s.accent]),
              ["About us", "/about", "#5b46e8"],
              ["Our work", "/work", "#0bb6d4"],
              ["The fleet", "/ai-agents", "#d4569e"],
              ["Contact", "/contact", "#34b87c"],
            ].map(([label, href, color]) => (
              <li key={href + label}>
                <Link
                  href={href}
                  className="start-row group flex items-center gap-4 border-b border-line py-4 text-base md:text-lg font-light text-snow/80 hover:text-snow transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 transition-transform group-hover:scale-150" style={{ background: color }} />
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">{label}</span>
                  <span className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ color }} aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq items={HOME_FAQS} title="SoftiIntel, explained." />

      {/* chapter beacon — one quiet line of context, not a card */}
      <p id="chapter-beacon" className="fixed bottom-6 left-6 z-30 mono-label !text-snow/45 hidden md:block" aria-hidden="true" />

      <HomeFX />
    </main>
  );
}
