"use client";

/* ─── Jetro Education CRM — global state + role-aware actions ───
   Single source of truth for the running app. Wraps the whole /crm tree,
   hydrates from localStorage on mount, and persists on every change. */

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { loadDB, saveDB, loadSession, saveSession, resetDB, uid } from "@/lib/crm/store";
import { ROLES, PAYMENT_STATUS, ADMISSION_STAGES, APPROVAL_STATUS } from "@/lib/crm/constants";

const CrmContext = createContext(null);

const EMPTY = {
  users: [], universities: [], boards: [], centers: [],
  employees: [], approvals: [], students: [], payments: [], activityLogs: [],
};

export function CrmProvider({ children }) {
  const [db, setDb] = useState(EMPTY);
  const [sessionId, setSessionId] = useState(null);
  const [ready, setReady] = useState(false);

  /* hydrate once on the client */
  useEffect(() => {
    setDb(loadDB() || EMPTY);
    setSessionId(loadSession());
    setReady(true);
  }, []);

  /* persist whenever the db changes (after hydration) */
  useEffect(() => {
    if (ready) saveDB(db);
  }, [db, ready]);

  const user = useMemo(
    () => db.users.find((u) => u.id === sessionId) || null,
    [db.users, sessionId]
  );
  const role = user?.role || null;

  /* ── auth ── */
  const login = useCallback(
    (identifier, password) => {
      const id = String(identifier || "").trim().toLowerCase();
      const match = db.users.find(
        (u) =>
          (u.email.toLowerCase() === id || u.mobile === identifier.trim()) &&
          u.password === password
      );
      if (!match) return { ok: false, error: "Invalid mobile/email or password." };
      setSessionId(match.id);
      saveSession(match.id);
      return { ok: true };
    },
    [db.users]
  );

  const logout = useCallback(() => {
    setSessionId(null);
    saveSession(null);
  }, []);

  const resetDemo = useCallback(() => {
    resetDB();
    const fresh = loadDB();
    setDb(fresh);
    setSessionId(null);
  }, []);

  /* ── activity log ── */
  const log = useCallback(
    (action) =>
      setDb((d) => ({
        ...d,
        activityLogs: [
          { id: uid("log"), ts: new Date().toISOString(), user: d.users.find((u) => u.id === sessionId)?.name || "System", action },
          ...d.activityLogs,
        ].slice(0, 200),
      })),
    [sessionId]
  );

  /* ── generic CRUD ── */
  const add = useCallback((collection, item) => {
    const withId = { id: uid(collection.slice(0, 3)), createdAt: new Date().toISOString(), ...item };
    setDb((d) => ({ ...d, [collection]: [withId, ...d[collection]] }));
    return withId;
  }, []);

  const update = useCallback((collection, id, patch) => {
    setDb((d) => ({
      ...d,
      [collection]: d[collection].map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  }, []);

  const remove = useCallback((collection, id) => {
    setDb((d) => ({ ...d, [collection]: d[collection].filter((it) => it.id !== id) }));
  }, []);

  /* ── assignment approval workflow ── */
  const requestAssignment = useCallback(
    (employeeId, centerId) => {
      add("approvals", { type: "assignment", employeeId, centerId, status: APPROVAL_STATUS.PENDING, requestedBy: sessionId });
      log("Requested center assignment — awaiting Prashant approval");
    },
    [add, log, sessionId]
  );

  const approveAssignment = useCallback(
    (id) =>
      setDb((d) => {
        const ap = d.approvals.find((a) => a.id === id);
        if (!ap) return d;
        return {
          ...d,
          approvals: d.approvals.map((a) => (a.id === id ? { ...a, status: APPROVAL_STATUS.APPROVED } : a)),
          employees: d.employees.map((e) =>
            e.id === ap.employeeId && !e.assignedCenterIds.includes(ap.centerId)
              ? { ...e, assignedCenterIds: [...e.assignedCenterIds, ap.centerId] }
              : e
          ),
          activityLogs: [{ id: uid("log"), ts: new Date().toISOString(), user: "Prashant", action: `Approved assignment ${id}` }, ...d.activityLogs],
        };
      }),
    []
  );

  const rejectAssignment = useCallback((id) => {
    update("approvals", id, { status: APPROVAL_STATUS.REJECTED });
    log(`Rejected assignment ${id}`);
  }, [update, log]);

  /* ── payment workflow ── */
  const setPaymentStatus = useCallback(
    (id, status, extra = {}) => {
      update("payments", id, { status, ...extra });
      log(`Payment ${id} → ${status}`);
    },
    [update, log]
  );

  /* ── admission funnel ── */
  const advanceAdmission = useCallback(
    (studentId) =>
      setDb((d) => ({
        ...d,
        students: d.students.map((s) => {
          if (s.id !== studentId) return s;
          const i = ADMISSION_STAGES.indexOf(s.admissionStatus);
          const next = ADMISSION_STAGES[Math.min(i + 1, ADMISSION_STAGES.length - 1)];
          return { ...s, admissionStatus: next };
        }),
      })),
    []
  );

  /* ── lookups ── */
  const getCenter = useCallback((id) => db.centers.find((c) => c.id === id), [db.centers]);
  const getEmployee = useCallback((id) => db.employees.find((e) => e.id === id), [db.employees]);
  const getUniversity = useCallback((id) => db.universities.find((u) => u.id === id), [db.universities]);
  const getBoard = useCallback((id) => db.boards.find((b) => b.id === id), [db.boards]);
  const getStudent = useCallback((id) => db.students.find((s) => s.id === id), [db.students]);

  /* ── role scoping ──
     admin → everything; center user → own center; employee → assigned centers. */
  const visibleCenterIds = useMemo(() => {
    if (role === ROLES.ADMIN) return db.centers.map((c) => c.id);
    if (role === ROLES.CENTER) return user?.centerId ? [user.centerId] : [];
    if (role === ROLES.EMPLOYEE) {
      const emp = db.employees.find((e) => e.id === user?.employeeId);
      return emp?.assignedCenterIds || [];
    }
    return [];
  }, [role, db.centers, db.employees, user]);

  const visibleCenters = useMemo(() => {
    // personal centers are admin-only regardless of assignment
    return db.centers.filter(
      (c) => visibleCenterIds.includes(c.id) && (!c.personal || role === ROLES.ADMIN)
    );
  }, [db.centers, visibleCenterIds, role]);

  const visibleStudents = useMemo(() => {
    if (role === ROLES.ADMIN) return db.students;
    return db.students.filter((s) => {
      const inCenter = visibleCenterIds.includes(s.centerId);
      if (role === ROLES.EMPLOYEE) return inCenter && s.employeeId === user?.employeeId;
      return inCenter; // center user
    });
  }, [db.students, role, visibleCenterIds, user]);

  const value = {
    ready, db, user, role,
    login, logout, resetDemo, log,
    add, update, remove,
    requestAssignment, approveAssignment, rejectAssignment,
    setPaymentStatus, advanceAdmission,
    getCenter, getEmployee, getUniversity, getBoard, getStudent,
    visibleCenters, visibleStudents, visibleCenterIds,
    is: { admin: role === ROLES.ADMIN, center: role === ROLES.CENTER, employee: role === ROLES.EMPLOYEE },
    PAYMENT_STATUS,
  };

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used within <CrmProvider>");
  return ctx;
}
