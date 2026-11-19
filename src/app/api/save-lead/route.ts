import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import type { TreeAnswersState } from "@/lib/intake/questionTreeTypes";
import { supabase } from "@/lib/supabase";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isTreeAnswersState(value: unknown): value is TreeAnswersState {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  try {
    const raw: unknown = await request.json();
    if (typeof raw !== "object" || raw === null) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { email, answers } = raw as { email?: unknown; answers?: unknown };
    if (typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (!isTreeAnswersState(answers)) {
      return NextResponse.json({ error: "Invalid answers payload" }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase.from("leads").insert({
      id: randomUUID(),
      email,
      answers,
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
