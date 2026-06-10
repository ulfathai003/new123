/* ─── Jetro Education CRM — localStorage persistence helpers ───
   No backend is connected, so the whole CRM runs on the browser. This module
   is the only place that touches localStorage; everything else goes through
   the CrmProvider context. Bump DB_VERSION to invalidate stale demo data. */

import { buildSeed } from "./seed";

export const DB_KEY = "jetro-crm-db-v3";
export const SESSION_KEY = "jetro-crm-session-v3";

export function loadDB() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupt payload — fall through to a fresh seed */
  }
  const seeded = buildSeed();
  saveDB(seeded);
  return seeded;
}

export function saveDB(db) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* quota exceeded (large screenshots) — ignore, keep in-memory state */
  }
}

export function loadSession() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function saveSession(userId) {
  if (typeof window === "undefined") return;
  try {
    if (userId) window.localStorage.setItem(SESSION_KEY, userId);
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function resetDB() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DB_KEY);
  window.localStorage.removeItem(SESSION_KEY);
}

let counter = 0;
export function uid(prefix = "id") {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}${counter}`;
}
