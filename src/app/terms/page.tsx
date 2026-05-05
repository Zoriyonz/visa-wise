export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-[#d2d2d2]">
      <h1 className="display-font text-4xl text-foreground">Terms of Service</h1>
      <p className="mt-4 text-sm text-[#888]">Last updated: May 2026</p>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl text-foreground">Informational Purposes Only</h2>
        <p>
          Visa-Wise provides generalized immigration pathway analysis for educational and informational purposes only.
          Our results are not legal advice and do not replace counsel from a licensed immigration attorney or regulated consultant.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl text-foreground">No Attorney-Client Relationship</h2>
        <p>
          Use of this site, reports, and recommendations does not create an attorney-client, consultant-client, fiduciary,
          or confidential advisory relationship between you and Visa-Wise.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl text-foreground">Independent Verification Required</h2>
        <p>
          You agree to independently verify all program criteria, processing times, filing fees, and legal requirements
          using official IRCC, USCIS, and government sources before relying on any output.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl text-foreground">Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Visa-Wise is not liable for direct, indirect, incidental, consequential,
          or special damages arising from your use of the platform, including reliance on inaccurate, outdated, or incomplete information.
        </p>
      </section>
    </main>
  );
}
