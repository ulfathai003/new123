import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, SITE } from "../../../lib/data";
import Faq from "../../../components/Faq";
import MagneticButton from "../../../components/MagneticButton";
import ServiceFX from "../../../components/fx/ServiceFX";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return {};
  return {
    title: `${s.title} — ${s.hero}`,
    description: `${s.short} ${s.body.split(". ")[0]}.`,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: `${s.title} | ${SITE.name}`, description: s.short },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) notFound();

  const idx = SERVICES.indexOf(s);
  const next = SERVICES[(idx + 1) % SERVICES.length];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.short,
    provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
    url: `${SITE.url}/services/${s.slug}`,
  };

  return (
    <main className="pt-32" style={{ "--accent": s.accent }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* hero */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-5xl mx-auto" data-depth="0.3">
          <p className="mono-label mb-6 reveal">
            <Link href="/services" className="hover:text-snow">services</Link>
            <span className="mx-2 text-snow/30">/</span>
            <span style={{ color: s.accent }}>{s.title.toLowerCase()}</span>
          </p>
          <h1 className="display text-[11vw] md:text-[6.5vw]" data-split>
            {s.hero}
          </h1>
          <p className="mt-8 max-w-2xl text-mist text-lg font-light leading-relaxed reveal">
            {s.body}
          </p>
          <div className="mt-10 reveal">
            <MagneticButton href="/contact" className="cta" burstColor={s.accent}>
              <span className="dot" style={{ background: s.accent }} />
              Scope this with us
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* deliverables */}
      <section className="px-6 md:px-10 py-24 border-t border-snow/10">
        <div className="max-w-5xl mx-auto">
          <p className="mono-label mb-12 reveal">what you get</p>
          <div className="grid md:grid-cols-2 gap-4" data-speed="0.12">
            {s.deliverables.map((d, i) => (
              <div
                key={d}
                className="deliverable reveal flex items-baseline gap-5 border border-snow/10 rounded-[10px] p-6 bg-void/60 backdrop-blur-sm"
              >
                <span className="mono-label" style={{ color: s.accent }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-snow/90 font-light text-lg">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* case study reveal — ohzi-style curtain block */}
      <section className="px-6 md:px-10 py-24">
        <div className="max-w-5xl mx-auto" data-speed="-0.08">
          <p className="mono-label mb-12 reveal">field evidence</p>
          <div id="case-block" className="relative overflow-clip rounded-[10px] border border-snow/10">
            <div
              id="case-curtain"
              className="absolute inset-0 z-10"
              style={{ background: `linear-gradient(120deg, ${s.accent}22, #0c0d10)` }}
              aria-hidden="true"
            />
            <div className="relative p-10 md:p-16 bg-void-soft/80">
              <p className="mono-label mb-6" style={{ color: s.accent }}>
                case study — {s.caseStudy.client}
              </p>
              <p className="display text-2xl md:text-4xl leading-[1.2] max-w-3xl">
                {s.caseStudy.result}
              </p>
              <Link href="/work" className="draw-link mono-label !text-snow/60 hover:!text-snow inline-block mt-10">
                more from the field →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Faq items={s.faqs} title={`${s.title}, answered.`} />

      {/* continuity: next door */}
      <section className="px-6 md:px-10 pb-32">
        <Link
          href={`/services/${next.slug}`}
          className="reveal group block max-w-5xl mx-auto border border-snow/10 rounded-[10px] p-10 text-center hover:border-snow/30 transition-colors"
        >
          <p className="mono-label mb-4">next discipline</p>
          <p className="display text-3xl md:text-5xl text-snow group-hover:text-[var(--accent)] transition-colors">
            {next.title} →
          </p>
        </Link>
      </section>

      <ServiceFX accent={s.accent} />
    </main>
  );
}
