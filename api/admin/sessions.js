import { listSessions } from "../../logStore.js";
import { requireAdmin } from "../../adminAuth.js";

export default function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  res.statusCode = 200;
  res.json(listSessions());
}
