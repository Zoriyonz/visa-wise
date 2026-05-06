interface Props {
  currentStep: number;
  totalSteps: number;
}

export function IntakeProgressBar({ currentStep, totalSteps }: Props) {
  const pct = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;
  return (
    <div>
      {/* 2px bar flush against card top — parent must have overflow-hidden */}
      <div className="h-0.5 w-full bg-[#30363d]">
        <div
          className="h-0.5 bg-[#c9922a] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="px-6 pt-5 font-mono text-xs text-[#8b949e] md:px-12">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
}
