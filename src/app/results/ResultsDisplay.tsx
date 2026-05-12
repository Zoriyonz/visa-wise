import { computeEligibility } from "@/../lib/eligibility/engine";
import { mapTreeAnswersToUserAnswers } from "@/../lib/intake/mapUserAnswers";
import type { TreeAnswersState } from "@/../lib/intake/questionTreeTypes";
import { LockedReportOverlay } from "@/components/results/LockedReportOverlay";
import { PathwayCard } from "@/components/results/PathwayCard";

import { EmailCapture } from "./EmailCapture";

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
  const lockedIneligible = report.ineligible.slice(0, 3);

  return (
    <>
      {!hasMatches && (
        <section className="mb-12 text-center">
          <h2 className="font-display text-[28px] text-dark">No strong matches found</h2>
          <p className="font-body text-[15px] text-muted mt-3 max-w-xl mx-auto">
            Based on your answers, no pathways reached a strong or close match yet.
            Focus on the gaps below to improve your eligibility over time.
          </p>
          {report.computed_gaps.length > 0 && (
            <ul className="mt-6 space-y-2 text-left max-w-lg mx-auto">
              {report.computed_gaps.map((gap) => (
                <li key={gap} className="font-body text-[14px] text-dark">
                  {gap}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {report.qualifying.length > 0 && (
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

      {report.borderline.length > 0 && (
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

      {report.ineligible.length > 0 && (
        <p className="font-body text-[14px] text-muted mt-10 text-center">
          {report.ineligible.length} additional pathways checked — not yet eligible
        </p>
      )}

      {lockedIneligible.length > 0 && (
        <section aria-label="Locked pathways" className="relative mt-8">
          <div className="space-y-4 blur-[6px] pointer-events-none select-none">
            {lockedIneligible.map((pathway) => (
              <PathwayCard
                key={pathway.pathway_id}
                name={pathway.pathway_name}
                score={pathway.score}
                country={pathwayCountry(pathway.country_code)}
                borderline
              />
            ))}
          </div>
          <LockedReportOverlay />
        </section>
      )}

      <EmailCapture answers={answers} />
    </>
  );
}
