import type { PathwayResult } from "@/../lib/eligibility/types";

interface Props {
  item: PathwayResult;
  tone: "green" | "amber";
}

const ACCENTS = {
  green: { hex: "#238636", label: "Qualifies" },
  amber: { hex: "#9e6a03", label: "Close Match" },
} as const;

export function PathwayCard({ item, tone }: Props) {
  const { hex, label } = ACCENTS[tone];
  const pct = Math.min(100, Math.round((item.score / Math.max(item.threshold_qualifies, 1)) * 100));

  const reason =
    tone === "green"
      ? item.matched_soft_factors.slice(0, 2).join(" · ") || null
      : (item.unmet_gaps[0] ?? item.failed_hard_requirements[0] ?? null);

  return (
    <article className="relative overflow-hidden rounded-xl border border-[#30363d] bg-[#1c2128] p-5">
      <div className="absolute left-0 top-0 h-full w-[3px]" style={{ background: hex }} />
      <div className="pl-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="display-font text-lg leading-snug text-[#f0ece4]">{item.pathway_name}</h3>
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ background: `${hex}25`, color: hex }}
          >
            {label}
          </span>
        </div>
        <div className="mt-3 h-1 rounded-full bg-[#30363d]">
          <div
            className="h-1 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: hex }}
          />
        </div>
        <p className="mt-1 text-xs text-[#8b949e]">
          Score {item.score} · qualifies at {item.threshold_qualifies}
        </p>
        {reason && <p className="mt-3 text-sm leading-relaxed text-[#8b949e]">{reason}</p>}
      </div>
    </article>
  );
}
