"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import MagneticButton from "./MagneticButton";

const LINKS = [
  ["About", "/about"],
  ["Services", "/services"],
  ["AI Agents", "/ai-agents"],
  ["Work", "/work"],
  ["Contact", "/contact"],
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const overlayRef = useRef(null);

  /* fullscreen menu choreography */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    if (open) {
      gsap.timeline()
        .set(overlay, { display: "flex" })
        .fromTo(overlay, { clipPath: "circle(0% at 92% 6%)" }, {
          clipPath: "circle(140% at 92% 6%)", duration: 0.8, ease: "power4.inOut",
        })
        .fromTo(".menu-link", { yPercent: 120, opacity: 0 }, {
          yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: "expo.out",
        }, "-=0.3");
    } else {
      gsap.timeline()
        .to(overlay, { clipPath: "circle(0% at 92% 6%)", duration: 0.6, ease: "power4.inOut" })
        .set(overlay, { display: "none" });
    }
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 mix-blend-difference">
        <Link href="/" className="flex items-baseline gap-3" data-magnetic>
          <span className="display text-lg tracking-tight">
            SOFTI<span className="text-signal">INTEL</span>
          </span>
          <span className="mono-label hidden lg:inline">ai-native agency</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`draw-link mono-label transition-colors ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "!text-snow"
                  : "!text-snow/60 hover:!text-snow"
              }`}
            >
              {label}
            </Link>
          ))}
          <MagneticButton href="/contact" className="cta !py-2.5 !px-5">
            <span className="dot" />
            Start a project
          </MagneticButton>
        </nav>

        <button
          className="md:hidden mono-label !text-snow p-2"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Menu"
        >
          {open ? "close" : "menu"}
        </button>
      </header>

      {/* fullscreen mobile menu */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 bg-void-soft hidden flex-col justify-center px-8 gap-2"
      >
        {[["Home", "/"], ...LINKS].map(([label, href], i) => (
          <div key={href} className="overflow-clip">
            <Link
              href={href}
              className="menu-link block display text-5xl py-2 text-snow/90"
            >
              <span className="mono-label !text-signal mr-4">{String(i).padStart(2, "0")}</span>
              {label}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
