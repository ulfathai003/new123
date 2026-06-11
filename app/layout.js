import { IBM_Plex_Mono } from "next/font/google";
import { SITE, SERVICES } from "../lib/data";
import Shell from "../components/Shell";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  description: SITE.description,
  sameAs: [SITE.linkedin],
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

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — AI Agents, CRM, Web & Automation | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "AI agency", "AI agents", "custom CRM development", "web development",
    "mobile app development", "WhatsApp automation", "AI integrations",
    "custom software", "digital transformation", "immersive web design",
  ],
  openGraph: {
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
    locale: "en_US",
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plexMono.variable}>
      <body className="grain vignette">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
