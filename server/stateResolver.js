export function resolveState(input, session) {
  const t = input.toLowerCase();

  if (t.match(/idiot|fup|dum/)) {
    return {
      state: { id: "G", label: "Guard" },
      trigger: "provokation",
      ai: false,
      output: "Dette værktøj deltager ikke i personlige angreb."
    };
  }

  if (t.includes("book")) {
    return {
      state: { id: 2, label: "Praktisk" },
      trigger: "praktisk",
      ai: false,
      output: "Du kan booke via hjemmesiden."
    };
  }

  if (t.includes("fly")) {
    return {
      state: { id: 7, label: "Flyskræk" },
      trigger: "tema",
      ai: true,
      prompt: {
        id: "state_7_v1",
        system: "Faglig afklaring af flyskræk via hypnose.",
        user: input
      }
    };
  }

  return {
    state: { id: 4, label: "Hypnose generelt" },
    trigger: "faglig",
    ai: true,
    prompt: {
      id: "state_4_v1",
      system: "Faglig definition af hypnose.",
      user: input
    }
  };
}
