"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { AnalysisResult } from "@/../lib/ai";
import type { EligibilityReport, PathwayResult } from "@/../lib/eligibility/types";

type ResultPayload = { id: string; analysis_result: AnalysisResult; eligibility_report: EligibilityReport; paid?: boolean };

function PathwayCard({ item, tone }: { item: PathwayResult; tone: "green" | "amber" }) {
  const border = tone === "green" ? "border-[#238636]/40 bg-[#238636]/10" : "border-[#9e6a03]/40 bg-[#9e6a03]/10";
  const badge = tone === "green" ? "bg-[#238636]/20 text-[#238636]" : "bg-[#9e6a03]/20 text-[#9e6a03]";
  const bar = tone === "green" ? "bg-[#238636]" : "bg-[#9e6a03]";
  const pct = Math.min(100, Math.round((item.score / Math.max(item.threshold_qualifies, 1)) * 100));
  return (
    <article className={`rounded-xl border p-5 ${border}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-[#f0ece4]">{item.pathway_name}</h3>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${badge}`}>{tone === "green" ? "Qualifies" : "Close"}</span>
      </div>
      <div className="mt-3 h-1 rounded-full bg-[#30363d]">
        <div className={`h-1 rounded-full ${bar}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 text-xs text-[#8b949e]">Score {item.score} · qualifies at {item.threshold_qualifies}</p>
    </article>
  );
}

export function ResultsClient() {
  const params = useSearchParams();
  const id = params.get("id");
  const [data, setData] = useState<ResultPayload | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) { setError(true); return; }
    const cached = sessionStorage.getItem(`analysis:${id}`);
    if (cached) { setData(JSON.parse(cached) as ResultPayload); return; }
    fetch(`/api/results?id=${id}`)
      .then(async (r) => { const j = await r.json() as ResultPayload; if (!j?.eligibility_report) setError(true); else setData(j); })
      .catch(() => setError(true));
  }, [id]);

  async function startCheckout() {
    if (!id) return;
    const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const p = (await r.json()) as { checkoutUrl?: string };
    if (p.checkoutUrl) window.location.href = p.checkoutUrl;
  }

  if (error || (data !== null && (!data?.eligibility_report || !data?.analysis_result))) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d1117] px-6">
        <div className="mx-auto max-w-md rounded-xl border border-[#30363d] bg-[#1c2128] p-8 text-center">
          <h1 className="display-font text-2xl text-[#f0ece4]">We couldn't load your results</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#8b949e]">
            This can happen if the session expired or the analysis didn't complete. Please try again.
          </p>
          <a href="/form" className="mt-6 inline-flex h-11 items-center rounded-full bg-[#c9922a] px-7 font-semibold text-[#0d1117] transition-colors hover:bg-[#e0b060]">
            Start Over
          </a>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d1117]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#30363d] border-t-[#c9922a]" />
      </main>
    );
  }

  const top = data.eligibility_report.qualifying[0] ?? data.eligibility_report.borderline[0];

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <section className="rounded-xl border border-[#30363d] bg-[#1c2128] p-6 md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#8b949e]">Top Match</p>
        <h1 className="display-font mt-2 text-3xl text-[#f0ece4] md:text-4xl">{top?.pathway_name ?? "No strong match found"}</h1>
        <p className="mt-3 leading-relaxed text-[#8b949e]">{data.analysis_result.summary}</p>
      </section>

      {data.eligibility_report.qualifying.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[#8b949e]">Qualifying Pathways</h2>
          <div className="grid gap-3 md:grid-cols-2">{data.eligibility_report.qualifying.map((p) => <PathwayCard key={p.pathway_id} item={p} tone="green" />)}</div>
        </section>
      )}
      {data.eligibility_report.borderline.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[#8b949e]">Close Matches</h2>
          <div className="grid gap-3 md:grid-cols-2">{data.eligibility_report.borderline.map((p) => <PathwayCard key={p.pathway_id} item={p} tone="amber" />)}</div>
        </section>
      )}

      <section className={`mt-8 space-y-6 transition-all ${data.paid ? "" : "select-none blur-sm"}`}>
        {data.eligibility_report.computed_gaps.length > 0 && (
          <div>
            <h2 className="mb-3 font-semibold text-[#f0ece4]">Key Gaps</h2>
            <ul className="space-y-2">{data.eligibility_report.computed_gaps.map((g) => <li key={g} className="flex items-start gap-2 text-sm text-[#8b949e]"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#da3633]" />{g}</li>)}</ul>
          </div>
        )}
        {data.eligibility_report.action_steps.length > 0 && (
          <div>
            <h2 className="mb-3 font-semibold text-[#f0ece4]">Action Steps</h2>
            <ol className="space-y-2 list-none">{data.eligibility_report.action_steps.map((s, i) => <li key={s} className="flex items-start gap-3 text-sm text-[#8b949e]"><span className="font-mono text-xs text-[#c9922a]">{String(i + 1).padStart(2, "0")}</span>{s}</li>)}</ol>
          </div>
        )}
      </section>

      <div className="mt-10 text-center">
        {data.paid
          ? <><p className="mb-4 text-sm text-[#c9922a]">Full report unlocked</p><button onClick={() => window.print()} className="rounded-full border border-[#c9922a] px-6 py-2.5 text-sm text-[#c9922a] transition-colors hover:bg-[#c9922a]/10">Download PDF</button></>
          : <button onClick={startCheckout} className="inline-flex h-12 items-center rounded-full bg-[#c9922a] px-8 font-semibold text-[#0d1117] shadow-[0_4px_20px_rgba(201,146,42,0.25)] transition-colors hover:bg-[#e0b060]">Unlock Full Report — $9.99</button>
        }
      </div>
    </main>
  );
}
