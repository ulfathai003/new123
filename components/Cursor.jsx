"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import pointerState from "../lib/pointerState";

/**
 * Custom cursor: a signal dot + a lagging ring that swells over
 * interactive elements. Also the single writer of pointerState,
 * which the WebGL water sim and particle field read every frame.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return; // touch: native

    const dot = dotRef.current;
    const ring = ringRef.current;
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let lastX = 0, lastY = 0;

    const onMove = (e) => {
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);

      pointerState.x = e.clientX / window.innerWidth;
      pointerState.y = 1 - e.clientY / window.innerHeight;
      pointerState.speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      pointerState.active = true;
      lastX = e.clientX; lastY = e.clientY;
    };
    const onLeave = () => (pointerState.active = false);
    const onDown = () => {
      pointerState.clicks += 1;
      gsap.fromTo(ring, { scale: 0.7 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    };

    // swell over anything interactive
    const onOver = (e) => {
      const hit = e.target.closest("a, button, [data-magnetic], input, select, textarea, summary");
      gsap.to(ring, {
        scale: hit ? 2.2 : 1,
        opacity: hit ? 0.9 : 0.5,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.classList.add("has-cursor");

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div aria-hidden="true" className="hidden md:block">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[80] w-1.5 h-1.5 rounded-full bg-snow pointer-events-none"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[80] w-9 h-9 rounded-full border border-snow/50 opacity-50 pointer-events-none mix-blend-difference"
      />
    </div>
  );
}
