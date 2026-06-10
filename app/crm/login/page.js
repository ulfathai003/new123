"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmProvider";
import { Field } from "@/components/crm/ui";
import QuickJump from "@/components/crm/QuickJump";

const DEMO = [
  { label: "Admin · Prashant", id: "prashant@jetro.in", pw: "admin123" },
  { label: "Center User", id: "ravi@center.in", pw: "center123" },
  { label: "Employee", id: "anita@jetro.in", pw: "emp123" },
];

export default function LoginPage() {
  const { ready, user, login } = useCrm();
  const router = useRouter();
  const [mode, setMode] = useState("email"); // 'email' | 'mobile'
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // already signed in → straight to dashboard
  useEffect(() => {
    if (ready && user) router.replace("/crm");
  }, [ready, user, router]);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = login(identifier, password);
    if (res.ok) router.replace("/crm");
    else {
      setError(res.error);
      setBusy(false);
    }
  };

  const quick = (d) => {
    setError("");
    const res = login(d.id, d.pw);
    if (res.ok) router.replace("/crm");
    else setError(res.error);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── brand panel ── */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-[var(--line)]">
        <div className="absolute inset-0 -z-10 opacity-90"
          style={{ background: "radial-gradient(900px 500px at 20% 10%, rgba(94,230,255,0.10), transparent 60%), radial-gradient(700px 500px at 90% 90%, rgba(124,108,255,0.12), transparent 60%)" }} />
        <Link href="/" className="flex items-center gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--signal)] to-[var(--signal-2)] text-[#04121a] font-bold text-lg">J</span>
          <span className="display text-xl tracking-tight">JETRO<span className="text-signal"> CRM</span></span>
        </Link>
        <div>
          <h1 className="display text-4xl xl:text-5xl leading-[1.04] tracking-tight">
            The operating system for<br /><span className="text-signal">education admissions.</span>
          </h1>
          <p className="text-mist mt-5 max-w-md">
            Centers, employees, students, universities, boards and payments —
            one approval-driven workflow, from lead to confirmed admission.
          </p>
          <ul className="mt-8 space-y-2.5 text-sm text-snow/80">
            {["Role-based access for Admin, Centers & Employees", "UTR-backed payments with Prashant approval", "Year-wise editable fee structures & installments"].map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="text-signal">◆</span> {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="crm-label">© {new Date().getFullYear()} Jetro · Powered by SoftiIntel</p>
      </div>

      {/* ── form panel ── */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--signal)] to-[var(--signal-2)] text-[#04121a] font-bold text-lg">J</span>
            <span className="display text-xl tracking-tight">JETRO<span className="text-signal"> CRM</span></span>
          </div>

          <h2 className="display text-3xl tracking-tight text-center">Welcome back</h2>
          <p className="text-mist text-sm text-center mt-2 mb-7">Sign in to your workspace</p>

          {/* mobile / email toggle */}
          <div className="flex p-1 rounded-xl bg-[var(--surface-3)] border border-[var(--line)] mb-5">
            {[["email", "Email"], ["mobile", "Mobile"]].map(([m, lbl]) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setIdentifier(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                  mode === m ? "bg-[var(--surface)] text-snow shadow" : "text-mist"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Field label={mode === "email" ? "Email address" : "Mobile number"} required>
              <input
                className="crm-input"
                type={mode === "email" ? "email" : "tel"}
                inputMode={mode === "email" ? "email" : "numeric"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={mode === "email" ? "you@jetro.in" : "9000000001"}
                autoComplete="username"
                required
              />
            </Field>

            <Field label="Password" required>
              <div className="relative">
                <input
                  className="crm-input !pr-16"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 crm-label hover:text-snow"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </Field>

            {error && (
              <div className="crm-pill tone-rose !w-full !justify-center !py-2">{error}</div>
            )}

            <button className="crm-btn crm-btn-primary w-full !py-3" disabled={busy}>
              {busy ? "Signing in…" : "Sign in →"}
            </button>
          </form>

          {/* demo quick-login */}
          <div className="mt-6">
            <p className="crm-label text-center mb-2.5">Demo accounts — one tap</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO.map((d) => (
                <button key={d.id} onClick={() => quick(d)} className="crm-btn !px-2 !text-xs flex-col !gap-0.5 !py-2.5">
                  {d.label.split(" · ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* university / board quick redirect */}
          <div className="mt-8 pt-6 border-t border-[var(--line)]">
            <p className="crm-label text-center mb-3">Browse directly</p>
            <QuickJump />
          </div>
        </div>
      </div>
    </div>
  );
}
