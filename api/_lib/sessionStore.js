import { randomUUID } from "crypto";
import { storage } from "./storage.js";

const DEFAULT_TTL = 1000 * 60 * 60 * 24 * 14; // 14 days

export function getOrCreateSession({ session_id, ip, geo, ttl = DEFAULT_TTL }) {
  const now = Date.now();

  if (session_id && storage.sessions.has(session_id)) {
    const existing = storage.sessions.get(session_id);

    if (now - existing.last_activity_at <= ttl) {
      existing.last_activity_at = now;
      return existing;
    }

    // expired session
    storage.sessions.delete(session_id);
    storage.logs.delete(session_id);
  }

  const id = randomUUID();

  const session = {
    session_id: id,
    created_at: now,
    last_activity_at: now,
    ip,
    geo: geo || {
      country: null,
      region: null,
      city: null
    }
  };

  storage.sessions.set(id, session);
  storage.logs.set(id, []);

  return session;
}

export function listSessions() {
  return Array.from(storage.sessions.values()).map(s => ({
    session_id: s.session_id,
    created_at: s.created_at,
    last_activity_at: s.last_activity_at,
    ip: s.ip,
    geo: s.geo,
    count: storage.logs.get(s.session_id)?.length || 0
  }));
}
