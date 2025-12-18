import { stateConfig } from "./stateConfig.js";
import { loadPrompt } from "./renderResponse.js";

export function resolveState({ input }) {
  const t = input.toLowerCase();

  let id = "4";
  let trigger = "faglig";
  let terminal = false;
  let type = "enter";

  if (/(idiot|fup|dum|svindel)/.test(t)) {
    id = "G";
    trigger = "G";
    type = "interrupt";
  } else if (/(book|pris|kontakt)/.test(t)) {
    id = "2";
    trigger = "praktisk";
  } else if (/fly/.test(t)) {
    id = "7";
    trigger = "tema";
  } else if (/(for altid|garanteret)/.test(t)) {
    id = "8";
    trigger = "gentagelse";
    terminal = true;
    type = "reset";
  } else if (/(kan i hjælpe|hvad kan i)/.test(t)) {
    id = "1";
    trigger = "meta";
  }

  const cfg = stateConfig[id];

  return {
    state: { id },
    transition: { type, trigger },
    terminal,
    ai: cfg.ai
      ? {
          called: true,
          prompt: {
            id: cfg.prompt_id,
            system: loadPrompt(cfg.prompt_id),
            user: input,
            temperature: cfg.temperature,
            max_tokens: cfg.max_tokens
          }
        }
      : {
          called: false,
          bypass_reason: cfg.bypass_reason || "none"
        }
  };
}
