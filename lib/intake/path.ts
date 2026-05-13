import { isQuestionVisible } from "./conditions";
import type { IntakeQuestion, TreeAnswersState } from "./questionTreeTypes";

export function getVisiblePathIndices(questions: readonly IntakeQuestion[], answers: TreeAnswersState): number[] {
  const indices: number[] = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (isQuestionVisible(q.show_if, q.skip_if, answers, { questionId: q.id })) indices.push(i);
  }
  return indices;
}

export function nextTreeIndexAfter(questions: readonly IntakeQuestion[], answers: TreeAnswersState, afterIndex: number): number | null {
  const path = getVisiblePathIndices(questions, answers);
  return path.find((i) => i > afterIndex) ?? null;
}

export function clearAnswersAfterIndex(questions: readonly IntakeQuestion[], answers: TreeAnswersState, afterIndex: number): TreeAnswersState {
  const next: TreeAnswersState = { ...answers };
  for (let i = afterIndex + 1; i < questions.length; i++) {
    delete next[questions[i].id];
  }
  return next;
}
