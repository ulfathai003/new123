"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate, stagger, createTimeline } from "animejs";

gsap.registerPlugin(ScrollTrigger);

/**
 * Home choreography — card-free, igloo-style + extra creative flourishes.
 * All home-specific animation orchestration lives here. The Shell adds
 * reveals, splits and parallax via shared grammar; this file layers on
 * the signature moments that make the home memorable.
 */
export default function HomeFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(".lev-bar", { width: (i, el) => el.dataset.size + "%" });
      gsap.set("#pm-spine-progress", { strokeDashoffset: 0 });
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

      /* ── leverage lines draw on arrival, with a count-up ── */
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

      /* ── PROJECT TIMELINE — the curvy SVG spine draws itself as you scroll;
            each stage's dot ignites with a pulse ring on entry. ── */
      if (document.getElementById("pm-list")) {
        // desktop: scrub the SVG path's stroke-dashoffset 1→0
        gsap.to("#pm-spine-progress", {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#pm-list",
            start: "top 75%",
            end: "bottom 65%",
            scrub: 0.6,
          },
        });
        // mobile: scrub the simple vertical line
        gsap.to("#pm-progress-mobile", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "#pm-list",
            start: "top 75%",
            end: "bottom 65%",
            scrub: 0.6,
          },
        });

        // each step: dot ignite, pulse ring, card lift
        gsap.utils.toArray(".pm-step").forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 75%",
            once: true,
            onEnter: () => {
              const dot = step.querySelector(".pm-dot");
              const pulse = step.querySelector(".pm-pulse");
              const card = step.querySelector(".pm-card > div");

              const tl = gsap.timeline();
              tl.to(dot, {
                backgroundColor: "#5b46e8",
                scale: 1.4,
                duration: 0.5,
                ease: "back.out(3)",
              })
                .fromTo(
                  pulse,
                  { scale: 1, opacity: 0.6 },
                  { scale: 4, opacity: 0, duration: 1.2, ease: "power3.out" },
                  "-=0.3"
                )
                .fromTo(
                  card,
                  { y: 20, scale: 0.95, opacity: 0.4 },
                  { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: "expo.out" },
                  "-=1.0"
                );
            },
          });
        });
      }

      /* ── FAQ accordion details: animate maxHeight + chevron rotate ── */
      gsap.utils.toArray("details.faq-item").forEach((el) => {
        const summary = el.querySelector("summary");
        summary?.addEventListener("click", () => {
          // anime.js spring on summary itself
          animate(summary, {
            scale: [1, 0.985, 1],
            duration: 350,
            ease: "outElastic(1, .6)",
          });
        });
      });

      /* ── leverage label rows: nudge in from alternating sides ── */
      ScrollTrigger.batch(".leverage-row", {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.from(els, {
            x: (i) => (i % 2 ? 40 : -40),
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "expo.out",
          }),
      });

      /* ── service / launch row hover: magnetic-ish slide on the bullet ── */
      gsap.utils.toArray(".start-row, .feature-link").forEach((row) => {
        const dot = row.querySelector(".w-1\\.5") || row.querySelector(".feature-arrow");
        if (!dot) return;
        row.addEventListener("mouseenter", () =>
          gsap.to(dot, { scale: 1.6, duration: 0.4, ease: "back.out(2)" })
        );
        row.addEventListener("mouseleave", () =>
          gsap.to(dot, { scale: 1, duration: 0.5, ease: "power3.out" })
        );
      });

      /* ── act-index numbers: glitchy scramble when entering view ── */
      gsap.utils.toArray(".act-index").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          once: true,
          onEnter: () => {
            const target = el.textContent;
            const chars = "0123456789▌█▓░";
            let frame = 0;
            const tick = () => {
              if (frame >= 12) {
                el.textContent = target;
                return;
              }
              el.textContent = Array.from(target)
                .map(() => chars[Math.floor(Math.random() * chars.length)])
                .join("");
              frame++;
              setTimeout(tick, 40);
            };
            tick();
          },
        });
      });
    });

    /* ── TOOLBOX words: each drifts on its own slow loop + colour ripple
          when the section enters. Plays once on arrival, breathes forever. ── */
    const chips = document.querySelectorAll(".toolbox-chip");
    let chipAnim = null;
    if (chips.length) {
      // arrival cascade
      animate(chips, {
        opacity: [0, 1],
        translateY: [22, 0],
        scale: [0.92, 1],
        duration: 700,
        delay: stagger(60),
        ease: "outExpo",
      });
      // breathing
      chipAnim = animate(chips, {
        translateY: () => [0, -5 - Math.random() * 9],
        duration: () => 2400 + Math.random() * 1800,
        delay: stagger(80),
        ease: "inOutSine",
        loop: true,
        alternate: true,
      });
    }

    /* ── hero: cycle the underlined word with an anime.js scramble ── */
    const heroEm = document.querySelector("#intro em");
    let heroCycle = null;
    if (heroEm) {
      const words = ["your business", "your team", "your follow-ups", "your operations", "your inbox"];
      let idx = 0;
      const swap = () => {
        idx = (idx + 1) % words.length;
        const next = words[idx];
        const out = createTimeline()
          .add(heroEm, {
            opacity: [1, 0],
            translateY: [0, -12],
            duration: 350,
            ease: "inExpo",
          })
          .add(
            heroEm,
            {
              opacity: [0, 1],
              translateY: [12, 0],
              duration: 450,
              ease: "outExpo",
              onBegin: () => {
                heroEm.textContent = next;
              },
            },
            "-=100"
          );
      };
      heroCycle = setInterval(swap, 3200);
    }

    /* ── HOVER MAGIC for every "service" link: shimmer the accent dot ── */
    const featureLinks = document.querySelectorAll(".feature-arrow");
    featureLinks.forEach((arrow) => {
      arrow.addEventListener("mouseenter", () => {
        animate(arrow, {
          translateX: [0, 6, 0],
          duration: 600,
          ease: "outElastic(1, .5)",
        });
      });
    });

    return () => {
      chipAnim?.pause?.();
      if (heroCycle) clearInterval(heroCycle);
      ctx.revert();
    };
  }, []);

  return null;
}
