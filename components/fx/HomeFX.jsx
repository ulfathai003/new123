"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate, stagger } from "animejs";

gsap.registerPlugin(ScrollTrigger);

/**
 * Home choreography, anime.js-homepage style:
 * - chapter tracking swaps the floating ops-console card
 * - a scroll rail cursor rides the page progress
 * - toolbox chips float on their own gentle loops
 * - the leverage chart bars grow when the chapter arrives
 * (Headline splits, reveals, counters and parallax come from the
 *  Shell's shared grammar — this file only adds the home-specific acts.)
 */
export default function HomeFX({ snippets = [] }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(".lev-bar", { width: (i, el) => el.dataset.size + "%" });
      return;
    }

    const ctx = gsap.context(() => {
      /* ── floating ops console: one card per chapter ── */
      let activeCard = null;
      const showCard = (slug) => {
        if (activeCard === slug) return;
        activeCard = slug;
        document.querySelectorAll(".ops-card").forEach((el) => {
          const match = el.dataset.card === slug;
          if (match && el.classList.contains("hidden")) {
            el.classList.remove("hidden");
            animate(el, {
              translateY: [14, 0],
              opacity: [0, 1],
              duration: 450,
              ease: "outExpo",
            });
          } else if (!match) {
            el.classList.add("hidden");
          }
        });
      };
      snippets.forEach((slug) => {
        ScrollTrigger.create({
          trigger: `#ch-${slug}`,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) showCard(slug);
            else if (activeCard === slug) {
              activeCard = null;
              document
                .querySelector(`.ops-card[data-card="${slug}"]`)
                ?.classList.add("hidden");
            }
          },
        });
      });

      /* ── scroll rail cursor ── */
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          gsap.set("#scroll-rail-cursor", { top: `${self.progress * 100}%` });
        },
      });

      /* ── leverage chart grows on arrival ── */
      ScrollTrigger.create({
        trigger: ".leverage-chart",
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(".lev-bar", {
            width: (i, el) => el.dataset.size + "%",
            duration: 1.3,
            ease: "power4.out",
            stagger: 0.1,
          });
        },
      });
    });

    /* ── toolbox chips: each drifts on its own slow loop ── */
    const chips = document.querySelectorAll(".toolbox-chip");
    const chipAnim = chips.length
      ? animate(chips, {
          translateY: () => [0, -6 - Math.random() * 8],
          duration: () => 2200 + Math.random() * 1600,
          delay: stagger(90),
          ease: "inOutSine",
          loop: true,
          alternate: true,
        })
      : null;

    return () => {
      chipAnim?.pause?.();
      ctx.revert();
    };
  }, [snippets]);

  return null;
}
