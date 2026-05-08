interface WordmarkProps {
  className?: string;
  inverted?: boolean;
}

export function Wordmark({ className = "", inverted = false }: WordmarkProps) {
  const tone = inverted ? "text-cream" : "text-dark";
  return (
    <span
      className={`font-display ${tone} ${className}`}
      style={{ fontSize: "20px", letterSpacing: "0.05em", fontWeight: 500 }}
    >
      Visa-Wise
    </span>
  );
}
