import { stateConfig } from "./stateConfig.js";
import { loadPrompt } from "./promptLoader.js";

/*
  StateResolver V2

  Ansvar:
  - Klassificere input
  - Bestemme næste state
  - Bestemme transition-type og trigger
  - Konstruere AI-kaldsparametre ud fra stateConfig

  Resolveren:
  - har INGEN hukommelse
  - kender IKKE session, gentagelser eller historik
  - udfører INGEN etik- eller toneanalyse
*/

export function resolveState({ input, forcedState = null }) {
  const text = input.toLowerCase();

  // --- 1. Klassifikation (ren, deterministisk) ---

  let nextState = "4"; // default: Hypnose generelt
  let trigger = "faglig";
  let terminal = false;
  let transition_type = "enter";

  // Guard har altid forrang
  if (/(idiot|fup|dum|svindel)/.test(text)) {
    nextState = "G";
    trigger = "G";
    transition_type = "interrupt";
  }

  // Praktisk / administrativ
  else if (/(book|tid|pris|kontakt)/.test(text)) {
    nextState = "2";
    trigger = "praktisk";
  }

  // Uden for scope
  else if (/(rødbeder|vejrudsigt|sport)/.test(text)) {
    nextState = "9";
    trigger = "andet";
  }

  // Snævert tema (eksempel)
  else if (/fly/.test(text)) {
    nextState = "7";
    trigger = "tema";
  }

  // Terminal vurdering / gentagelse-indikator
  else if (/(for altid|garanteret|virker det|er det sikkert)/.test(text)) {
    nextState = "8";
    trigger = "gentagelse";
    terminal = true;
    transition_type = "reset";
  }

  // Meta / rolleafklaring
  else if (/(kan i hjælpe|hvad kan i|hvad er dette)/.test(text)) {
    nextState = "1";
    trigger = "meta";
  }

  // Forced override (bruges af systemet, ikke UI)
  if (forcedState && stateConfig[forcedState]) {
    nextState = forcedState;
    trigger = "system";
    transition_type = "reset";
  }

  const cfg = stateConfig[nextState];

  // --- 2. Output-kontrakt ---

  return {
    state: {
      id: nextState
    },

    transition: {
      type: transition_type,
      trigger
    },

    terminal,

    ai: cfg.ai === true
      ? {
          called: true,
          bypass_reason: null,
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
          bypass_reason: cfg.bypass_reason || "none",
          prompt: null
        }
  };
}
