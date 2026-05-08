import { Logo } from "@/components/Logo";
import { Wordmark } from "@/components/Wordmark";
import { LockedReportOverlay } from "@/components/results/LockedReportOverlay";
import { PathwayCard } from "@/components/results/PathwayCard";

interface PreviewPathway {
  name: string;
  score: number;
  country: "CA" | "US";
  borderline?: boolean;
}

const QUALIFYING: readonly PreviewPathway[] = [
  { name: "Federal Skilled Worker", score: 74, country: "CA" },
  { name: "Express Entry CEC", score: 58, country: "CA", borderline: true },
  { name: "EB-2 NIW", score: 51, country: "US", borderline: true },
];

const LOCKED_PLACEHOLDERS: readonly PreviewPathway[] = [
  { name: "Provincial Nominee — Ontario", score: 42, country: "CA", borderline: true },
  { name: "Atlantic Immigration Program", score: 39, country: "CA", borderline: true },
  { name: "Rural and Northern Immigration", score: 37, country: "CA", borderline: true },
  { name: "EB-3 Skilled Worker", score: 33, country: "US", borderline: true },
];

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-cream py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-3">
            <Logo size={48} />
            <Wordmark className="!text-[24px]" />
          </div>
          <h1 className="font-display font-light text-display-md text-dark mt-10">
            Your Immigration Analysis
          </h1>
          <p className="font-body text-[15px] text-muted mt-3">
            Based on published IRCC and USCIS guidelines
          </p>
        </header>

        <section aria-label="Qualifying pathways" className="space-y-4">
          {QUALIFYING.map((pathway) => (
            <PathwayCard key={pathway.name} {...pathway} />
          ))}
        </section>

        <section aria-label="Locked pathways" className="relative mt-12">
          <div className="space-y-4 blur-[6px] pointer-events-none select-none">
            {LOCKED_PLACEHOLDERS.map((pathway) => (
              <PathwayCard key={pathway.name} {...pathway} />
            ))}
          </div>
          <LockedReportOverlay />
        </section>
      </div>
    </main>
  );
}
