import { getSessionLogs } from "../../logStore.js";
import { requireAdmin } from "../../adminAuth.js";

export default function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  const id = req.query.id;
  res.statusCode = 200;
  res.json(getSessionLogs(id));
}
