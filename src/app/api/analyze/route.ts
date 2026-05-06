import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { generateAnalysis } from "@/../lib/ai";
import { computeEligibility } from "@/../lib/eligibility/engine";
import type { UserAnswers } from "@/../lib/eligibility/types";
import { supabase } from "@/../lib/supabase";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

const ipHits = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipHits.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  try {
    const raw: unknown = await request.json();
    if (typeof raw !== "object" || raw === null) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const { selected_country } = raw as { selected_country?: unknown };
    if (selected_country !== "canada" && selected_country !== "us") {
      return NextResponse.json({ error: "Invalid country selection" }, { status: 400 });
    }
    const answers = raw as UserAnswers;
    const eligibilityReport = computeEligibility(answers);
    const analysisResult = await generateAnalysis(eligibilityReport);
    const fallbackId = randomUUID();
    let id = fallbackId;
    if (supabase) {
      try {
        const { data } = await supabase
          .from("intake_submissions")
          .insert({ user_answers: answers, analysis_result: analysisResult, eligibility_report: eligibilityReport })
          .select("id")
          .single();
        id = data?.id ?? fallbackId;
      } catch (dbError) {
        console.error("[analyze] Supabase insert failed — using fallback id:", dbError);
      }
    }
    return NextResponse.json({ id, summary: analysisResult.summary, result: analysisResult, report: eligibilityReport });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
