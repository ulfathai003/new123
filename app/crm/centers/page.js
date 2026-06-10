"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmProvider";
import { PageHeader, StatusPill, Toolbar, SearchInput, EmptyState } from "@/components/crm/ui";
import CenterForm from "@/components/crm/CenterForm";
import { CENTER_STATUS } from "@/lib/crm/constants";

export default function CentersPage() {
  const { db, is, visibleCenters, remove, log } = useCrm();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // exclude personal centers from the general centers screen
  const base = (is.admin ? db.centers : visibleCenters).filter((c) => !c.personal);

  const rows = useMemo(() => {
    return base.filter((c) => {
      const matchQ = `${c.name} ${c.owner} ${c.address}`.toLowerCase().includes(q.toLowerCase());
      const matchS = !status || c.status === status;
      return matchQ && matchS;
    });
  }, [base, q, status]);

  const studentsIn = (id) => db.students.filter((s) => s.centerId === id).length;
  const empsIn = (id) => db.employees.filter((e) => e.assignedCenterIds.includes(id)).length;

  const onEdit = (c) => { setEditing(c); setFormOpen(true); };
  const onNew = () => { setEditing(null); setFormOpen(true); };
  const onDelete = (c) => {
    if (confirm(`Delete center "${c.name}"? This cannot be undone.`)) {
      remove("centers", c.id);
      log(`Deleted center ${c.name}`);
    }
  };

  return (
    <div>
      <PageHeader title="Centers" subtitle={`${base.length} center${base.length === 1 ? "" : "s"} · ${base.filter((c) => c.status === "Active").length} active`}>
        {is.admin && <button className="crm-btn crm-btn-primary" onClick={onNew}>+ New Center</button>}
      </PageHeader>

      <Toolbar>
        <SearchInput value={q} onChange={setQ} placeholder="Search name, owner, city…" />
        <select className="crm-input max-w-[160px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {CENTER_STATUS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Toolbar>

      {rows.length === 0 ? (
        <EmptyState title="No centers found" hint="Adjust your filters or add a new center." />
      ) : (
        <div className="crm-card overflow-x-auto">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Center</th><th>Owner</th><th>Contact</th><th>Students</th><th>Employees</th><th>Status</th>
                {is.admin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/crm/centers/${c.id}`} className="font-medium hover:text-signal">{c.name}</Link>
                    <div className="text-xs text-mist truncate max-w-[220px]">{c.address}</div>
                  </td>
                  <td>{c.owner || "—"}</td>
                  <td className="text-mist text-xs">{c.mobile}<br />{c.email}</td>
                  <td className="tabular-nums">{studentsIn(c.id)}</td>
                  <td className="tabular-nums">{empsIn(c.id)}</td>
                  <td><StatusPill value={c.status} /></td>
                  {is.admin && (
                    <td>
                      <div className="flex gap-1.5 justify-end">
                        <button className="crm-btn crm-btn-ghost !px-2.5 !py-1.5 text-xs" onClick={() => onEdit(c)}>Edit</button>
                        <button className="crm-btn crm-btn-danger !px-2.5 !py-1.5 text-xs" onClick={() => onDelete(c)}>Delete</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && <CenterForm open={formOpen} onClose={() => setFormOpen(false)} editing={editing} />}
    </div>
  );
}
