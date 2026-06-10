"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { SERVICES, SITE } from "../lib/data";

gsap.registerPlugin(Draggable);

/* ─── tiny rule-based brain: context-aware, zero backend ─── */
function think(raw, pathname) {
  const q = raw.toLowerCase();

  // service intent — match by slug words, title, or domain keywords
  const KEYWORDS = {
    "ai-agents": ["agent", "autonomous", "bot for", "digital worker"],
    "crm-development": ["crm", "pipeline", "sales tool", "customer manage"],
    "web-development": ["website", "web dev", "webgl", "3d site", "landing"],
    "mobile-apps": ["mobile", "app for", "ios", "android", "booking app"],
    "automation": ["whatsapp", "automat", "workflow", "follow-up", "reminder"],
    "ai-integrations": ["integrat", "llm", "gpt", "claude", "rag", "search", "document"],
    "custom-software": ["custom software", "internal tool", "portal", "inventory", "erp"],
    "digital-transformation": ["transform", "digitis", "digitiz", "moderni", "roadmap"],
  };
  for (const s of SERVICES) {
    const hits = [s.title.toLowerCase(), ...(KEYWORDS[s.slug] || [])];
    if (hits.some((k) => q.includes(k))) {
      return {
        text: `${s.short} ${s.body.split(". ")[0]}.`,
        link: { href: `/services/${s.slug}`, label: `Explore ${s.title} →` },
        chips: ["What does it cost?", "Book a call"],
      };
    }
  }

  if (/price|cost|budget|quote|how much/.test(q))
    return {
      text: "We quote fixed, not hourly — after a short discovery sprint that maps your workflows and finds the highest-leverage build. Most SME engagements start lean and grow only when results land.",
      link: { href: "/contact", label: "Get a fixed quote →" },
      chips: ["Book a call", "What services do you offer?"],
    };

  if (/book|call|meet|schedule|talk|appoint/.test(q))
    return {
      text: "Easiest path: drop your details on the contact page and we'll come back within one business day with times.",
      link: { href: "/contact", label: "Open contact page →" },
      lead: true,
    };

  if (/service|offer|do you do|what can|help/.test(q))
    return {
      text: "Eight disciplines, one team: " + SERVICES.map((s) => s.title).join(", ") + ". Which one is closest to your problem?",
      link: { href: "/services", label: "See all services →" },
      chips: ["AI Agents", "CRM", "WhatsApp automation"],
    };

  if (/who|about|team|softiintel/.test(q))
    return {
      text: "SoftiIntel is an AI-native creative technology agency — designers and engineers who build intelligence into businesses: agents, CRMs, apps and automations.",
      link: { href: "/about", label: "Our story →" },
    };

  // FAQ fallback — search all page FAQs for an overlapping keyword
  const words = q.split(/\W+/).filter((w) => w.length > 4);
  for (const s of SERVICES)
    for (const [question, answer] of s.faqs)
      if (words.some((w) => question.toLowerCase().includes(w)))
        return { text: answer, link: { href: `/services/${s.slug}`, label: `More on ${s.title} →` } };

  // context nudge based on the page they're reading
  const onService = SERVICES.find((s) => pathname.includes(s.slug));
  return {
    text: onService
      ? `Good question — I don't have an exact answer, but you're reading about ${onService.title}, and the humans behind me definitely do. Want to ask them directly?`
      : "I'm a scripted scout, not the full brain — but I can route you. Try asking about a service, pricing, or booking a call.",
    link: { href: "/contact", label: "Ask the team →" },
    chips: ["What services do you offer?", "What does it cost?"],
  };
}

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

export default function ChatBot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    {
      from: "bot",
      text: "Hello — I'm Scout, SoftiIntel's resident agent. Ask me about services, pricing, or what an AI agent could automate in your business.",
      chips: ["What services do you offer?", "What does it cost?", "Book a call"],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const orbRef = useRef(null);
  const panelRef = useRef(null);
  const logRef = useRef(null);
  const awaitingEmail = useRef(false);

  useEffect(() => {
    Draggable.create(orbRef.current, { bounds: window, inertia: false, allowEventDefault: true });
  }, []);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { y: 24, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" }
    );
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      let reply;
      if (awaitingEmail.current && isEmail(text)) {
        awaitingEmail.current = false;
        reply = { text: "Logged — the team will reach out within one business day. Anything else I can scout for you?" };
      } else {
        reply = think(text, pathname);
        if (reply.lead) awaitingEmail.current = true;
        if (awaitingEmail.current && !reply.lead) awaitingEmail.current = false;
        if (reply.lead) reply.text += " Or just drop your email here and we'll reach out.";
      }
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", ...reply }]);
    }, 700 + Math.random() * 500);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[65]">
      {open && (
        <div
          ref={panelRef}
          className="absolute bottom-16 right-0 w-[20.5rem] max-w-[calc(100vw-2.5rem)] h-[26rem] rounded-2xl border border-snow/15 bg-void-soft/95 backdrop-blur-md flex flex-col overflow-clip shadow-2xl shadow-black/60"
        >
          <div className="px-4 py-3 border-b border-snow/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5ef0b0] animate-pulse" />
            <p className="mono-label !text-snow">scout — softiintel agent</p>
          </div>

          <div ref={logRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === "bot" ? "self-start max-w-[88%]" : "self-end max-w-[88%]"}>
                <div
                  className={`text-[13px] font-light leading-relaxed rounded-xl px-3.5 py-2.5 ${
                    m.from === "bot" ? "bg-snow/8 text-snow/90 rounded-bl-sm" : "bg-signal/90 text-void rounded-br-sm"
                  }`}
                >
                  {m.text}
                </div>
                {m.link && (
                  <Link href={m.link.href} className="mono-label !text-signal inline-block mt-2 hover:underline">
                    {m.link.label}
                  </Link>
                )}
                {m.chips && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.chips.map((c) => (
                      <button
                        key={c}
                        onClick={() => send(c)}
                        className="mono-label !text-snow/70 border border-snow/15 rounded-full px-2.5 py-1 hover:border-signal hover:!text-snow"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="self-start bg-snow/8 rounded-xl rounded-bl-sm px-3.5 py-2.5 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-snow/60 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-snow/10 flex"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Scout anything…"
              className="flex-1 bg-transparent px-4 py-3 text-[13px] font-light outline-none placeholder:text-snow/30"
              aria-label="Chat message"
            />
            <button type="submit" className="mono-label !text-signal px-4">send</button>
          </form>
        </div>
      )}

      <button
        ref={orbRef}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with Scout, our AI assistant"}
        className="relative w-13 h-13 md:w-14 md:h-14 rounded-full border border-snow/20 bg-void-soft/90 backdrop-blur flex items-center justify-center group cursor-pointer"
      >
        <span className="absolute inset-0 rounded-full bg-signal/20 blur-md group-hover:bg-signal/40 transition-colors" />
        <span className="relative display text-base text-snow">{open ? "×" : "S"}</span>
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#5ef0b0] border-2 border-void" />
      </button>
    </div>
  );
}
