import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { AnalysisResult } from "./ai";
import type { EligibilityReport } from "./eligibility/types";
import type { UserAnswers } from "./eligibility/types";

export interface IntakeSubmissionRow {
  id?: string;
  created_at?: string;
  user_answers: UserAnswers;
  analysis_result: AnalysisResult;
  eligibility_report?: EligibilityReport;
  paid?: boolean;
}

export interface Database {
  public: {
    Tables: {
      intake_submissions: {
        Row: IntakeSubmissionRow;
        Insert: IntakeSubmissionRow;
        Update: Partial<IntakeSubmissionRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;
