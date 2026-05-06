import { mapTreeAnswersToUserAnswers } from "./mapUserAnswers";
import type { TreeAnswersState } from "./questionTreeTypes";

export interface AnalyzeResponsePayload {
  id: string;
  result: unknown;
  report: unknown;
}

export async function postIntakeAnalysis(answers: TreeAnswersState): Promise<AnalyzeResponsePayload> {
  const userAnswers = mapTreeAnswersToUserAnswers(answers);
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userAnswers),
  });
  return (await response.json()) as AnalyzeResponsePayload;
}
