import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ─────────────────────────────────────────────────────────────
   SECURITY — Content-Security-Policy + hardening headers.

   The lockdown that matters: `connect-src` is restricted to this
   site itself plus Luma's domains (the 3D mountain). The browser
   will REFUSE any fetch / XHR / WebSocket / beacon to anywhere
   else — so even if hostile code were ever injected into the
   bundle, it physically cannot phone home, exfiltrate data, or
   call an unknown API. img-src and form-action are locked the
   same way to close the common side-channels.

   If you ever legitimately need a new external service, add its
   exact origin to the relevant directive below — nowhere else.
   ───────────────────────────────────────────────────────────── */
const csp = [
  "default-src 'self'",
  // Next.js hydration needs inline scripts; Three/Luma compile WASM.
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  // Tailwind + Next inject inline styles and per-element CSS vars.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // ↓ THE GUARDRAIL — outbound calls allowed ONLY to self + Luma.
  "connect-src 'self' https://lumalabs.ai https://*.lumalabs.ai https://*.engineeringlumalabs.com",
  // Luma spins up gaussian-splat workers from blob URLs.
  "worker-src 'self' blob:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root: a drive-wide lockfile exists above this project,
  // and without this Next/Turbopack can infer the wrong root for builds.
  turbopack: {
    root: __dirname,
  },
  // Don't leak the framework version in response headers.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
