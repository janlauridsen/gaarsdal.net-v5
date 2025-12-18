import { getOrCreateSession, appendLog } from "../logStore.js";
import { postAnalyze } from "../postAnalysis.js";
import { resolveState } from "../stateResolver.js";
import { callAI } from "../aiClient.js";

export default async function handler(req, res) {
  const body = JSON.parse(req.body || "{}");
  const ip = req.headers["x-forwarded-for"] || "unknown";

  const session = getOrCreateSession({
    session_id: body.session_id,
    ip,
    geo: body.geo || null
  });

  const state = resolveState(body.input);
  let outputText = "";
  let aiMeta = { called: false, bypass_reason: "none" };

  if (state.ai) {
    const ai = await callAI(state, body.input);
    outputText = ai.text;
    aiMeta = ai.meta;
  } else {
    outputText = state.bypass_text || "";
    aiMeta = { called: false, bypass_reason: state.bypass_reason };
  }

  const analysis = postAnalyze(outputText, state);

  const entry = {
    timestamp: Date.now(),
    session,
    input: { raw: body.input },
    state: { id: state.id, label: state.label },
    transition: { type: "enter", trigger: state.trigger },
    ai: aiMeta,
    output: { text: outputText, terminal: state.terminal },
    analysis
  };

  appendLog(session.session_id, entry);

  res.statusCode = 200;
  res.json(entry);
}
