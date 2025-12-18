import { resolveState } from "../server/stateResolver.js";
import { callAI } from "../server/aiClient.js";
import { postAnalyze } from "../server/postAnalysis.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const { input, session_id } = req.body || {};
    if (!input || typeof input !== "string") {
      return res.status(400).json({ error: "Invalid input" });
    }

    const decision = resolveState(input);

    let output = decision.output || "";
    let aiMeta = { called: false };

    if (decision.ai && decision.prompt) {
      try {
        const ai = await callAI(decision.prompt);
        output = ai.text;
        aiMeta = ai.meta;
      } catch {
        output = "Systemet kunne ikke levere et svar på nuværende tidspunkt.";
        aiMeta = { called: true, error: "AI_FAILURE" };
      }
    }

    const analysis = postAnalyze(output, decision.state);

    res.status(200).json({
      session_id: session_id || crypto.randomUUID(),
      output,
      state: decision.state,
      trigger: decision.trigger,
      ai: aiMeta,
      analysis
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}
