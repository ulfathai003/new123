"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import * as THREE from "three";

import scrollState from "../lib/scrollState";
import { ROUTE_THEMES } from "../lib/data";
import GLBackground from "./GLBackground";
import Cursor from "./Cursor";
import Nav from "./Nav";
import Footer from "./Footer";
import ChatBot from "./ChatBot";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Shell({ children }) {
  const pathname = usePathname();
  const [reduced, setReduced] = useState(false);
  const curtainRef = useRef(null);
  const lenisRef = useRef(null);
  // GL reads this every frame; route changes just retarget the lerp
  const themeRef = useRef({
    a: new THREE.Color("#5ee6ff"),
    b: new THREE.Color("#7c6cff"),
    energy: 1,
    morph: 1,
  });

  /* ── route → particle weather ── */
  useEffect(() => {
    const key =
      Object.keys(ROUTE_THEMES)
        .filter((k) => pathname === k || (k !== "/" && pathname.startsWith(k)))
        .sort((a, b) => b.length - a.length)[0] || "/";
    const t = ROUTE_THEMES[key];
    themeRef.current.a = new THREE.Color(t.a);
    themeRef.current.b = new THREE.Color(t.b);
    themeRef.current.energy = t.energy;
    themeRef.current.morph = t.morph ?? 0;
  }, [pathname]);

  /* ── smooth scroll, once ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);
    if (prefersReduced) {
      scrollState.ready = true;
      return;
    }
    const lenis = new Lenis({ autoRaf: false, lerp: 0.09 });
    lenisRef.current = lenis;
    lenis.on("scroll", (e) => {
      scrollState.progress = e.progress ?? 0;
      scrollState.velocity = e.velocity ?? 0;
      ScrollTrigger.update();
    });
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    scrollState.ready = true;
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  /* ── per-page choreography: curtain in, then shared reveal grammar ── */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set("[data-split], .reveal", { opacity: 1 });
      return;
    }

    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // arrival curtain
      gsap.fromTo(
        curtainRef.current,
        { scaleY: 1 },
        { scaleY: 0, transformOrigin: "top center", duration: 0.9, ease: "power4.inOut", delay: 0.05 }
      );

      // headline grammar — GSAP SplitText with masked lines
      document.querySelectorAll("[data-split]").forEach((el) => {
        const split = new SplitText(el, { type: "words,chars", mask: "words" });
        gsap.set(el, { opacity: 1 });
        gsap.from(split.chars, {
          yPercent: 115,
          duration: 0.9,
          stagger: 0.014,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // body grammar — rise from the fog
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      // animated statistics — [data-count="120"]
      gsap.utils.toArray("[data-count]").forEach((el) => {
        const target = parseFloat(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => (el.textContent = Math.round(obj.v) + (el.dataset.suffix || "")),
        });
      });

      // scroll parallax — [data-speed] layers drift at their own pace
      // while crossing the viewport (positive = rises, negative = sinks)
      gsap.utils.toArray("[data-speed]").forEach((el) => {
        const sp = parseFloat(el.dataset.speed) || 0.15;
        gsap.fromTo(
          el,
          { y: sp * 120 },
          {
            y: -sp * 120,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          }
        );
      });

      ScrollTrigger.refresh();
    });

    // mouse-depth parallax — [data-depth] elements float on their own
    // plane, sliding against each other as the cursor travels
    let removeMouse = () => {};
    if (!window.matchMedia("(pointer: coarse)").matches) {
      const layers = gsap.utils.toArray("[data-depth]").map((el) => ({
        d: parseFloat(el.dataset.depth) || 0.3,
        x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
      }));
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(nx * l.d * -64);
          l.y(ny * l.d * -40);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      removeMouse = () => window.removeEventListener("pointermove", onMove);
    }

    return () => {
      removeMouse();
      ctx.revert();
    };
  }, [pathname]);

  return (
    <>
      <GLBackground theme={themeRef} reducedMotion={reduced} />
      <Cursor />
      <Nav />
      <div className="relative z-10">{children}</div>
      <Footer />
      <ChatBot />
      {/* route-arrival curtain */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[68] bg-void-soft pointer-events-none scale-y-0"
        aria-hidden="true"
      />
    </>
  );
}
