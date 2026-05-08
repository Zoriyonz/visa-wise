import { CTAButton } from "@/components/CTAButton";

export function LockedReportOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <div className="bg-cream border border-border rounded-[16px] p-8 max-w-sm text-center shadow-cta">
        <h3 className="font-display text-[28px] text-dark">
          Unlock Your Full Report
        </h3>
        <p className="font-body text-[16px] text-muted mt-2">
          $9.99 — One time payment
        </p>
        <p className="font-body text-[13px] text-muted mt-3">
          See all 40+ pathways, gap analysis, action plan, and processing
          estimates.
        </p>
        <div className="mt-6">
          <CTAButton variant="dark" size="lg" fullWidth>
            Unlock Full Report
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
