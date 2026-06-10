import { SERVICES, SITE } from "../lib/data";

export default function sitemap() {
  const now = new Date();
  const statics = ["", "/about", "/services", "/ai-agents", "/work", "/contact"].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.8,
  }));
  const services = SERVICES.map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [...statics, ...services];
}
