import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (!supabase) return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 });
  const { data, error } = await supabase
    .from("intake_submissions")
    .select("id, analysis_result, eligibility_report, paid")
    .eq("id", id)
    .single();
  if (error || !data) return NextResponse.json({ error: "Result not found" }, { status: 404 });
  return NextResponse.json(data);
}
