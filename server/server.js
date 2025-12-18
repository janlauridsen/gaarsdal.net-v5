import express from "express";
import { resolveState } from "./stateResolver.js";
import { callAI } from "./aiClient.js";
import { getSession, getAllSessions } from "./sessionStore.js";
import { postAnalyze } from "./postAnalysis.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/evaluate", async (req, res) => {
  try {
    const { input, session_id } = req.body;
    const session = getSession(session_id, req.ip);

    const decision = resolveState(input, session);

    let output = decision.output || "";
    let aiMeta = { called: false };

    if (decision.ai && decision.prompt) {
      const ai = await callAI(decision.prompt);
      output = ai.text;
      aiMeta = ai.meta;
    }

    const analysis = postAnalyze(output, decision.state);

    const response = {
      session_id: session.id,
      output,
      state: decision.state,
      trigger: decision.trigger,
      ai: aiMeta,
      analysis
    };

    session.log.push({
      timestamp: Date.now(),
      input,
      response
    });

    res.json(response);
  } catch {
    res.status(500).json({ error: "Internal error" });
  }
});

/* Admin: session list */
app.get("/api/admin/sessions", (req, res) => {
  const sessions = getAllSessions().map(s => ({
    id: s.id,
    ip: s.ip,
    created: s.created,
    last: s.last,
    entries: s.log.length,
    hasWarn: s.log.some(e => e.response.analysis.status === "warn"),
    hasError: s.log.some(e => e.response.analysis.status === "error")
  }));
  res.json(sessions);
});

/* Admin: session detail */
app.get("/api/admin/sessions/:id", (req, res) => {
  const s = getAllSessions().find(x => x.id === req.params.id);
  if (!s) return res.status(404).end();
  res.json(s);
});

app.listen(3000);
