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

    let outputText = decision.output || "";
    let ai = {
      called: false,
      bypass_reason: "none",
      prompt_id: null,
      model: null,
      error: null
    };

    if (decision.ai && decision.prompt) {
      try {
        const aiRes = await callAI(decision.prompt);
        outputText = aiRes.text;
        ai = {
          called: true,
          bypass_reason: "none",
          prompt_id: aiRes.meta.prompt_id,
          model: aiRes.meta.model,
          error: null
        };
      } catch {
        outputText = "Systemet kunne ikke levere et svar.";
        ai = {
          called: true,
          bypass_reason: "none",
          prompt_id: null,
          model: null,
          error: "AI_FAILURE"
        };
      }
    } else {
      ai.bypass_reason = decision.bypass_reason || "unknown";
    }

    const analysis = postAnalyze(outputText, decision.state);

    const logEntry = {
      timestamp: Date.now(),

      session: {
        session_id: session_id || crypto.randomUUID(),
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        geo: null
      },

      input: {
        raw: input
      },

      state: decision.state,

      transition: {
        type: decision.transition_type,
        trigger: decision.trigger
      },

      ai,

      output: {
        text: outputText,
        terminal: Boolean(decision.terminal)
      },

      analysis
    };

    res.status(200).json(logEntry);

  } catch {
    res.status(500).json({ error: "Server error" });
  }
}
