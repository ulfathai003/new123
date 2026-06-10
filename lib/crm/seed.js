/* ─── Jetro Education CRM — seed dataset ───
   A believable, fully-wired demo: roles, universities + courses + year-wise
   fees, boards, centers (incl. personal), employees with center assignments,
   students across the admission funnel, and payments across every status.
   Everything is persisted to localStorage by the store; this is the cold-start. */

import { PAYMENT_STATUS, ADMISSION_STAGES, APPROVAL_STATUS } from "./constants";

export function buildSeed() {
  /* ── Users / Roles ── */
  const users = [
    {
      id: "u-admin",
      name: "Prashant",
      mobile: "9000000001",
      email: "prashant@jetro.in",
      password: "admin123",
      role: "admin",
    },
    {
      id: "u-center",
      name: "Ravi Kumar",
      mobile: "9000000002",
      email: "ravi@center.in",
      password: "center123",
      role: "center",
      centerId: "c-1",
    },
    {
      id: "u-emp",
      name: "Anita Sharma",
      mobile: "9000000003",
      email: "anita@jetro.in",
      password: "emp123",
      role: "employee",
      employeeId: "e-1",
    },
  ];

  /* ── Universities (courses + year-wise fee structures w/ installments) ── */
  const universities = [
    {
      id: "uni-1",
      name: "Sikkim Manipal University",
      code: "SMU",
      courses: [
        { id: "crs-1", name: "BA" },
        { id: "crs-2", name: "B.Com" },
        { id: "crs-3", name: "BBA" },
        { id: "crs-4", name: "BCA" },
      ],
      fees: [
        { id: "fee-1", courseId: "crs-1", year: "2026", amount: 20000, installments: 2, editable: true },
        { id: "fee-2", courseId: "crs-2", year: "2026", amount: 22000, installments: 2, editable: true },
        { id: "fee-3", courseId: "crs-3", year: "2026", amount: 28000, installments: 3, editable: true },
        { id: "fee-4", courseId: "crs-4", year: "2026", amount: 30000, installments: 3, editable: true },
      ],
    },
    {
      id: "uni-2",
      name: "BLESS University",
      code: "BLESS",
      courses: [
        { id: "crs-5", name: "B.Sc" },
        { id: "crs-6", name: "M.Com" },
        { id: "crs-7", name: "MBA" },
      ],
      fees: [
        { id: "fee-5", courseId: "crs-5", year: "2026", amount: 24000, installments: 2, editable: true },
        { id: "fee-6", courseId: "crs-6", year: "2026", amount: 26000, installments: 2, editable: true },
        { id: "fee-7", courseId: "crs-7", year: "2026", amount: 45000, installments: 4, editable: true },
      ],
    },
  ];

  /* ── Boards (10th / 12th managed separately) ── */
  const boards = [
    { id: "brd-1", name: "CBSE", type: "10th" },
    { id: "brd-2", name: "CBSE", type: "12th" },
    { id: "brd-3", name: "State Board", type: "10th" },
    { id: "brd-4", name: "State Board", type: "12th" },
    { id: "brd-5", name: "NIOS", type: "12th" },
  ];

  /* ── Centers (16 ordinary + 2 personal, owned by Prashant) ── */
  const cities = [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Surat", "Indore", "Bhopal",
    "Jaipur", "Lucknow", "Patna", "Ranchi", "Raipur", "Kolkata", "Delhi", "Noida",
  ];
  const centers = cities.map((city, i) => ({
    id: `c-${i + 1}`,
    name: `${city} Study Centre`,
    owner: ["Ravi Kumar", "Sunil Mehta", "Priya Nair", "Imran Khan"][i % 4],
    mobile: `90000${String(100 + i).padStart(5, "0")}`.slice(0, 10),
    email: `${city.toLowerCase()}@center.in`,
    address: `${12 + i}, Main Road, ${city}`,
    status: i % 5 === 0 ? "Inactive" : "Active",
    personal: false,
  }));
  centers.push(
    { id: "c-p1", name: "Prashant Personal — Bandra", owner: "Prashant", mobile: "9000000010", email: "personal1@jetro.in", address: "Linking Road, Bandra, Mumbai", status: "Active", personal: true },
    { id: "c-p2", name: "Prashant Personal — Koregaon", owner: "Prashant", mobile: "9000000011", email: "personal2@jetro.in", address: "Koregaon Park, Pune", status: "Active", personal: true },
  );

  /* ── Employees + center assignments (4 employees) ── */
  const employees = [
    { id: "e-1", name: "Anita Sharma", mobile: "9000000003", email: "anita@jetro.in", assignedCenterIds: ["c-1", "c-2", "c-3", "c-4"] },
    { id: "e-2", name: "Rahul Verma", mobile: "9000000004", email: "rahul@jetro.in", assignedCenterIds: ["c-5", "c-6", "c-7", "c-8"] },
    { id: "e-3", name: "Sneha Patil", mobile: "9000000005", email: "sneha@jetro.in", assignedCenterIds: ["c-9", "c-10", "c-11", "c-12"] },
    { id: "e-4", name: "Vikram Singh", mobile: "9000000006", email: "vikram@jetro.in", assignedCenterIds: ["c-13", "c-14"] },
  ];

  /* ── Approvals: two pending center-assignment requests for Prashant ── */
  const approvals = [
    { id: "ap-1", type: "assignment", employeeId: "e-4", centerId: "c-15", status: APPROVAL_STATUS.PENDING, requestedBy: "u-admin", createdAt: daysAgo(2) },
    { id: "ap-2", type: "assignment", employeeId: "e-4", centerId: "c-16", status: APPROVAL_STATUS.PENDING, requestedBy: "u-admin", createdAt: daysAgo(1) },
  ];

  /* ── Students spread across the admission funnel ── */
  const firstNames = ["Aarav", "Diya", "Kabir", "Isha", "Arjun", "Sara", "Rohan", "Meera", "Aditya", "Nisha", "Karan", "Tanvi", "Yash", "Pooja", "Dev", "Riya", "Manav", "Sneha", "Aman", "Kavya"];
  const courses = [
    ["uni-1", "BA", "fee-1"], ["uni-1", "B.Com", "fee-2"], ["uni-1", "BBA", "fee-3"], ["uni-1", "BCA", "fee-4"],
    ["uni-2", "B.Sc", "fee-5"], ["uni-2", "M.Com", "fee-6"], ["uni-2", "MBA", "fee-7"],
  ];
  const students = firstNames.map((fn, i) => {
    const [uniId, course, feeId] = courses[i % courses.length];
    const center = centers[i % 14];
    const emp = employees[i % 4];
    const stage = ADMISSION_STAGES[Math.min(i, ADMISSION_STAGES.length - 1)];
    return {
      id: `st-${i + 1}`,
      name: `${fn} ${["Shah", "Iyer", "Gupta", "Reddy"][i % 4]}`,
      mobile: `98000${String(10000 + i).padStart(5, "0")}`.slice(0, 10),
      email: `${fn.toLowerCase()}${i}@mail.com`,
      regNo: `JET-2026-${String(1001 + i)}`,
      centerId: center.id,
      employeeId: emp.id,
      universityId: uniId,
      boardId: i % 2 === 0 ? "brd-2" : "brd-4",
      course,
      academicYear: "2026",
      feeStructureId: feeId,
      admissionStatus: stage,
      documents: i % 3 === 0 ? [{ id: `doc-${i}`, name: "Aadhaar.pdf", type: "ID Proof" }] : [],
      createdAt: daysAgo(20 - (i % 20)),
    };
  });

  /* ── Payments across every status ── */
  const payStatuses = [
    PAYMENT_STATUS.VERIFIED, PAYMENT_STATUS.APPROVED, PAYMENT_STATUS.PENDING,
    PAYMENT_STATUS.PENDING, PAYMENT_STATUS.SUBMITTED, PAYMENT_STATUS.REJECTED,
    PAYMENT_STATUS.APPROVED, PAYMENT_STATUS.PENDING, PAYMENT_STATUS.VERIFIED,
    PAYMENT_STATUS.DRAFT,
  ];
  const payments = payStatuses.map((status, i) => {
    const st = students[i];
    return {
      id: `pay-${i + 1}`,
      studentId: st.id,
      regNo: st.regNo,
      course: st.course,
      amount: [10000, 11000, 20000, 22000, 28000][i % 5],
      utr: status === PAYMENT_STATUS.DRAFT ? "" : `UTR${String(700000000000 + i * 137)}`,
      txnDate: daysAgo(i + 1),
      mode: ["UPI", "Bank Transfer", "NEFT/RTGS", "UPI", "Card"][i % 5],
      screenshot: null,
      remarks: status === PAYMENT_STATUS.REJECTED ? "UTR mismatch — re-upload proof" : "",
      status,
      createdBy: "u-center",
      createdAt: daysAgo(i + 1),
    };
  });

  /* ── Activity log ── */
  const activityLogs = [
    { id: "log-1", ts: daysAgo(1), user: "Prashant", action: "Approved payment for JET-2026-1002" },
    { id: "log-2", ts: daysAgo(2), user: "Ravi Kumar", action: "Submitted payment for JET-2026-1003" },
    { id: "log-3", ts: daysAgo(3), user: "Anita Sharma", action: "Created lead for Aarav Shah" },
  ];

  return { users, universities, boards, centers, employees, approvals, students, payments, activityLogs };
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
