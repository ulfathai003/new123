"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCrm } from "@/components/crm/CrmProvider";
import { PageHeader, EmptyState, Modal, Field, StatusPill, money } from "@/components/crm/ui";
import { ACADEMIC_YEARS } from "@/lib/crm/constants";

export default function UniversityDetail() {
  const { id } = useParams();
  const { db, is, update, log } = useCrm();
  const uni = db.universities.find((u) => u.id === id);
  const [courseName, setCourseName] = useState("");
  const [feeForm, setFeeForm] = useState(null);

  if (!uni) return <EmptyState title="University not found" action={<Link className="crm-btn" href="/crm/universities">← Back</Link>} />;

  const saveUni = (patch) => update("universities", uni.id, patch);
  const courseLabel = (cid) => uni.courses.find((c) => c.id === cid)?.name || "—";

  const addCourse = () => {
    if (!courseName.trim()) return;
    saveUni({ courses: [...uni.courses, { id: `crs-${Date.now()}`, name: courseName.trim() }] });
    log(`Added course ${courseName} to ${uni.name}`);
    setCourseName("");
  };
  const removeCourse = (cid) => saveUni({ courses: uni.courses.filter((c) => c.id !== cid), fees: uni.fees.filter((f) => f.courseId !== cid) });

  const saveFee = (data) => {
    if (data.id) saveUni({ fees: uni.fees.map((f) => (f.id === data.id ? data : f)) });
    else saveUni({ fees: [...uni.fees, { ...data, id: `fee-${Date.now()}` }] });
    log(`${data.id ? "Updated" : "Added"} fee for ${uni.name}`);
    setFeeForm(null);
  };

  return (
    <div>
      <Link href="/crm/universities" className="crm-label hover:text-snow">← Universities</Link>
      <PageHeader title={uni.name} subtitle={`Code ${uni.code} · ${uni.courses.length} courses · ${uni.fees.length} fee plans`}>
        <span className="crm-pill tone-violet">{uni.code}</span>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* courses */}
        <div className="crm-card p-5">
          <h3 className="font-medium mb-4">Courses</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {uni.courses.length === 0 && <span className="text-mist text-sm">No courses yet.</span>}
            {uni.courses.map((c) => (
              <span key={c.id} className="crm-pill tone-sky gap-2">{c.name}
                {is.admin && <button onClick={() => removeCourse(c.id)} title="Remove">✕</button>}
              </span>
            ))}
          </div>
          {is.admin && (
            <div className="flex gap-2">
              <input className="crm-input" placeholder="Add course (e.g. BA)" value={courseName} onChange={(e) => setCourseName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCourse()} />
              <button className="crm-btn crm-btn-primary" onClick={addCourse}>+</button>
            </div>
          )}
        </div>

        {/* fee structures */}
        <div className="crm-card p-5 lg:col-span-2 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Year-wise Fee Structures</h3>
            {is.admin && <button className="crm-btn crm-btn-primary !py-2 text-xs" disabled={uni.courses.length === 0} onClick={() => setFeeForm({ courseId: uni.courses[0]?.id, year: "2026", amount: 20000, installments: 2, editable: true })}>+ Add Fee Plan</button>}
          </div>
          {uni.fees.length === 0 ? <p className="text-mist text-sm">No fee plans yet. Add courses, then create fee plans.</p> : (
            <table className="crm-table">
              <thead><tr><th>Course</th><th>Year</th><th>Amount</th><th>Installments</th><th>Editable</th>{is.admin && <th></th>}</tr></thead>
              <tbody>
                {uni.fees.map((f) => (
                  <tr key={f.id}>
                    <td className="font-medium">{courseLabel(f.courseId)}</td>
                    <td>{f.year}</td>
                    <td className="tabular-nums">{money(f.amount)}</td>
                    <td className="tabular-nums">{f.installments} × {money(Math.round(f.amount / f.installments))}</td>
                    <td>{f.editable ? <StatusPill value="Editable" tone="emerald" /> : <StatusPill value="Locked" tone="rock" />}</td>
                    {is.admin && (
                      <td><div className="flex gap-1.5 justify-end">
                        <button className="crm-btn crm-btn-ghost !px-2.5 !py-1.5 text-xs" disabled={!f.editable} onClick={() => setFeeForm(f)}>Edit</button>
                        <button className="crm-btn crm-btn-danger !px-2.5 !py-1.5 text-xs" onClick={() => saveUni({ fees: uni.fees.filter((x) => x.id !== f.id) })}>Delete</button>
                      </div></td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {feeForm && (
        <Modal open onClose={() => setFeeForm(null)} title={feeForm.id ? "Edit Fee Plan" : "New Fee Plan"}
          footer={<><button className="crm-btn crm-btn-ghost" onClick={() => setFeeForm(null)}>Cancel</button><button className="crm-btn crm-btn-primary" onClick={() => saveFee(feeForm)}>Save</button></>}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Course" required>
              <select className="crm-input" value={feeForm.courseId} onChange={(e) => setFeeForm((f) => ({ ...f, courseId: e.target.value }))}>
                {uni.courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Academic year">
              <select className="crm-input" value={feeForm.year} onChange={(e) => setFeeForm((f) => ({ ...f, year: e.target.value }))}>{ACADEMIC_YEARS.map((y) => <option key={y}>{y}</option>)}</select>
            </Field>
            <Field label="Total amount (₹)"><input type="number" className="crm-input" value={feeForm.amount} onChange={(e) => setFeeForm((f) => ({ ...f, amount: +e.target.value }))} /></Field>
            <Field label="Installments"><input type="number" min={1} className="crm-input" value={feeForm.installments} onChange={(e) => setFeeForm((f) => ({ ...f, installments: Math.max(1, +e.target.value) }))} /></Field>
            <label className="flex items-center gap-2.5 sm:col-span-2 text-sm cursor-pointer">
              <input type="checkbox" checked={feeForm.editable} onChange={(e) => setFeeForm((f) => ({ ...f, editable: e.target.checked }))} />
              Allow this fee structure to be edited later (BLESS-style editable)
            </label>
          </div>
        </Modal>
      )}
    </div>
  );
}
