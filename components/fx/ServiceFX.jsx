"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Service pages: ohzi-style curtain reveal on the case study block. */
export default function ServiceFX({ accent = "#5ee6ff" }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set("#case-curtain", { xPercent: 101 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.to("#case-curtain", {
        xPercent: 101,
        duration: 1.2,
        ease: "power4.inOut",
        scrollTrigger: { trigger: "#case-block", start: "top 70%", once: true },
      });
      // deliverables cascade with a slight overshoot, color-keyed
      ScrollTrigger.batch(".deliverable", {
        start: "top 85%",
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { borderColor: accent + "55" },
            { borderColor: "rgba(236,238,242,0.1)", duration: 1.6, ease: "power2.out", stagger: 0.1 }
          ),
      });
    });
    return () => ctx.revert();
  }, [accent]);

  return null;
}
