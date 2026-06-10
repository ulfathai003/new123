"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { animate, stagger } from "animejs";
import { SERVICES, SITE } from "../lib/data";
import MagneticButton from "./MagneticButton";

const MARQUEE = "AI AGENTS · CRM · WEB · MOBILE · AUTOMATION · AI INTEGRATIONS · CUSTOM SOFTWARE · TRANSFORMATION · ";

export default function Footer() {
  const headlineRef = useRef(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* per-character ripple when the headline is touched — anime.js spring */
  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    const chars = el.querySelectorAll(".f-char");
    const onEnter = (e) => {
      const idx = [...chars].indexOf(e.target);
      if (idx < 0) return;
      animate(chars, {
        translateY: (_, i) => [0, -Math.max(0, 18 - Math.abs(i - idx) * 4), 0],
        duration: 600,
        delay: stagger(18, { from: idx }),
        ease: "outElastic(1, .6)",
      });
    };
    el.addEventListener("pointerover", onEnter);
    return () => el.removeEventListener("pointerover", onEnter);
  }, []);

  return (
    <footer className="relative z-10 border-t border-snow/10 bg-void/85 backdrop-blur-sm overflow-clip">
      {/* marquee */}
      <div className="py-4 border-b border-snow/10 overflow-clip whitespace-nowrap" aria-hidden="true">
        <div className="marquee mono-label !text-snow/40 inline-block">
          {MARQUEE.repeat(3)}
        </div>
      </div>

      {/* the invitation */}
      <div className="px-6 md:px-10 pt-20 pb-16 text-center">
        <p className="mono-label mb-8">have an unfair idea?</p>
        <h2
          ref={headlineRef}
          className="display text-[9.5vw] md:text-[6.5vw] leading-[1.02] cursor-default select-none"
          data-depth="0.2"
          aria-label="Let's build intelligence."
        >
          {"Let's build intelligence.".split("").map((c, i) => (
            <span key={i} aria-hidden="true" className="f-char inline-block whitespace-pre">
              {c}
            </span>
          ))}
        </h2>
        <div className="mt-12 flex justify-center">
          <MagneticButton href="/contact" className="cta" burstColor="#7c6cff">
            <span className="dot" />
            {SITE.email}
          </MagneticButton>
        </div>
      </div>

      {/* sitemap columns */}
      <div className="px-6 md:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-snow/10 max-w-7xl mx-auto">
        <div>
          <p className="mono-label !text-signal mb-5">studio</p>
          {[["Home", "/"], ["About", "/about"], ["Work", "/work"], ["Contact", "/contact"]].map(([l, h]) => (
            <Link key={h} href={h} className="draw-link block w-fit text-sm font-light text-snow/70 hover:text-snow mb-3">{l}</Link>
          ))}
        </div>
        <div>
          <p className="mono-label !text-signal mb-5">services</p>
          {SERVICES.slice(0, 4).map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="draw-link block w-fit text-sm font-light text-snow/70 hover:text-snow mb-3">{s.title}</Link>
          ))}
        </div>
        <div>
          <p className="mono-label !text-transparent mb-5 select-none" aria-hidden="true">·</p>
          {SERVICES.slice(4).map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="draw-link block w-fit text-sm font-light text-snow/70 hover:text-snow mb-3">{s.title}</Link>
          ))}
        </div>
        <div>
          <p className="mono-label !text-signal mb-5">signal</p>
          <a href={`mailto:${SITE.email}`} className="draw-link block w-fit text-sm font-light text-snow/70 hover:text-snow mb-3">{SITE.email}</a>
          <p className="mono-label !text-snow/40 mt-6">local time</p>
          <p className="text-sm font-light text-snow/70 tabular-nums">{time || "—"}</p>
        </div>
      </div>

      {/* baseline */}
      <div className="px-6 md:px-10 py-6 border-t border-snow/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="mono-label">© {new Date().getFullYear()} SoftiIntel — engineered intelligence</p>
        <p className="mono-label">forged by humans &amp; their agents</p>
      </div>
    </footer>
  );
}
