"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCrm } from "@/components/crm/CrmProvider";
import { PageHeader, StatCard, StatusPill, EmptyState, money } from "@/components/crm/ui";
import { PAYMENT_STATUS } from "@/lib/crm/constants";

export default function CenterDetail() {
  const { id } = useParams();
  const { db, getCenter, getEmployee, getUniversity } = useCrm();
  const center = getCenter(id);

  if (!center) return <EmptyState title="Center not found" hint="It may have been deleted." action={<Link className="crm-btn" href="/crm/centers">← Back to centers</Link>} />;

  const students = db.students.filter((s) => s.centerId === id);
  const studentIds = new Set(students.map((s) => s.id));
  const payments = db.payments.filter((p) => studentIds.has(p.studentId));
  const employees = db.employees.filter((e) => e.assignedCenterIds.includes(id));
  const revenue = payments
    .filter((p) => [PAYMENT_STATUS.APPROVED, PAYMENT_STATUS.VERIFIED].includes(p.status))
    .reduce((s, p) => s + +p.amount, 0);

  return (
    <div>
      <Link href="/crm/centers" className="crm-label hover:text-snow">← Centers</Link>
      <PageHeader title={center.name} subtitle={center.address}>
        <StatusPill value={center.status} />
        {center.personal && <span className="crm-pill tone-violet">Personal</span>}
      </PageHeader>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Students" value={students.length} />
        <StatCard label="Employees" value={employees.length} tone="violet" />
        <StatCard label="Payments" value={payments.length} />
        <StatCard label="Revenue" value={money(revenue)} tone="violet" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <div className="crm-card p-5">
          <h3 className="font-medium mb-4">Center Details</h3>
          <dl className="space-y-2.5 text-sm">
            {[["Owner", center.owner], ["Mobile", center.mobile], ["Email", center.email], ["Address", center.address], ["Status", center.status]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-mist">{k}</dt>
                <dd className="text-right">{v || "—"}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 pt-4 border-t border-[var(--line)]">
            <div className="crm-label mb-2">Assigned employees</div>
            {employees.length === 0 ? <p className="text-mist text-sm">None assigned.</p> : (
              <div className="flex flex-wrap gap-2">
                {employees.map((e) => (
                  <Link key={e.id} href="/crm/employees" className="crm-pill tone-sky">{e.name}</Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="crm-card p-5 lg:col-span-2 overflow-x-auto">
          <h3 className="font-medium mb-4">Students at this center</h3>
          {students.length === 0 ? <p className="text-mist text-sm">No students yet.</p> : (
            <table className="crm-table">
              <thead><tr><th>Student</th><th>Reg. No</th><th>University</th><th>Course</th><th>Status</th></tr></thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td><Link href={`/crm/students/${s.id}`} className="font-medium hover:text-signal">{s.name}</Link></td>
                    <td className="text-mist text-xs">{s.regNo}</td>
                    <td>{getUniversity(s.universityId)?.code || "—"}</td>
                    <td>{s.course}</td>
                    <td><StatusPill value={s.admissionStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
