"use client";

/* ─── Jetro CRM — shared presentational primitives ─── */

import { useEffect } from "react";
import { STATUS_TONE } from "@/lib/crm/constants";

export function StatusPill({ value, tone }) {
  const t = tone || STATUS_TONE[value] || "rock";
  return <span className={`crm-pill tone-${t}`}>{value}</span>;
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
      <div>
        <h1 className="display text-2xl md:text-3xl tracking-tight">{title}</h1>
        {subtitle && <p className="text-mist text-sm mt-1.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2.5">{children}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, tone = "signal", icon }) {
  return (
    <div className="crm-card p-5 relative overflow-hidden">
      <div
        className="absolute -right-6 -top-8 w-24 h-24 rounded-full blur-2xl opacity-30"
        style={{ background: tone === "signal" ? "var(--signal)" : "var(--signal-2)" }}
      />
      <div className="flex items-start justify-between">
        <span className="crm-label">{label}</span>
        {icon && <span className="text-lg opacity-70">{icon}</span>}
      </div>
      <div className="mt-3 text-3xl font-medium tracking-tight tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-mist">{hint}</div>}
    </div>
  );
}

export function Field({ label, hint, children, required }) {
  return (
    <label className="block">
      <span className="crm-label block mb-1.5">
        {label} {required && <span className="text-signal">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-mist mt-1">{hint}</span>}
    </label>
  );
}

export function Modal({ open, onClose, title, children, footer, wide }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center p-4 md:p-8 overflow-y-auto"
      style={{ background: "rgba(4,5,8,0.72)", backdropFilter: "blur(6px)" }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className={`crm-card w-full ${wide ? "max-w-3xl" : "max-w-lg"} my-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
          <h2 className="text-lg font-medium">{title}</h2>
          <button className="crm-btn crm-btn-ghost !p-2" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[var(--line)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ icon = "◎", title, hint, action }) {
  return (
    <div className="crm-card p-12 text-center">
      <div className="text-4xl opacity-40 mb-3">{icon}</div>
      <p className="text-snow font-medium">{title}</p>
      {hint && <p className="text-mist text-sm mt-1.5 max-w-sm mx-auto">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Toolbar({ children }) {
  return <div className="flex flex-wrap items-center gap-2.5 mb-5">{children}</div>;
}

export function SearchInput({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="relative flex-1 min-w-[180px] max-w-xs">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mist text-sm">⌕</span>
      <input
        className="crm-input !pl-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function money(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

export function fmtDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}
