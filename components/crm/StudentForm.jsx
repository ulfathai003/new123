"use client";

import { useMemo, useState } from "react";
import { useCrm } from "./CrmProvider";
import { Modal, Field, money } from "./ui";
import { ACADEMIC_YEARS, ADMISSION_STAGES, ROLES } from "@/lib/crm/constants";

export default function StudentForm({ open, onClose, editing }) {
  const { db, user, role, add, update, log, visibleCenters } = useCrm();

  const defaultCenter = role === ROLES.CENTER ? user.centerId : "";
  const defaultEmp = role === ROLES.EMPLOYEE ? user.employeeId : "";

  const [f, setF] = useState(
    editing || {
      name: "", mobile: "", email: "", regNo: "",
      centerId: defaultCenter, employeeId: defaultEmp,
      universityId: "", boardId: "", course: "", academicYear: "2026",
      feeStructureId: "", admissionStatus: "Lead Created", documents: [],
    }
  );
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  // center options by role
  const centerOpts = role === ROLES.ADMIN ? db.centers : visibleCenters;
  const empOpts = role === ROLES.EMPLOYEE ? db.employees.filter((e) => e.id === user.employeeId) : db.employees;

  const uni = db.universities.find((u) => u.id === f.universityId);
  const courseOpts = uni?.courses || [];
  const feeOpts = useMemo(
    () => (uni?.fees || []).filter((fee) => {
      const c = uni.courses.find((co) => co.id === fee.courseId);
      return (!f.course || c?.name === f.course) && (!f.academicYear || String(fee.year) === String(f.academicYear));
    }),
    [uni, f.course, f.academicYear]
  );

  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("ID Proof");

  const save = () => {
    if (!f.name.trim() || !f.centerId) { alert("Name and Center are required."); return; }
    if (editing) { update("students", editing.id, f); log(`Updated student ${f.name}`); }
    else { add("students", { ...f, regNo: f.regNo || `JET-2026-${Math.floor(1000 + Math.random() * 9000)}` }); log(`Created lead/student ${f.name}`); }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} wide title={editing ? "Edit Student" : "New Student / Lead"}
      footer={<><button className="crm-btn crm-btn-ghost" onClick={onClose}>Cancel</button><button className="crm-btn crm-btn-primary" onClick={save}>{editing ? "Save changes" : "Create"}</button></>}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Student name" required><input className="crm-input" value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="Registration number" hint="Auto-generated if left blank"><input className="crm-input" value={f.regNo} onChange={(e) => set("regNo", e.target.value)} placeholder="JET-2026-1234" /></Field>
        <Field label="Mobile"><input className="crm-input" value={f.mobile} onChange={(e) => set("mobile", e.target.value)} /></Field>
        <Field label="Email"><input className="crm-input" value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>

        <Field label="Center" required>
          <select className="crm-input" value={f.centerId} onChange={(e) => set("centerId", e.target.value)} disabled={role === ROLES.CENTER}>
            <option value="">Select center…</option>
            {centerOpts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Assigned employee">
          <select className="crm-input" value={f.employeeId} onChange={(e) => set("employeeId", e.target.value)} disabled={role === ROLES.EMPLOYEE}>
            <option value="">Unassigned</option>
            {empOpts.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </Field>

        <Field label="University">
          <select className="crm-input" value={f.universityId} onChange={(e) => { set("universityId", e.target.value); set("course", ""); set("feeStructureId", ""); }}>
            <option value="">Select university…</option>
            {db.universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </Field>
        <Field label="Board (10th / 12th)">
          <select className="crm-input" value={f.boardId} onChange={(e) => set("boardId", e.target.value)}>
            <option value="">Select board…</option>
            {db.boards.map((b) => <option key={b.id} value={b.id}>{b.name} — {b.type}</option>)}
          </select>
        </Field>

        <Field label="Course">
          <select className="crm-input" value={f.course} onChange={(e) => { set("course", e.target.value); set("feeStructureId", ""); }} disabled={!uni}>
            <option value="">{uni ? "Select course…" : "Pick a university first"}</option>
            {courseOpts.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Academic year">
          <select className="crm-input" value={f.academicYear} onChange={(e) => { set("academicYear", e.target.value); set("feeStructureId", ""); }}>
            {ACADEMIC_YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </Field>

        <Field label="Fee structure">
          <select className="crm-input" value={f.feeStructureId} onChange={(e) => set("feeStructureId", e.target.value)} disabled={!uni}>
            <option value="">{uni ? "Select fee…" : "Pick a university first"}</option>
            {feeOpts.map((fee) => {
              const c = uni.courses.find((co) => co.id === fee.courseId);
              return <option key={fee.id} value={fee.id}>{c?.name} {fee.year} · {money(fee.amount)} ({fee.installments} inst.)</option>;
            })}
          </select>
        </Field>
        <Field label="Admission status">
          <select className="crm-input" value={f.admissionStatus} onChange={(e) => set("admissionStatus", e.target.value)}>
            {ADMISSION_STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      {/* documents */}
      <div className="mt-5 pt-4 border-t border-[var(--line)]">
        <div className="crm-label mb-2">Documents</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {(f.documents || []).length === 0 && <span className="text-mist text-sm">None added.</span>}
          {(f.documents || []).map((d) => (
            <span key={d.id} className="crm-pill tone-sky gap-2">{d.name} <span className="text-mist">· {d.type}</span>
              <button onClick={() => set("documents", f.documents.filter((x) => x.id !== d.id))}>✕</button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5">
          <input className="crm-input max-w-[200px]" placeholder="Document name" value={docName} onChange={(e) => setDocName(e.target.value)} />
          <select className="crm-input max-w-[160px]" value={docType} onChange={(e) => setDocType(e.target.value)}>
            {["ID Proof", "Photo", "Marksheet", "Certificate", "Other"].map((t) => <option key={t}>{t}</option>)}
          </select>
          <button className="crm-btn" disabled={!docName.trim()} onClick={() => { set("documents", [...(f.documents || []), { id: `doc-${Date.now()}`, name: docName, type: docType }]); setDocName(""); }}>+ Add</button>
        </div>
      </div>
    </Modal>
  );
}
