"use client";

import { useRef, useState } from "react";
import { useCrm } from "./CrmProvider";
import { Modal, Field, money } from "./ui";
import { PAYMENT_MODES, PAYMENT_STATUS } from "@/lib/crm/constants";

export default function PaymentForm({ open, onClose, editing }) {
  const { visibleStudents, getUniversity, add, update, log } = useCrm();
  const fileRef = useRef(null);

  const [f, setF] = useState(
    editing || {
      studentId: "", amount: "", utr: "", txnDate: new Date().toISOString().slice(0, 10),
      mode: "UPI", remarks: "", screenshot: null, status: PAYMENT_STATUS.DRAFT,
    }
  );
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const [err, setErr] = useState("");

  const student = visibleStudents.find((s) => s.id === f.studentId);

  const onStudent = (sid) => {
    const s = visibleStudents.find((x) => x.id === sid);
    const uni = s && getUniversity(s.universityId);
    const fee = uni?.fees.find((x) => x.id === s.feeStructureId);
    setF((p) => ({ ...p, studentId: sid, regNo: s?.regNo, course: s?.course, amount: p.amount || (fee ? Math.round(fee.amount / fee.installments) : "") }));
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 700 * 1024) { setErr("Screenshot must be under 700 KB."); return; }
    const reader = new FileReader();
    reader.onload = () => set("screenshot", { name: file.name, data: reader.result });
    reader.readAsDataURL(file);
    setErr("");
  };

  const persist = (status) => {
    if (!f.studentId) { setErr("Select a student."); return; }
    if (!f.amount) { setErr("Enter an amount."); return; }
    if (status !== PAYMENT_STATUS.DRAFT && !f.utr) { setErr("UTR number is required to submit."); return; }
    const payload = { ...f, amount: +f.amount, status, regNo: student?.regNo, course: student?.course, createdBy: "self" };
    if (editing) { update("payments", editing.id, payload); log(`Updated payment ${student?.regNo} → ${status}`); }
    else { add("payments", payload); log(`Recorded payment ${student?.regNo} → ${status}`); }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} wide title={editing ? "Edit Payment" : "New Payment Entry"}
      footer={<>
        <button className="crm-btn crm-btn-ghost" onClick={onClose}>Cancel</button>
        <button className="crm-btn" onClick={() => persist(PAYMENT_STATUS.DRAFT)}>Save draft</button>
        <button className="crm-btn crm-btn-primary" onClick={() => persist(PAYMENT_STATUS.PENDING)}>Submit for approval →</button>
      </>}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Student" required>
          <select className="crm-input" value={f.studentId} onChange={(e) => onStudent(e.target.value)}>
            <option value="">Select student…</option>
            {visibleStudents.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.regNo}</option>)}
          </select>
        </Field>
        <Field label="Course"><input className="crm-input" value={student?.course || f.course || ""} readOnly placeholder="—" /></Field>
        <Field label="Amount (₹)" required><input type="number" className="crm-input" value={f.amount} onChange={(e) => set("amount", e.target.value)} placeholder="20000" /></Field>
        <Field label="Payment mode">
          <select className="crm-input" value={f.mode} onChange={(e) => set("mode", e.target.value)}>{PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}</select>
        </Field>
        <Field label="UTR / Reference number" hint="Required to submit"><input className="crm-input" value={f.utr} onChange={(e) => set("utr", e.target.value)} placeholder="UTR123456789012" /></Field>
        <Field label="Transaction date"><input type="date" className="crm-input" value={f.txnDate} onChange={(e) => set("txnDate", e.target.value)} /></Field>
        <Field label="Remarks"><input className="crm-input" value={f.remarks} onChange={(e) => set("remarks", e.target.value)} placeholder="Optional note" /></Field>
        <Field label="Payment screenshot" hint="PNG/JPG under 700 KB">
          <div className="flex items-center gap-2.5">
            <button type="button" className="crm-btn" onClick={() => fileRef.current?.click()}>⬆ Upload</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            {f.screenshot && <span className="crm-pill tone-emerald gap-2">{f.screenshot.name}<button onClick={() => set("screenshot", null)}>✕</button></span>}
          </div>
        </Field>
      </div>

      {f.screenshot?.data && (
        <img src={f.screenshot.data} alt="proof" className="mt-4 max-h-40 rounded-lg border border-[var(--line)]" />
      )}
      {f.amount && <p className="mt-4 crm-pill tone-violet">Recording {money(+f.amount)} for {student?.name || "—"}</p>}
      {err && <p className="mt-3 crm-pill tone-rose !py-2">{err}</p>}
    </Modal>
  );
}
