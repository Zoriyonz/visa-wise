interface CheckmarkProps {
  className?: string;
  stroke?: string;
}

export function Checkmark({
  className = "w-4 h-4",
  stroke = "currentColor",
}: CheckmarkProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke={stroke}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 8.5 L6.5 12 L13 4.5" />
    </svg>
  );
}
