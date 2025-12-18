import { storage } from "./storage.js";

export function appendLog(session_id, logEntry) {
  if (!storage.logs.has(session_id)) {
    storage.logs.set(session_id, []);
  }
  storage.logs.get(session_id).push(logEntry);
}

export function getSessionLogs(session_id) {
  return storage.logs.get(session_id) || [];
}
