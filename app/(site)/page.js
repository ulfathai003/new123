import Link from "next/link";
import { SERVICES, HOME_FAQS, SITE } from "../../lib/data";
import HomeFX from "../../components/fx/HomeFX";
import AnimeDemo from "../../components/AnimeDemo";
import MagneticButton from "../../components/MagneticButton";
import Faq from "../../components/Faq";

export const metadata = {
  title: "SoftiIntel — AI-Native Creative Technology Agency | AI Agents, CRM, Web & Automation",
  description:
    "SoftiIntel is the all-in-one intelligence engine for ambitious businesses: AI agents, custom CRMs, immersive websites, mobile apps and WhatsApp automation — one team, one API for your whole operation.",
  alternates: { canonical: "/" },
};

/* chapter-synced code cards (the floating sub-nav, anime.js style) */
const OPS_SNIPPETS = {
  "ai-agents": `agent.watch(inbox)\n  .qualify(lead)\n  .book(meeting);`,
  "crm-development": `crm.pipeline(\n  'enquiry → quote → close'\n).automate(followUps);`,
  "web-development": `site.render(<Story />);\nsite.audit({\n  lighthouse: 98,\n});`,
  "mobile-apps": `app.notify(customer,\n  'Your slot is ready'\n).rebook(noShows);`,
  "automation": `on(order.created)\n  .send(whatsapp.update)\n  .recover(abandoned);`,
  "ai-integrations": `docs.extract(invoice)\n  .validate()\n  .post(ledger);`,
  "custom-software": `replace(spreadsheets * 7)\n  .with(onePlatform);`,
  "digital-transformation": `audit(business)\n  .roadmap()\n  .ship({ cadence: 'weekly' });`,
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

export default function Home() {
  return (
    <main>
      {/* ════ INTRO — the engine headline over the peaks ════ */}
      <section id="intro" data-chapter="intro" className="relative min-h-screen flex items-center px-6 md:px-10">
        <div className="max-w-6xl mx-auto w-full" data-depth="0.25">
          <h1 className="display text-[15vw] md:text-[7.2rem] leading-[0.98]" data-split>
            All-in-one intelligence engine
          </h1>
          <span className="sr-only">— SoftiIntel, the AI-native creative technology agency</span>
          <p className="mt-8 max-w-md text-mist text-lg font-light leading-relaxed reveal">
            A fast and tireless team to automate{" "}
            <em className="not-italic text-snow border-b-2 border-signal">your business</em>.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5 reveal">
            <pre className="mono-label !text-snow bg-void-soft border border-line rounded-full px-5 py-3.5 shadow-sm">
              <code>{`> softiintel deploy --agents`}</code>
            </pre>
            <MagneticButton href="/contact" className="cta">
              <span className="dot" />
              Start a project
            </MagneticButton>
          </div>
        </div>
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal">
          <p className="mono-label">scroll — the engine warms up</p>
          <div className="w-px h-9 bg-gradient-to-b from-snow/50 to-transparent" />
        </div>
      </section>

      {/* ════ TOOLBOX — everything, one team ════ */}
      <section id="toolbox" data-chapter="toolbox" className="relative px-6 md:px-10 py-36 md:py-48 text-center overflow-clip">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="display text-4xl md:text-6xl" data-split>
            The complete operator&rsquo;s toolbox
          </h2>
          <p className="mt-6 text-mist font-light leading-relaxed max-w-xl mx-auto reveal">
            Break free from manual operations. Automate anything in your
            business with a single team and a single point of contact.
          </p>
        </div>
        <div className="toolbox-cloud mt-16 max-w-4xl mx-auto flex flex-wrap justify-center gap-3" aria-hidden="true">
          {TOOLBOX_CHIPS.map((chip) => (
            <span key={chip} className="toolbox-chip mono-label !text-snow/70 border border-line bg-void-soft/80 rounded-full px-4 py-2">
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* ════ FEATURE CHAPTERS — one per discipline, live demos ════ */}
      <section id="features" aria-label="Services">
        {SERVICES.map((s, i) => (
          <section
            key={s.slug}
            id={`ch-${s.slug}`}
            data-chapter={s.slug}
            className="feature-sec relative px-6 md:px-10 py-24 md:py-36"
            style={{ "--accent": s.accent }}
          >
            <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center ${i % 2 ? "md:[direction:rtl]" : ""}`}>
              <div className="[direction:ltr]">
                <p className="mono-label mb-4 reveal">
                  <span style={{ color: s.accent }}>{String(i + 1).padStart(2, "0")}</span> / {s.slug.replace(/-/g, " ")}
                </p>
                <h2 className="display text-3xl md:text-5xl mb-5" data-split>
                  {s.hero}
                </h2>
                <p className="text-mist font-light leading-relaxed mb-8 max-w-md reveal">{s.short}</p>
                <ul className="reveal flex flex-col gap-3.5">
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
              <div className="[direction:ltr] reveal" data-speed="0.08">
                <AnimeDemo type={s.slug} accent={s.accent} />
              </div>
            </div>
          </section>
        ))}
      </section>

      {/* ════ LEVERAGE — where the hours go back (modules chart) ════ */}
      <section id="leverage" data-chapter="leverage" className="relative px-6 md:px-10 py-36 md:py-48">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="display text-4xl md:text-6xl" data-split>
              A lightweight, modular engagement
            </h2>
            <p className="mt-6 text-mist font-light leading-relaxed max-w-md reveal">
              Start with the one workflow that bleeds the most hours.
              Add modules only when the previous one has paid for itself.
            </p>
          </div>
          <div className="reveal border border-line rounded-[10px] bg-void-soft p-7 shadow-sm">
            <div className="flex items-baseline justify-between mb-5">
              <h3 className="display text-lg">Hours reclaimed</h3>
              <p className="mono-label !text-snow"><span data-count="160" data-suffix="+">0</span> hrs / mo</p>
            </div>
            <div className="leverage-chart flex h-3 rounded-full overflow-clip mb-6" aria-hidden="true">
              {LEVERAGE.map(([label, size, color]) => (
                <div key={label} className="lev-bar h-full" data-size={size} style={{ background: color, width: 0 }} />
              ))}
            </div>
            <ul className="flex flex-col gap-2.5">
              {LEVERAGE.map(([label, size, color]) => (
                <li key={label} className="flex items-center gap-3 text-sm font-light text-snow/85">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                  {label}
                  <span className="ml-auto mono-label !text-snow/50">{size}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ════ GET STARTED — the launch grid ════ */}
      <section id="get-started" data-chapter="get-started" className="relative px-6 md:px-10 py-36 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="display text-5xl md:text-7xl" data-split>
            Start automating
          </h2>
          <p className="mt-5 text-mist font-light reveal">
            Pick the door closest to your bottleneck.
          </p>
          <ul className="reveal mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            {[...SERVICES.map((s) => [s.title, `/services/${s.slug}`, s.accent]),
              ["About us", "/about", "#5b46e8"],
              ["Our work", "/work", "#0bb6d4"],
              ["The fleet", "/ai-agents", "#d4569e"],
              ["Contact", "/contact", "#34b87c"],
            ].map(([label, href, color]) => (
              <li key={href + label}>
                <Link href={href} className="start-link group flex items-center gap-3 border border-line rounded-[10px] bg-void-soft/80 px-4 py-3.5 text-sm font-light text-snow/85 hover:text-snow hover:border-snow/35 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                  {label}
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }} aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq items={HOME_FAQS} title="SoftiIntel, explained." />

      {/* ════ SUB-NAV — floating ops console synced to the chapter ════ */}
      <aside id="subnav" className="fixed right-6 bottom-6 z-30 hidden lg:flex items-end gap-3" aria-hidden="true">
        <div className="flex flex-col gap-0 w-56">
          {Object.entries(OPS_SNIPPETS).map(([slug, code]) => (
            <pre
              key={slug}
              data-card={slug}
              className="ops-card hidden border border-line rounded-[10px] bg-void-soft/95 backdrop-blur-sm p-4 text-[11px] leading-relaxed font-mono text-snow/80 shadow-lg"
              style={{ "--accent": SERVICES.find((s) => s.slug === slug)?.accent }}
            >
              <code>{code}</code>
            </pre>
          ))}
        </div>
        <div className="scroll-rail w-px h-28 bg-line relative">
          <div id="scroll-rail-cursor" className="absolute left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-signal" style={{ top: 0 }} />
        </div>
      </aside>

      <HomeFX snippets={Object.keys(OPS_SNIPPETS)} />
    </main>
  );
}
