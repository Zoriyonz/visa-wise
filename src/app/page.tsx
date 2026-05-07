const CHECK = (
  <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-[#c9922a]" aria-hidden>
    <path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
  </svg>
);

const HOW_STEPS = [
  ["01", "Answer targeted questions", "We ask exactly what a licensed immigration lawyer asks at an intake — nothing more, nothing less."],
  ["02", "Engine checks 40+ pathways", "Deterministic rules against published IRCC and USCIS criteria — not AI guesswork that changes each run."],
  ["03", "Get your personalized report", "Pathway matches ranked by fit, gap analysis with specific fixes, action plan, and timeline estimates."],
] as const;

const DELIVERABLES = [
  "Pathway eligibility for 40+ programs",
  "Gap analysis with specific actionable fixes",
  "Step-by-step action plan",
  "Province and state recommendations",
  "Processing time estimates",
  "Government fee breakdown",
  "Exportable PDF report",
];

export default function Home() {
  return (
    <main className="bg-[#0d1117] text-[#f0ece4]">
      {/* ── Hero ── */}
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 45%, rgba(201,146,42,0.04), transparent)" }} />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="display-font text-[36px] font-bold leading-[1.15] tracking-tight md:text-[56px]">
            Know your immigration pathway before you spend $$$$ on a lawyer
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#8b949e]">
            Answer targeted questions. Our engine checks 40+ pathways against published IRCC and USCIS rules — not AI guesswork.
          </p>
          <div className="mt-10">
            <a href="/form" className="inline-flex h-12 items-center rounded-full bg-[#c9922a] px-8 font-semibold text-[#0d1117] shadow-[0_4px_24px_rgba(201,146,42,0.28)] transition-colors hover:bg-[#e0b060] active:scale-[0.98]">
              Start Your Free Analysis
            </a>
          </div>
          <p className="mt-6 text-sm text-[#8b949e]">Used by immigrants navigating Express Entry, H-1B, EB-2, and 40+ other pathways</p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="display-font mb-12 text-center text-3xl md:text-4xl">How it works</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {HOW_STEPS.map(([num, title, body]) => (
            <article key={num} className="relative overflow-hidden rounded-xl border border-[#30363d] bg-[#1c2128] p-6 pl-7">
              <div className="absolute left-0 top-0 h-full w-[3px] bg-[#c9922a]" />
              <p className="font-mono text-xs text-[#c9922a]">{num}</p>
              <h3 className="display-font mt-4 text-xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#8b949e]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── What you get ── */}
      <section className="mx-auto max-w-6xl px-6 py-8 pb-24">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div>
            <h2 className="display-font mb-8 text-3xl md:text-4xl">What you get</h2>
            <ul className="space-y-4">
              {DELIVERABLES.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#f0ece4]">{CHECK}{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[#30363d] bg-[#1c2128] overflow-hidden">
            <div className="p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#8b949e]">Analysis Preview</p>
              <div className="mt-4 rounded-lg border border-[#238636]/40 bg-[#238636]/10 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">Federal Skilled Worker</span>
                  <span className="shrink-0 rounded-full bg-[#238636]/20 px-2 py-0.5 text-xs text-[#238636]">Strong Match</span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-[#30363d]"><div className="h-1 w-[74%] rounded-full bg-[#238636]" /></div>
                <p className="mt-1 text-xs text-[#8b949e]">Score 74 / 100</p>
              </div>
              <div className="mt-3 rounded-lg border border-[#9e6a03]/40 bg-[#9e6a03]/10 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">Express Entry (CEC)</span>
                  <span className="shrink-0 rounded-full bg-[#9e6a03]/20 px-2 py-0.5 text-xs text-[#9e6a03]">Close Match</span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-[#30363d]"><div className="h-1 rounded-full bg-[#9e6a03]" style={{ width: "58%" }} /></div>
                <p className="mt-1 text-xs text-[#8b949e]">Score 58 / 100</p>
              </div>
              <div className="mt-4 border-t border-[#30363d] pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8b949e]">Key Gaps</p>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex items-center gap-2 text-sm"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#da3633]" />Language test not yet submitted</li>
                  <li className="flex items-center gap-2 text-sm"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#9e6a03]" />Foreign credential evaluation pending</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[#30363d] bg-[#0d1117]/50 px-5 py-3 text-center text-xs text-[#8b949e]">
              + 8 more pathways · action plan · fee breakdown · PDF export
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-lg rounded-xl border border-[#30363d] bg-[#1c2128] p-10 text-center">
          <p className="display-font text-[64px] font-bold leading-none text-[#c9922a]">$9.99</p>
          <p className="mt-4 text-[#f0ece4]">One-time payment. No subscription. No hidden fees.</p>
          <p className="mt-2 text-sm text-[#8b949e]">Compare: an initial lawyer consultation costs $300–500</p>

          <a href="/form" className="mt-8 inline-flex h-12 items-center rounded-full bg-[#c9922a] px-8 font-semibold text-[#0d1117] shadow-[0_4px_24px_rgba(201,146,42,0.28)] transition-colors hover:bg-[#e0b060]">
            Start Your Analysis
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#30363d] px-6 py-10 text-center text-sm text-[#8b949e]">
        <div className="mb-3 flex justify-center gap-6">
          <a href="/terms" className="transition-colors hover:text-[#f0ece4]">Terms of Service</a>
        </div>
        <p>© 2026 Visa-Wise. For informational purposes only. Not legal advice.</p>
      </footer>
    </main>
  );
}
