"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";

/**
 * Live anime.js vignettes — one tiny looping scene per discipline,
 * in the spirit of the anime.js homepage demos but staged with
 * SoftiIntel's own metaphors. Pure DOM + anime.js, no canvas cost.
 */

const dots = (n) => Array.from({ length: n }, (_, i) => i);

function Stage({ children }) {
  return (
    <div className="demo-stage relative h-64 md:h-80 border border-line rounded-[10px] bg-void-soft shadow-sm overflow-clip flex items-center justify-center">
      {children}
    </div>
  );
}

export default function AnimeDemo({ type, accent = "#5b46e8" }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const $ = (sel) => root.querySelectorAll(sel);
    const anims = [];

    switch (type) {
      case "ai-agents": {
        // three agents orbiting the core, each on its own period
        $(".orbit").forEach((el, i) => {
          anims.push(
            animate(el, {
              rotate: 360,
              duration: 5200 + i * 1800,
              ease: "linear",
              loop: true,
            })
          );
        });
        anims.push(
          animate($(".core"), {
            scale: [1, 1.14, 1],
            duration: 2200,
            ease: "inOutQuad",
            loop: true,
          })
        );
        break;
      }
      case "crm-development": {
        // a deal chip travelling the pipeline, columns acknowledging it
        const tl = createTimeline({ loop: true, defaults: { ease: "inOutExpo" } });
        tl.add($(".deal"), { translateX: 0, scale: [0.6, 1], opacity: [0, 1], duration: 500 })
          .add($(".deal"), { translateX: 96, duration: 700 }, "+=500")
          .add($(".deal"), { translateX: 192, duration: 700 }, "+=500")
          .add($(".deal"), { scale: [1, 1.25], background: accent, duration: 450 }, "+=300")
          .add($(".deal"), { opacity: 0, duration: 400 }, "+=600");
        anims.push(tl);
        break;
      }
      case "web-development": {
        // the classic grid stagger — squares breathing from the centre
        anims.push(
          animate($(".cell"), {
            scale: [{ to: 0.45 }, { to: 1 }],
            opacity: [{ to: 0.35 }, { to: 1 }],
            duration: 1400,
            delay: stagger(60, { grid: [7, 4], from: "center" }),
            ease: "inOutQuad",
            loop: true,
            loopDelay: 300,
          })
        );
        break;
      }
      case "mobile-apps": {
        // notifications landing on the device, badge counting up
        const tl = createTimeline({ loop: true });
        tl.add($(".notif"), {
          translateY: [-46, 0],
          opacity: [0, 1],
          duration: 650,
          delay: stagger(900),
          ease: "outElastic(1, .7)",
        })
          .add($(".badge"), { scale: [1, 1.45, 1], duration: 500, ease: "outBack(2)" }, "-=600")
          .add($(".notif"), { opacity: 0, duration: 450, delay: stagger(80) }, "+=900");
        anims.push(tl);
        break;
      }
      case "automation": {
        // a WhatsApp thread answering itself, forever
        const tl = createTimeline({ loop: true });
        tl.add($(".bub-in"), { translateX: [-34, 0], opacity: [0, 1], duration: 520, ease: "outExpo" })
          .add($(".typing span"), { opacity: [0.2, 1], scale: [0.7, 1], duration: 260, delay: stagger(130), loop: 2, alternate: true }, "+=250")
          .add($(".typing"), { opacity: 0, duration: 200 })
          .add($(".bub-out"), { translateX: [34, 0], opacity: [0, 1], duration: 520, ease: "outExpo" })
          .add($(".bub-in, .bub-out"), { opacity: 0, duration: 420 }, "+=1300");
        anims.push(tl);
        break;
      }
      case "ai-integrations": {
        // document lines flying into structured fields
        const tl = createTimeline({ loop: true, defaults: { ease: "inOutExpo" } });
        tl.add($(".doc-line"), { scaleX: [0, 1], duration: 480, delay: stagger(120) })
          .add($(".doc-line"), { translateX: 132, opacity: [1, 0], duration: 620, delay: stagger(100) }, "+=450")
          .add($(".field"), { background: accent + "33", borderColor: accent, duration: 380, delay: stagger(100) }, "-=500")
          .add($(".field"), { background: "transparent", borderColor: "rgba(20,21,26,0.14)", duration: 420 }, "+=900");
        anims.push(tl);
        break;
      }
      case "custom-software": {
        // seven scattered tool-chips collapsing into one platform slab
        const tl = createTimeline({ loop: true, defaults: { ease: "inOutExpo" } });
        tl.add($(".tool"), {
          translateX: () => (Math.random() - 0.5) * 150,
          translateY: () => (Math.random() - 0.5) * 90,
          rotate: () => (Math.random() - 0.5) * 24,
          opacity: [0, 1],
          duration: 600,
          delay: stagger(70),
        })
          .add($(".tool"), { translateX: 0, translateY: 0, rotate: 0, scale: 0.4, opacity: 0.2, duration: 750, delay: stagger(45) }, "+=800")
          .add($(".platform"), { scale: [0.7, 1], opacity: [0, 1], duration: 550, ease: "outBack(1.6)" }, "-=300")
          .add($(".platform"), { opacity: 0, scale: 0.85, duration: 420 }, "+=1300");
        anims.push(tl);
        break;
      }
      case "digital-transformation": {
        // the before/after bars trading places, quarter after quarter
        anims.push(
          animate($(".tbar"), {
            scaleY: (el) => [0.15, parseFloat(el.dataset.h)],
            duration: 1300,
            delay: stagger(140),
            ease: "inOutQuad",
            loop: true,
            alternate: true,
            loopDelay: 500,
          })
        );
        break;
      }
    }

    return () => anims.forEach((a) => a?.pause?.());
  }, [type, accent]);

  /* ── per-scene markup ── */
  return (
    <div ref={ref}>
      {type === "ai-agents" && (
        <Stage>
          <div className="core w-10 h-10 rounded-full" style={{ background: accent }} />
          {[78, 120, 164].map((r, i) => (
            <div key={r} className="orbit absolute rounded-full border border-line" style={{ width: r * 2, height: r * 2 }}>
              <span className="absolute -top-[5px] left-1/2 w-2.5 h-2.5 rounded-full" style={{ background: accent, opacity: 0.85 - i * 0.22 }} />
            </div>
          ))}
        </Stage>
      )}

      {type === "crm-development" && (
        <Stage>
          <div className="flex gap-4">
            {["Enquiry", "Quote", "Won"].map((col) => (
              <div key={col} className="w-20 h-36 border border-line rounded-lg bg-void/40 p-2">
                <p className="mono-label !text-[9px] text-center">{col}</p>
              </div>
            ))}
          </div>
          <span className="deal absolute left-[calc(50%-7.5rem)] top-1/2 w-14 h-8 rounded-md border border-line bg-void-soft shadow-sm" />
        </Stage>
      )}

      {type === "web-development" && (
        <Stage>
          <div className="grid grid-cols-7 gap-2.5">
            {dots(28).map((i) => (
              <span key={i} className="cell w-5 h-5 md:w-6 md:h-6 rounded-[5px]" style={{ background: accent, opacity: 0.9 }} />
            ))}
          </div>
        </Stage>
      )}

      {type === "mobile-apps" && (
        <Stage>
          <div className="relative w-32 h-56 border-2 border-snow/25 rounded-2xl bg-void/30 p-2.5 flex flex-col gap-2">
            <span className="badge absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-mono text-white flex items-center justify-center" style={{ background: accent }}>3</span>
            {dots(3).map((i) => (
              <span key={i} className="notif h-9 rounded-lg border border-line bg-void-soft shadow-sm opacity-0" />
            ))}
          </div>
        </Stage>
      )}

      {type === "automation" && (
        <Stage>
          <div className="flex flex-col gap-3 w-56">
            <span className="bub-in self-start w-36 h-9 rounded-xl rounded-bl-sm border border-line bg-void/40 opacity-0" />
            <span className="typing self-end flex gap-1.5 px-3 py-2.5 rounded-xl rounded-br-sm" style={{ background: accent + "22" }}>
              {dots(3).map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
              ))}
            </span>
            <span className="bub-out self-end w-40 h-9 rounded-xl rounded-br-sm opacity-0" style={{ background: accent, opacity: 0 }} />
          </div>
        </Stage>
      )}

      {type === "ai-integrations" && (
        <Stage>
          <div className="flex items-center gap-10">
            <div className="w-28 h-36 border border-line rounded-lg bg-void/30 p-3 flex flex-col gap-2.5">
              {dots(4).map((i) => (
                <span key={i} className="doc-line h-2 rounded-full origin-left" style={{ background: accent, width: `${88 - i * 14}%` }} />
              ))}
            </div>
            <div className="w-28 h-36 flex flex-col gap-2.5 justify-center">
              {dots(4).map((i) => (
                <span key={i} className="field h-6 rounded-md border border-line" />
              ))}
            </div>
          </div>
        </Stage>
      )}

      {type === "custom-software" && (
        <Stage>
          {dots(7).map((i) => (
            <span key={i} className="tool absolute w-12 h-7 rounded-md border border-line bg-void-soft shadow-sm opacity-0" />
          ))}
          <div className="platform w-40 h-24 rounded-xl border-2 opacity-0 flex items-center justify-center mono-label !text-[9px]" style={{ borderColor: accent, color: accent }}>
            one platform
          </div>
        </Stage>
      )}

      {type === "digital-transformation" && (
        <Stage>
          <div className="flex items-end gap-3.5 h-40">
            {[0.3, 0.5, 0.42, 0.66, 0.82, 1].map((h, i) => (
              <span key={i} className="tbar w-7 h-full rounded-t-md origin-bottom" data-h={h} style={{ background: i >= 4 ? accent : "rgba(20,21,26,0.22)", transform: "scaleY(0.15)" }} />
            ))}
          </div>
        </Stage>
      )}
    </div>
  );
}
