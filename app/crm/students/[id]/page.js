"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCrm } from "@/components/crm/CrmProvider";
import { PageHeader, StatusPill, EmptyState, money, fmtDate } from "@/components/crm/ui";
import { ADMISSION_STAGES } from "@/lib/crm/constants";

export default function StudentDetail() {
  const { id } = useParams();
  const { db, is, getStudent, getCenter, getEmployee, getUniversity, getBoard, advanceAdmission, log } = useCrm();
  const s = getStudent(id);

  if (!s) return <EmptyState title="Student not found" action={<Link className="crm-btn" href="/crm/students">← Back</Link>} />;

  const uni = getUniversity(s.universityId);
  const fee = uni?.fees.find((fst) => fst.id === s.feeStructureId);
  const payments = db.payments.filter((p) => p.studentId === s.id);
  const paid = payments.filter((p) => ["Approved", "Verified"].includes(p.status)).reduce((a, p) => a + +p.amount, 0);
  const stageIdx = ADMISSION_STAGES.indexOf(s.admissionStatus);
  const isFinal = stageIdx === ADMISSION_STAGES.length - 1;

  return (
    <div>
      <Link href="/crm/students" className="crm-label hover:text-snow">← Students</Link>
      <PageHeader title={s.name} subtitle={`${s.regNo} · ${getCenter(s.centerId)?.name || "—"}`}>
        <StatusPill value={s.admissionStatus} />
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* profile */}
        <div className="crm-card p-5 lg:col-span-1">
          <h3 className="font-medium mb-4">Profile</h3>
          <dl className="space-y-2.5 text-sm">
            {[
              ["Mobile", s.mobile], ["Email", s.email],
              ["Center", getCenter(s.centerId)?.name],
              ["Employee", getEmployee(s.employeeId)?.name || "Unassigned"],
              ["University", uni?.name], ["Board", getBoard(s.boardId) ? `${getBoard(s.boardId).name} — ${getBoard(s.boardId).type}` : "—"],
              ["Course", s.course], ["Academic Year", s.academicYear],
              ["Fee Structure", fee ? `${money(fee.amount)} · ${fee.installments} inst.` : "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4"><dt className="text-mist">{k}</dt><dd className="text-right">{v || "—"}</dd></div>
            ))}
          </dl>
          {fee && (
            <div className="mt-4 pt-4 border-t border-[var(--line)]">
              <div className="flex justify-between text-sm mb-1"><span className="text-mist">Collected</span><span className="tabular-nums">{money(paid)} / {money(fee.amount)}</span></div>
              <div className="h-2 rounded-full bg-[var(--surface-3)] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[var(--signal)] to-[var(--signal-2)]" style={{ width: `${Math.min(100, (paid / fee.amount) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* admission workflow */}
        <div className="crm-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Admission Workflow</h3>
            {!isFinal && (
              <button className="crm-btn crm-btn-primary !py-2 text-xs" onClick={() => { advanceAdmission(s.id); log(`Advanced ${s.name} to next stage`); }}>
                Advance to next stage →
              </button>
            )}
          </div>
          <ol className="space-y-0">
            {ADMISSION_STAGES.map((stage, i) => {
              const done = i < stageIdx, current = i === stageIdx;
              return (
                <li key={stage} className="flex items-start gap-3 pb-3 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className={`grid place-items-center w-5 h-5 rounded-full text-[10px] ${done ? "bg-signal text-[#04121a]" : current ? "bg-[var(--signal-2)] text-white" : "bg-[var(--surface-3)] text-mist"}`}>
                      {done ? "✓" : i + 1}
                    </span>
                    {i < ADMISSION_STAGES.length - 1 && <span className={`w-px h-5 ${done ? "bg-signal" : "bg-[var(--line)]"}`} />}
                  </div>
                  <span className={`text-sm pt-0.5 ${current ? "text-snow font-medium" : done ? "text-snow/70" : "text-mist"}`}>{stage}{current && " ← current"}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* payments + documents */}
      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        <div className="crm-card p-5 lg:col-span-2 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Payment History</h3>
            <Link href="/crm/payments" className="crm-label hover:text-snow">Manage →</Link>
          </div>
          {payments.length === 0 ? <p className="text-mist text-sm">No payments recorded.</p> : (
            <table className="crm-table">
              <thead><tr><th>Date</th><th>Amount</th><th>Mode</th><th>UTR</th><th>Status</th></tr></thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="text-mist text-xs">{fmtDate(p.txnDate)}</td>
                    <td className="tabular-nums">{money(p.amount)}</td>
                    <td>{p.mode}</td>
                    <td className="text-mist text-xs">{p.utr || "—"}</td>
                    <td><StatusPill value={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="crm-card p-5">
          <h3 className="font-medium mb-4">Documents</h3>
          {(s.documents || []).length === 0 ? <p className="text-mist text-sm">No documents uploaded.</p> : (
            <div className="space-y-2">
              {s.documents.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><span className="text-signal">▤</span>{d.name}</span>
                  <span className="crm-pill tone-rock">{d.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
