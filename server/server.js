import express from "express";
import { resolveState } from "./stateResolver.js";
import { callAI } from "./aiClient.js";
import { getSession } from "./sessionStore.js";
import { postAnalyze } from "./postAnalysis.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/api/evaluate", async (req, res) => {
  try {
    const { input, session_id } = req.body;

    if (!input || typeof input !== "string") {
      return res.status(400).json({ error: "Invalid input" });
    }

    const session = getSession(session_id, req.ip);

    const decision = resolveState(input, session);

    let output = decision.output || "";
    let aiMeta = {
      called: false,
      model: null,
      temperature: null,
      prompt_id: null
    };

    if (decision.ai === true && decision.prompt) {
      const aiResult = await callAI(decision.prompt);
      output = aiResult.text;
      aiMeta = aiResult.meta;
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

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
