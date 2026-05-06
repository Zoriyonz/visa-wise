"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { AnalysisResult } from "@/../lib/ai";
import type { EligibilityReport } from "@/../lib/eligibility/types";
import { generateVisaWiseReport } from "@/lib/pdf/generateReport";

import { DisclaimerModal } from "./DisclaimerModal";
import { PathwayCard } from "./PathwayCard";

type ResultPayload = {
  id: string;
  analysis_result: AnalysisResult;
  eligibility_report: EligibilityReport;
  paid?: boolean;
};

export function ResultsClient() {
  const params = useSearchParams();
  const id = params.get("id");
  const [data, setData] = useState<ResultPayload | null>(null);
  const [error, setError] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    if (!id) { setError(true); return; }
    const cached = sessionStorage.getItem(`analysis:${id}`);
    if (cached) { setData(JSON.parse(cached) as ResultPayload); return; }
    fetch(`/api/results?id=${id}`)
      .then(async (r) => { const j = (await r.json()) as ResultPayload; if (!j?.eligibility_report || !j?.analysis_result) setError(true); else setData(j); })
      .catch(() => setError(true));
  }, [id]);

  useEffect(() => {
    if (!data?.paid || !id) return;
    if (!sessionStorage.getItem(`disclaimer_shown_${id}`)) setShowDisclaimer(true);
  }, [data, id]);

  function handleDisclaimerConfirm() {
    if (id) sessionStorage.setItem(`disclaimer_shown_${id}`, "1");
    setShowDisclaimer(false);
  }

  async function startCheckout() {
    if (!id) return;
    setCheckoutError(null);
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const json = (await r.json()) as { checkoutUrl?: string; error?: string };
      if (json.checkoutUrl) {
        window.location.href = json.checkoutUrl;
      } else {
        setCheckoutError(json.error ?? "Could not start checkout. Please try again.");
      }
    } catch {
      setCheckoutError("Could not start checkout. Please try again.");
    }
  }

  if (error || (data !== null && (!data?.eligibility_report || !data?.analysis_result))) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d1117] px-6">
        <div className="mx-auto max-w-md rounded-xl border border-[#30363d] bg-[#1c2128] p-8 text-center">
          <h1 className="display-font text-2xl text-[#f0ece4]">We couldn't load your results</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#8b949e]">This can happen if the session expired or the analysis didn't complete. Please try again.</p>
          <a href="/form" className="mt-6 inline-flex h-11 items-center rounded-full bg-[#c9922a] px-7 font-semibold text-[#0d1117] transition-colors hover:bg-[#e0b060]">Start Over</a>
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

  const paid = data.paid === true;
  const top = data.eligibility_report.qualifying[0] ?? data.eligibility_report.borderline[0];
  const gaps = data.analysis_result.key_gaps.length > 0 ? data.analysis_result.key_gaps : data.eligibility_report.computed_gaps;
  const steps = data.analysis_result.next_steps.length > 0 ? data.analysis_result.next_steps : data.eligibility_report.action_steps;

  return (
    <main className="min-h-screen bg-[#0d1117] px-6 py-12">
      {showDisclaimer && <DisclaimerModal onConfirm={handleDisclaimerConfirm} />}
      <div className="mx-auto max-w-3xl space-y-10">
        <header>
          <p className="font-mono text-xs uppercase tracking-widest text-[#c9922a]">Your Immigration Analysis</p>
          <h1 className="display-font mt-2 text-3xl text-[#f0ece4] md:text-4xl">{top?.pathway_name ?? "Analysis Complete"}</h1>
          <p className="mt-1 text-sm text-[#8b949e]">Based on published IRCC and USCIS guidelines</p>
          {data.analysis_result.summary && <p className="mt-4 leading-relaxed text-[#8b949e]">{data.analysis_result.summary}</p>}
        </header>

        {data.eligibility_report.qualifying.length > 0 && (
          <section>
            <h2 className="display-font mb-4 text-xl text-[#f0ece4]">Pathways You Qualify For</h2>
            <div className="grid gap-4 md:grid-cols-2">{data.eligibility_report.qualifying.map((p) => <PathwayCard key={p.pathway_id} item={p} tone="green" />)}</div>
          </section>
        )}

        {data.eligibility_report.borderline.length > 0 && (
          <section>
            <h2 className="display-font mb-4 text-xl text-[#f0ece4]">Close — With Some Work</h2>
            <div className="grid gap-4 md:grid-cols-2">{data.eligibility_report.borderline.map((p) => <PathwayCard key={p.pathway_id} item={p} tone="amber" />)}</div>
          </section>
        )}

        <div className="relative">
          <div className={`space-y-8 ${paid ? "" : "pointer-events-none select-none blur-sm"}`}>
            {gaps.length > 0 && (
              <section>
                <h2 className="display-font mb-4 text-xl text-[#f0ece4]">What's Holding You Back</h2>
                <ul className="space-y-3">
                  {gaps.map((g) => (
                    <li key={g} className="flex items-start gap-3 rounded-lg border border-[#30363d] bg-[#1c2128] p-4">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#da3633]" />
                      <span className="text-sm leading-relaxed text-[#8b949e]">{g}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {steps.length > 0 && (
              <section>
                <h2 className="display-font mb-4 text-xl text-[#f0ece4]">Your Action Plan</h2>
                <ol className="list-none space-y-3">
                  {steps.map((s, i) => (
                    <li key={s} className="flex items-start gap-4 rounded-lg border border-[#30363d] bg-[#1c2128] p-4">
                      <span className="shrink-0 font-mono text-sm font-medium text-[#c9922a]">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-sm leading-relaxed text-[#8b949e]">{s}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
          {!paid && (
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="w-full max-w-sm rounded-xl border border-[#30363d] bg-[#1c2128]/95 p-8 text-center shadow-2xl backdrop-blur-sm">
                <h3 className="display-font text-2xl text-[#f0ece4]">Unlock Your Full Report</h3>
                <p className="mt-3 text-lg font-semibold text-[#c9922a]">$9.99 — One time payment</p>
                <p className="mt-1 text-sm text-[#8b949e]">Gap analysis, action plan, and PDF export</p>
                {checkoutError && <p className="mt-3 text-sm text-[#da3633]">{checkoutError}</p>}
                <button onClick={startCheckout} className="mt-6 inline-flex h-12 items-center rounded-full bg-[#c9922a] px-8 font-semibold text-[#0d1117] shadow-[0_4px_20px_rgba(201,146,42,0.3)] transition-colors hover:bg-[#e0b060] active:scale-[0.98]">
                  Unlock Now
                </button>
              </div>
            </div>
          )}
        </div>

        {paid && (
          <div className="text-center">
            <p className="mb-4 text-sm text-[#c9922a]">Full report unlocked</p>
            <button onClick={() => generateVisaWiseReport(data)} className="rounded-full border border-[#c9922a] px-6 py-2.5 text-sm text-[#c9922a] transition-colors hover:bg-[#c9922a]/10">Download PDF Report</button>
          </div>
        )}
      </div>
    </main>
  );
}
