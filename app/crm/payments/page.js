"use client";

import { useMemo, useState } from "react";
import { useCrm } from "@/components/crm/CrmProvider";
import { PageHeader, StatCard, StatusPill, Toolbar, SearchInput, EmptyState, Modal, money, fmtDate } from "@/components/crm/ui";
import PaymentForm from "@/components/crm/PaymentForm";
import { PAYMENT_STATUS, PAYMENT_STATUS_LIST } from "@/lib/crm/constants";

export default function PaymentsPage() {
  const { db, is, visibleStudents, getStudent, setPaymentStatus } = useCrm();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("All");
  const [form, setForm] = useState(null);
  const [view, setView] = useState(null); // screenshot viewer

  const studentIds = new Set(visibleStudents.map((s) => s.id));
  const all = is.admin ? db.payments : db.payments.filter((p) => studentIds.has(p.studentId));

  const rows = useMemo(() => all.filter((p) => {
    const s = getStudent(p.studentId);
    const matchQ = `${s?.name || ""} ${p.regNo} ${p.utr}`.toLowerCase().includes(q.toLowerCase());
    const matchT = tab === "All" || p.status === tab;
    return matchQ && matchT;
  }), [all, q, tab, getStudent]);

  const count = (st) => all.filter((p) => p.status === st).length;
  const pendingTotal = all.filter((p) => p.status === PAYMENT_STATUS.PENDING).reduce((a, p) => a + +p.amount, 0);
  const verifiedTotal = all.filter((p) => [PAYMENT_STATUS.APPROVED, PAYMENT_STATUS.VERIFIED].includes(p.status)).reduce((a, p) => a + +p.amount, 0);

  const reject = (p) => {
    const reason = prompt("Reason for rejection:", p.remarks || "");
    if (reason !== null) setPaymentStatus(p.id, PAYMENT_STATUS.REJECTED, { remarks: reason });
  };

  return (
    <div>
      <PageHeader title="Payments" subtitle={is.admin ? "Review, approve and verify payment entries." : "Submit payment entries with UTR & screenshot for approval."}>
        <button className="crm-btn crm-btn-primary" onClick={() => setForm({})}>+ New Payment</button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending Approval" value={count(PAYMENT_STATUS.PENDING)} hint={money(pendingTotal)} />
        <StatCard label="Approved" value={count(PAYMENT_STATUS.APPROVED)} tone="violet" />
        <StatCard label="Verified" value={count(PAYMENT_STATUS.VERIFIED)} />
        <StatCard label="Collected" value={money(verifiedTotal)} tone="violet" />
      </div>

      <Toolbar>
        <SearchInput value={q} onChange={setQ} placeholder="Search student, reg. no, UTR…" />
        <div className="flex flex-wrap gap-1.5">
          {["All", ...PAYMENT_STATUS_LIST].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`crm-btn !py-1.5 !px-3 text-xs ${tab === t ? "crm-btn-primary" : ""}`}>
              {t}{t !== "All" && count(t) > 0 ? ` ${count(t)}` : ""}
            </button>
          ))}
        </div>
      </Toolbar>

      {rows.length === 0 ? (
        <EmptyState icon="₹" title="No payments" hint="No entries match this view." />
      ) : (
        <div className="crm-card overflow-x-auto">
          <table className="crm-table">
            <thead><tr><th>Student</th><th>Amount</th><th>Mode</th><th>UTR</th><th>Date</th><th>Proof</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {rows.map((p) => {
                const s = getStudent(p.studentId);
                return (
                  <tr key={p.id}>
                    <td><div className="font-medium">{s?.name || "—"}</div><div className="text-xs text-mist">{p.regNo}</div></td>
                    <td className="tabular-nums">{money(p.amount)}</td>
                    <td>{p.mode}</td>
                    <td className="text-mist text-xs">{p.utr || "—"}</td>
                    <td className="text-mist text-xs">{fmtDate(p.txnDate)}</td>
                    <td>{p.screenshot?.data ? <button className="crm-label hover:text-snow underline" onClick={() => setView(p)}>View</button> : <span className="text-mist text-xs">—</span>}</td>
                    <td><StatusPill value={p.status} /></td>
                    <td>
                      <div className="flex gap-1.5 justify-end">
                        {is.admin && p.status === PAYMENT_STATUS.PENDING && (
                          <>
                            <button className="crm-btn crm-btn-primary !px-2.5 !py-1.5 text-xs" onClick={() => setPaymentStatus(p.id, PAYMENT_STATUS.APPROVED)}>Approve</button>
                            <button className="crm-btn crm-btn-danger !px-2.5 !py-1.5 text-xs" onClick={() => reject(p)}>Reject</button>
                          </>
                        )}
                        {is.admin && p.status === PAYMENT_STATUS.APPROVED && (
                          <button className="crm-btn !px-2.5 !py-1.5 text-xs" onClick={() => setPaymentStatus(p.id, PAYMENT_STATUS.VERIFIED)}>Verify</button>
                        )}
                        {[PAYMENT_STATUS.DRAFT, PAYMENT_STATUS.REJECTED].includes(p.status) && (
                          <button className="crm-btn crm-btn-ghost !px-2.5 !py-1.5 text-xs" onClick={() => setForm(p)}>Edit</button>
                        )}
                        {!is.admin && p.status === PAYMENT_STATUS.PENDING && <span className="crm-label">awaiting Prashant</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {form && <PaymentForm open onClose={() => setForm(null)} editing={form.id ? form : null} />}

      {view && (
        <Modal open onClose={() => setView(null)} title={`Payment proof · ${view.regNo}`}>
          <img src={view.screenshot.data} alt="proof" className="w-full rounded-lg border border-[var(--line)]" />
          <div className="mt-3 text-sm text-mist">{view.mode} · {money(view.amount)} · UTR {view.utr}</div>
          {view.remarks && <div className="mt-1 text-sm">Remarks: {view.remarks}</div>}
        </Modal>
      )}
    </div>
  );
}
