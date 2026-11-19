import { describe, expect, it } from "vitest";

import { mapTreeAnswersToUserAnswers } from "./mapUserAnswers";

describe("mapTreeAnswersToUserAnswers", () => {
  it("fills every field with a safe default for an empty answer set", () => {
    const answers = mapTreeAnswersToUserAnswers({});
    expect(answers.selected_country).toBe("canada");
    expect(answers.age).toBe(0);
    expect(answers.criminal_history).toBe(false);
    expect(answers.credential_recognized).toBe("no");
    expect(answers.noc_teer_level).toBe("teer3");
  });

  it("passes through well-typed answers", () => {
    const answers = mapTreeAnswersToUserAnswers({
      selected_country: "us",
      age: 31,
      english_level: "advanced",
      total_work_years: 6,
    });
    expect(answers).toMatchObject({
      selected_country: "us",
      age: 31,
      english_level: "advanced",
      total_work_years: 6,
    });
  });

  it("ignores answers of the wrong type instead of trusting them", () => {
    const answers = mapTreeAnswersToUserAnswers({ age: "thirty", english_level: 5 });
    expect(answers.age).toBe(0);
    expect(answers.english_level).toBe("none");
  });

  it("coerces boolean strings and treats anything unrecognised as false", () => {
    expect(mapTreeAnswersToUserAnswers({ criminal_history: "true" }).criminal_history).toBe(true);
    expect(mapTreeAnswersToUserAnswers({ criminal_history: true }).criminal_history).toBe(true);
    expect(mapTreeAnswersToUserAnswers({ criminal_history: "yes" }).criminal_history).toBe(false);
    expect(mapTreeAnswersToUserAnswers({ prior_removal: "false" }).prior_removal).toBe(false);
  });

  it("maps credential answers, treating 'not applicable' as recognised", () => {
    expect(
      mapTreeAnswersToUserAnswers({ credential_recognized: "yes" }).credential_recognized,
    ).toBe("yes");
    expect(
      mapTreeAnswersToUserAnswers({ credential_recognized: "in_progress" }).credential_recognized,
    ).toBe("in_progress");
    expect(mapTreeAnswersToUserAnswers({ credential_recognized: "na" }).credential_recognized).toBe(
      "yes",
    );
    expect(
      mapTreeAnswersToUserAnswers({ credential_recognized: "maybe" }).credential_recognized,
    ).toBe("no");
  });

  it("falls back to Canada for an unknown country", () => {
    expect(mapTreeAnswersToUserAnswers({ selected_country: "mars" }).selected_country).toBe(
      "canada",
    );
  });
});
