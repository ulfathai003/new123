import Link from "next/link";
import { AGENTS_SHOWCASE, SERVICES } from "@/lib/data";
import Faq from "@/components/Faq";
import MagneticButton from "@/components/MagneticButton";
import AgentsFX from "@/components/fx/AgentsFX";

export const metadata = {
  title: "AI Agents — Autonomous Digital Workers for Your Business",
  description:
    "Meet SoftiIntel's AI agent fleet: lead qualification, support triage, back-office analysis and follow-up automation. See how autonomous agents plug into your CRM, WhatsApp and email.",
  alternates: { canonical: "/ai-agents" },
};

const agentService = SERVICES.find((s) => s.slug === "ai-agents");

export default function AIAgents() {
  return (
    <main className="pt-32">
      {/* hero */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-5xl mx-auto" data-depth="0.3">
          <p className="mono-label mb-6 reveal">the fleet — agents in service</p>
          <h1 className="display text-[11vw] md:text-[6.5vw]" data-split>
            Software with initiative.
          </h1>
          <p className="mt-8 max-w-2xl text-mist text-lg font-light leading-relaxed reveal">
            These aren&rsquo;t chatbots waiting for input. They&rsquo;re digital
            workers with goals, tools and guardrails — already running inside
            our clients&rsquo; businesses. Meet four of them.
          </p>
        </div>
      </section>

      {/* live workflow diagram */}
      <section className="px-6 md:px-10 py-24 border-t border-snow/10" aria-label="How an agent works">
        <div className="max-w-5xl mx-auto" data-speed="0.1">
          <p className="mono-label mb-4 reveal">anatomy of an agent</p>
          <h2 className="display text-4xl md:text-6xl mb-16" data-split>
            Watch the work move.
          </h2>
          <div className="reveal border border-snow/10 rounded-[10px] bg-void/60 backdrop-blur-sm p-6 md:p-10 overflow-x-auto">
            <svg id="agent-flow" viewBox="0 0 920 260" className="w-full min-w-[640px]" role="img" aria-label="Diagram: enquiry flows into the agent, which acts on CRM, WhatsApp and calendar">
              {/* lanes */}
              <path id="flow-in" d="M70,130 C180,130 200,130 330,130" fill="none" stroke="rgba(236,238,242,0.15)" strokeWidth="1.5" />
              <path id="flow-crm" d="M510,130 C620,130 640,60 850,60" fill="none" stroke="rgba(236,238,242,0.15)" strokeWidth="1.5" />
              <path id="flow-wa" d="M510,130 C620,130 640,130 850,130" fill="none" stroke="rgba(236,238,242,0.15)" strokeWidth="1.5" />
              <path id="flow-cal" d="M510,130 C620,130 640,200 850,200" fill="none" stroke="rgba(236,238,242,0.15)" strokeWidth="1.5" />
              {/* nodes */}
              <g fontFamily="var(--font-plex-mono)" fontSize="11" letterSpacing="1.5">
                <circle cx="70" cy="130" r="34" fill="none" stroke="rgba(236,238,242,0.25)" />
                <text x="70" y="134" textAnchor="middle" fill="#878b94">ENQUIRY</text>
                <rect x="330" y="86" width="180" height="88" rx="10" fill="rgba(94,230,255,0.06)" stroke="#5ee6ff" strokeOpacity="0.5" />
                <text x="420" y="122" textAnchor="middle" fill="#eceef2">AGENT</text>
                <text x="420" y="142" textAnchor="middle" fill="#878b94">reason · decide · act</text>
                <text x="858" y="64" fill="#878b94">CRM</text>
                <text x="858" y="134" fill="#878b94">WHATSAPP</text>
                <text x="858" y="204" fill="#878b94">CALENDAR</text>
              </g>
              {/* tokens animated along the paths via MotionPath */}
              <circle className="flow-token" data-path="#flow-in" r="4" fill="#5ee6ff" />
              <circle className="flow-token" data-path="#flow-crm" r="4" fill="#7c6cff" />
              <circle className="flow-token" data-path="#flow-wa" r="4" fill="#5ef0b0" />
              <circle className="flow-token" data-path="#flow-cal" r="4" fill="#ffb454" />
            </svg>
          </div>
        </div>
      </section>

      {/* the fleet */}
      <section className="px-6 md:px-10 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="mono-label mb-4 reveal">deployed units</p>
          <h2 className="display text-4xl md:text-6xl mb-16" data-split>
            The fleet, on the record.
          </h2>
          <div className="grid md:grid-cols-2 gap-5" data-speed="0.12">
            {AGENTS_SHOWCASE.map((a) => (
              <article key={a.name} className="agent-card reveal border border-snow/10 rounded-[10px] p-8 bg-void/60 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-signal agent-pulse" />
                  <h3 className="display text-2xl">{a.name}</h3>
                  <span className="mono-label !text-snow/50">— {a.role}</span>
                </div>
                <p className="text-mist font-light leading-relaxed mb-7">{a.desc}</p>
                <ol className="flex flex-wrap items-center gap-2" aria-label={`${a.name} workflow`}>
                  {a.steps.map((step, i) => (
                    <li key={step} className="flex items-center gap-2">
                      <span className="mono-label !text-snow/70 border border-snow/15 rounded-full px-3 py-1.5">
                        {step}
                      </span>
                      {i < a.steps.length - 1 && <span className="text-snow/30" aria-hidden="true">→</span>}
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
          <p className="text-mist font-light text-sm mt-10 max-w-xl reveal">
            Want a live demonstration? Scout — the orb in the corner — is one of
            ours. Ask it something.
          </p>
        </div>
      </section>

      <Faq items={agentService.faqs} title="AI agents, answered." />

      <section className="px-6 md:px-10 pb-32 text-center">
        <MagneticButton href="/contact" className="cta reveal">
          <span className="dot" />
          Commission your first agent
        </MagneticButton>
      </section>

      <AgentsFX />
    </main>
  );
}
