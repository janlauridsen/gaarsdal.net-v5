// In-memory v1 (kan erstattes af KV / DB)
export const sessions = new Map(); // session_id -> session meta
export const logs = new Map();     // session_id -> [entries]
