# SoftiIntel

The marketing site for **SoftiIntel** — an AI-native creative technology agency.
A card-free, immersive, scroll-driven experience: a photoreal gaussian-splat
mountain (Luma) behind full-bleed typographic "acts," with a cinematic camera
flythrough, mouse-hold orbit, water-ripple cursor, and a paper-light design system.

Built with **Next.js 16 (App Router)**, **React 19**, **Three.js / @react-three/fiber**,
**@lumaai/luma-web**, **GSAP + ScrollTrigger**, **anime.js**, and **Tailwind CSS v4**.

## Run locally

```bash
npm install          # uses .npmrc (legacy-peer-deps) for luma-web
npm run dev          # http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Structure

- `app/` — routes (home, about, services + 8 dynamic service pages, ai-agents, work, contact) and SEO files (sitemap, robots, JSON-LD in `layout.js`).
- `components/` — `Shell` (mounts everything), `GLBackground` (the WebGL scene: splat, camera shots, water-ripple sim), `Nav`, `Footer`, `ChatBot`, `Cursor`, `MagneticButton`, `Faq`, `ContactForm`, and per-page FX in `components/fx/`.
- `lib/data.js` — single source of truth for all copy + SEO (services, FAQs, contact email, LinkedIn).
- `lib/r2.js` — resolves heavy 3D asset URLs to the Cloudflare R2 CDN (see below).
- `next.config.mjs` — strict Content-Security-Policy and security headers.

## 3D assets on Cloudflare R2

Large `.glb` / `.gltf` / `.splat` files are served from a **Cloudflare R2**
bucket (`softiintel-3d`) instead of Vercel — free egress, range requests, and a
global CDN. The app shell stays small; only the 3D payload comes from R2.

**Bucket public base:** `https://pub-ea9a6707d2e741b9883f1e8674dcc2b0.r2.dev`
(set as `NEXT_PUBLIC_R2_BASE` on Vercel + in `.env.local` for dev).

Upload a model (needs `wrangler login` once):

```bash
wrangler r2 object put softiintel-3d/models/mountain.glb \
  --file ./mountain.glb --content-type model/gltf-binary --remote
```

Use it in code via the helper — it falls back to `/public` when the env var is
unset, so local dev works without R2:

```js
import { asset } from "@/lib/r2";
import { useGLTF } from "@react-three/drei";

const { scene } = useGLTF(asset("models/mountain.glb"));
```

CORS (`.r2-cors.json`) allows GET/HEAD from the Vercel domains + `localhost:3000`.
Re-apply after edits with `wrangler r2 bucket cors set softiintel-3d --file .r2-cors.json`.

## The mountain camera

`components/GLBackground.jsx` defines a `SHOTS` storyboard — six authored
camera angles (arrival → starboard climb → port traverse → aerial → valley
floor → departure). Scroll interpolates the camera between them; press-and-drag
orbits the massif with inertia. See `softiintel-mountain-angles.html` (saved to
the Desktop) for a standalone preview of just that flythrough.

## Security

`connect-src` is locked to the site itself plus Luma's domains and `*.r2.dev`,
so the browser refuses any other outbound API/fetch/WebSocket call. See
`next.config.mjs` and `vercel.json`.

## Deploy

Connect this repo to **Vercel** (Framework preset: Next.js) and it deploys on
every push. One environment variable is required: `NEXT_PUBLIC_R2_BASE` (the R2
bucket public base URL) — already configured on the `new123` Vercel project.
