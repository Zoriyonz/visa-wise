import type { Condition, TreeAnswersState } from "./questionTreeTypes";

const PLACEHOLDER = "$selected_country_iso";

export function resolveSelectedCountryIso(answers: TreeAnswersState): "CA" | "US" {
  return answers.selected_country === "us" ? "US" : "CA";
}

function lookupAnswerKey(key: string, answers: TreeAnswersState): unknown {
  if (!(key in answers)) return undefined;
  const value = answers[key];
  if (value === undefined || value === null) return undefined;
  return value;
}

export function resolveValue(
  raw: string | number | boolean | (string | number | boolean)[],
  answers: TreeAnswersState,
): unknown {
  if (Array.isArray(raw)) {
    return raw.map((item) => resolveValue(item as never, answers));
  }
  if (typeof raw === "string" && raw.startsWith("$")) {
    if (raw === PLACEHOLDER) {
      return lookupAnswerKey("selected_country_iso", answers) ?? resolveSelectedCountryIso(answers);
    }
    const key = raw.slice(1);
    return lookupAnswerKey(key, answers);
  }
  return raw;
}

function getFieldValue(field: string, answers: TreeAnswersState): unknown {
  return lookupAnswerKey(field, answers);
}

/** Free-text current_country vs ISO from $selected_country_iso (CA/US). */
function currentCountryMatchesIso(left: unknown, iso: unknown): boolean {
  if (iso !== "CA" && iso !== "US") {
    return false;
  }
  if (typeof left !== "string") {
    return left === iso;
  }
  const normalized = left.trim().toLowerCase();
  if (iso === "CA") {
    return normalized === "ca" || normalized === "canada";
  }
  return (
    normalized === "us" ||
    normalized === "usa" ||
    normalized === "u.s." ||
    normalized === "u.s.a." ||
    normalized === "united states" ||
    normalized === "united states of america"
  );
}

function fieldEqualsNormalized(field: string, left: unknown, right: unknown): boolean {
  if (left === right) {
    return true;
  }
  if (field === "current_country" && (right === "CA" || right === "US")) {
    return currentCountryMatchesIso(left, right);
  }
  return false;
}

export function evaluateCondition(condition: Condition, answers: TreeAnswersState): boolean {
  const left = getFieldValue(condition.field, answers);
  const right = resolveValue(condition.value as never, answers);

  switch (condition.operator) {
    case "eq":
      return fieldEqualsNormalized(condition.field, left, right);
    case "not_eq":
      return !fieldEqualsNormalized(condition.field, left, right);
    case "in":
      if (!Array.isArray(right)) {
        return false;
      }
      if (condition.field === "current_country") {
        return right.some((item) => fieldEqualsNormalized(condition.field, left, item));
      }
      return right.includes(left as never);
    case "not_in":
      if (!Array.isArray(right)) {
        return false;
      }
      if (condition.field === "current_country") {
        return !right.some((item) => fieldEqualsNormalized(condition.field, left, item));
      }
      return !right.includes(left as never);
    default:
      return false;
  }
}

/** Canada-only product: tree's "skip in Canada" flag was OR'd with real skip reasons and hid employer_type for every Canadian. */
function effectiveSkipIf(questionId: string, skipIf: Condition[]): Condition[] {
  if (questionId !== "employer_type") {
    return skipIf;
  }
  return skipIf.filter(
    (condition) =>
      !(
        condition.field === "selected_country" &&
        condition.operator === "eq" &&
        condition.value === "canada"
      ),
  );
}

export function isQuestionVisible(
  showIf: Condition[],
  skipIf: Condition[],
  answers: TreeAnswersState,
  options?: { questionId?: string; ignoreSkipIf?: boolean },
): boolean {
  if (!showIf.every((condition) => evaluateCondition(condition, answers))) {
    return false;
  }
  const skipList = options?.ignoreSkipIf
    ? []
    : options?.questionId
      ? effectiveSkipIf(options.questionId, skipIf)
      : skipIf;
  if (skipList.some((condition) => evaluateCondition(condition, answers))) {
    return false;
  }
  return true;
}

/** auto_fill.condition uses `answer` as the value just submitted */
export function evaluateAutoFillCondition(condition: string, answer: unknown): boolean {
  const inMatch = /^answer in \[(.+)\]$/.exec(condition.trim());
  if (inMatch) {
    const inner = inMatch[1];
    const parts = inner.match(/'([^']*)'/g) ?? [];
    const list = parts.map((part) => part.slice(1, -1));
    return list.includes(String(answer));
  }
  const eqMatch = /^answer eq (.+)$/.exec(condition.trim());
  if (eqMatch) {
    const raw = eqMatch[1].trim();
    if (raw === "0") return answer === 0 || answer === "0";
    if (/^\d+$/.test(raw)) return Number(answer) === Number(raw);
    if (raw.startsWith("'") && raw.endsWith("'")) return answer === raw.slice(1, -1);
    return String(answer) === raw;
  }
  return false;
}
