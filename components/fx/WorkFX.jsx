"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Work page: each case unveils with a sweeping curtain + parallax settle. */
export default function WorkFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(".case-veil", { xPercent: 101 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".case-reveal").forEach((block) => {
        const veil = block.querySelector(".case-veil");
        gsap
          .timeline({
            scrollTrigger: { trigger: block, start: "top 75%", once: true },
          })
          .fromTo(block, { y: 60, opacity: 0.4 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" })
          .to(veil, { xPercent: 101, duration: 1.1, ease: "power4.inOut" }, "-=0.6");
      });
    });
    return () => ctx.revert();
  }, []);

  return null;
}
