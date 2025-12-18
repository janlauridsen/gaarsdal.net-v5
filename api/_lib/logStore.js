import { sessions, logs } from "./storage.js";
import { randomUUID } from "crypto";

export function getOrCreateSession({ session_id, ip, geo }) {
  if (session_id && sessions.has(session_id)) {
    const s = sessions.get(session_id);
    s.last_activity_at = Date.now();
    return s;
  }

  const id = randomUUID();
  const session = {
    session_id: id,
    created_at: Date.now(),
    last_activity_at: Date.now(),
    ip,
    geo
  };

  sessions.set(id, session);
  logs.set(id, []);
  return session;
}

export function appendLog(session_id, entry) {
  if (!logs.has(session_id)) logs.set(session_id, []);
  logs.get(session_id).push(entry);
}

export function listSessions() {
  return Array.from(sessions.values()).map(s => ({
    session_id: s.session_id,
    created_at: s.created_at,
    last_activity_at: s.last_activity_at,
    ip: s.ip,
    geo: s.geo,
    count: logs.get(s.session_id)?.length || 0
  }));
}

export function getSessionLogs(session_id) {
  return logs.get(session_id) || [];
}
