import type { UserAnswers } from "@/../lib/eligibility/types";

export type QuestionType = "select" | "number" | "boolean";
export type QuestionConfig = {
  key: keyof UserAnswers;
  label: string;
  type: QuestionType;
  options?: { label: string; value: string }[];
  countries?: UserAnswers["selected_country"][];
};

export const initialAnswers: UserAnswers = {
  selected_country: "canada",
  current_country: "",
  country_of_birth: "",
  age: 30,
  marital_status: "single",
  spouse_status: "none",
  education_level: "bachelors",
  education_field: "stem",
  education_country: "",
  credential_recognized: "no",
  english_level: "intermediate",
  french_level: "none",
  total_work_years: 0,
  destination_work_years: 0,
  noc_teer_level: "teer3",
  soc_category: "professional",
  job_offer: "none",
  employer_type: "private",
  provincial_preference: "none",
  net_worth_usd: "10k_50k",
  criminal_history: false,
  prior_removal: false,
  prior_us_visa: "none",
  crs_score: 0,
};

const yesNo = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

export const allQuestions: QuestionConfig[] = [
  { key: "current_country", label: "What country do you currently live in?", type: "select", options: [{ label: "Canada", value: "canada" }, { label: "US", value: "us" }, { label: "Other", value: "other" }] },
  { key: "country_of_birth", label: "What is your country of birth?", type: "select", options: [{ label: "India", value: "IN" }, { label: "China", value: "CN" }, { label: "Other", value: "OTHER" }] },
  { key: "age", label: "How old are you?", type: "number" },
  { key: "marital_status", label: "Marital status?", type: "select", options: [{ label: "Single", value: "single" }, { label: "Married", value: "married" }, { label: "Common-law", value: "common_law" }] },
  { key: "spouse_status", label: "Spouse status?", type: "select", options: [{ label: "None", value: "none" }, { label: "Citizen/PR", value: "citizen_pr" }, { label: "Temporary", value: "temporary" }] },
  { key: "education_level", label: "Highest education level?", type: "select", options: [{ label: "Secondary", value: "secondary" }, { label: "Bachelor's", value: "bachelors" }, { label: "Master's", value: "masters" }, { label: "PhD", value: "phd" }] },
  { key: "education_field", label: "Education field?", type: "select", options: [{ label: "STEM", value: "stem" }, { label: "Business", value: "business" }, { label: "Other", value: "other" }] },
  { key: "education_country", label: "Where was your education completed?", type: "select", options: [{ label: "Canada", value: "canada" }, { label: "US", value: "us" }, { label: "Other", value: "other" }] },
  { key: "credential_recognized", label: "Is your credential officially recognized?", type: "select", options: [{ label: "Yes", value: "yes" }, { label: "No", value: "no" }, { label: "In progress", value: "in_progress" }] },
  { key: "english_level", label: "English level?", type: "select", options: [{ label: "None", value: "none" }, { label: "Basic", value: "basic" }, { label: "Intermediate", value: "intermediate" }, { label: "Advanced", value: "advanced" }] },
  { key: "french_level", label: "French level?", type: "select", options: [{ label: "None", value: "none" }, { label: "Basic", value: "basic" }, { label: "Proficient", value: "proficient" }, { label: "Advanced", value: "advanced" }], countries: ["canada"] },
  { key: "total_work_years", label: "Total years of work experience?", type: "number" },
  { key: "destination_work_years", label: "Years of work in destination country?", type: "number" },
  { key: "noc_teer_level", label: "NOC TEER level?", type: "select", options: [{ label: "TEER 0", value: "teer0" }, { label: "TEER 1", value: "teer1" }, { label: "TEER 2", value: "teer2" }, { label: "TEER 3", value: "teer3" }, { label: "TEER 4+", value: "teer4" }], countries: ["canada"] },
  { key: "soc_category", label: "US SOC occupation category?", type: "select", options: [{ label: "Professional", value: "professional" }, { label: "Technical", value: "technical" }, { label: "Other", value: "other" }], countries: ["us"] },
  { key: "job_offer", label: "Do you have a qualifying job offer?", type: "select", options: [{ label: "None", value: "none" }, { label: "Canada/US Employer", value: "qualified" }] },
  { key: "employer_type", label: "Employer type?", type: "select", options: [{ label: "Private", value: "private" }, { label: "University", value: "university" }, { label: "Government", value: "government" }], countries: ["us"] },
  { key: "provincial_preference", label: "Preferred province?", type: "select", options: [{ label: "None", value: "none" }, { label: "Ontario", value: "ontario" }, { label: "BC", value: "bc" }, { label: "Alberta", value: "alberta" }], countries: ["canada"] },
  { key: "net_worth_usd", label: "Approximate net worth (USD)?", type: "select", options: [{ label: "Under 10k", value: "under_10k" }, { label: "10k-50k", value: "10k_50k" }, { label: "50k-200k", value: "50k_200k" }, { label: "200k+", value: "200k_plus" }] },
  { key: "criminal_history", label: "Any criminal history?", type: "boolean", options: yesNo },
  { key: "prior_removal", label: "Any prior removal/deportation?", type: "boolean", options: yesNo },
  { key: "prior_us_visa", label: "Prior US visa status?", type: "select", options: [{ label: "None", value: "none" }, { label: "Approved", value: "approved" }, { label: "Refused", value: "refused" }], countries: ["us"] },
  { key: "crs_score", label: "If known, your CRS score?", type: "number", countries: ["canada"] },
];
