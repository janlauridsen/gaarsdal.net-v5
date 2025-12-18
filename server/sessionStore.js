import { v4 as uuid } from "uuid";

const TTL = 1000 * 60 * 60 * 24 * 14;
const sessions = new Map();

export function getSession(id, ip) {
  let s = id && sessions.get(id);
  if (!s || Date.now() - s.last > TTL) {
    s = { id: uuid(), ip, created: Date.now(), last: Date.now(), log: [] };
    sessions.set(s.id, s);
  }
  s.last = Date.now();
  return s;
}

export function getAllSessions() {
  return [...sessions.values()];
}
