import { describe, expect, it } from "vitest";

import { INITIAL_ANSWERS, getNextQuestion, getProgress, isComplete } from "./intake-engine";

describe("intake engine", () => {
  it("starts with a question and is not complete", () => {
    expect(getNextQuestion(INITIAL_ANSWERS)).not.toBeNull();
    expect(isComplete(INITIAL_ANSWERS)).toBe(false);
  });

  it("starts on Canada", () => {
    expect(INITIAL_ANSWERS.selected_country).toBe("canada");
  });

  it("reports progress as a fraction between 0 and 1 that never decreases as answers are added", () => {
    let answers = { ...INITIAL_ANSWERS };
    let previous = getProgress(answers);
    expect(previous).toBeGreaterThanOrEqual(0);

    for (let step = 0; step < 60; step++) {
      const question = getNextQuestion(answers);
      if (!question) break;
      const value =
        question.type === "single_select"
          ? (question.options?.[0]?.value ?? "")
          : question.type === "number"
            ? 1
            : "x";
      answers = { ...answers, [question.id]: value };
      const progress = getProgress(answers);
      expect(progress).toBeGreaterThanOrEqual(previous);
      expect(progress).toBeLessThanOrEqual(1);
      previous = progress;
    }
  });

  it("never asks a question twice", () => {
    let answers = { ...INITIAL_ANSWERS };
    const asked = new Set<string>();
    for (let step = 0; step < 80; step++) {
      const question = getNextQuestion(answers);
      if (!question) break;
      expect(asked.has(question.id)).toBe(false);
      asked.add(question.id);
      const value =
        question.type === "single_select"
          ? (question.options?.[0]?.value ?? "")
          : question.type === "number"
            ? 1
            : "x";
      answers = { ...answers, [question.id]: value };
    }
    expect(asked.size).toBeGreaterThan(5);
  });
});
