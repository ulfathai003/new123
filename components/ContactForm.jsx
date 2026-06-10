"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { COUNTRIES, SITE } from "../lib/data";

gsap.registerPlugin(Physics2DPlugin);

const FIELDS = [
  ["firstName", "First name", "text", "Ada"],
  ["lastName", "Last name", "text", "Lovelace"],
  ["email", "Email address", "email", "ada@company.com"],
  ["phone", "Phone number", "tel", "98765 43210"],
];

export default function ContactForm() {
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "", phone: "", country: null, message: "" });
  const [query, setQuery] = useState("");
  const [openList, setOpenList] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const meterRef = useRef(null);

  /* ── arrival: the form falls into place — gravity, then settle ── */
  useEffect(() => {
    const items = formRef.current?.querySelectorAll(".drop-in");
    if (!items) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(items, { opacity: 1, y: 0, rotation: 0 });
      return;
    }
    gsap.fromTo(
      items,
      { y: -220, opacity: 0, rotation: () => gsap.utils.random(-7, 7) },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "bounce.out",
        delay: 0.5,
      }
    );
  }, []);

  /* ── signal meter: completion is visible, physical feedback ── */
  const completion = useMemo(() => {
    const checks = [
      values.firstName.trim().length > 1,
      values.lastName.trim().length > 1,
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email),
      values.phone.trim().length >= 7,
      !!values.country,
      values.message.trim().length > 10,
    ];
    return checks.filter(Boolean).length / checks.length;
  }, [values]);

  useEffect(() => {
    gsap.to(meterRef.current, { scaleX: completion, duration: 0.8, ease: "elastic.out(1, 0.5)" });
  }, [completion]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return COUNTRIES.filter(([, name, dial]) => name.toLowerCase().includes(q) || dial.includes(q));
  }, [query]);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (values.firstName.trim().length < 2) errs.firstName = "required";
    if (values.lastName.trim().length < 2) errs.lastName = "required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = "valid email required";
    if (values.phone.trim().length < 7) errs.phone = "valid number required";
    if (!values.country) errs.country = "pick a country";
    if (values.message.trim().length <= 10) errs.message = "tell us a little more";
    setErrors(errs);

    if (Object.keys(errs).length) {
      // physical rejection: the form shudders
      gsap.fromTo(formRef.current, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.25)" });
      return;
    }

    // celebration: a storm of signal particles with real gravity
    const rect = formRef.current.getBoundingClientRect();
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("span");
      p.className = "burst-particle";
      p.style.background = ["#5ee6ff", "#7c6cff", "#5ef0b0"][i % 3];
      p.style.left = `${rect.left + rect.width / 2}px`;
      p.style.top = `${rect.top + rect.height / 3}px`;
      document.body.appendChild(p);
      gsap.to(p, {
        duration: 1.4 + Math.random(),
        physics2D: { velocity: 200 + Math.random() * 360, angle: -90 + gsap.utils.random(-70, 70), gravity: 700 },
        opacity: 0,
        ease: "none",
        onComplete: () => p.remove(),
      });
    }
    gsap.to(formRef.current, { scale: 0.97, opacity: 0, duration: 0.5, ease: "power3.in", onComplete: () => setSent(true) });
  };

  if (sent) {
    return (
      <section className="px-6 md:px-10 py-24 text-center">
        <div className="max-w-xl mx-auto border border-snow/10 rounded-[10px] p-12 bg-void-soft/80">
          <p className="display text-4xl mb-4">Signal received.</p>
          <p className="text-mist font-light leading-relaxed mb-8">
            Thank you, {values.firstName}. A human (escorted by an agent) will
            reply within one business day.
          </p>
          <a
            className="draw-link mono-label !text-signal"
            href={`mailto:${SITE.email}?subject=Project enquiry from ${values.firstName} ${values.lastName}&body=${encodeURIComponent(values.message + `\n\n— ${values.firstName} ${values.lastName}\n${values.email} · ${values.country?.[2] ?? ""} ${values.phone} · ${values.country?.[1] ?? ""}`)}`}
          >
            or email us directly →
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 md:px-10 py-16">
      <form ref={formRef} onSubmit={submit} className="max-w-3xl mx-auto" data-speed="0.06" noValidate>
        {/* signal meter */}
        <div className="drop-in mb-10">
          <div className="flex justify-between items-baseline mb-3">
            <p className="mono-label">signal strength</p>
            <p className="mono-label !text-signal tabular-nums">{Math.round(completion * 100)}%</p>
          </div>
          <div className="h-px bg-snow/15">
            <div ref={meterRef} className="h-full bg-signal origin-left scale-x-0" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {FIELDS.map(([key, label, type, ph]) => (
            <div key={key} className={`drop-in ${key === "phone" ? "relative" : ""}`}>
              <label htmlFor={key} className="mono-label block mb-2.5">
                {label}
                {errors[key] && <span className="text-[#ff6e6e] ml-3 normal-case">{errors[key]}</span>}
              </label>
              {key === "phone" ? (
                <div className="flex gap-2">
                  <span className="field !w-auto flex items-center text-snow/60 tabular-nums shrink-0">
                    {values.country?.[2] ?? "+··"}
                  </span>
                  <input id={key} type={type} placeholder={ph} value={values[key]} onChange={set(key)} className="field" autoComplete="tel" />
                </div>
              ) : (
                <input id={key} type={type} placeholder={ph} value={values[key]} onChange={set(key)} className="field" autoComplete={key === "email" ? "email" : "name"} />
              )}
            </div>
          ))}

          {/* searchable country */}
          <div className="drop-in relative md:col-span-2">
            <label htmlFor="country" className="mono-label block mb-2.5">
              Country
              {errors.country && <span className="text-[#ff6e6e] ml-3 normal-case">{errors.country}</span>}
            </label>
            <input
              id="country"
              className="field"
              placeholder="Type to search — India, United States, UAE…"
              value={values.country ? values.country[1] : query}
              onChange={(e) => { setQuery(e.target.value); setValues((v) => ({ ...v, country: null })); setOpenList(true); }}
              onFocus={() => setOpenList(true)}
              onBlur={() => setTimeout(() => setOpenList(false), 150)}
              autoComplete="off"
              role="combobox"
              aria-expanded={openList}
              aria-controls="country-list"
            />
            {openList && !values.country && (
              <ul id="country-list" className="absolute z-20 top-full left-0 right-0 mt-2 max-h-56 overflow-y-auto border border-snow/15 rounded-[10px] bg-void-soft/95 backdrop-blur-md">
                {filtered.length === 0 && <li className="px-4 py-3 text-sm text-mist">No match — try another spelling</li>}
                {filtered.map((c) => (
                  <li key={c[0]}>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2.5 text-sm font-light text-snow/80 hover:bg-snow/5 hover:text-snow flex justify-between"
                      onMouseDown={() => { setValues((v) => ({ ...v, country: c })); setQuery(""); setOpenList(false); }}
                    >
                      {c[1]}
                      <span className="text-snow/40 tabular-nums">{c[2]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="drop-in md:col-span-2">
            <label htmlFor="message" className="mono-label block mb-2.5">
              Message
              {errors.message && <span className="text-[#ff6e6e] ml-3 normal-case">{errors.message}</span>}
            </label>
            <textarea
              id="message"
              rows={5}
              className="field resize-none"
              placeholder="The bottleneck, in your own words…"
              value={values.message}
              onChange={set("message")}
            />
          </div>
        </div>

        <div className="drop-in mt-10 flex justify-center">
          <button type="submit" className="cta" data-magnetic>
            <span className="dot" />
            Transmit {completion === 1 ? "— signal at full strength" : ""}
          </button>
        </div>
      </form>
    </section>
  );
}
