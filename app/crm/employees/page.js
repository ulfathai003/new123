"use client";

import { useState } from "react";
import { useCrm } from "@/components/crm/CrmProvider";
import { PageHeader, StatCard, StatusPill, Toolbar, SearchInput, EmptyState, Modal, Field } from "@/components/crm/ui";

export default function EmployeesPage() {
  const { db, is, add, update, remove, requestAssignment, log } = useCrm();
  const [q, setQ] = useState("");
  const [form, setForm] = useState(null); // {mode:'new'|'edit', data}
  const [assign, setAssign] = useState(null); // employee being assigned

  if (!is.admin) return <EmptyState icon="♟" title="Restricted" hint="Employee management is admin-only. Employees can access only their assigned centers and students." />;

  const rows = db.employees.filter((e) => `${e.name} ${e.email} ${e.mobile}`.toLowerCase().includes(q.toLowerCase()));
  const centerName = (id) => db.centers.find((c) => c.id === id)?.name || id;
  const studentsOf = (id) => db.students.filter((s) => s.employeeId === id).length;

  return (
    <div>
      <PageHeader title="Employees" subtitle={`${db.employees.length} employees · 4 centers per employee recommended`}>
        <button className="crm-btn crm-btn-primary" onClick={() => setForm({ mode: "new", data: { name: "", mobile: "", email: "" } })}>+ New Employee</button>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Employees" value={db.employees.length} />
        <StatCard label="Centers Covered" value={new Set(db.employees.flatMap((e) => e.assignedCenterIds)).size} tone="violet" />
        <StatCard label="Pending Assignments" value={db.approvals.filter((a) => a.status === "Pending").length} />
        <StatCard label="Leads Handled" value={db.students.length} tone="violet" />
      </div>

      <Toolbar><SearchInput value={q} onChange={setQ} placeholder="Search employees…" /></Toolbar>

      <div className="crm-card overflow-x-auto">
        <table className="crm-table">
          <thead><tr><th>Employee</th><th>Contact</th><th>Assigned Centers</th><th>Students</th><th></th></tr></thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td className="font-medium">{e.name}</td>
                <td className="text-mist text-xs">{e.mobile}<br />{e.email}</td>
                <td>
                  <div className="flex flex-wrap gap-1.5 max-w-sm">
                    {e.assignedCenterIds.length === 0 && <span className="text-mist text-xs">None</span>}
                    {e.assignedCenterIds.map((cid) => <span key={cid} className="crm-pill tone-sky">{centerName(cid)}</span>)}
                  </div>
                </td>
                <td className="tabular-nums">{studentsOf(e.id)}</td>
                <td>
                  <div className="flex gap-1.5 justify-end">
                    <button className="crm-btn crm-btn-ghost !px-2.5 !py-1.5 text-xs" onClick={() => setAssign(e)}>Assign</button>
                    <button className="crm-btn crm-btn-ghost !px-2.5 !py-1.5 text-xs" onClick={() => setForm({ mode: "edit", data: e })}>Edit</button>
                    <button className="crm-btn crm-btn-danger !px-2.5 !py-1.5 text-xs" onClick={() => { if (confirm(`Delete ${e.name}?`)) { remove("employees", e.id); log(`Deleted employee ${e.name}`); } }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* create / edit */}
      {form && (
        <Modal
          open
          onClose={() => setForm(null)}
          title={form.mode === "new" ? "New Employee" : "Edit Employee"}
          footer={
            <>
              <button className="crm-btn crm-btn-ghost" onClick={() => setForm(null)}>Cancel</button>
              <button className="crm-btn crm-btn-primary" onClick={() => {
                if (!form.data.name.trim()) return;
                if (form.mode === "new") { add("employees", { ...form.data, assignedCenterIds: [] }); log(`Created employee ${form.data.name}`); }
                else { update("employees", form.data.id, form.data); log(`Updated employee ${form.data.name}`); }
                setForm(null);
              }}>{form.mode === "new" ? "Create" : "Save"}</button>
            </>
          }
        >
          <div className="space-y-4">
            <Field label="Full name" required><input className="crm-input" value={form.data.name} onChange={(e) => setForm((f) => ({ ...f, data: { ...f.data, name: e.target.value } }))} /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Mobile"><input className="crm-input" value={form.data.mobile} onChange={(e) => setForm((f) => ({ ...f, data: { ...f.data, mobile: e.target.value } }))} /></Field>
              <Field label="Email"><input className="crm-input" value={form.data.email} onChange={(e) => setForm((f) => ({ ...f, data: { ...f.data, email: e.target.value } }))} /></Field>
            </div>
          </div>
        </Modal>
      )}

      {/* assignment manager */}
      {assign && <AssignModal employee={assign} onClose={() => setAssign(null)} />}
    </div>
  );
}

function AssignModal({ employee, onClose }) {
  const { db, update, requestAssignment, log } = useCrm();
  const [pick, setPick] = useState("");
  const e = db.employees.find((x) => x.id === employee.id) || employee;
  const available = db.centers.filter((c) => !c.personal && !e.assignedCenterIds.includes(c.id));
  const pending = db.approvals.filter((a) => a.employeeId === e.id && a.status === "Pending");
  const centerName = (id) => db.centers.find((c) => c.id === id)?.name || id;

  return (
    <Modal open onClose={onClose} title={`Assign Centers — ${e.name}`} wide
      footer={<button className="crm-btn crm-btn-primary" onClick={onClose}>Done</button>}>
      <div className="space-y-5">
        <div className="crm-pill tone-amber !py-2">Flow: Admin assigns → Prashant approval → active assignment</div>

        <div>
          <div className="crm-label mb-2">Request new assignment</div>
          <div className="flex gap-2.5">
            <select className="crm-input" value={pick} onChange={(ev) => setPick(ev.target.value)}>
              <option value="">Select a center…</option>
              {available.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button className="crm-btn crm-btn-primary whitespace-nowrap" disabled={!pick}
              onClick={() => { requestAssignment(e.id, pick); setPick(""); }}>Request</button>
          </div>
        </div>

        {pending.length > 0 && (
          <div>
            <div className="crm-label mb-2">Pending approval</div>
            <div className="flex flex-wrap gap-2">
              {pending.map((a) => <span key={a.id} className="crm-pill tone-amber">{centerName(a.centerId)} · Pending</span>)}
            </div>
          </div>
        )}

        <div>
          <div className="crm-label mb-2">Active assignments ({e.assignedCenterIds.length})</div>
          {e.assignedCenterIds.length === 0 ? <p className="text-mist text-sm">No active assignments.</p> : (
            <div className="flex flex-wrap gap-2">
              {e.assignedCenterIds.map((cid) => (
                <span key={cid} className="crm-pill tone-emerald gap-2">
                  {centerName(cid)}
                  <button className="hover:text-snow" title="Unassign"
                    onClick={() => { update("employees", e.id, { assignedCenterIds: e.assignedCenterIds.filter((x) => x !== cid) }); log(`Unassigned ${e.name} from ${centerName(cid)}`); }}>✕</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
