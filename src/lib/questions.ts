export type QuestionType = "select" | "multi" | "number" | "boolean";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  helpText?: string;
  options?: QuestionOption[];
}

export const questions: Question[] = [
  {
    id: "primary_goal",
    type: "select",
    prompt: "Which country are you primarily considering?",
    helpText:
      "You can answer for either Canada or the United States. Some pathways exist in both.",
    options: [
      { value: "canada", label: "Canada" },
      { value: "us", label: "United States" },
      { value: "both", label: "Both — show me everything" },
    ],
  },
  {
    id: "country_of_birth",
    type: "select",
    prompt: "What is your country of birth?",
    helpText:
      "Country of birth — not citizenship — determines visa bulletin backlogs for US employment-based pathways.",
    options: [
      { value: "IN", label: "India" },
      { value: "CN", label: "China" },
      { value: "PH", label: "Philippines" },
      { value: "MX", label: "Mexico" },
      { value: "NG", label: "Nigeria" },
      { value: "OTHER", label: "Other" },
    ],
  },
  {
    id: "current_country",
    type: "select",
    prompt: "Where do you currently live?",
    options: [
      { value: "CA", label: "Canada" },
      { value: "US", label: "United States" },
      { value: "OTHER", label: "Other country" },
    ],
  },
  {
    id: "age",
    type: "select",
    prompt: "How old are you?",
    helpText:
      "Age affects CRS scoring in Canada and several US humanitarian pathways.",
    options: [
      { value: "18-29", label: "18–29" },
      { value: "30-34", label: "30–34" },
      { value: "35-39", label: "35–39" },
      { value: "40-44", label: "40–44" },
      { value: "45+", label: "45 or older" },
    ],
  },
  {
    id: "education_level",
    type: "select",
    prompt: "What is your highest completed education?",
    options: [
      { value: "less_than_secondary", label: "Less than secondary school" },
      { value: "secondary", label: "Secondary school" },
      { value: "one_year_post_secondary", label: "1-year post-secondary" },
      { value: "two_year_post_secondary", label: "2-year post-secondary" },
      { value: "bachelors", label: "Bachelor's degree" },
      { value: "masters", label: "Master's degree" },
      { value: "phd", label: "PhD or doctorate" },
    ],
  },
  {
    id: "english_level",
    type: "select",
    prompt: "How would you rate your English proficiency?",
    helpText:
      "CLB 7 ≈ IELTS 6.0 in all bands. CLB 9 ≈ IELTS 7.0+ in all bands.",
    options: [
      { value: "none", label: "None or very limited" },
      { value: "basic", label: "Basic (CLB 4–5)" },
      { value: "intermediate", label: "Intermediate (CLB 6–7)" },
      { value: "proficient", label: "Proficient (CLB 8–9)" },
      { value: "advanced", label: "Advanced (CLB 10+)" },
      { value: "native", label: "Native speaker" },
    ],
  },
  {
    id: "french_level",
    type: "select",
    prompt: "How would you rate your French proficiency?",
    helpText:
      "French opens significant Canadian pathways including category-based Express Entry draws.",
    options: [
      { value: "none", label: "None" },
      { value: "basic", label: "Basic" },
      { value: "intermediate", label: "Intermediate (NCLC 5–6)" },
      { value: "proficient", label: "Proficient (NCLC 7+)" },
      { value: "native", label: "Native or fluent" },
    ],
  },
  {
    id: "total_work_years",
    type: "select",
    prompt: "How many years of skilled work experience do you have?",
    options: [
      { value: "0", label: "Less than 1 year" },
      { value: "1", label: "1 year" },
      { value: "2", label: "2 years" },
      { value: "3-5", label: "3–5 years" },
      { value: "6-10", label: "6–10 years" },
      { value: "10+", label: "More than 10 years" },
    ],
  },
  {
    id: "noc_teer_level",
    type: "select",
    prompt: "What best describes your occupation level?",
    helpText:
      "TEER 0/1 = management or university-degree roles. TEER 2/3 = technical or trades. TEER 4/5 = entry-level.",
    options: [
      { value: "teer0", label: "Management role" },
      { value: "teer1", label: "Professional (degree required)" },
      { value: "teer2", label: "Technical / supervisory" },
      { value: "teer3", label: "Skilled trade or technician" },
      { value: "teer4", label: "Intermediate (training required)" },
      { value: "teer5", label: "Entry-level" },
    ],
  },
  {
    id: "job_offer",
    type: "select",
    prompt: "Do you have a job offer?",
    options: [
      { value: "none", label: "No job offer" },
      { value: "pending", label: "In conversations / interviewing" },
      { value: "employer_sponsored_us", label: "Yes — US employer willing to sponsor" },
      { value: "lmia_approved", label: "Yes — Canadian employer with LMIA" },
      { value: "lmia_exempt", label: "Yes — Canadian employer (LMIA-exempt)" },
    ],
  },
  {
    id: "marital_status",
    type: "select",
    prompt: "What is your marital status?",
    options: [
      { value: "single", label: "Single" },
      { value: "married", label: "Married" },
      { value: "common_law", label: "Common-law partner" },
      { value: "divorced", label: "Divorced" },
      { value: "widowed", label: "Widowed" },
    ],
  },
  {
    id: "spouse_status",
    type: "select",
    prompt: "What is your spouse's immigration status?",
    helpText:
      "A citizen or permanent-resident spouse opens family sponsorship pathways.",
    options: [
      { value: "none", label: "Not applicable" },
      { value: "citizen_ca", label: "Canadian citizen" },
      { value: "pr_ca", label: "Canadian permanent resident" },
      { value: "citizen_us", label: "US citizen" },
      { value: "pr_us", label: "US permanent resident" },
      { value: "other", label: "Other / none of the above" },
    ],
  },
  {
    id: "criminal_history",
    type: "boolean",
    prompt: "Do you have any criminal history?",
    helpText:
      "Includes any conviction, arrest, or pending charge. Honest answers are critical — this affects admissibility.",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes — I have something to disclose" },
    ],
  },
  {
    id: "prior_removal",
    type: "boolean",
    prompt: "Have you ever been removed or deported from Canada or the US?",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
  },
];
