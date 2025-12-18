// Canonical in-memory storage (V1)
// Single source of truth for sessions and logs

export const storage = {
  sessions: new Map(), // session_id -> session object
  logs: new Map()      // session_id -> [LogEntry]
};
