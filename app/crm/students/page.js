"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmProvider";
import { PageHeader, StatusPill, Toolbar, SearchInput, EmptyState } from "@/components/crm/ui";
import StudentForm from "@/components/crm/StudentForm";
import { ADMISSION_STAGES, ACADEMIC_YEARS, PAYMENT_STATUS_LIST } from "@/lib/crm/constants";

const EMPTY_FILTERS = { center: "", employee: "", university: "", course: "", admission: "", payment: "", year: "", from: "", to: "" };

export default function StudentsPage() {
  const { db, is, visibleStudents, visibleCenters, getUniversity, getCenter, getEmployee, remove, log } = useCrm();
  const [q, setQ] = useState("");
  const [fl, setFl] = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [form, setForm] = useState(null);

  const setF = (k) => (e) => setFl((p) => ({ ...p, [k]: e.target.value }));

  // latest payment status per student
  const payStatus = useMemo(() => {
    const m = {};
    [...db.payments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).forEach((p) => { m[p.studentId] = p.status; });
    return m;
  }, [db.payments]);

  const courseOpts = useMemo(() => [...new Set(db.students.map((s) => s.course))], [db.students]);
  const centerOpts = is.admin ? db.centers : visibleCenters;

  const rows = useMemo(() => {
    return visibleStudents.filter((s) => {
      if (q && !`${s.name} ${s.regNo} ${s.mobile} ${s.email}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (fl.center && s.centerId !== fl.center) return false;
      if (fl.employee && s.employeeId !== fl.employee) return false;
      if (fl.university && s.universityId !== fl.university) return false;
      if (fl.course && s.course !== fl.course) return false;
      if (fl.admission && s.admissionStatus !== fl.admission) return false;
      if (fl.year && s.academicYear !== fl.year) return false;
      if (fl.payment && (payStatus[s.id] || "—") !== fl.payment) return false;
      if (fl.from && new Date(s.createdAt) < new Date(fl.from)) return false;
      if (fl.to && new Date(s.createdAt) > new Date(fl.to + "T23:59:59")) return false;
      return true;
    });
  }, [visibleStudents, q, fl, payStatus]);

  const activeFilterCount = Object.values(fl).filter(Boolean).length;

  return (
    <div>
      <PageHeader title="Students" subtitle={`${visibleStudents.length} records · ${rows.length} shown`}>
        <button className="crm-btn crm-btn-primary" onClick={() => setForm({})}>+ New Student</button>
      </PageHeader>

      <Toolbar>
        <SearchInput value={q} onChange={setQ} placeholder="Search name, reg. no, mobile…" />
        <button className="crm-btn" onClick={() => setShowFilters((v) => !v)}>
          ⚙ Filters{activeFilterCount ? ` · ${activeFilterCount}` : ""}
        </button>
        {activeFilterCount > 0 && <button className="crm-btn crm-btn-ghost" onClick={() => setFl(EMPTY_FILTERS)}>Clear</button>}
      </Toolbar>

      {showFilters && (
        <div className="crm-card p-4 mb-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select className="crm-input" value={fl.center} onChange={setF("center")}><option value="">All centers</option>{centerOpts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          {is.admin && <select className="crm-input" value={fl.employee} onChange={setF("employee")}><option value="">All employees</option>{db.employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>}
          <select className="crm-input" value={fl.university} onChange={setF("university")}><option value="">All universities</option>{db.universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select>
          <select className="crm-input" value={fl.course} onChange={setF("course")}><option value="">All courses</option>{courseOpts.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="crm-input" value={fl.admission} onChange={setF("admission")}><option value="">All admission stages</option>{ADMISSION_STAGES.map((s) => <option key={s}>{s}</option>)}</select>
          <select className="crm-input" value={fl.payment} onChange={setF("payment")}><option value="">All payment statuses</option>{PAYMENT_STATUS_LIST.map((s) => <option key={s}>{s}</option>)}</select>
          <select className="crm-input" value={fl.year} onChange={setF("year")}><option value="">All academic years</option>{ACADEMIC_YEARS.map((y) => <option key={y}>{y}</option>)}</select>
          <div className="flex gap-2 items-center">
            <input type="date" className="crm-input" value={fl.from} onChange={setF("from")} title="From" />
            <span className="text-mist">–</span>
            <input type="date" className="crm-input" value={fl.to} onChange={setF("to")} title="To" />
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState icon="✦" title="No students match" hint="Try clearing filters or add a new student." />
      ) : (
        <div className="crm-card overflow-x-auto">
          <table className="crm-table">
            <thead><tr><th>Student</th><th>Center</th><th>University</th><th>Course</th><th>Admission</th><th>Payment</th><th></th></tr></thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link href={`/crm/students/${s.id}`} className="font-medium hover:text-signal">{s.name}</Link>
                    <div className="text-xs text-mist">{s.regNo}</div>
                  </td>
                  <td className="text-sm">{getCenter(s.centerId)?.name || "—"}</td>
                  <td>{getUniversity(s.universityId)?.code || "—"}</td>
                  <td>{s.course || "—"}</td>
                  <td><StatusPill value={s.admissionStatus} /></td>
                  <td>{payStatus[s.id] ? <StatusPill value={payStatus[s.id]} /> : <span className="text-mist text-xs">No payment</span>}</td>
                  <td>
                    <div className="flex gap-1.5 justify-end">
                      <button className="crm-btn crm-btn-ghost !px-2.5 !py-1.5 text-xs" onClick={() => setForm(s)}>Edit</button>
                      {is.admin && <button className="crm-btn crm-btn-danger !px-2.5 !py-1.5 text-xs" onClick={() => { if (confirm(`Delete ${s.name}?`)) { remove("students", s.id); log(`Deleted student ${s.name}`); } }}>Delete</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && <StudentForm open onClose={() => setForm(null)} editing={form.id ? form : null} />}
    </div>
  );
}
