"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate, stagger } from "animejs";

gsap.registerPlugin(ScrollTrigger);

/**
 * Home choreography — card-free, igloo-style:
 * - a quiet chapter beacon names the act you're in
 * - leverage lines draw themselves when the chapter arrives
 * - toolbox words float on their own slow loops
 * (Headline splits, reveals, counters and parallax come from the
 *  Shell's shared grammar — this file only adds the home-specific acts.)
 */
export default function HomeFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(".lev-bar", { width: (i, el) => el.dataset.size + "%" });
      return;
    }

    const ctx = gsap.context(() => {
      /* ── chapter beacon: whisper the act name as it takes the stage ── */
      const beacon = document.getElementById("chapter-beacon");
      if (beacon) {
        gsap.utils.toArray("[data-chapter]").forEach((sec) => {
          ScrollTrigger.create({
            trigger: sec,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (!self.isActive) return;
              const label = sec.dataset.chapter;
              if (beacon.textContent === label) return;
              beacon.textContent = label;
              animate(beacon, {
                opacity: [0, 1],
                translateY: [6, 0],
                duration: 500,
                ease: "outExpo",
              });
            },
          });
        });
      }

      /* ── leverage lines draw on arrival ── */
      ScrollTrigger.create({
        trigger: "#leverage",
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".lev-bar", {
            width: (i, el) => el.dataset.size + "%",
            duration: 1.4,
            ease: "power4.out",
            stagger: 0.12,
          });
        },
      });

      /* ── project timeline: the signal line climbs as you scroll,
            each stage's dot ignites when it takes the stage ── */
      if (document.getElementById("pm-list")) {
        gsap.to("#pm-progress", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "#pm-list",
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        });
        gsap.utils.toArray(".pm-step").forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 72%",
            once: true,
            onEnter: () =>
              gsap.to(step.querySelector(".pm-dot"), {
                backgroundColor: "#5b46e8",
                scale: 1.5,
                duration: 0.5,
                ease: "back.out(3)",
              }),
          });
        });
      }
    });

    /* ── toolbox words: each drifts on its own slow loop ── */
    const chips = document.querySelectorAll(".toolbox-chip");
    const chipAnim = chips.length
      ? animate(chips, {
          translateY: () => [0, -5 - Math.random() * 9],
          opacity: [{ to: 1 }],
          duration: () => 2400 + Math.random() * 1800,
          delay: stagger(80),
          ease: "inOutSine",
          loop: true,
          alternate: true,
        })
      : null;

    return () => {
      chipAnim?.pause?.();
      ctx.revert();
    };
  }, []);

  return null;
}
