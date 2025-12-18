import { Anomaly } from "./enums.js";

export function detectAnomalies(text) {
  const t = text.toLowerCase();
  const a = [];

  if (/(jeg forstår|det lyder)/.test(t)) a.push(Anomaly.RELATIONAL_TONE);
  if (/(du bør|jeg anbefaler)/.test(t)) a.push(Anomaly.ADVICE_FOUND);
  if (/\?$/.test(text.trim())) a.push(Anomaly.QUESTION_FOUND);
  if (/(jeg håber|det er normalt)/.test(t)) a.push(Anomaly.EMPATHY_FOUND);
  if (text.length > 700) a.push(Anomaly.OVERLONG_RESPONSE);

  return a;
}
