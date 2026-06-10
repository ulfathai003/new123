"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";

gsap.registerPlugin(Physics2DPlugin);

/**
 * Every button alive: magnetic attraction toward the cursor,
 * elastic snap-back on leave, and a gravity-driven particle burst
 * on click (GSAP Physics2D — real velocity + gravity, not keyframes).
 * Renders a Next <Link> when `href` is given, else a <button> —
 * so server components can use it without passing component props.
 */
export default function MagneticButton({
  href,
  className = "",
  burstColor = "#5ee6ff",
  strength = 0.35,
  children,
  ...props
}) {
  const Tag = href ? Link : "button";
  const ref = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(inner, "x", { duration: 0.3, ease: "power3.out" });
    const yTo = gsap.quickTo(inner, "y", { duration: 0.3, ease: "power3.out" });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.3)" });
    };
    const onClick = (e) => {
      // particle burst with actual physics: velocity, angle, gravity
      for (let i = 0; i < 12; i++) {
        const p = document.createElement("span");
        p.className = "burst-particle";
        p.style.background = burstColor;
        p.style.left = `${e.clientX}px`;
        p.style.top = `${e.clientY}px`;
        document.body.appendChild(p);
        gsap.to(p, {
          duration: 0.9 + Math.random() * 0.5,
          physics2D: {
            velocity: 120 + Math.random() * 220,
            angle: Math.random() * 360,
            gravity: 520,
          },
          opacity: 0,
          scale: 0.2,
          ease: "none",
          onComplete: () => p.remove(),
        });
      }
      gsap.fromTo(inner, { scale: 0.92 }, { scale: 1, duration: 0.7, ease: "elastic.out(1.2, 0.35)" });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("click", onClick);
    };
  }, [strength, burstColor]);

  return (
    <Tag ref={ref} href={href} data-magnetic className={className} {...props}>
      <span ref={innerRef} className="inline-flex items-center gap-3 will-change-transform">
        {children}
      </span>
    </Tag>
  );
}
