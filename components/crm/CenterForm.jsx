"use client";

import { useState } from "react";
import { useCrm } from "./CrmProvider";
import { Modal, Field } from "./ui";
import { CENTER_STATUS } from "@/lib/crm/constants";

const blank = { name: "", owner: "", mobile: "", email: "", address: "", status: "Active" };

export default function CenterForm({ open, onClose, editing, personal = false }) {
  const { add, update, log } = useCrm();
  const [form, setForm] = useState(editing || blank);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) {
      update("centers", editing.id, form);
      log(`Updated center ${form.name}`);
    } else {
      add("centers", { ...form, personal, assignedEmployeeIds: [] });
      log(`Created ${personal ? "personal " : ""}center ${form.name}`);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Center" : personal ? "New Personal Center" : "New Center"}
      footer={
        <>
          <button className="crm-btn crm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="crm-btn crm-btn-primary" onClick={save}>{editing ? "Save changes" : "Create center"}</button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Center name" required>
          <input className="crm-input" value={form.name} onChange={set("name")} placeholder="Mumbai Study Centre" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Owner">
            <input className="crm-input" value={form.owner} onChange={set("owner")} placeholder="Owner name" />
          </Field>
          <Field label="Status">
            <select className="crm-input" value={form.status} onChange={set("status")}>
              {CENTER_STATUS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Mobile">
            <input className="crm-input" value={form.mobile} onChange={set("mobile")} placeholder="9000000000" />
          </Field>
          <Field label="Email">
            <input className="crm-input" value={form.email} onChange={set("email")} placeholder="center@jetro.in" />
          </Field>
        </div>
        <Field label="Address">
          <textarea className="crm-input" rows={2} value={form.address} onChange={set("address")} placeholder="Street, City" />
        </Field>
      </div>
    </Modal>
  );
}
