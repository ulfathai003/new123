/* ─── Jetro Education CRM — shared constants ─── */

export const ROLES = {
  ADMIN: "admin",
  CENTER: "center",
  EMPLOYEE: "employee",
};

export const ROLE_LABEL = {
  admin: "Admin",
  center: "Center User",
  employee: "Employee",
};

/* Payment lifecycle */
export const PAYMENT_STATUS = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  PENDING: "Pending Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  VERIFIED: "Verified",
};

export const PAYMENT_STATUS_LIST = [
  "Draft",
  "Submitted",
  "Pending Approval",
  "Approved",
  "Rejected",
  "Verified",
];

export const PAYMENT_MODES = ["UPI", "Bank Transfer", "NEFT/RTGS", "Cash", "Card", "Cheque"];

/* Center status */
export const CENTER_STATUS = ["Active", "Inactive"];

/* Admission funnel (ordered) */
export const ADMISSION_STAGES = [
  "Lead Created",
  "Employee Assigned",
  "Follow-Up",
  "Interested",
  "Document Collection",
  "Admission Application",
  "University Submission",
  "Fee Entry",
  "UTR Upload",
  "Prashant Approval",
  "Admission Confirmed",
  "Student Active",
];

/* Assignment approval status */
export const APPROVAL_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const ACADEMIC_YEARS = ["2024", "2025", "2026", "2027"];

/* Colour token per status — used for pills (Tailwind classes) */
export const STATUS_TONE = {
  Active: "emerald",
  Inactive: "rock",
  Draft: "rock",
  Submitted: "sky",
  "Pending Approval": "amber",
  Approved: "emerald",
  Rejected: "rose",
  Verified: "violet",
  Pending: "amber",
  "Student Active": "emerald",
  "Admission Confirmed": "emerald",
  "Lead Created": "sky",
};
