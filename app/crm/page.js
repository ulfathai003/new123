"use client";

import Link from "next/link";
import { useCrm } from "@/components/crm/CrmProvider";
import { StatCard, PageHeader, StatusPill, money, fmtDate } from "@/components/crm/ui";
import { PAYMENT_STATUS, ADMISSION_STAGES } from "@/lib/crm/constants";

export default function Dashboard() {
  const { db, role, user, is, visibleCenters, visibleStudents, getUniversity } = useCrm();

  const centers = is.admin ? db.centers : visibleCenters;
  const students = visibleStudents;
  const employees = db.employees;

  // payments scoped to visible students for non-admins
  const studentIds = new Set(students.map((s) => s.id));
  const payments = is.admin ? db.payments : db.payments.filter((p) => studentIds.has(p.studentId));

  const thisMonth = new Date().getMonth();
  const isThisMonth = (iso) => iso && new Date(iso).getMonth() === thisMonth;

  const leads = students.filter((s) => s.admissionStatus !== "Student Active");
  const admissionsThisMonth = students.filter(
    (s) => isThisMonth(s.createdAt) && ["Admission Confirmed", "Student Active"].includes(s.admissionStatus)
  );
  const pendingPay = payments.filter((p) => [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.SUBMITTED].includes(p.status));
  const approvedPay = payments.filter((p) => [PAYMENT_STATUS.APPROVED, PAYMENT_STATUS.VERIFIED].includes(p.status));
  const revenue = approvedPay.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pendingApprovals = db.approvals.filter((a) => a.status === "Pending");

  // university-wise admissions
  const byUni = db.universities
    .map((u) => ({ name: u.code || u.name, count: students.filter((s) => s.universityId === u.id).length }))
    .filter((x) => x.count > 0);
  const maxUni = Math.max(1, ...byUni.map((x) => x.count));

  // admission funnel
  const funnel = ADMISSION_STAGES.map((stage) => ({
    stage,
    count: students.filter((s) => s.admissionStatus === stage).length,
  }));
  const maxFunnel = Math.max(1, ...funnel.map((f) => f.count));

  const cards = [
    { label: "Total Centers", value: centers.length, hint: `${centers.filter((c) => c.status === "Active").length} active`, show: true },
    { label: "Active Centers", value: centers.filter((c) => c.status === "Active").length, tone: "violet", show: true },
    { label: "Total Employees", value: employees.length, tone: "violet", show: is.admin },
    { label: "Total Leads", value: leads.length, hint: "in funnel", show: true },
    { label: "Total Students", value: students.length, tone: "violet", show: true },
    { label: "Admissions This Month", value: admissionsThisMonth.length, show: true },
    { label: "Pending Payments", value: pendingPay.length, tone: "violet", hint: money(pendingPay.reduce((s, p) => s + +p.amount, 0)), show: true },
    { label: "Approved Payments", value: approvedPay.length, show: true },
    { label: "Revenue Collected", value: money(revenue), tone: "violet", show: true },
  ].filter((c) => c.show);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user.name.split(" ")[0]}`}
        subtitle="Live snapshot of your education pipeline."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        {/* university-wise admissions */}
        <div className="crm-card p-5 lg:col-span-1">
          <h3 className="font-medium mb-4">University-wise Admissions</h3>
          <div className="space-y-3">
            {byUni.length === 0 && <p className="text-mist text-sm">No admissions yet.</p>}
            {byUni.map((u) => (
              <div key={u.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{u.name}</span>
                  <span className="text-mist tabular-nums">{u.count}</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--surface-3)] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[var(--signal)] to-[var(--signal-2)]"
                    style={{ width: `${(u.count / maxUni) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* admission funnel */}
        <div className="crm-card p-5 lg:col-span-2">
          <h3 className="font-medium mb-4">Admission Funnel</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-2.5">
            {funnel.map((f) => (
              <div key={f.stage} className="flex items-center gap-2.5">
                <div className="w-1.5 h-7 rounded-full bg-[var(--surface-3)] overflow-hidden flex items-end">
                  <div className="w-full bg-signal" style={{ height: `${(f.count / maxFunnel) * 100}%` }} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-mist truncate">{f.stage}</div>
                  <div className="text-sm font-medium tabular-nums">{f.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        {/* pending approval queue (admin) */}
        {is.admin && (
          <div className="crm-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Pending Approval Queue</h3>
              <Link href="/crm/approvals" className="crm-label hover:text-snow">View all →</Link>
            </div>
            <div className="space-y-2.5">
              {pendingPay.length === 0 && pendingApprovals.length === 0 && (
                <p className="text-mist text-sm">Nothing awaiting approval. 🎉</p>
              )}
              {pendingPay.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate">Payment · {p.regNo}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-mist tabular-nums">{money(p.amount)}</span>
                    <StatusPill value={p.status} />
                  </span>
                </div>
              ))}
              {pendingApprovals.slice(0, 2).map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate">Center assignment request</span>
                  <StatusPill value="Pending" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* recent activity */}
        <div className="crm-card p-5">
          <h3 className="font-medium mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {db.activityLogs.slice(0, 6).map((l) => (
              <div key={l.id} className="flex gap-3 text-sm">
                <span className="text-signal mt-0.5">•</span>
                <div>
                  <div>{l.action}</div>
                  <div className="crm-label !text-[0.58rem] mt-0.5">{l.user} · {fmtDate(l.ts)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
