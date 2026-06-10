"use client";

import { useState } from "react";
import Link from "next/link";
import { useCrm } from "@/components/crm/CrmProvider";
import { PageHeader, StatusPill, EmptyState } from "@/components/crm/ui";
import CenterForm from "@/components/crm/CenterForm";

export default function PersonalCentersPage() {
  const { db, is, remove, log } = useCrm();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  if (!is.admin) {
    return <EmptyState icon="✦" title="Restricted" hint="Personal Centers are accessible only by Prashant (Admin)." />;
  }

  const rows = db.centers.filter((c) => c.personal);

  return (
    <div>
      <PageHeader title="Personal Centers" subtitle="A separate, admin-only center category. No employee access unless explicitly granted.">
        <button className="crm-btn crm-btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>+ New Personal Center</button>
      </PageHeader>

      {rows.length === 0 ? (
        <EmptyState icon="★" title="No personal centers yet" hint="Create one to track Prashant's private centers separately." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((c) => (
            <div key={c.id} className="crm-card p-5">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/crm/centers/${c.id}`} className="font-medium hover:text-signal">{c.name}</Link>
                <StatusPill value={c.status} />
              </div>
              <p className="text-mist text-sm mt-1.5">{c.address}</p>
              <div className="text-xs text-mist mt-3">{c.owner} · {c.mobile}</div>
              <div className="flex gap-1.5 mt-4">
                <button className="crm-btn crm-btn-ghost !px-2.5 !py-1.5 text-xs" onClick={() => { setEditing(c); setFormOpen(true); }}>Edit</button>
                <button className="crm-btn crm-btn-danger !px-2.5 !py-1.5 text-xs" onClick={() => { if (confirm(`Delete "${c.name}"?`)) { remove("centers", c.id); log(`Deleted personal center ${c.name}`); } }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && <CenterForm open={formOpen} onClose={() => setFormOpen(false)} editing={editing} personal />}
    </div>
  );
}
