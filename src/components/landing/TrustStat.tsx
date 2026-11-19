"use client";

import { useCountUp } from "@/lib/use-count-up";

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export type TrustStatFormat = "thousands-plus" | "plus" | "plain";

interface TrustStatProps {
  target: number;
  format: TrustStatFormat;
  label: string;
  prefix?: string;
  sublabel?: string;
}

function formatValue(value: number, format: TrustStatFormat): string {
  if (format === "thousands-plus") return `${NUMBER_FORMATTER.format(value)}+`;
  if (format === "plus") return `${value}+`;
  return `${value}`;
}

export function TrustStat({ target, format, label, prefix, sublabel }: TrustStatProps) {
  const { value, ref } = useCountUp(target);
  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <span
        className="font-display font-light text-stat text-dark"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {prefix}
        {formatValue(value, format)}
      </span>
      <span
        className="font-body uppercase text-[13px] text-muted mt-3"
        style={{ letterSpacing: "0.15em" }}
      >
        {label}
      </span>
      {sublabel && (
        <span className="font-body text-[11px] text-muted mt-1" style={{ letterSpacing: "0.05em" }}>
          {sublabel}
        </span>
      )}
    </div>
  );
}
