"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCrm } from "@/components/crm/CrmProvider";
import { PageHeader, StatusPill, EmptyState } from "@/components/crm/ui";

export default function BoardDetail() {
  const { id } = useParams();
  const { db, getBoard, getUniversity } = useCrm();
  const board = getBoard(id);

  if (!board) return <EmptyState title="Board not found" action={<Link className="crm-btn" href="/crm/boards">← Back</Link>} />;

  const students = db.students.filter((s) => s.boardId === id);

  return (
    <div>
      <Link href="/crm/boards" className="crm-label hover:text-snow">← Boards</Link>
      <PageHeader title={board.name} subtitle={`${board.type} board · ${students.length} students`}>
        <span className="crm-pill tone-violet">{board.type}</span>
      </PageHeader>

      <div className="crm-card p-5 overflow-x-auto">
        <h3 className="font-medium mb-4">Students under {board.name} ({board.type})</h3>
        {students.length === 0 ? <p className="text-mist text-sm">No students linked to this board yet.</p> : (
          <table className="crm-table">
            <thead><tr><th>Student</th><th>Reg. No</th><th>University</th><th>Course</th><th>Status</th></tr></thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td><Link href={`/crm/students/${s.id}`} className="font-medium hover:text-signal">{s.name}</Link></td>
                  <td className="text-mist text-xs">{s.regNo}</td>
                  <td>{getUniversity(s.universityId)?.code || "—"}</td>
                  <td>{s.course}</td>
                  <td><StatusPill value={s.admissionStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
