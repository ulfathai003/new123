/* Resolves 3D asset URLs.
   Heavy GLB/GLTF/splat files live in a Cloudflare R2 bucket so Vercel
   only serves the app shell. Set NEXT_PUBLIC_R2_BASE to the bucket's
   public origin (e.g. https://pub-xxxx.r2.dev or https://cdn.softiintel.com).
   Falls back to /public so local dev works without the env var. */
const R2_BASE = (process.env.NEXT_PUBLIC_R2_BASE || "").replace(/\/$/, "");

export function asset(path) {
  const clean = String(path).replace(/^\//, "");
  return R2_BASE ? `${R2_BASE}/${clean}` : `/${clean}`;
}

export const R2_ENABLED = Boolean(R2_BASE);
