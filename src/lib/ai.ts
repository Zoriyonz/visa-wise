import "server-only";

import Anthropic from "@anthropic-ai/sdk";

import type { EligibilityReport } from "./eligibility/types";

export interface AnalysisResult {
  summary: string;
  top_recommendations: string[];
  qualifying_pathways: string[];
  borderline_pathways: string[];
  ineligible_pathways: string[];
  key_gaps: string[];
  next_steps: string[];
  disclaimer: string;
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildPrompt(report: EligibilityReport): string {
  const toLine = (list: string[]) => (list.length > 0 ? list.join(", ") : "none");
  const pathwayLine = (items: EligibilityReport["qualifying"]) =>
    items.map((item) => `${item.pathway_name} (score ${item.score})`).join("; ") || "none";
  return [
    "You are a clarity-focused immigration explainer.",
    "Do not change eligibility outcomes. They are final and precomputed.",
    `Selected country: ${report.selected_country}`,
    `Qualifying pathways: ${pathwayLine(report.qualifying)}`,
    `Borderline pathways: ${pathwayLine(report.borderline)}`,
    `Not yet eligible pathways: ${pathwayLine(report.ineligible)}`,
    `Computed gaps: ${toLine(report.computed_gaps)}`,
    `Action steps: ${toLine(report.action_steps)}`,
    "Return strict JSON with keys:",
    "summary, top_recommendations, qualifying_pathways, borderline_pathways, ineligible_pathways, key_gaps, next_steps, disclaimer.",
    "Write concise plain English and keep legal caution in disclaimer.",
  ].join("\n");
}

export async function generateAnalysis(report: EligibilityReport): Promise<AnalysisResult> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    temperature: 0.2,
    messages: [{ role: "user", content: buildPrompt(report) }],
  });
  const content = response.content.find((block) => block.type === "text");
  if (!content || content.type !== "text") {
    throw new Error("Claude returned no text output.");
  }
  const raw = content.text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const parsed = JSON.parse(raw) as AnalysisResult;
  return {
    summary: parsed.summary,
    top_recommendations: parsed.top_recommendations ?? [],
    qualifying_pathways: parsed.qualifying_pathways ?? [],
    borderline_pathways: parsed.borderline_pathways ?? [],
    ineligible_pathways: parsed.ineligible_pathways ?? [],
    key_gaps: parsed.key_gaps ?? [],
    next_steps: parsed.next_steps ?? [],
    disclaimer: parsed.disclaimer,
  };
}
