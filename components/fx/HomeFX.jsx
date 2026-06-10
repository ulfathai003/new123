"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Home choreography: vertical scroll drives a horizontal journey.
 * Desktop pins the track and scrubs it sideways; every panel's
 * content is revealed by its position on the track (containerAnimation),
 * not the viewport. Mobile gets an honest vertical flow.
 */
export default function HomeFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(".h-reveal", { opacity: 1, y: 0 });
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const track = document.getElementById("journey-track");
      const distance = () => track.scrollWidth - window.innerWidth;

      const drive = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: "#journey",
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set("#journey-rail-fill", { scaleX: self.progress });
          },
        },
      });

      // horizontal parallax — [data-px] layers drift at their own rate
      // while their panel traverses, so every slide has visible depth
      gsap.utils.toArray("#journey-track [data-px]").forEach((el) => {
        const depth = parseFloat(el.dataset.px) || 0.3;
        gsap.fromTo(
          el,
          { x: depth * 180 },
          {
            x: -depth * 180,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              containerAnimation: drive,
              start: "left right",
              end: "right left",
              scrub: 0.5,
            },
          }
        );
      });

      // panel content surfaces as its slide enters from the right
      gsap.utils.toArray("#journey-track .h-reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            containerAnimation: drive,
            start: "left 80%",
            once: true,
          },
        });
      });

      // stats count up when the proof panel slides in
      gsap.utils.toArray("[data-hcount]").forEach((el) => {
        const target = parseFloat(el.dataset.hcount);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, containerAnimation: drive, start: "left 85%", once: true },
          onUpdate: () =>
            (el.textContent = Math.round(obj.v).toLocaleString() + (el.dataset.suffix || "")),
        });
      });

      // capability cards: depth tilt toward the cursor
      const cards = gsap.utils.toArray(".svc-card");
      const cleanups = cards.map((card) => {
        const rx = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
        const ry = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
        gsap.set(card, { transformPerspective: 700 });
        const move = (e) => {
          const r = card.getBoundingClientRect();
          rx(((e.clientX - r.left) / r.width - 0.5) * 10);
          ry(-((e.clientY - r.top) / r.height - 0.5) * 10);
        };
        const leave = () => { rx(0); ry(0); };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        return () => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        };
      });

      return () => cleanups.forEach((fn) => fn());
    });

    /* mobile: plain vertical reveals, counters on viewport entry */
    mm.add("(max-width: 767px)", () => {
      gsap.utils.toArray(".h-reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 1, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      gsap.utils.toArray("[data-hcount]").forEach((el) => {
        const target = parseFloat(el.dataset.hcount);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 2, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () =>
            (el.textContent = Math.round(obj.v).toLocaleString() + (el.dataset.suffix || "")),
        });
      });
    });

    return () => mm.revert();
  }, []);

  return null;
}
