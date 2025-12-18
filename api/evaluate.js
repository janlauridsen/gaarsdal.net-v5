import { getOrCreateSession, appendLog } from "../server/logStore.js";
import { resolveState } from "../server/stateResolver.js";
import { callAI } from "../server/aiClient.js";
import { postAnalyze } from "../server/postAnalysis.js";

export default async function handler(req, res) {
  try {
    // ---- Parse body safely (Vercel-safe) ----
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

    const rawInput = body.input;
    if (!rawInput || typeof rawInput !== "string") {
      res.status(400).json({ error: "Missing input" });
      return;
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "unknown";

    // ---- Session ----
    const session = getOrCreateSession({
      session_id: body.session_id,
      ip,
      geo: body.geo || null
    });

    // ---- State resolution ----
    const state = resolveState(rawInput);

    let outputText = "";
    let aiMeta = {
      called: false,
      bypass_reason: state.ai ? "none" : state.bypass_reason || "bypass",
      prompt_id: null,
      model: null,
      temperature: null,
      max_tokens: null,
      error: null
    };

    // ---- AI or bypass ----
    if (state.ai) {
      const aiResult = await callAI(state, rawInput);
      outputText = aiResult.text;
      aiMeta = aiResult.meta;
    } else {
      outputText = state.bypass_text || "";
    }

    // ---- Post analysis ----
    const analysis = postAnalyze(outputText, state);

    // ---- Final log entry ----
    const entry = {
      timestamp: Date.now(),
      session,
      input: { raw: rawInput },
      state: { id: state.id, label: state.label },
      transition: {
        type: "enter",
        trigger: state.trigger || "direct"
      },
      ai: aiMeta,
      output: {
        text: outputText,
        terminal: Boolean(state.terminal)
      },
      analysis
    };

    appendLog(session.session_id, entry);

    // ---- JSON response (always) ----
    res.status(200).json(entry);

  } catch (err) {
    console.error("EVALUATE ERROR:", err);

    res.status(500).json({
      error: "internal_error",
      message: err.message || String(err)
    });
  }
}
