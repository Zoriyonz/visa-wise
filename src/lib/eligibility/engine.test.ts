import { describe, expect, it } from "vitest";

import { mapTreeAnswersToUserAnswers } from "@/lib/intake/mapUserAnswers";

import { computeEligibility } from "./engine";
import type { UserAnswers } from "./types";

const CANADA_PATHWAY_COUNT = 13;
const US_PATHWAY_COUNT = 29;

/** A strong skilled-worker profile: masters degree, advanced English, five years of TEER 1 work. */
const strongCanadian: UserAnswers = mapTreeAnswersToUserAnswers({
  selected_country: "canada",
  age: 28,
  education_level: "masters",
  english_level: "advanced",
  total_work_years: 5,
  destination_work_years: 2,
  noc_teer_level: "teer1",
  marital_status: "single",
  credential_recognized: "yes",
});

function pathwayCount(report: ReturnType<typeof computeEligibility>): number {
  return report.qualifying.length + report.borderline.length + report.ineligible.length;
}

describe("computeEligibility", () => {
  it("qualifies a strong skilled-worker profile for the Federal Skilled Worker Program", () => {
    const report = computeEligibility(strongCanadian);
    const fsw = report.qualifying.find((p) => p.pathway_id === "fsw");

    expect(fsw).toBeDefined();
    expect(fsw?.status).toBe("qualifies");
    expect(fsw?.score).toBeGreaterThanOrEqual(fsw?.threshold_qualifies ?? Infinity);
    expect(fsw?.failed_hard_requirements).toEqual([]);
    expect(fsw?.matched_soft_factors.length).toBeGreaterThan(0);
  });

  it("places every pathway in exactly one bucket", () => {
    expect(pathwayCount(computeEligibility(strongCanadian))).toBe(CANADA_PATHWAY_COUNT);
    const us = mapTreeAnswersToUserAnswers({ selected_country: "us", age: 30 });
    expect(pathwayCount(computeEligibility(us))).toBe(US_PATHWAY_COUNT);
  });

  it("scores zero and matches no soft factors for a pathway whose hard requirements fail", () => {
    const report = computeEligibility(strongCanadian);
    const hardFailed = report.ineligible.filter((p) => p.failed_hard_requirements.length > 0);

    expect(hardFailed.length).toBeGreaterThan(0);
    for (const pathway of hardFailed) {
      expect(pathway.score).toBe(0);
      expect(pathway.matched_soft_factors).toEqual([]);
      expect(pathway.status).toBe("not_yet");
    }
  });

  it("makes every pathway ineligible when a country-level disqualifier applies", () => {
    const report = computeEligibility({ ...strongCanadian, criminal_history: true });

    expect(report.qualifying).toEqual([]);
    expect(report.borderline).toEqual([]);
    expect(report.ineligible).toHaveLength(CANADA_PATHWAY_COUNT);
    for (const pathway of report.ineligible) {
      expect(pathway.status).toBe("not_yet");
      expect(pathway.failed_hard_requirements[0]).toMatch(/inadmissibility/i);
    }
  });

  it("treats a prior removal as a disqualifier too", () => {
    const report = computeEligibility({ ...strongCanadian, prior_removal: true });
    expect(report.qualifying).toHaveLength(0);
    expect(report.ineligible).toHaveLength(CANADA_PATHWAY_COUNT);
  });

  it("does not qualify an empty profile for anything", () => {
    const report = computeEligibility(mapTreeAnswersToUserAnswers({ selected_country: "canada" }));
    expect(report.qualifying).toEqual([]);
  });

  it("is deterministic: the same answers always give the same report", () => {
    expect(computeEligibility(strongCanadian)).toEqual(computeEligibility(strongCanadian));
  });

  it("only reports the selected country's pathways", () => {
    const canada = computeEligibility(strongCanadian);
    const everyPathway = [...canada.qualifying, ...canada.borderline, ...canada.ineligible];
    expect(everyPathway.every((p) => p.country_code === "CA")).toBe(true);
  });

  it("returns action steps only for pathways the user qualifies or is close for", () => {
    const report = computeEligibility(strongCanadian);
    const expected = new Set(
      [...report.qualifying, ...report.borderline].flatMap((p) => p.action_steps),
    );
    expect(new Set(report.action_steps)).toEqual(expected);
  });
});
