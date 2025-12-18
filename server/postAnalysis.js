// postAnalysis.js — v2
// Deterministisk, regex-baseret lint af AI-output
// Observerende: ændrer aldrig output

const RULES = [
  // A — Dialog & invitation (ERROR)
  {
    id: "A1_QUESTION",
    severity: "error",
    pattern: /\?/g
  },
  {
    id: "A2_INVITATION",
    severity: "error",
    pattern: /\b(du kan|du må|du bør|spørg|fortæl|lad mig|hvis du vil)\b/gi
  },
  {
    id: "A3_FOLLOWUP",
    severity: "error",
    pattern: /\b(hvad tænker du|vil du|ønsker du|har du lyst)\b/gi
  },

  // B — Relationel tone (ERROR)
  {
    id: "B1_EMPATHY",
    severity: "error",
    pattern: /\b(jeg forstår|det lyder|det giver mening|jeg er ked af)\b/gi
  },
  {
    id: "B2_PERSONAL",
    severity: "error",
    pattern: /\b(for dig|hos dig|din situation|i dit tilfælde)\b/gi
  },

  // C — Rådgivning / vurdering (ERROR)
  {
    id: "C1_ADVICE",
    severity: "error",
    pattern: /\b(du bør|jeg anbefaler|det anbefales|det er bedst at)\b/gi
  },
  {
    id: "C2_EFFECT",
    severity: "error",
    pattern: /\b(vil hjælpe|virker for|har effekt for|god løsning)\b/gi
  },

  // D — Modalverber (WARN)
  {
    id: "D1_MODAL",
    severity: "warn",
    pattern: /\b(kan|ofte|typisk|muligvis|nogle gange)\b/gi
  },

  // E — Kvantificering (STATE-AFHÆNGIG)
  {
    id: "E1_NUMBERS",
    severity: "state",
    pattern: /\b\d+(\s*[-–]\s*\d+)?\b/g
  },
  {
    id: "E2_TIME",
    severity: "state",
    pattern: /\b(uger|måneder|sessioner|gange|forløb)\b/gi
  },

  // F — Evidensord (STATE-AFHÆNGIG)
  {
    id: "F1_EVIDENCE",
    severity: "state",
    pattern: /\b(studier|forskning|evidens|meta-analyse|randomiseret)\b/gi
  }
];

function isErrorState(ruleId, stateId) {
  // Kvantificering er ERROR i state 7 og 8
  if ((ruleId === "E1_NUMBERS" || ruleId === "E2_TIME") && (stateId === "7" || stateId === "8")) {
    return "error";
  }

  // Evidensord er ERROR uden for state 5
  if (ruleId === "F1_EVIDENCE" && stateId !== "5") {
    return "error";
  }

  return "warn";
}

export function postAnalyze(text, state) {
  const stateId = state?.id || "";
  const matches = [];

  for (const rule of RULES) {
    const found = text.match(rule.pattern);
    if (!found) continue;

    if (rule.severity === "error") {
      matches.push({
        rule: rule.id,
        severity: "error"
      });
    } else if (rule.severity === "warn") {
      matches.push({
        rule: rule.id,
        severity: "warn"
      });
    } else if (rule.severity === "state") {
      matches.push({
        rule: rule.id,
        severity: isErrorState(rule.id, stateId)
      });
    }
  }

  let status = "ok";
  if (matches.some(m => m.severity === "error")) status = "error";
  else if (matches.some(m => m.severity === "warn")) status = "warn";

  return {
    status,
    anomalies: matches.map(m => m.rule),
    matches
  };
}
