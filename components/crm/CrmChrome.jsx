"use client";

/* ─── Jetro CRM — app chrome: auth gate + hamburger sidebar + topbar ───
   The hamburger is always visible (desktop collapses the rail, mobile opens
   a drawer). Navigation is filtered by the signed-in user's role. */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCrm } from "./CrmProvider";
import { ROLE_LABEL } from "@/lib/crm/constants";

const NAV = [
  { href: "/crm", label: "Dashboard", icon: "▦", roles: ["admin", "center", "employee"], exact: true },
  { href: "/crm/centers", label: "Centers", icon: "⬢", roles: ["admin", "center", "employee"] },
  { href: "/crm/personal-centers", label: "Personal Centers", icon: "★", roles: ["admin"] },
  { href: "/crm/employees", label: "Employees", icon: "♟", roles: ["admin"] },
  { href: "/crm/students", label: "Students", icon: "✦", roles: ["admin", "center", "employee"] },
  { href: "/crm/universities", label: "Universities", icon: "⌂", roles: ["admin"] },
  { href: "/crm/boards", label: "Boards", icon: "▤", roles: ["admin"] },
  { href: "/crm/payments", label: "Payments", icon: "₹", roles: ["admin", "center", "employee"] },
  { href: "/crm/approvals", label: "Approvals", icon: "✓", roles: ["admin"] },
  { href: "/crm/reports", label: "Reports", icon: "◔", roles: ["admin"] },
];

export default function CrmChrome({ children }) {
  const { ready, user, role, logout } = useCrm();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/crm/login";

  const [open, setOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop rail

  // close mobile drawer on route change
  useEffect(() => setOpen(false), [pathname]);

  // auth gate
  useEffect(() => {
    if (ready && !user && !isLogin) router.replace("/crm/login");
  }, [ready, user, isLogin, router]);

  if (!ready) {
    return (
      <div className="crm-root flex items-center justify-center">
        <div className="crm-label animate-pulse">Loading Jetro CRM…</div>
      </div>
    );
  }

  // login page renders bare (no chrome)
  if (isLogin) return <div className="crm-root">{children}</div>;

  if (!user) {
    return (
      <div className="crm-root flex items-center justify-center">
        <div className="crm-label">Redirecting to sign in…</div>
      </div>
    );
  }

  const links = NAV.filter((n) => n.roles.includes(role));
  const isActive = (n) =>
    n.exact ? pathname === n.href : pathname === n.href || pathname.startsWith(n.href + "/");

  return (
    <div className="crm-root flex">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:sticky top-0 z-[90] h-screen shrink-0 border-r border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur
          flex flex-col transition-[width,transform] duration-300
          ${collapsed ? "md:w-[76px]" : "md:w-[252px]"}
          w-[252px] ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center gap-2.5 h-16 px-5 border-b border-[var(--line)]">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--signal)] to-[var(--signal-2)] text-[#04121a] font-bold">
            J
          </span>
          {!collapsed && (
            <div className="leading-tight">
              <div className="display text-base tracking-tight">
                JETRO<span className="text-signal"> CRM</span>
              </div>
              <div className="crm-label !text-[0.58rem]">Education Platform</div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {links.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              data-active={isActive(n)}
              className="crm-nav-link"
              title={n.label}
            >
              <span className="w-5 text-center text-[1.05rem] shrink-0">{n.icon}</span>
              {!collapsed && <span className="truncate">{n.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-[var(--line)]">
          <button
            className="crm-nav-link w-full hidden md:flex"
            onClick={() => setCollapsed((c) => !c)}
            title="Collapse"
          >
            <span className="w-5 text-center">{collapsed ? "»" : "«"}</span>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Main column ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-[70] h-16 flex items-center gap-3 px-4 md:px-7 border-b border-[var(--line)] bg-[var(--void)]/80 backdrop-blur">
          {/* hamburger — always visible */}
          <button
            className="crm-btn crm-btn-ghost !p-2.5"
            aria-label="Toggle menu"
            onClick={() => {
              if (window.matchMedia("(min-width: 768px)").matches) setCollapsed((c) => !c);
              else setOpen((o) => !o);
            }}
          >
            <span className="flex flex-col gap-[3px]">
              <span className="block w-[18px] h-[2px] bg-snow" />
              <span className="block w-[18px] h-[2px] bg-snow" />
              <span className="block w-[18px] h-[2px] bg-snow" />
            </span>
          </button>

          <div className="hidden sm:block crm-label">
            {ROLE_LABEL[role]} workspace
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link href="/" className="crm-btn crm-btn-ghost !px-3 hidden sm:inline-flex" title="Back to website">
              ← Site
            </Link>
            <div className="flex items-center gap-2.5 pl-3 border-l border-[var(--line)]">
              <div className="grid place-items-center w-9 h-9 rounded-full bg-[var(--surface-3)] border border-[var(--line)] font-medium">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="crm-label !text-[0.58rem]">{ROLE_LABEL[role]}</div>
              </div>
              <button className="crm-btn crm-btn-ghost !px-3" onClick={logout} title="Sign out">
                ⎋
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-7 py-6 md:py-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
