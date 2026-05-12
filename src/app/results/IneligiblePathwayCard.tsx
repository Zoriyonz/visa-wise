import type { PathwayResult } from "@/../lib/eligibility/types";

interface IneligiblePathwayCardProps {
  pathway: PathwayResult;
}

export function IneligiblePathwayCard({ pathway }: IneligiblePathwayCardProps) {
  return (
    <article
      className="rounded-2xl border border-border bg-surface/40 p-6 opacity-70"
      aria-label={`${pathway.pathway_name} — not yet eligible`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-xl text-dark">{pathway.pathway_name}</h3>
        <span className="font-mono text-xs uppercase tracking-wider text-muted border border-border px-2 py-1 rounded">
          Not yet eligible
        </span>
      </div>
      {pathway.unmet_gaps.length > 0 && (
        <ul className="mt-4 space-y-2">
          {pathway.unmet_gaps.map((gap) => (
            <li key={gap} className="font-body text-[14px] text-muted">
              {gap}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
