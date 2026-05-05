export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <section className="noise-overlay relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,39,58,.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(28,63,143,.18),transparent_35%)] animate-[pulse_14s_ease-in-out_infinite]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <h1 className="display-font text-4xl leading-tight md:text-6xl">
            Know your immigration pathway before you spend $400 on a lawyer
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#b5b5b5]">
            Answer 20 questions. Get a personalized pathway analysis, gap report, and action plan — for $9.99.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a href="/form?country=canada" className="rounded-full bg-[#d4273a] px-8 py-4 font-medium">
              Analyze Canada pathways
            </a>
            <a href="/form?country=us" className="rounded-full bg-[#1c3f8f] px-8 py-4 font-medium">
              Analyze US pathways
            </a>
          </div>
        </div>
      </section>
      <section className="border-y border-[#1a1a1a] px-6 py-5 text-center text-sm text-[#666666]">
        Used by immigrants navigating Express Entry, H-1B, EB-2, and 40+ other pathways
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 py-20 md:grid-cols-3">
        {[
          ["01", "Answer 20 targeted questions", "we ask what a lawyer asks at intake"],
          ["02", "Our engine checks 40+ pathways", "against published IRCC and USCIS rules, not AI guesswork"],
          ["03", "Get your personalized report", "pathway matches, gap analysis, action plan, PDF export"],
        ].map(([step, title, copy]) => (
          <article key={step} className="rounded-2xl border border-[#1a1a1a] bg-[#111111] p-6">
            <p className="font-mono text-sm text-[#c9922a]">{step}</p>
            <h3 className="mt-4 text-xl">{title}</h3>
            <p className="mt-3 text-sm text-[#a0a0a0]">{copy}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2">
        <ul className="space-y-3 text-[#d0d0d0]">
          {[
            "Pathway eligibility for 40+ programs",
            "Gap analysis with specific fixes",
            "Step-by-step action plan",
            "Province/State recommendations",
            "Processing time estimates",
            "Government fee breakdown",
            "Exportable PDF report",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="text-[#c9922a]">✓</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#111111] p-6">
          <p className="font-mono text-xs text-[#666666]">Sample Result</p>
          <h4 className="mt-3 display-font text-2xl">Federal Skilled Worker — Close Match</h4>
          <p className="mt-3 text-sm text-[#a0a0a0]">Primary gaps: language score and credential recognition. Projected timeline: 8-14 months.</p>
        </div>
      </section>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#1a1a1a] bg-[#111111] p-10 text-center">
          <p className="display-font text-6xl text-[#c9922a]">$9.99</p>
          <p className="mt-3 text-[#d0d0d0]">One-time. No subscription.</p>
          <p className="mt-2 text-sm text-[#666666]">vs $400+ for an initial lawyer consultation</p>
          <a href="/form" className="mt-8 inline-block rounded-full bg-[#c9922a] px-8 py-3 font-semibold text-black">
            Start My Analysis
          </a>
        </div>
      </section>
      <footer className="border-t border-[#1a1a1a] px-6 py-10 text-center text-sm text-[#666666]">
        <div className="mb-3 flex justify-center gap-6">
          <a href="/terms" className="hover:text-foreground">Terms of Service</a>
          <a href="#" className="hover:text-foreground">Privacy Policy</a>
        </div>
        <p>© 2026 Visa-Wise. For informational purposes only. Not legal advice.</p>
      </footer>
    </main>
  );
}
