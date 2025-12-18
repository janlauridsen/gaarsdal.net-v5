import express from "express";
import { resolveState } from "./stateResolver.js";
import { callAI } from "./aiClient.js";
import { getSession } from "./sessionStore.js";

const app = express();
app.use(express.json());

app.post("/api/evaluate", async (req, res) => {
  const { input, session_id } = req.body;
  const session = getSession(session_id, req.ip);

  const stateResult = resolveState(input, session);

  let output = stateResult.output;
  let aiMeta = { called: false };

  if (stateResult.ai) {
    const aiRes = await callAI(stateResult.prompt);
    output = aiRes.text;
    aiMeta = aiRes.meta;
  }

  const response = {
    session_id: session.id,
    output,
    state: stateResult.state,
    trigger: stateResult.trigger,
    ai: aiMeta,
    analysis: {
      status: "ok",
      anomalies: []
    }
  };

  session.log.push({ input, response });
  res.json(response);
});

app.listen(3000);
