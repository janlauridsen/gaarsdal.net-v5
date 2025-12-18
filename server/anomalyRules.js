import { Anomaly } from "./enums.js";

export function detectAnomalies(text) {
  const t = text.toLowerCase();
  const anomalies = [];

  if (/(jeg forstår|det lyder|jeg er ked af)/.test(t)) {
    anomalies.push(Anomaly.RELATIONAL_TONE);
  }

  if (/(du bør|jeg anbefaler|mit råd)/.test(t)) {
    anomalies.push(Anomaly.ADVICE_FOUND);
  }

  if (/\?$/.test(text.trim())) {
    anomalies.push(Anomaly.QUESTION_FOUND);
    anomalies.push(Anomaly.INVITATION_FOUND);
  }

  if (/(jeg håber|det er helt normalt)/.test(t)) {
    anomalies.push(Anomaly.EMPATHY_FOUND);
  }

  if (text.length > 700) {
    anomalies.push(Anomaly.OVERLONG_RESPONSE);
  }

  return anomalies;
}
