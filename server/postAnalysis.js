import { AnalysisStatus } from "./enums.js";
import { detectAnomalies } from "./anomalyRules.js";

export function postAnalyze(output, state) {
  const anomalies = detectAnomalies(output);

  let status = AnalysisStatus.OK;

  if (anomalies.length > 0) {
    status = AnalysisStatus.WARN;
  }

  if (
    state.id === "G" &&
    anomalies.length > 0
  ) {
    status = AnalysisStatus.ERROR;
  }

  return {
    status,
    anomalies
  };
}
