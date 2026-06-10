import Shell from "@/components/Shell";
import { SITE, SERVICES } from "@/lib/data";

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  description: SITE.description,
  makesOffer: SERVICES.map((s) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: s.title,
      description: s.short,
      url: `${SITE.url}/services/${s.slug}`,
    },
  })),
};

export default function SiteLayout({ children }) {
  return (
    <div className="grain vignette">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <noscript>
        <style>{`#preloader{display:none}.reveal,[data-split]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <Shell>{children}</Shell>
    </div>
  );
}
