import "server-only";

import immigrationData from "@/../data/immigration_pathways.json";

import type { EligibilityReport, PathwayResult, UserAnswers } from "./types";

type Requirement = { field: keyof UserAnswers; operator: string; value: unknown; error_message?: string };
type SoftFactor = { field: keyof UserAnswers; weight: number; favorable_values: unknown[]; points: number };
type Gap = { condition: string; gap_title: string };
type Pathway = {
  id: string;
  name: string;
  country: string;
  hard_requirements: Requirement[];
  soft_factors: SoftFactor[];
  eligibility_score_threshold: { qualifies: number; close: number };
  gaps?: Gap[];
  action_steps?: string[];
};
type CountryData = { hard_disqualifiers: Requirement[]; pathways: Pathway[] };
type RulesData = { canada: CountryData; us: CountryData };

const rules = immigrationData as RulesData;

function compareValue(left: unknown, operator: string, right: unknown): boolean {
  if (operator === "eq") return left === right;
  if (operator === "not_eq" || operator === "ne") return left !== right;
  if (operator === "gte") return Number(left) >= Number(right);
  if (operator === "lte") return Number(left) <= Number(right);
  if (operator === "gt") return Number(left) > Number(right);
  if (operator === "lt") return Number(left) < Number(right);
  if (operator === "in") return Array.isArray(right) && right.includes(left);
  if (operator === "not_in" || operator === "not in") return Array.isArray(right) && !right.includes(left);
  return false;
}

function evaluateGapCondition(condition: string, answers: UserAnswers): boolean {
  const tokens = condition.split(/\s+(and|or)\s+/i);
  let result: boolean | null = null;
  let pendingJoin: "and" | "or" = "and";
  for (const token of tokens) {
    const lowered = token.toLowerCase();
    if (lowered === "and" || lowered === "or") {
      pendingJoin = lowered;
      continue;
    }
    const match = token.match(/^([a-z_]+)\s*(eq|ne|in|not in|<=|>=|<|>)\s*(.+)$/i);
    if (!match) continue;
    const [, field, rawOperator, rawValue] = match;
    const operator = rawOperator.toLowerCase();
    const cleaned = rawValue.trim();
    const value =
      cleaned.startsWith("[") && cleaned.endsWith("]")
        ? JSON.parse(cleaned.replace(/'/g, "\""))
        : cleaned.startsWith("'") && cleaned.endsWith("'")
          ? cleaned.slice(1, -1)
          : Number.isNaN(Number(cleaned))
            ? cleaned
            : Number(cleaned);
    const current = compareValue(answers[field as keyof UserAnswers], operator, value);
    result = result === null ? current : pendingJoin === "and" ? result && current : result || current;
  }
  return result ?? false;
}

function computePathway(pathway: Pathway, answers: UserAnswers): PathwayResult {
  const failedHard = pathway.hard_requirements
    .filter((item) => !compareValue(answers[item.field], item.operator, item.value))
    .map((item) => item.error_message ?? `${item.field} failed ${item.operator} check`);
  const hardFailed = failedHard.length > 0;
  const matchedSoft = hardFailed
    ? []
    : pathway.soft_factors.filter((factor) => factor.favorable_values.includes(answers[factor.field]));
  const score = hardFailed
    ? 0
    : Math.round(matchedSoft.reduce((total, factor) => total + factor.points * factor.weight, 0));
  const status: PathwayResult["status"] = hardFailed
    ? "not_yet"
    : score >= pathway.eligibility_score_threshold.qualifies
      ? "qualifies"
      : score >= pathway.eligibility_score_threshold.close
        ? "close"
        : "not_yet";
  const unmetGaps = (pathway.gaps ?? []).filter((gap) => evaluateGapCondition(gap.condition, answers)).map((gap) => gap.gap_title);
  return {
    pathway_id: pathway.id,
    pathway_name: pathway.name,
    country_code: pathway.country,
    status,
    score,
    threshold_qualifies: pathway.eligibility_score_threshold.qualifies,
    threshold_close: pathway.eligibility_score_threshold.close,
    failed_hard_requirements: failedHard,
    matched_soft_factors: matchedSoft.map((factor) => `${factor.field} (+${Math.round(factor.points * factor.weight)})`),
    unmet_gaps: unmetGaps,
    action_steps: pathway.action_steps ?? [],
  };
}

export function computeEligibility(answers: UserAnswers): EligibilityReport {
  const selected = answers.selected_country;
  const countryRules = rules[selected];
  const countryDisqualifiers = countryRules.hard_disqualifiers.filter((item) =>
    compareValue(answers[item.field], item.operator, item.value),
  );
  const results = countryRules.pathways.map((pathway) => computePathway(pathway, answers));
  if (countryDisqualifiers.length > 0) {
    const disqualifierMessages = countryDisqualifiers.map((item) => item.error_message ?? "Country-level disqualifier");
    const disqualifiedResults = results.map((result) => ({
      ...result,
      status: "not_yet" as const,
      failed_hard_requirements: [...disqualifierMessages, ...result.failed_hard_requirements],
    }));
    return {
      selected_country: selected,
      generated_at: "deterministic",
      qualifying: [],
      borderline: [],
      ineligible: disqualifiedResults,
      computed_gaps: [...new Set(disqualifiedResults.flatMap((item) => item.unmet_gaps))],
      action_steps: [...new Set(disqualifiedResults.flatMap((item) => item.action_steps))],
    };
  }
  const qualifying = results.filter((item) => item.status === "qualifies");
  const borderline = results.filter((item) => item.status === "close");
  const ineligible = results.filter((item) => item.status === "not_yet");
  return {
    selected_country: selected,
    generated_at: "deterministic",
    qualifying,
    borderline,
    ineligible,
    computed_gaps: [...new Set(results.flatMap((item) => item.unmet_gaps))],
    action_steps: [...new Set([...qualifying, ...borderline].flatMap((item) => item.action_steps))],
  };
}
