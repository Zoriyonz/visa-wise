import { describe, expect, it } from "vitest";

import {
  evaluateAutoFillCondition,
  evaluateCondition,
  isQuestionVisible,
  resolveSelectedCountryIso,
} from "./conditions";
import type { Condition } from "./questionTreeTypes";

describe("resolveSelectedCountryIso", () => {
  it("maps the selected country to an ISO code, defaulting to CA", () => {
    expect(resolveSelectedCountryIso({ selected_country: "us" })).toBe("US");
    expect(resolveSelectedCountryIso({ selected_country: "canada" })).toBe("CA");
    expect(resolveSelectedCountryIso({})).toBe("CA");
  });
});

describe("evaluateCondition", () => {
  it("supports eq, not_eq, in and not_in", () => {
    const answers = { education_level: "masters" };
    const check = (operator: Condition["operator"], value: Condition["value"]) =>
      evaluateCondition({ field: "education_level", operator, value }, answers);

    expect(check("eq", "masters")).toBe(true);
    expect(check("eq", "phd")).toBe(false);
    expect(check("not_eq", "phd")).toBe(true);
    expect(check("in", ["masters", "phd"])).toBe(true);
    expect(check("not_in", ["masters", "phd"])).toBe(false);
  });
});

describe("isQuestionVisible", () => {
  const showIfMarried: Condition[] = [
    { field: "marital_status", operator: "eq", value: "married" },
  ];
  const skipIfUnder18: Condition[] = [{ field: "age", operator: "in", value: [15, 16, 17] }];

  it("is visible when it has no conditions", () => {
    expect(isQuestionVisible([], [], {})).toBe(true);
  });

  it("requires every show_if condition to hold", () => {
    expect(isQuestionVisible(showIfMarried, [], { marital_status: "married" })).toBe(true);
    expect(isQuestionVisible(showIfMarried, [], { marital_status: "single" })).toBe(false);
  });

  it("hides the question when any skip_if condition holds", () => {
    expect(isQuestionVisible([], skipIfUnder18, { age: 16 })).toBe(false);
    expect(isQuestionVisible([], skipIfUnder18, { age: 30 })).toBe(true);
  });

  it("can ignore skip_if for baseline questions", () => {
    expect(isQuestionVisible([], skipIfUnder18, { age: 16 }, { ignoreSkipIf: true })).toBe(true);
  });
});

describe("evaluateAutoFillCondition", () => {
  it("matches membership in a quoted list", () => {
    expect(evaluateAutoFillCondition("answer in ['a', 'b']", "b")).toBe(true);
    expect(evaluateAutoFillCondition("answer in ['a', 'b']", "c")).toBe(false);
  });

  it("matches numeric and quoted equality", () => {
    expect(evaluateAutoFillCondition("answer eq 0", "0")).toBe(true);
    expect(evaluateAutoFillCondition("answer eq 0", 0)).toBe(true);
    expect(evaluateAutoFillCondition("answer eq 3", 3)).toBe(true);
    expect(evaluateAutoFillCondition("answer eq 'yes'", "yes")).toBe(true);
    expect(evaluateAutoFillCondition("answer eq 'yes'", "no")).toBe(false);
  });

  it("returns false for conditions it does not understand", () => {
    expect(evaluateAutoFillCondition("answer matches x", "x")).toBe(false);
  });
});
