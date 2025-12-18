import { AnalysisStatus } from "./enums.js";
import { detectAnomalies } from "./anomalyRules.js";

export function postAnalyze(output, state) {
  const anomalies = detectAnomalies(output);
  let status = AnalysisStatus.OK;

  if (anomalies.length) status = AnalysisStatus.WARN;
  if (state.id === "G" && anomalies.length) status = AnalysisStatus.ERROR;

  return { status, anomalies };
}
