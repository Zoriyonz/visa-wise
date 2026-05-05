export type EligibilityStatus = "qualifies" | "close" | "not_yet";

export interface UserAnswers {
  selected_country: "canada" | "us";
  current_country: string;
  country_of_birth: string;
  age: number;
  marital_status: string;
  spouse_status: string;
  education_level: string;
  education_field: string;
  education_country: string;
  credential_recognized: "yes" | "no" | "in_progress";
  english_level: string;
  french_level: string;
  total_work_years: number;
  destination_work_years: number;
  noc_teer_level: string;
  soc_category: string;
  job_offer: string;
  employer_type: string;
  provincial_preference: string;
  net_worth_usd: string;
  criminal_history: boolean;
  prior_removal: boolean;
  prior_us_visa: string;
  crs_score: number;
}

export interface PathwayResult {
  pathway_id: string;
  pathway_name: string;
  country_code: string;
  status: EligibilityStatus;
  score: number;
  threshold_qualifies: number;
  threshold_close: number;
  failed_hard_requirements: string[];
  matched_soft_factors: string[];
  unmet_gaps: string[];
  action_steps: string[];
}

export interface EligibilityReport {
  selected_country: UserAnswers["selected_country"];
  generated_at: string;
  qualifying: PathwayResult[];
  borderline: PathwayResult[];
  ineligible: PathwayResult[];
  computed_gaps: string[];
  action_steps: string[];
}
