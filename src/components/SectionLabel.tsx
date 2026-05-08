interface SectionLabelProps {
  children: string;
  inverted?: boolean;
  className?: string;
}

export function SectionLabel({
  children,
  inverted = false,
  className = "",
}: SectionLabelProps) {
  const tone = inverted ? "text-muted-dark" : "text-muted";
  return (
    <span
      className={`font-body uppercase ${tone} ${className}`}
      style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 500 }}
    >
      {children}
    </span>
  );
}
