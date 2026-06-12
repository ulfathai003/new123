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
- `next.config.mjs` — strict Content-Security-Policy and security headers.

## The mountain camera

`components/GLBackground.jsx` defines a `SHOTS` storyboard — six authored
camera angles (arrival → starboard climb → port traverse → aerial → valley
floor → departure). Scroll interpolates the camera between them; press-and-drag
orbits the massif with inertia. See `softiintel-mountain-angles.html` (saved to
the Desktop) for a standalone preview of just that flythrough.

## Security

`connect-src` is locked to the site itself plus Luma's domains, so the browser
refuses any other outbound API/fetch/WebSocket call. See `next.config.mjs`.

## Deploy

Connect this repo to **Vercel** (Framework preset: Next.js) and it deploys on
every push. No environment variables required.
