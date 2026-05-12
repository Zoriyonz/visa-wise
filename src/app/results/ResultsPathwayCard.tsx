import type { PathwayResult } from "@/../lib/eligibility/types";
import { PathwayCard } from "@/components/results/PathwayCard";

interface ResultsPathwayCardProps {
  pathway: PathwayResult;
  borderline?: boolean;
}

function pathwayCountry(countryCode: string): "CA" | "US" {
  return countryCode === "US" ? "US" : "CA";
}

export function ResultsPathwayCard({ pathway, borderline = false }: ResultsPathwayCardProps) {
  const nextSteps = pathway.action_steps.slice(0, 3);

  return (
    <article className="space-y-4">
      <PathwayCard
        name={pathway.pathway_name}
        score={pathway.score}
        country={pathwayCountry(pathway.country_code)}
        borderline={borderline}
      />
      {pathway.unmet_gaps.length > 0 && (
        <div className="rounded-[12px] border border-border bg-surface/60 px-5 py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            What to improve
          </p>
          <ul className="mt-3 space-y-2">
            {pathway.unmet_gaps.map((gap) => (
              <li key={gap} className="font-body text-[14px] text-muted">
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}
      {nextSteps.length > 0 && (
        <div className="rounded-[12px] border border-border bg-surface/60 px-5 py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            Next steps
          </p>
          <ol className="mt-3 space-y-2 list-decimal list-inside">
            {nextSteps.map((step) => (
              <li key={step} className="font-body text-[14px] text-muted">
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}
