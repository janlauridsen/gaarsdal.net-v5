export const stateConfig = {
  // 0 — Åben indgang
  "0": {
    ai: true,
    temperature: 0.0,
    max_tokens: 120,
    prompt_id: "state_0_v3"
  },

  // 1 — Meta / rolleafklaring
  "1": {
    ai: true,
    temperature: 0.0,
    max_tokens: 120,
    prompt_id: "state_1_v3"
  },

  // 2 — Praktisk / administrativ
  "2": {
    ai: false,
    bypass_reason: "practical"
  },

  // 3 — Faglig afklaring (bred)
  "3": {
    ai: true,
    temperature: 0.0,
    max_tokens: 220,
    prompt_id: "state_4_v3"
  },

  // 4 — Hypnose generelt
  "4": {
    ai: true,
    temperature: 0.0,
    max_tokens: 300,
    prompt_id: "state_4_v3"
  },

  // 5 — Evidens / risiko
  "5": {
    ai: true,
    temperature: 0.0,
    max_tokens: 250,
    prompt_id: "state_5_v3"
  },

  // 6 — Tema-afklaring
  "6": {
    ai: true,
    temperature: 0.0,
    max_tokens: 180,
    prompt_id: "state_4_v3"
  },

  // 7 — Snævert tema
  "7": {
    ai: true,
    temperature: 0.0,
    max_tokens: 180,
    prompt_id: "state_7_v3"
  },

  // 8 — Gentagelse / terminal
  "8": {
    ai: true,
    temperature: 0.0,
    max_tokens: 80,
    prompt_id: "state_8_v2"
  },

  // 9 — Uden for scope
  "9": {
    ai: false,
    bypass_reason: "out_of_scope"
  },

  // G — Guard
  "G": {
    ai: true,
    temperature: 0.0,
    max_tokens: 40,
    prompt_id: "guard_v2"
  }
};
