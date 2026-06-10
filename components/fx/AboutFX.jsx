"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** About page: the chapter line draws itself; dots ignite as you pass. */
export default function AboutFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.to("#tl-progress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: "#tl-list", start: "top 70%", end: "bottom 55%", scrub: 0.5 },
      });
      gsap.utils.toArray(".tl-step").forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 65%",
          once: true,
          onEnter: () =>
            gsap.to(step.querySelector(".tl-dot"), {
              backgroundColor: "#5ee6ff",
              scale: 1.5,
              duration: 0.5,
              ease: "back.out(3)",
            }),
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return null;
}
