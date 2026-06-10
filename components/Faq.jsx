/**
 * SEO-grade FAQ block: semantic <details> accordions plus
 * structured FAQPage schema for rich results. Server component.
 */
export default function Faq({ items, title = "Questions, answered." }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section className="relative px-6 md:px-10 py-24 md:py-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-3xl mx-auto" data-speed="0.06">
        <p className="mono-label mb-4 reveal">faq</p>
        <h2 className="display text-3xl md:text-5xl mb-12" data-split>
          {title}
        </h2>
        <div className="reveal">
          {items.map(([q, a]) => (
            <details key={q} className="faq-item group">
              <summary className="cursor-pointer">
                <h3 className="text-base md:text-lg font-light text-snow/90">{q}</h3>
              </summary>
              <p className="text-mist text-sm md:text-base font-light leading-relaxed pb-6 max-w-2xl">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
