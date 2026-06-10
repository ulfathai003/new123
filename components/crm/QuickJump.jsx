"use client";

/* University & Board dropdowns that redirect to the selected entity's page. */

import { useRouter } from "next/navigation";
import { useCrm } from "./CrmProvider";

export default function QuickJump() {
  const { db } = useCrm();
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <select
        className="crm-input"
        defaultValue=""
        onChange={(e) => e.target.value && router.push(`/crm/universities/${e.target.value}`)}
        aria-label="Go to university"
      >
        <option value="" disabled>University →</option>
        {db.universities.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <select
        className="crm-input"
        defaultValue=""
        onChange={(e) => e.target.value && router.push(`/crm/boards/${e.target.value}`)}
        aria-label="Go to board"
      >
        <option value="" disabled>Board (10th / 12th) →</option>
        {db.boards.map((b) => (
          <option key={b.id} value={b.id}>{b.name} — {b.type}</option>
        ))}
      </select>
    </div>
  );
}
