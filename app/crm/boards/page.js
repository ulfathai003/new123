"use client";

import { useState } from "react";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmProvider";
import { PageHeader, EmptyState, Modal, Field } from "@/components/crm/ui";

export default function BoardsPage() {
  const { db, is, add, update, remove, log } = useCrm();
  const [form, setForm] = useState(null);

  if (!is.admin) return <EmptyState icon="▤" title="Restricted" hint="Board management is admin-only." />;

  const groups = [["10th", "Class 10 Boards"], ["12th", "Class 12 Boards"]];
  const studentsOn = (bid) => db.students.filter((s) => s.boardId === bid).length;

  return (
    <div>
      <PageHeader title="Boards" subtitle="Manage 10th and 12th boards separately.">
        <button className="crm-btn crm-btn-primary" onClick={() => setForm({ name: "", type: "12th" })}>+ New Board</button>
      </PageHeader>

      <div className="grid md:grid-cols-2 gap-5">
        {groups.map(([type, title]) => {
          const rows = db.boards.filter((b) => b.type === type);
          return (
            <div key={type} className="crm-card p-5">
              <h3 className="font-medium mb-4 flex items-center gap-2">{title} <span className="crm-pill tone-rock">{rows.length}</span></h3>
              {rows.length === 0 ? <p className="text-mist text-sm">No {type} boards yet.</p> : (
                <div className="space-y-2.5">
                  {rows.map((b) => (
                    <div key={b.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--surface-3)]">
                      <Link href={`/crm/boards/${b.id}`} className="font-medium hover:text-signal">{b.name}</Link>
                      <div className="flex items-center gap-2">
                        <span className="crm-pill tone-sky">{studentsOn(b.id)} students</span>
                        <button className="crm-btn crm-btn-ghost !px-2 !py-1 text-xs" onClick={() => setForm(b)}>Edit</button>
                        <button className="crm-btn crm-btn-danger !px-2 !py-1 text-xs" onClick={() => { if (confirm(`Delete ${b.name} (${b.type})?`)) { remove("boards", b.id); log(`Deleted board ${b.name}`); } }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {form && (
        <Modal open onClose={() => setForm(null)} title={form.id ? "Edit Board" : "New Board"}
          footer={<><button className="crm-btn crm-btn-ghost" onClick={() => setForm(null)}>Cancel</button>
            <button className="crm-btn crm-btn-primary" onClick={() => {
              if (!form.name.trim()) return;
              if (form.id) { update("boards", form.id, { name: form.name, type: form.type }); log(`Updated board ${form.name}`); }
              else { add("boards", { name: form.name, type: form.type }); log(`Created board ${form.name}`); }
              setForm(null);
            }}>{form.id ? "Save" : "Create"}</button></>}>
          <div className="space-y-4">
            <Field label="Board name" required><input className="crm-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="CBSE / State Board / NIOS" /></Field>
            <Field label="Type" required>
              <select className="crm-input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                <option value="10th">10th</option><option value="12th">12th</option>
              </select>
            </Field>
          </div>
        </Modal>
      )}
    </div>
  );
}
