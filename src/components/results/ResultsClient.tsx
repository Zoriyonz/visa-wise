"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { AnalysisResult } from "@/../lib/ai";
import type { EligibilityReport, PathwayResult } from "@/../lib/eligibility/types";

type ResultPayload = { id: string; analysis_result: AnalysisResult; eligibility_report: EligibilityReport };

export function ResultsClient() {
  const params = useSearchParams();
  const id = params.get("id");
  const unlocked = params.get("unlocked") === "true";
  const [data, setData] = useState<ResultPayload | null>(null);

  useEffect(() => {
    if (!id) return;
    const cached = sessionStorage.getItem(`analysis:${id}`);
    if (cached) return setData(JSON.parse(cached) as ResultPayload);
    fetch(`/api/results?id=${id}`).then(async (response) => setData((await response.json()) as ResultPayload));
  }, [id]);

  async function startCheckout() {
    if (!id) return;
    const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const payload = (await response.json()) as { checkoutUrl?: string };
    if (payload.checkoutUrl) window.location.href = payload.checkoutUrl;
  }

  if (!data) return <main className="grid min-h-screen place-items-center">Loading results...</main>;
  const topPathway = data.eligibility_report.qualifying[0] ?? data.eligibility_report.borderline[0];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-2xl border border-[#1a1a1a] bg-[#111111] p-8"><p className="font-mono text-xs text-[#666]">Top Match</p><h1 className="display-font mt-2 text-4xl">{topPathway?.pathway_name ?? "No strong match yet"}</h1><p className="mt-3 text-[#b9b9b9]">{data.analysis_result.summary}</p></section>
      <section className="mt-8 grid gap-4 md:grid-cols-2">{data.eligibility_report.qualifying.map((item) => <PathwayCard key={item.pathway_id} item={item} tone="green" />)}</section>
      <section className="mt-8 grid gap-4 md:grid-cols-2">{data.eligibility_report.borderline.map((item) => <PathwayCard key={item.pathway_id} item={item} tone="amber" />)}</section>
      <section className={`mt-10 space-y-8 ${unlocked ? "" : "blur-sm"}`}><div><h2 className="text-xl">Key Gaps</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-[#b9b9b9]">{data.eligibility_report.computed_gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul></div><div><h2 className="text-xl">Action Steps</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-[#b9b9b9]">{data.eligibility_report.action_steps.map((step) => <li key={step}>{step}</li>)}</ol></div></section>
      {!unlocked ? <div className="mt-8 text-center"><button onClick={startCheckout} className="rounded-full bg-[#c9922a] px-8 py-3 font-semibold text-black">Unlock Full Report — $9.99</button></div> : <div className="mt-8 text-center"><p className="mb-4 text-[#c9922a]">Full report unlocked.</p><button onClick={() => window.print()} className="rounded-full border border-[#c9922a] px-6 py-2 text-[#c9922a]">Download PDF</button></div>}
    </main>
  );
}

function PathwayCard({ item, tone }: { item: PathwayResult; tone: "green" | "amber" }) {
  const palette = tone === "green" ? "border-emerald-800/60 bg-emerald-950/20" : "border-amber-800/60 bg-amber-950/20";
  return <article className={`rounded-xl border p-5 ${palette}`}><h3 className="text-lg">{item.pathway_name}</h3><p className="mt-1 text-sm text-[#a0a0a0]">Score: {item.score} (qualifies at {item.threshold_qualifies})</p></article>;
}
