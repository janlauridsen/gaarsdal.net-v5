import { storage } from "./storage.js";

export function appendLog(session_id, entry) {
  if (!storage.logs.has(session_id)) {
    storage.logs.set(session_id, []);
  }
  storage.logs.get(session_id).push(entry);
}

export function getSessionLogs(session_id) {
  return storage.logs.get(session_id) || [];
}
