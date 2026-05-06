import type { UserAnswers } from "@/../lib/eligibility/types";

import type { TreeAnswersState } from "./questionTreeTypes";

const defaults: UserAnswers = {
  selected_country: "canada",
  current_country: "",
  country_of_birth: "",
  age: 0,
  marital_status: "single",
  spouse_status: "none",
  education_level: "secondary",
  education_field: "other",
  education_country: "other",
  credential_recognized: "no",
  english_level: "none",
  french_level: "none",
  total_work_years: 0,
  destination_work_years: 0,
  noc_teer_level: "teer3",
  soc_category: "other",
  job_offer: "none",
  employer_type: "none",
  provincial_preference: "no_preference",
  net_worth_usd: "under_10k",
  criminal_history: false,
  prior_removal: false,
  prior_us_visa: "none",
  crs_score: 0,
};

function asBool(value: unknown): boolean {
  if (value === true || value === false) return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return false;
}

function asCredential(value: unknown): UserAnswers["credential_recognized"] {
  if (value === "yes" || value === "no" || value === "in_progress") return value;
  if (value === "na") return "yes";
  return "no";
}

function asCountry(value: unknown): UserAnswers["selected_country"] {
  return value === "us" ? "us" : "canada";
}

export function mapTreeAnswersToUserAnswers(raw: TreeAnswersState): UserAnswers {
  return {
    ...defaults,
    selected_country: asCountry(raw.selected_country),
    current_country: typeof raw.current_country === "string" ? raw.current_country : defaults.current_country,
    country_of_birth: typeof raw.country_of_birth === "string" ? raw.country_of_birth : defaults.country_of_birth,
    age: typeof raw.age === "number" ? raw.age : defaults.age,
    marital_status: typeof raw.marital_status === "string" ? raw.marital_status : defaults.marital_status,
    spouse_status: typeof raw.spouse_status === "string" ? raw.spouse_status : defaults.spouse_status,
    education_level: typeof raw.education_level === "string" ? raw.education_level : defaults.education_level,
    education_field: typeof raw.education_field === "string" ? raw.education_field : defaults.education_field,
    education_country: typeof raw.education_country === "string" ? raw.education_country : defaults.education_country,
    credential_recognized: asCredential(raw.credential_recognized),
    english_level: typeof raw.english_level === "string" ? raw.english_level : defaults.english_level,
    french_level: typeof raw.french_level === "string" ? raw.french_level : defaults.french_level,
    total_work_years: typeof raw.total_work_years === "number" ? raw.total_work_years : defaults.total_work_years,
    destination_work_years: typeof raw.destination_work_years === "number" ? raw.destination_work_years : defaults.destination_work_years,
    noc_teer_level: typeof raw.noc_teer_level === "string" ? raw.noc_teer_level : defaults.noc_teer_level,
    soc_category: typeof raw.soc_category === "string" ? raw.soc_category : defaults.soc_category,
    job_offer: typeof raw.job_offer === "string" ? raw.job_offer : defaults.job_offer,
    employer_type: typeof raw.employer_type === "string" ? raw.employer_type : defaults.employer_type,
    provincial_preference: typeof raw.provincial_preference === "string" ? raw.provincial_preference : defaults.provincial_preference,
    net_worth_usd: typeof raw.net_worth_usd === "string" ? raw.net_worth_usd : defaults.net_worth_usd,
    criminal_history: asBool(raw.criminal_history),
    prior_removal: asBool(raw.prior_removal),
    prior_us_visa: typeof raw.prior_us_visa === "string" ? raw.prior_us_visa : defaults.prior_us_visa,
    crs_score: typeof raw.crs_score === "number" ? raw.crs_score : defaults.crs_score,
  };
}
