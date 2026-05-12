import Link from "next/link";

import { computeEligibility } from "@/../lib/eligibility/engine";
import type { PathwayResult } from "@/../lib/eligibility/types";
import { mapTreeAnswersToUserAnswers } from "@/../lib/intake/mapUserAnswers";
import type { TreeAnswersState } from "@/../lib/intake/questionTreeTypes";

import { DocumentsChecklist } from "./DocumentsChecklist";
import { EmailCapture } from "./EmailCapture";
import { IneligiblePathwayCard } from "./IneligiblePathwayCard";
import { ResultsPathwayCard } from "./ResultsPathwayCard";

interface ResultsDisplayProps {
  answers: TreeAnswersState;
}

function uniqueValues(values: string[]): string[] {
  return [...new Set(values)];
}

function collectTopGaps(pathways: PathwayResult[], limit: number): string[] {
  return uniqueValues(pathways.flatMap((pathway) => pathway.unmet_gaps)).slice(0, limit);
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h2
      className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted mb-4"
    >
      {title}
    </h2>
  );
}

export function ResultsDisplay({ answers }: ResultsDisplayProps) {
  const report = computeEligibility(mapTreeAnswersToUserAnswers(answers));
  const trueBorderline = report.borderline.filter((pathway) => pathway.score > 0);
  const falsePositives = report.borderline.filter((pathway) => pathway.score === 0);
  const allIneligible = [...falsePositives, ...report.ineligible];
  const hasMatches = report.qualifying.length > 0 || trueBorderline.length > 0;
  const totalChecked =
    report.qualifying.length + report.borderline.length + report.ineligible.length;
  const topMatch = report.qualifying[0] ?? trueBorderline[0];
  const checklistItems = topMatch ? topMatch.action_steps : [];
  const topGaps = collectTopGaps(allIneligible, 5);

  return (
    <>
      {hasMatches ? (
        <>
          <header className="mb-10 text-center">
            <h2 className="font-display text-[32px] text-dark">Here&apos;s what we found</h2>
            <p className="font-body text-[15px] text-muted mt-3">
              {totalChecked} Canadian pathways analysed
            </p>
          </header>

          {report.qualifying.length > 0 && (
            <section aria-label="Strong matches" className="space-y-6">
              <SectionHeading title="Strong Matches" />
              {report.qualifying.map((pathway) => (
                <ResultsPathwayCard key={pathway.pathway_id} pathway={pathway} />
              ))}
            </section>
          )}

          {trueBorderline.length > 0 && (
            <section aria-label="Close matches" className="space-y-6 mt-10">
              <SectionHeading title="Close Matches" />
              {trueBorderline.map((pathway) => (
                <ResultsPathwayCard key={pathway.pathway_id} pathway={pathway} borderline />
              ))}
            </section>
          )}

          {allIneligible.length > 0 && (
            <details className="mt-10 rounded-[16px] border border-border bg-surface/40 p-6">
              <summary className="cursor-pointer list-none font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                Not Yet Eligible ({allIneligible.length})
              </summary>
              <div className="mt-6 space-y-3">
                {allIneligible.map((pathway) => (
                  <IneligiblePathwayCard key={pathway.pathway_id} pathway={pathway} />
                ))}
              </div>
            </details>
          )}

          <DocumentsChecklist items={checklistItems} />
        </>
      ) : (
        <section className="mb-12">
          <header className="mb-8">
            <h2 className="font-display text-[32px] text-dark">No matches yet — here&apos;s why</h2>
            <p className="font-body text-[15px] text-muted mt-3">
              {totalChecked} Canadian pathways analysed
            </p>
          </header>

          {topGaps.length > 0 && (
            <ul className="space-y-3 mb-8">
              {topGaps.map((gap) => (
                <li
                  key={gap}
                  className="rounded-[12px] border border-border bg-surface px-5 py-4 font-body text-[15px] text-dark"
                >
                  {gap}
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-3">
            {allIneligible.map((pathway) => (
              <IneligiblePathwayCard key={pathway.pathway_id} pathway={pathway} />
            ))}
          </div>

          <Link
            href="/form"
            className="inline-flex items-center mt-10 px-6 py-3 bg-dark text-cream font-mono text-sm uppercase tracking-wider rounded-full hover:opacity-90 transition"
          >
            Start again with different answers
          </Link>
        </section>
      )}

      <EmailCapture answers={answers} />
    </>
  );
}
