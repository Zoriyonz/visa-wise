import { TrustStat, type TrustStatFormat } from "./TrustStat";

interface StatConfig {
  target: number;
  format: TrustStatFormat;
  label: string;
  prefix?: string;
  sublabel?: string;
}

const STATS: readonly StatConfig[] = [
  {
    target: 40,
    format: "plus",
    label: "PATHWAYS CHECKED",
    sublabel: "Per analysis, every time",
  },
  {
    target: 2,
    format: "plain",
    label: "COUNTRIES COVERED",
    sublabel: "Canada & United States",
  },
  {
    target: 0,
    format: "plain",
    prefix: "$",
    label: "LAWYER FEES",
    sublabel: "For this step",
  },
];

export function TrustBar() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-12 px-6 md:flex-row md:gap-0 lg:px-10">
        {STATS.map((stat, index) => (
          <div
            key={stat.label}
            className="flex w-full items-center justify-center md:flex-1"
          >
            <TrustStat
              target={stat.target}
              format={stat.format}
              label={stat.label}
              prefix={stat.prefix}
              sublabel={stat.sublabel}
            />
            {index < STATS.length - 1 && (
              <div
                className="hidden h-16 w-px bg-border md:ml-12 md:block"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
