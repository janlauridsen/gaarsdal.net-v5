import { getOrCreateSession } from "./sessionStore.js";
import { appendLog } from "./logStore.js";
import { resolveState } from "./stateResolver.js";
import { callAI } from "./aiClient.js";
import { postAnalyze } from "./postAnalysis.js";

/*
  Én indgang.
  Én sandhed.
*/

export async function handleRequest({
  input,
  session_id,
  ip,
  geo
}) {
  // 1. Session
  const session = getOrCreateSession({ session_id, ip, geo });

  // 2. State resolution
  const resolved = resolveState({ input });

  let outputText = "";
  let aiMeta = {
    called: false,
    bypass_reason: resolved.ai.bypass_reason,
    prompt_id: null,
    model: "gpt-4.1-mini",
    error: null
  };

  // 3. AI call (if applicable)
  if (resolved.ai.called) {
    try {
      outputText = await callAI(resolved.ai.prompt);
      aiMeta = {
        called: true,
        bypass_reason: null,
        prompt_id: resolved.ai.prompt.id,
        model: "gpt-4.1-mini",
        error: null
      };
    } catch (err) {
      outputText = "Systemfejl.";
      aiMeta.error = err.message;
    }
  } else {
    outputText = "Dette håndteres administrativt.";
  }

  // 4. Post-analysis
  const analysis = postAnalyze(outputText);

  // 5. Log entry (KANONISK)
  const logEntry = {
    timestamp: Date.now(),

    session: {
      session_id: session.session_id,
      ip: session.ip,
      geo: session.geo
    },

    input: {
      raw: input
    },

    state: {
      id: resolved.state.id
    },

    transition: resolved.transition,

    ai: aiMeta,

    output: {
      text: outputText,
      terminal: resolved.terminal
    },

    analysis
  };

  appendLog(session.session_id, logEntry);

  return {
    session_id: session.session_id,
    output: outputText,
    terminal: resolved.terminal
  };
}
