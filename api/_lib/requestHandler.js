import { getOrCreateSession } from "./sessionStore.js";
import { appendLog } from "./logStore.js";
import { resolveState } from "./stateResolver.js";
import { callAI } from "./aiClient.js";
import { postAnalyze } from "./postAnalysis.js";

export async function handleRequest({ input, session_id, ip, geo }) {
  const session = getOrCreateSession({ session_id, ip, geo });
  const resolved = resolveState({ input });

  let output = "";
  let aiMeta = { called: false, bypass_reason: resolved.ai.bypass_reason || null };

  if (resolved.ai.called) {
    output = await callAI(resolved.ai.prompt);
    aiMeta = {
      called: true,
      prompt_id: resolved.ai.prompt.id,
      model: "gpt-4.1-mini",
      error: null
    };
  } else {
    output = "Dette håndteres administrativt.";
  }

  const analysis = postAnalyze(output);

  appendLog(session.session_id, {
    timestamp: Date.now(),
    session: {
      session_id: session.session_id,
      ip: session.ip,
      geo: session.geo
    },
    input: { raw: input },
    state: resolved.state,
    transition: resolved.transition,
    ai: aiMeta,
    output: { text: output, terminal: resolved.terminal },
    analysis
  });

  return {
    session_id: session.session_id,
    output,
    terminal: resolved.terminal
  };
}
