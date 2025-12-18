function apiMock(input) {
  const t = input.toLowerCase();

  if (t.includes("book")) {
    return {
      output: "Du kan booke via hjemmesiden.",
      state: { id: 2, label: "Praktisk" },
      trigger: "praktisk",
      ai: { called: false, model: "-", temperature: "-", prompt_id: "-" },
      analysis: { status: "ok", anomalies: [] }
    };
  }

  if (t.includes("idiot") || t.includes("fup")) {
    return {
      output: "Dette værktøj deltager ikke i personlige angreb.",
      state: { id: "G", label: "Guard" },
      trigger: "provokation",
      ai: { called: false, model: "-", temperature: "-", prompt_id: "-" },
      analysis: { status: "ok", anomalies: [] }
    };
  }

  if (t.includes("fly")) {
    return {
      output: "Flyskræk beskrives fagligt som en situationsbetinget angst.",
      state: { id: 7, label: "Flyskræk" },
      trigger: "tema",
      ai: { called: true, model: "gpt-4.1-mini", temperature: 0, prompt_id: "state_7_v1" },
      analysis: { status: "ok", anomalies: [] }
    };
  }

  return {
    output: "Hypnose kan fagligt beskrives som en metode...",
    state: { id: 4, label: "Hypnose generelt" },
    trigger: "faglig",
    ai: { called: true, model: "gpt-4.1-mini", temperature: 0, prompt_id: "state_4_v1" },
    analysis: { status: "ok", anomalies: [] }
  };
}
