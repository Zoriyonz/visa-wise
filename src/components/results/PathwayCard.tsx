interface PathwayCardProps {
  name: string;
  score: number;
  country: "CA" | "US";
  borderline?: boolean;
}

export function PathwayCard({
  name,
  score,
  country,
  borderline = false,
}: PathwayCardProps) {
  const accent = borderline ? "#B8860B" : "#1A6B3C";
  const label = borderline ? "Close Match" : "Strong Match";
  const countryLabel = country === "CA" ? "CANADA" : "CANADA";

  return (
    <article
      className="bg-surface rounded-[12px] p-6 border border-border"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <p
            className="font-mono uppercase text-[11px] text-muted"
            style={{ letterSpacing: "0.15em" }}
          >
            {countryLabel}
          </p>
          <h3 className="font-display text-[24px] text-dark mt-2">{name}</h3>
        </div>
        <span
          className="font-body text-[11px] font-medium text-cream px-2.5 py-1 rounded-[6px]"
          style={{ backgroundColor: accent }}
        >
          {label}
        </span>
      </header>
      <div className="mt-5">
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-dark rounded-full"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="font-mono text-[11px] text-muted mt-2">{score} / 100</p>
      </div>
    </article>
  );
}
