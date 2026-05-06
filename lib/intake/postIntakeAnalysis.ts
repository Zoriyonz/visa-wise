import type { AnalysisResult } from "../ai";
import type { EligibilityReport } from "../eligibility/types";
import { mapTreeAnswersToUserAnswers } from "./mapUserAnswers";
import type { TreeAnswersState } from "./questionTreeTypes";

export interface AnalyzeResponsePayload {
  id: string;
  summary: string;
  result: AnalysisResult;
  report: EligibilityReport;
}

export async function postIntakeAnalysis(answers: TreeAnswersState): Promise<AnalyzeResponsePayload> {
  const userAnswers = mapTreeAnswersToUserAnswers(answers);
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userAnswers),
  });
  const payload: AnalyzeResponsePayload = await response.json();
  return payload;
}
