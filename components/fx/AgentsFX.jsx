"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/** AI Agents page: work-tokens orbit the flow diagram on real motion paths. */
export default function AgentsFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".flow-token").forEach((token, i) => {
        gsap.to(token, {
          motionPath: { path: token.dataset.path, align: token.dataset.path, alignOrigin: [0.5, 0.5] },
          duration: 2.4 + i * 0.3,
          delay: i * 0.5,
          repeat: -1,
          repeatDelay: 0.4,
          ease: "power1.inOut",
          scrollTrigger: { trigger: "#agent-flow", start: "top 85%", toggleActions: "play pause resume pause" },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return null;
}
