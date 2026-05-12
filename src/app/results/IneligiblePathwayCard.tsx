import type { PathwayResult } from "@/../lib/eligibility/types";

interface IneligiblePathwayCardProps {
  pathway: PathwayResult;
}

export function IneligiblePathwayCard({ pathway }: IneligiblePathwayCardProps) {
  const topGap = pathway.unmet_gaps[0];

  return (
    <article
      className="rounded-2xl border border-border bg-surface/40 p-5 opacity-80"
      aria-label={`${pathway.pathway_name} — not yet eligible`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl text-dark">{pathway.pathway_name}</h3>
          {topGap && (
            <p className="font-body text-[14px] text-muted mt-2">{topGap}</p>
          )}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted border border-border px-2 py-1 rounded shrink-0">
          Not yet eligible
        </span>
      </div>
    </article>
  );
}
