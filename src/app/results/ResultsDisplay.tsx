import Link from "next/link";

import { computeEligibility } from "@/../lib/eligibility/engine";
import { mapTreeAnswersToUserAnswers } from "@/../lib/intake/mapUserAnswers";
import type { TreeAnswersState } from "@/../lib/intake/questionTreeTypes";
import { PathwayCard } from "@/components/results/PathwayCard";

import { EmailCapture } from "./EmailCapture";
import { IneligiblePathwayCard } from "./IneligiblePathwayCard";

interface ResultsDisplayProps {
  answers: TreeAnswersState;
}

function pathwayCountry(countryCode: string): "CA" | "US" {
  return countryCode === "US" ? "US" : "CA";
}

export function ResultsDisplay({ answers }: ResultsDisplayProps) {
  const userAnswers = mapTreeAnswersToUserAnswers(answers);
  const report = computeEligibility(userAnswers);
  const hasMatches = report.qualifying.length > 0 || report.borderline.length > 0;
  const checkedPathways = [
    ...report.qualifying,
    ...report.borderline,
    ...report.ineligible,
  ];
  const gapEntries = report.ineligible.flatMap((pathway) =>
    pathway.unmet_gaps.map((gap) => ({
      id: `${pathway.pathway_id}-${gap}`,
      description: gap,
    })),
  );

  return (
    <>
      {!hasMatches && (
        <section className="mb-12">
          <h2 className="font-display text-3xl text-dark mb-3">No strong matches yet</h2>
          <p className="text-muted mb-8 max-w-prose">
            Based on what you&apos;ve told us so far, no pathway is a clear fit.
            Here&apos;s what&apos;s blocking each one, and what you could do next.
          </p>
          {gapEntries.length > 0 && (
            <ul className="space-y-3">
              {gapEntries.map((gap) => (
                <li key={gap.id} className="flex items-start gap-3">
                  <span className="font-mono text-xs text-muted mt-1 shrink-0">—</span>
                  <span className="text-dark">{gap.description}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 space-y-4">
            {report.ineligible.map((pathway) => (
              <IneligiblePathwayCard key={pathway.pathway_id} pathway={pathway} />
            ))}
          </div>
          <Link
            href="/form"
            className="inline-flex items-center gap-2 mt-12 px-6 py-3 bg-dark text-cream font-mono text-sm uppercase tracking-wider rounded-full hover:opacity-90 transition"
          >
            Answer more questions to refine your results
          </Link>
        </section>
      )}

      {hasMatches && report.qualifying.length > 0 && (
        <section aria-label="Qualifying pathways" className="space-y-4">
          {report.qualifying.map((pathway) => (
            <PathwayCard
              key={pathway.pathway_id}
              name={pathway.pathway_name}
              score={pathway.score}
              country={pathwayCountry(pathway.country_code)}
            />
          ))}
        </section>
      )}

      {hasMatches && report.borderline.length > 0 && (
        <section aria-label="Borderline pathways" className="space-y-4 mt-8">
          {report.borderline.map((pathway) => (
            <PathwayCard
              key={pathway.pathway_id}
              name={pathway.pathway_name}
              score={pathway.score}
              country={pathwayCountry(pathway.country_code)}
              borderline
            />
          ))}
        </section>
      )}

      {hasMatches && report.ineligible.length > 0 && (
        <>
          <p className="font-body text-[14px] text-muted mt-10 text-center">
            {report.ineligible.length} additional pathways checked — not yet eligible
          </p>
          <section aria-label="Ineligible pathways" className="mt-8 space-y-4">
            {report.ineligible.map((pathway) => (
              <IneligiblePathwayCard key={pathway.pathway_id} pathway={pathway} />
            ))}
          </section>
        </>
      )}

      {hasMatches && checkedPathways.length === 0 && (
        <p className="font-body text-[14px] text-muted text-center">
          No pathways were checked for this profile.
        </p>
      )}

      <EmailCapture answers={answers} />
    </>
  );
}
