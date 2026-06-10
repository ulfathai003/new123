import Link from "next/link";
import { WORK } from "../../lib/data";
import MagneticButton from "../../components/MagneticButton";
import WorkFX from "../../components/fx/WorkFX";

export const metadata = {
  title: "Work — Case Studies in Applied Intelligence",
  description:
    "SoftiIntel case studies: AI agent fleets, immersive 3D storefronts, booking apps and operations platforms — with the before/after numbers to prove they worked.",
  alternates: { canonical: "/work" },
};

const TRANSFORMS = [
  ["Meridian Logistics", ["Support inbox triaged by hand, 14h first-response", "71% of tickets resolved autonomously, 4-minute response"]],
  ["Casa Verde", ["Template store, page 4 of search results", "Immersive 3D storefront, +212% organic traffic"]],
  ["Northwind Salons", ["Phone-only bookings, 1-in-5 no-shows", "In-app bookings with reminders, no-shows down 27%"]],
  ["Atlas Build Co.", ["Seven tools, 40 spreadsheet-hours a week", "One ops platform, payback inside 5 months"]],
];

export default function Work() {
  return (
    <main className="pt-32">
      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-6xl mx-auto" data-depth="0.3">
          <p className="mono-label mb-6 reveal">work — field evidence</p>
          <h1 className="display text-[11vw] md:text-[6.5vw]" data-split>
            Proof, exhibited.
          </h1>
          <p className="mt-8 max-w-2xl text-mist text-lg font-light leading-relaxed reveal">
            Four engagements, four transformations. Scroll — each one unveils
            itself the way it unfolded: gradually, then suddenly.
          </p>
        </div>
      </section>

      {/* ohzi-style unveilings */}
      <section className="px-6 md:px-10 pb-12">
        <div className="max-w-6xl mx-auto flex flex-col gap-10" data-speed="0.05">
          {WORK.map((w, i) => (
            <article
              key={w.client}
              className="case-reveal relative overflow-clip rounded-[10px] border border-snow/10"
              style={{ "--accent": w.accent }}
            >
              <div
                className="case-veil absolute inset-0 z-10"
                style={{ background: `linear-gradient(115deg, #0c0d10 40%, ${w.accent}33)` }}
                aria-hidden="true"
              />
              <div className="relative bg-void-soft/80 p-10 md:p-14 grid md:grid-cols-[1fr_auto] gap-8 items-end">
                <div>
                  <p className="mono-label mb-5">
                    <span style={{ color: w.accent }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="mx-3 text-snow/30">·</span>
                    {w.sector}
                  </p>
                  <h2 className="display text-3xl md:text-5xl mb-4">{w.title}</h2>
                  <p className="text-mist font-light">{w.client}</p>
                </div>
                <p className="display text-2xl md:text-3xl" style={{ color: w.accent }}>
                  {w.result}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* before / after ledger */}
      <section className="px-6 md:px-10 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="mono-label mb-4 reveal">the ledger</p>
          <h2 className="display text-4xl md:text-6xl mb-16" data-split>
            Before / After.
          </h2>
          <div className="border border-snow/10 rounded-[10px] overflow-clip" data-speed="0.1">
            <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[12rem_1fr_1fr] mono-label !text-snow/40 border-b border-snow/10">
              <p className="hidden md:block p-5">client</p>
              <p className="p-5">before</p>
              <p className="p-5" style={{ color: "#5ef0b0" }}>after</p>
            </div>
            {TRANSFORMS.map(([client, [before, after]]) => (
              <div key={client} className="reveal grid grid-cols-[1fr_1fr] md:grid-cols-[12rem_1fr_1fr] border-b border-snow/10 last:border-b-0 bg-void/50">
                <p className="hidden md:block p-5 text-sm font-light text-snow/80">{client}</p>
                <p className="p-5 text-sm font-light text-mist leading-relaxed">{before}</p>
                <p className="p-5 text-sm font-light text-snow/90 leading-relaxed">{after}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-32 text-center">
        <p className="mono-label mb-8 reveal">your name belongs on this page</p>
        <MagneticButton href="/contact" className="cta reveal" burstColor="#ffb454">
          <span className="dot" style={{ background: "#ffb454" }} />
          Open a case with us
        </MagneticButton>
      </section>

      <WorkFX />
    </main>
  );
}
