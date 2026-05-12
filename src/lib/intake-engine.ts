import questionTreeJson from "../../data/intake_question_tree.json";
import {
  evaluateAutoFillCondition,
  isQuestionVisible,
} from "../../lib/intake/conditions";
import type { IntakeQuestion, TreeAnswersState } from "../../lib/intake/questionTreeTypes";

const QUESTIONS = questionTreeJson as IntakeQuestion[];

function isAnswered(id: string, answers: TreeAnswersState): boolean {
  return Object.prototype.hasOwnProperty.call(answers, id);
}

function findVisibleVariant(
  startIndex: number,
  answers: TreeAnswersState,
): IntakeQuestion | null {
  const id = QUESTIONS[startIndex].id;
  for (let index = startIndex; index < QUESTIONS.length && QUESTIONS[index].id === id; index++) {
    const question = QUESTIONS[index];
    if (isQuestionVisible(question.show_if, question.skip_if, answers)) return question;
  }
  return null;
}

function skipQuestionVariants(startIndex: number): number {
  const id = QUESTIONS[startIndex].id;
  let index = startIndex;
  while (index < QUESTIONS.length && QUESTIONS[index].id === id) index++;
  return index;
}

export function getNextQuestion(answers: TreeAnswersState): IntakeQuestion | null {
  let index = 0;
  while (index < QUESTIONS.length) {
    const id = QUESTIONS[index].id;
    if (isAnswered(id, answers)) {
      index = skipQuestionVariants(index);
      continue;
    }
    const visible = findVisibleVariant(index, answers);
    if (visible) return visible;
    index = skipQuestionVariants(index);
  }
  return null;
}

export function applyAutoFill(
  question: IntakeQuestion,
  answer: string | number | boolean,
  answers: TreeAnswersState,
): TreeAnswersState {
  const rule = question.auto_fill;
  if (!rule || !evaluateAutoFillCondition(rule.condition, answer)) return answers;
  return { ...answers, [rule.field]: rule.value };
}

function neutralAnswer(question: IntakeQuestion): string | number | boolean {
  if (question.type === "number") return 0;
  if (question.type === "text") return "";
  return question.options?.[0]?.value ?? "";
}

function countVisibleQuestionIds(answers: TreeAnswersState): number {
  const visibleIds = new Set<string>();
  let index = 0;
  while (index < QUESTIONS.length) {
    const id = QUESTIONS[index].id;
    if (visibleIds.has(id) || isAnswered(id, answers)) {
      index = skipQuestionVariants(index);
      continue;
    }
    if (findVisibleVariant(index, answers)) visibleIds.add(id);
    index = skipQuestionVariants(index);
  }
  return visibleIds.size;
}

function estimateTotalVisibleQuestions(answers: TreeAnswersState): number {
  const simulated = { ...answers };
  while (true) {
    const next = getNextQuestion(simulated);
    if (!next) break;
    const answer = neutralAnswer(next);
    const nextState = { ...applyAutoFill(next, answer, simulated), [next.id]: answer };
    Object.assign(simulated, nextState);
  }
  return countVisibleQuestionIds(simulated);
}

export function getProgress(answers: TreeAnswersState): number {
  const answered = Object.keys(answers).filter((id) =>
    QUESTIONS.some((question) => question.id === id),
  ).length;
  const total = estimateTotalVisibleQuestions(answers);
  if (total === 0) return 0;
  return Math.min(100, Math.round((answered / total) * 100));
}

export function isComplete(answers: TreeAnswersState): boolean {
  return getNextQuestion(answers) === null;
}
