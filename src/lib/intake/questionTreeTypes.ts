export type IntakeQuestionType = "single_select" | "number" | "text";

export type ConditionOperator = "eq" | "in" | "not_eq" | "not_in";

export interface Condition {
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean | (string | number | boolean)[];
}

export interface AutoFillRule {
  field: string;
  value: string | number | boolean | null;
  condition: string;
}

export interface IntakeQuestionOption {
  value: string;
  label: string;
}

export interface IntakeQuestion {
  id: string;
  question: string;
  type: IntakeQuestionType;
  options: IntakeQuestionOption[] | null;
  show_if: Condition[];
  skip_if: Condition[];
  auto_fill: AutoFillRule | null;
  help_text: string;
}

export type TreeAnswersState = Record<string, string | number | boolean | null>;
