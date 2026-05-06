import type { Condition, TreeAnswersState } from "./questionTreeTypes";

const PLACEHOLDER = "$selected_country_iso";

export function resolveSelectedCountryIso(answers: TreeAnswersState): "CA" | "US" {
  return answers.selected_country === "us" ? "US" : "CA";
}

function resolveValue(raw: string | number | boolean | (string | number | boolean)[], answers: TreeAnswersState): unknown {
  if (Array.isArray(raw)) return raw.map((item) => resolveValue(item, answers));
  if (raw === PLACEHOLDER) return resolveSelectedCountryIso(answers);
  return raw;
}

function getFieldValue(field: string, answers: TreeAnswersState): unknown {
  if (!(field in answers)) return undefined;
  return answers[field];
}

export function evaluateCondition(condition: Condition, answers: TreeAnswersState): boolean {
  const left = getFieldValue(condition.field, answers);
  const right = resolveValue(condition.value as never, answers);

  switch (condition.operator) {
    case "eq":
      return left === right;
    case "not_eq":
      return left !== right;
    case "in":
      return Array.isArray(right) && right.includes(left as never);
    case "not_in":
      return Array.isArray(right) && !right.includes(left as never);
    default:
      return false;
  }
}

export function isQuestionVisible(
  showIf: Condition[],
  skipIf: Condition[],
  answers: TreeAnswersState,
): boolean {
  if (!showIf.every((c) => evaluateCondition(c, answers))) return false;
  if (skipIf.some((c) => evaluateCondition(c, answers))) return false;
  return true;
}

/** auto_fill.condition uses `answer` as the value just submitted */
export function evaluateAutoFillCondition(condition: string, answer: unknown): boolean {
  const inMatch = /^answer in \[(.+)\]$/.exec(condition.trim());
  if (inMatch) {
    const inner = inMatch[1];
    const parts = inner.match(/'([^']*)'/g) ?? [];
    const list = parts.map((p) => p.slice(1, -1));
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
