import { stateConfig } from "./stateConfig.js";
import { loadPrompt } from "./promptLoader.js";

export function resolveState(input) {
  const t = input.toLowerCase();

  let state = { id: "4", label: "Hypnose generelt" };
  let trigger = "faglig";
  let terminal = false;

  if (/(idiot|fup|dum)/.test(t)) {
    state = { id: "G", label: "Guard" };
    trigger = "G";
  } else if (t.includes("book")) {
    state = { id: "2", label: "Praktisk" };
    trigger = "praktisk";
  } else if (t.includes("fly")) {
    state = { id: "7", label: "Flyskræk" };
    trigger = "tema";
  } else if (t.includes("for altid")) {
    state = { id: "8", label: "Terminal" };
    trigger = "gentagelse";
    terminal = true;
  }

  const cfg = stateConfig[state.id] || {};

  return {
    state,
    trigger,
    terminal,
    transition_type: terminal ? "reset" : "enter",
    ai: cfg.ai === true,
    bypass_reason: cfg.bypass_reason || null,
    prompt: cfg.ai
      ? {
          id: cfg.prompt_id,
          system: loadPrompt(cfg.prompt_id),
          user: input,
          temperature: cfg.temperature,
          max_tokens: cfg.max_tokens
        }
      : null
  };
}
