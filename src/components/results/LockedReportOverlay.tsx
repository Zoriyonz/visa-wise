import { CTAButton } from "@/components/CTAButton";

export function LockedReportOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <div className="bg-cream border border-border rounded-[16px] p-8 max-w-sm text-center shadow-cta">
        <h3 className="font-display text-[28px] text-dark">
          See All Your Pathways
        </h3>
        <p className="font-body text-[13px] text-muted mt-3">
          Answer a few more questions to see all pathways checked, your full
          gap analysis, and action plan.
        </p>
        <div className="mt-6">
          <CTAButton href="/form" variant="dark" size="lg" fullWidth>
            Start Over
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
