import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { generateAnalysis } from "@/../lib/ai";
import { computeEligibility } from "@/../lib/eligibility/engine";
import type { UserAnswers } from "@/../lib/eligibility/types";
import { supabase } from "@/../lib/supabase";

export async function POST(request: Request) {
  try {
    const answers = (await request.json()) as UserAnswers;
    const eligibilityReport = computeEligibility(answers);
    const analysisResult = await generateAnalysis(eligibilityReport);
    const fallbackId = randomUUID();
    let id = fallbackId;
    if (supabase) {
      const { data } = await supabase
        .from("intake_submissions")
        .insert({ user_answers: answers, analysis_result: analysisResult, eligibility_report: eligibilityReport })
        .select("id")
        .single();
      id = data?.id ?? fallbackId;
    }
    return NextResponse.json({ id, summary: analysisResult.summary, result: analysisResult, report: eligibilityReport });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
