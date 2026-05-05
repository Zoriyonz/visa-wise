"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { allQuestions, initialAnswers } from "@/../lib/form/questions";
import type { UserAnswers } from "@/../lib/eligibility/types";

export function IntakeWizard() {
  const params = useSearchParams();
  const router = useRouter();
  const [answers, setAnswers] = useState<UserAnswers>({ ...initialAnswers, selected_country: params.get("country") === "us" ? "us" : "canada" });
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const questions = useMemo(() => allQuestions.filter((q) => !q.countries || q.countries.includes(answers.selected_country)), [answers.selected_country]);
  const questionStep = step - 1;
  const current = questionStep >= 0 ? questions[questionStep] : null;

  async function submitForm() {
    setLoading(true);
    const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(answers) });
    const payload = (await response.json()) as { id: string; result: unknown; report: unknown };
    sessionStorage.setItem(`analysis:${payload.id}`, JSON.stringify({ id: payload.id, analysis_result: payload.result, eligibility_report: payload.report }));
    router.push(`/results?id=${payload.id}`);
  }

  function parseValue(raw: string): string | number | boolean {
    if (current?.type === "number") return Number(raw || 0);
    if (current?.type === "boolean") return raw === "true";
    return raw;
  }

  if (loading) return <div className="fixed inset-0 z-50 grid place-items-center bg-black/80"><p className="display-font text-3xl">Analyzing your profile...</p></div>;

  return (
    <section className="rounded-2xl border border-[#1a1a1a] bg-[#111111] p-6 md:p-10">
      <div className="mb-8"><div className="h-2 rounded-full bg-[#1a1a1a]"><div className="h-2 rounded-full bg-[#c9922a] transition-all duration-500" style={{ width: `${((step + 1) / (questions.length + 1)) * 100}%` }} /></div><p className="mt-3 text-sm text-[#666]">Step {step + 1} of {questions.length + 1}</p></div>
      {step === 0 ? (
        <div className="space-y-5">
          <h2 className="display-font text-3xl">Choose your destination country</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[{ id: "canada", label: "Canada", flag: "🇨🇦", color: "#d4273a" }, { id: "us", label: "United States", flag: "🇺🇸", color: "#1c3f8f" }].map((item) => (
              <button key={item.id} onClick={() => setAnswers((prev) => ({ ...prev, selected_country: item.id as UserAnswers["selected_country"] }))} className={`rounded-xl border p-6 text-left ${answers.selected_country === item.id ? "border-[#c9922a]" : "border-[#1a1a1a]"}`}>
                <p className="text-3xl">{item.flag}</p><p className="mt-2 text-xl" style={{ color: item.color }}>{item.label}</p>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="rounded-full bg-[#c9922a] px-6 py-3 font-semibold text-black">Continue</button>
        </div>
      ) : (
        <div className="space-y-6 transition-all duration-300 ease-out">
          <h2 className="display-font text-3xl">{current?.label}</h2>
          {current?.type === "number" ? <input type="number" value={String(answers[current.key] ?? "")} onChange={(event) => setAnswers((prev) => ({ ...prev, [current.key]: parseValue(event.target.value) as UserAnswers[typeof current.key] }))} className="w-full rounded-lg border border-[#1a1a1a] bg-black/40 p-4" /> : <div className="grid gap-3">{current?.options?.map((option) => <button key={option.value} onClick={() => setAnswers((prev) => ({ ...prev, [current.key]: parseValue(option.value) as UserAnswers[typeof current.key] }))} className={`rounded-lg border px-4 py-3 text-left ${String(answers[current.key]) === option.value ? "border-[#c9922a]" : "border-[#1a1a1a]"}`}>{option.label}</button>)}</div>}
          <div className="flex gap-3">
            <button onClick={() => setStep((value) => Math.max(0, value - 1))} className="rounded-full border border-[#1a1a1a] px-5 py-2">Back</button>
            <button onClick={() => (step === questions.length ? submitForm() : setStep((value) => value + 1))} className="rounded-full bg-[#c9922a] px-5 py-2 text-black">{step === questions.length ? "Analyze" : "Next"}</button>
          </div>
        </div>
      )}
    </section>
  );
}
