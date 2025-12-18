export default function handler(req, res) {
  const token = req.headers.authorization;
  if (token !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).end();
  }

  res.json({
    sessions: [],
    note: "Session persistence aktiveres i senere fase"
  });
}
