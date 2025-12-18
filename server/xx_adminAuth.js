export function requireAdmin(req, res) {
  const token = req.headers["x-admin-token"];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.statusCode = 401;
    res.end("Unauthorized");
    return false;
  }
  return true;
}
