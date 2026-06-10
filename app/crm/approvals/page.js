"use client";

import { useCrm } from "@/components/crm/CrmProvider";
import { PageHeader, StatCard, StatusPill, EmptyState, money, fmtDate } from "@/components/crm/ui";
import { PAYMENT_STATUS } from "@/lib/crm/constants";

export default function ApprovalsPage() {
  const { db, is, getCenter, getEmployee, getStudent, approveAssignment, rejectAssignment, setPaymentStatus } = useCrm();

  if (!is.admin) return <EmptyState icon="✓" title="Restricted" hint="The approval queue is Prashant's (admin) responsibility." />;

  const assignPending = db.approvals.filter((a) => a.status === "Pending");
  const payPending = db.payments.filter((p) => p.status === PAYMENT_STATUS.PENDING);

  const reject = (p) => { const r = prompt("Reason for rejection:"); if (r !== null) setPaymentStatus(p.id, PAYMENT_STATUS.REJECTED, { remarks: r }); };

  return (
    <div>
      <PageHeader title="Approval Queue" subtitle="Center assignments and payments awaiting Prashant's review." />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Assignment Requests" value={assignPending.length} />
        <StatCard label="Payments Pending" value={payPending.length} tone="violet" hint={money(payPending.reduce((a, p) => a + +p.amount, 0))} />
        <StatCard label="Total in Queue" value={assignPending.length + payPending.length} />
      </div>

      {/* assignments */}
      <h3 className="font-medium mb-3">Center Assignment Requests</h3>
      {assignPending.length === 0 ? (
        <div className="crm-card p-6 mb-8 text-mist text-sm">No assignment requests pending.</div>
      ) : (
        <div className="crm-card overflow-x-auto mb-8">
          <table className="crm-table">
            <thead><tr><th>Employee</th><th>Center</th><th>Requested</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {assignPending.map((a) => (
                <tr key={a.id}>
                  <td className="font-medium">{getEmployee(a.employeeId)?.name || a.employeeId}</td>
                  <td>{getCenter(a.centerId)?.name || a.centerId}</td>
                  <td className="text-mist text-xs">{fmtDate(a.createdAt)}</td>
                  <td><StatusPill value="Pending" /></td>
                  <td><div className="flex gap-1.5 justify-end">
                    <button className="crm-btn crm-btn-primary !px-2.5 !py-1.5 text-xs" onClick={() => approveAssignment(a.id)}>Approve</button>
                    <button className="crm-btn crm-btn-danger !px-2.5 !py-1.5 text-xs" onClick={() => rejectAssignment(a.id)}>Reject</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* payments */}
      <h3 className="font-medium mb-3">Payments Pending Approval</h3>
      {payPending.length === 0 ? (
        <div className="crm-card p-6 text-mist text-sm">No payments pending approval.</div>
      ) : (
        <div className="crm-card overflow-x-auto">
          <table className="crm-table">
            <thead><tr><th>Student</th><th>Amount</th><th>UTR</th><th>Mode</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {payPending.map((p) => (
                <tr key={p.id}>
                  <td><div className="font-medium">{getStudent(p.studentId)?.name || "—"}</div><div className="text-xs text-mist">{p.regNo}</div></td>
                  <td className="tabular-nums">{money(p.amount)}</td>
                  <td className="text-mist text-xs">{p.utr || "—"}</td>
                  <td>{p.mode}</td>
                  <td className="text-mist text-xs">{fmtDate(p.txnDate)}</td>
                  <td><div className="flex gap-1.5 justify-end">
                    <button className="crm-btn crm-btn-primary !px-2.5 !py-1.5 text-xs" onClick={() => setPaymentStatus(p.id, PAYMENT_STATUS.APPROVED)}>Approve</button>
                    <button className="crm-btn crm-btn-danger !px-2.5 !py-1.5 text-xs" onClick={() => reject(p)}>Reject</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
