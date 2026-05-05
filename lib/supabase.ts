import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { AnalysisResult } from "./ai";
import type { UserAnswers } from "./eligibility/types";

export interface IntakeSubmissionRow {
  id?: string;
  created_at?: string;
  user_answers: UserAnswers;
  analysis_result: AnalysisResult;
}

export interface Database {
  public: {
    Tables: {
      intake_submissions: {
        Row: IntakeSubmissionRow;
        Insert: IntakeSubmissionRow;
        Update: Partial<IntakeSubmissionRow>;
      };
    };
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing required Supabase environment variables.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
