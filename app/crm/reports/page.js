"use client";

import { useCrm } from "@/components/crm/CrmProvider";
import { PageHeader, StatCard, EmptyState, money } from "@/components/crm/ui";
import { ADMISSION_STAGES, PAYMENT_STATUS } from "@/lib/crm/constants";

function Bar({ label, value, max, suffix }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1"><span className="truncate">{label}</span><span className="text-mist tabular-nums">{suffix || value}</span></div>
      <div className="h-2 rounded-full bg-[var(--surface-3)] overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-[var(--signal)] to-[var(--signal-2)]" style={{ width: `${(value / Math.max(1, max)) * 100}%` }} />
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const { db, is, resetDemo } = useCrm();
  if (!is.admin) return <EmptyState icon="◔" title="Restricted" hint="Reports are admin-only." />;

  const approved = (p) => [PAYMENT_STATUS.APPROVED, PAYMENT_STATUS.VERIFIED].includes(p.status);
  const revenue = db.payments.filter(approved).reduce((a, p) => a + +p.amount, 0);

  // center performance
  const centerPerf = db.centers.filter((c) => !c.personal).map((c) => {
    const sids = new Set(db.students.filter((s) => s.centerId === c.id).map((s) => s.id));
    const rev = db.payments.filter((p) => sids.has(p.studentId) && approved(p)).reduce((a, p) => a + +p.amount, 0);
    return { name: c.name, students: sids.size, rev };
  }).sort((a, b) => b.rev - a.rev).slice(0, 8);
  const maxCenterRev = Math.max(...centerPerf.map((c) => c.rev), 1);

  // employee performance
  const empPerf = db.employees.map((e) => ({
    name: e.name,
    students: db.students.filter((s) => s.employeeId === e.id).length,
    confirmed: db.students.filter((s) => s.employeeId === e.id && ["Admission Confirmed", "Student Active"].includes(s.admissionStatus)).length,
  })).sort((a, b) => b.students - a.students);
  const maxEmp = Math.max(...empPerf.map((e) => e.students), 1);

  // university admissions
  const uniAdm = db.universities.map((u) => ({ name: u.code || u.name, count: db.students.filter((s) => s.universityId === u.id).length })).sort((a, b) => b.count - a.count);
  const maxUni = Math.max(...uniAdm.map((u) => u.count), 1);

  // fee collection by status
  const byStatus = ["Draft", "Submitted", "Pending Approval", "Approved", "Rejected", "Verified"].map((st) => ({
    st, amount: db.payments.filter((p) => p.status === st).reduce((a, p) => a + +p.amount, 0),
  }));
  const maxStatus = Math.max(...byStatus.map((b) => b.amount), 1);

  // funnel
  const funnel = ADMISSION_STAGES.map((stage) => ({ stage, count: db.students.filter((s) => s.admissionStatus === stage).length }));
  const maxFunnel = Math.max(...funnel.map((f) => f.count), 1);

  return (
    <div>
      <PageHeader title="Reports" subtitle="Performance, admissions, collections and funnel analytics.">
        <button className="crm-btn crm-btn-danger" onClick={() => { if (confirm("Reset all demo data to seed and sign out?")) resetDemo(); }}>↺ Reset demo data</button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Revenue Collected" value={money(revenue)} />
        <StatCard label="Total Students" value={db.students.length} tone="violet" />
        <StatCard label="Confirmed Admissions" value={db.students.filter((s) => ["Admission Confirmed", "Student Active"].includes(s.admissionStatus)).length} />
        <StatCard label="Pending Approvals" value={db.payments.filter((p) => p.status === PAYMENT_STATUS.PENDING).length} tone="violet" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="crm-card p-5">
          <h3 className="font-medium mb-4">Center Performance — Revenue</h3>
          <div className="space-y-3">
            {centerPerf.map((c) => <Bar key={c.name} label={`${c.name} (${c.students})`} value={c.rev} max={maxCenterRev} suffix={money(c.rev)} />)}
          </div>
        </div>

        <div className="crm-card p-5">
          <h3 className="font-medium mb-4">Employee Performance — Leads</h3>
          <div className="space-y-3">
            {empPerf.map((e) => <Bar key={e.name} label={`${e.name} · ${e.confirmed} confirmed`} value={e.students} max={maxEmp} />)}
          </div>
        </div>

        <div className="crm-card p-5">
          <h3 className="font-medium mb-4">University Admissions</h3>
          <div className="space-y-3">{uniAdm.map((u) => <Bar key={u.name} label={u.name} value={u.count} max={maxUni} />)}</div>
        </div>

        <div className="crm-card p-5">
          <h3 className="font-medium mb-4">Fee Collection by Status</h3>
          <div className="space-y-3">{byStatus.map((b) => <Bar key={b.st} label={b.st} value={b.amount} max={maxStatus} suffix={money(b.amount)} />)}</div>
        </div>

        <div className="crm-card p-5 lg:col-span-2">
          <h3 className="font-medium mb-4">Admission Funnel</h3>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
            {funnel.map((f) => <Bar key={f.stage} label={f.stage} value={f.count} max={maxFunnel} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
