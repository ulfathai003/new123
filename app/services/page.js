import Link from "next/link";
import { SERVICES } from "../../lib/data";

export const metadata = {
  title: "Services — AI Agents, CRM, Web, Mobile, Automation & More",
  description:
    "Eight disciplines, one team: AI agents, CRM development, web development, mobile apps, automation, AI integrations, custom software and digital transformation for SMEs.",
  alternates: { canonical: "/services" },
};

export default function Services() {
  return (
    <main className="pt-32">
      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-6xl mx-auto" data-depth="0.3">
          <p className="mono-label mb-6 reveal">services — pick your way in</p>
          <h1 className="display text-[11vw] md:text-[6.5vw]" data-split>
            Eight disciplines. One rope team.
          </h1>
          <p className="mt-8 max-w-2xl text-mist text-lg font-light leading-relaxed reveal">
            Every engagement starts with the same question — where does
            intelligence buy you the most leverage? — and ends with working
            software. Choose a door.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-32">
        <div className="max-w-6xl mx-auto flex flex-col" data-speed="0.07">
          {SERVICES.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="svc-row reveal group relative border-t border-snow/10 last:border-b py-10 md:py-12 grid md:grid-cols-[5rem_1fr_1fr_auto] items-baseline gap-4 transition-colors hover:bg-void-soft/60"
              style={{ "--accent": s.accent }}
            >
              <span className="mono-label !text-snow/40 pl-1">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="display text-2xl md:text-4xl text-snow group-hover:text-[var(--accent)] group-hover:translate-x-2 transition-all duration-500">
                {s.title}
              </h2>
              <p className="text-mist text-sm font-light leading-relaxed max-w-md">{s.short}</p>
              <span
                className="mono-label !text-snow/40 group-hover:!text-[var(--accent)] transition-all duration-500 group-hover:translate-x-1 pr-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
