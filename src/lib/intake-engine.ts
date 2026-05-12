import questionTreeJson from "../../data/intake_question_tree.json";
import {
  evaluateAutoFillCondition,
  isQuestionVisible,
} from "../../lib/intake/conditions";
import type { Condition, IntakeQuestion, TreeAnswersState } from "../../lib/intake/questionTreeTypes";

const BASELINE_QUESTION_IDS = [
  "age",
  "education_level",
  "english_level",
  "marital_status",
] as const;

const MIN_QUESTIONS_BEFORE_COMPLETE = 5;

type BaselineQuestionId = (typeof BASELINE_QUESTION_IDS)[number];

export const INITIAL_ANSWERS: TreeAnswersState = {
  selected_country: "canada",
};

function isBaselineQuestionId(id: string): id is BaselineQuestionId {
  return (BASELINE_QUESTION_IDS as readonly string[]).includes(id);
}

function isUsOnlyQuestion(question: IntakeQuestion): boolean {
  const { show_if: showIf } = question;
  if (showIf.length === 0) return false;
  return showIf.every(
    (condition: Condition) =>
      condition.field === "selected_country" &&
      condition.operator === "eq" &&
      condition.value === "us",
  );
}

const QUESTIONS = (questionTreeJson as IntakeQuestion[]).filter(
  (question) => !isUsOnlyQuestion(question),
);

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

function getVisibleQuestionIdsFromTree(answers: TreeAnswersState): string[] {
  const visibleIds: string[] = [];
  let index = 0;
  while (index < QUESTIONS.length) {
    const id = QUESTIONS[index].id;
    if (visibleIds.includes(id) || isAnswered(id, answers)) {
      index = skipQuestionVariants(index);
      continue;
    }
    if (findVisibleVariant(index, answers)) visibleIds.push(id);
    index = skipQuestionVariants(index);
  }
  return visibleIds;
}

function getVisibleQuestionIds(answers: TreeAnswersState): string[] {
  const ordered = getVisibleQuestionIdsFromTree(answers);
  for (const baselineId of BASELINE_QUESTION_IDS) {
    if (!ordered.includes(baselineId) && !isAnswered(baselineId, answers)) {
      ordered.push(baselineId);
    }
  }
  return ordered;
}

function resolveQuestionById(id: string, answers: TreeAnswersState): IntakeQuestion | null {
  const startIndex = QUESTIONS.findIndex((question) => question.id === id);
  if (startIndex < 0) return null;
  const visible = findVisibleVariant(startIndex, answers);
  if (visible) return visible;
  if (isBaselineQuestionId(id)) return QUESTIONS[startIndex];
  return null;
}

function getTreeNextQuestion(answers: TreeAnswersState): IntakeQuestion | null {
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

export function getNextQuestion(answers: TreeAnswersState): IntakeQuestion | null {
  for (const id of getVisibleQuestionIds(answers)) {
    if (isAnswered(id, answers)) continue;
    const question = resolveQuestionById(id, answers);
    if (question) return question;
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

function countAnsweredQuestions(answers: TreeAnswersState): number {
  return Object.keys(answers).filter((id) =>
    QUESTIONS.some((question) => question.id === id),
  ).length;
}

function countVisibleQuestionIds(answers: TreeAnswersState): number {
  return getVisibleQuestionIds(answers).length;
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
  const answered = countAnsweredQuestions(answers);
  const total = estimateTotalVisibleQuestions(answers);
  if (total === 0) return 0;
  return Math.min(100, Math.round((answered / total) * 100));
}

export function isComplete(answers: TreeAnswersState): boolean {
  return (
    getTreeNextQuestion(answers) === null &&
    getNextQuestion(answers) === null &&
    countAnsweredQuestions(answers) >= MIN_QUESTIONS_BEFORE_COMPLETE &&
    BASELINE_QUESTION_IDS.every((id) => isAnswered(id, answers))
  );
}
