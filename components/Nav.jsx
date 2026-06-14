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

function NavLink({ label, href, active }) {
  const ref = useRef(null);
  const chars = useRef([]);

  useEffect(() => {
    if (!ref.current) return;
    const text = label;
    ref.current.innerHTML = "";
    chars.current = text.split("").map((c) => {
      const span = document.createElement("span");
      span.textContent = c;
      span.style.display = "inline-block";
      ref.current.appendChild(span);
      return { span, original: c };
    });
  }, [label]);

  const onEnter = () => {
    const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    chars.current.forEach((item, i) => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: 1,
        duration: 0.5,
        delay: i * 0.02,
        ease: "none",
        onUpdate: () => {
          if (obj.v < 0.7) {
            item.span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
          } else {
            item.span.textContent = item.original;
          }
        },
      });
    });
  };

  return (
    <Link
      href={href}
      onMouseEnter={onEnter}
      className={`draw-link mono-label transition-colors inline-block ${
        active ? "!text-snow" : "!text-snow/60 hover:!text-snow"
      }`}
    >
      <span ref={ref} className="inline-block" />
    </Link>
  );
}

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
          clipPath: "circle(140% at 92% 6%)", duration: 0.9, ease: "power4.inOut",
        })
        .fromTo(".menu-link", { 
          yPercent: 120, 
          opacity: 0, 
          rotation: 4, 
          scale: 0.9 
        }, {
          yPercent: 0, 
          opacity: 1, 
          rotation: 0, 
          scale: 1, 
          stagger: 0.08, 
          duration: 1.1, 
          ease: "expo.out",
        }, "-=0.4");
    } else {
      gsap.timeline()
        .to(overlay, { clipPath: "circle(0% at 92% 6%)", duration: 0.6, ease: "power4.inOut" })
        .set(overlay, { display: "none" });
    }
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 transition-all duration-500 ${
        scrolled ? "bg-void/80 backdrop-blur-md" : ""
      }`}>
        <Link href="/" className="flex items-baseline gap-3" data-magnetic>
          <span className="display text-lg tracking-tight">
            SOFTI<span className="text-signal">INTEL</span>
          </span>
          <span className="mono-label hidden lg:inline">ai-native agency</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <NavLink key={href} label={label} href={href} active={pathname === href || pathname.startsWith(href + "/")} />
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
