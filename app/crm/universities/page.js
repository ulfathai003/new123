"use client";

import { useState } from "react";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmProvider";
import { PageHeader, EmptyState, Modal, Field, money } from "@/components/crm/ui";

export default function UniversitiesPage() {
  const { db, is, add, update, remove, log } = useCrm();
  const [form, setForm] = useState(null);

  if (!is.admin) return <EmptyState icon="⌂" title="Restricted" hint="University management is admin-only." />;

  return (
    <div>
      <PageHeader title="Universities" subtitle={`${db.universities.length} universities · courses, year-wise fees & installments`}>
        <button className="crm-btn crm-btn-primary" onClick={() => setForm({ name: "", code: "" })}>+ New University</button>
      </PageHeader>

      {db.universities.length === 0 ? (
        <EmptyState icon="⌂" title="No universities yet" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {db.universities.map((u) => (
            <div key={u.id} className="crm-card p-5">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/crm/universities/${u.id}`} className="font-medium text-lg hover:text-signal">{u.name}</Link>
                <span className="crm-pill tone-violet">{u.code}</span>
              </div>
              <div className="flex gap-4 mt-4 text-sm">
                <div><div className="text-2xl font-medium tabular-nums">{u.courses.length}</div><div className="crm-label">Courses</div></div>
                <div><div className="text-2xl font-medium tabular-nums">{u.fees.length}</div><div className="crm-label">Fee plans</div></div>
              </div>
              <p className="text-mist text-xs mt-3">From {money(Math.min(...u.fees.map((f) => f.amount)))}</p>
              <div className="flex gap-1.5 mt-4">
                <Link href={`/crm/universities/${u.id}`} className="crm-btn crm-btn-ghost !px-2.5 !py-1.5 text-xs">Manage</Link>
                <button className="crm-btn crm-btn-ghost !px-2.5 !py-1.5 text-xs" onClick={() => setForm(u)}>Edit</button>
                <button className="crm-btn crm-btn-danger !px-2.5 !py-1.5 text-xs" onClick={() => { if (confirm(`Delete ${u.name}?`)) { remove("universities", u.id); log(`Deleted university ${u.name}`); } }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <Modal open onClose={() => setForm(null)} title={form.id ? "Edit University" : "New University"}
          footer={<><button className="crm-btn crm-btn-ghost" onClick={() => setForm(null)}>Cancel</button>
            <button className="crm-btn crm-btn-primary" onClick={() => {
              if (!form.name.trim()) return;
              if (form.id) { update("universities", form.id, { name: form.name, code: form.code }); log(`Updated university ${form.name}`); }
              else { add("universities", { name: form.name, code: form.code || form.name.slice(0, 4).toUpperCase(), courses: [], fees: [] }); log(`Created university ${form.name}`); }
              setForm(null);
            }}>{form.id ? "Save" : "Create"}</button></>}>
          <div className="space-y-4">
            <Field label="University name" required><input className="crm-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
            <Field label="Short code" hint="e.g. SMU"><input className="crm-input" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} /></Field>
          </div>
        </Modal>
      )}
    </div>
  );
}
