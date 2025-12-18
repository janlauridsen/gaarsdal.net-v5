import express from "express";
import { resolveState } from "./stateResolver.js";
import { callAI } from "./aiClient.js";
import { getSession } from "./sessionStore.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/evaluate", async (req, res) => {
  const { input, session_id } = req.body;
  const session = getSession(session_id, req.ip);

  const decision = resolveState(input, session);

  let output = decision.output;
  let aiMeta = { called: false };

  if (decision.ai) {
    const ai = await callAI(decision.prompt);
    output = ai.text;
    aiMeta = ai.meta;
  }

  const response = {
    session_id: session.id,
    output,
    state: decision.state,
    trigger: decision.trigger,
    ai: aiMeta,
    analysis: { status: "ok", anomalies: [] }
  };

  session.log.push({ input, response });
  res.json(response);
});

app.listen(3000);
