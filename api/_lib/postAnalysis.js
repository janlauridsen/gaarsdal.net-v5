import { AnalysisStatus, Anomaly } from "./enums.js";

const RULES = [
  { code: Anomaly.QUESTION_FOUND, regex: /\?/ },
  { code: Anomaly.RELATIONAL_TONE, regex: /\b(jeg forstår|det lyder|jeg er ked af)\b/i },
  { code: Anomaly.ADVICE_FOUND, regex: /\b(du bør|jeg anbefaler|det anbefales)\b/i },
  { code: Anomaly.EMPATHY_FOUND, regex: /\b(jeg forstår|det giver mening)\b/i },
  { code: Anomaly.OVERLONG_RESPONSE, regex: /(.|\n){400,}/ }
];

export function postAnalyze(text = "") {
  const anomalies = [];

  for (const rule of RULES) {
    if (rule.regex.test(text)) {
      anomalies.push(rule.code);
    }
  }

  let status = AnalysisStatus.OK;
  if (anomalies.length > 0) status = AnalysisStatus.WARN;
  if (anomalies.some(a => a !== Anomaly.OVERLONG_RESPONSE)) {
    status = AnalysisStatus.ERROR;
  }

  return { status, anomalies };
}
