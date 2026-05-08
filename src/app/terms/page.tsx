import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

interface SectionProps {
  num: string;
  title: string;
  children: React.ReactNode;
}

function Section({ num, title, children }: SectionProps) {
  return (
    <section className="mt-12">
      <div className="flex items-baseline gap-3">
        <span
          className="font-mono text-[12px] uppercase text-muted"
          style={{ letterSpacing: "0.15em" }}
        >
          {num}
        </span>
        <h2 className="font-display font-normal text-[24px] text-dark">
          {title}
        </h2>
      </div>
      <div className="mt-4 space-y-3 font-body text-[15px] text-muted leading-7">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen px-6 pt-32 pb-20">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="font-mono text-[12px] uppercase text-muted hover:text-dark transition-colors"
            style={{ letterSpacing: "0.15em" }}
          >
            ← Back to visa-wise.com
          </Link>
          <h1 className="font-display font-light text-display-md text-dark mt-6">
            Terms of Service
          </h1>
          <p
            className="mt-3 font-mono text-[12px] uppercase text-muted"
            style={{ letterSpacing: "0.15em" }}
          >
            Last updated: May 2026
          </p>

          <Section num="01" title="Agreement to Terms">
            <p>
              By accessing or using Visa-Wise (&ldquo;the Service&rdquo;), you
              agree to be bound by these Terms of Service. If you do not agree
              to these terms in their entirety, you must not use the Service.
            </p>
          </Section>

          <Section num="02" title="Nature of Service — Informational Only">
            <p>
              Visa-Wise provides educational information about immigration
              pathways based on publicly available government guidelines
              published by IRCC, USCIS, and other official sources.
            </p>
            <p>
              <strong className="text-dark">We are not a law firm.</strong> No
              attorney-client relationship is created by your use of this
              Service, and nothing on this platform constitutes legal advice.
            </p>
            <p>
              You must not rely solely on our analysis for any immigration
              decision. You are responsible for independently verifying all
              information with official government sources (ircc.canada.ca,
              uscis.gov) before taking any action.
            </p>
          </Section>

          <Section num="03" title="Accuracy and Currency of Information">
            <p>
              Immigration rules, processing times, draw scores, and visa
              bulletin dates change frequently. While we make reasonable
              efforts to keep our data current, we make no representation or
              warranty that information is accurate, complete, or current at
              the time of your use.
            </p>
            <p>
              The data version used to generate your report is displayed within
              the report. Always verify current program requirements directly
              with the governing authority before submitting any application.
            </p>
          </Section>

          <Section num="04" title="No Guarantee of Outcome">
            <p>
              An eligibility assessment from Visa-Wise does not guarantee that
              any immigration application will be approved. Immigration
              officers have broad discretionary authority that no automated
              tool can predict or replicate.
            </p>
            <p>
              Individual circumstances — including undisclosed information,
              changes in personal situation, or officer interpretation — may
              affect eligibility in ways our tool cannot assess.
            </p>
          </Section>

          <Section num="05" title="Payment and Refund Policy">
            <p>
              Access to a full Visa-Wise report requires a one-time payment of
              $9.99 USD. This payment is processed securely through Stripe.
            </p>
            <p>
              Due to the immediate digital nature of the product, refunds are
              not available once your report has been generated and delivered.
              If a technical error prevents report delivery, contact{" "}
              <a
                href="mailto:support@visa-wise.com"
                className="text-dark underline underline-offset-2 hover:text-muted"
              >
                support@visa-wise.com
              </a>{" "}
              within 48 hours for assistance.
            </p>
          </Section>

          <Section num="06" title="Privacy and Data">
            <p>
              Your responses are stored securely and used solely to generate
              your immigration analysis report. We do not sell, rent, or share
              your personal data with third parties for marketing purposes.
            </p>
            <p>
              Immigration information is sensitive. We treat it accordingly and
              apply appropriate technical and organizational measures to
              protect it. You may request deletion of your data by contacting
              us at{" "}
              <a
                href="mailto:privacy@visa-wise.com"
                className="text-dark underline underline-offset-2 hover:text-muted"
              >
                privacy@visa-wise.com
              </a>
              .
            </p>
          </Section>

          <Section num="07" title="Limitation of Liability">
            <p>
              Visa-Wise shall not be liable for any immigration decisions made
              in reliance on our analysis, nor for any damages arising from
              changes in immigration law, policy, or officer practice that
              occur after your report is generated.
            </p>
            <p>
              To the maximum extent permitted by applicable law, our total
              liability to you for any claim arising from these Terms or your
              use of the Service is limited to the amount you paid for the
              Service ($9.99 USD).
            </p>
          </Section>

          <Section num="08" title="Governing Law">
            <p>
              These Terms are governed by and construed in accordance with the
              laws of the Province of British Columbia and the federal laws of
              Canada applicable therein.
            </p>
            <p>
              Any disputes arising out of or relating to these Terms or the
              Service shall be subject to the exclusive jurisdiction of the
              courts of British Columbia, Canada.
            </p>
          </Section>

          <Section num="09" title="Changes to These Terms">
            <p>
              We reserve the right to update these Terms at any time. When we
              do, we will revise the &ldquo;Last updated&rdquo; date above.
              Your continued use of the Service after any changes constitutes
              your acceptance of the revised Terms.
            </p>
          </Section>

          <Section num="10" title="Contact">
            <p>
              For general support:{" "}
              <a
                href="mailto:support@visa-wise.com"
                className="text-dark underline underline-offset-2 hover:text-muted"
              >
                support@visa-wise.com
              </a>
            </p>
            <p>
              For legal inquiries:{" "}
              <a
                href="mailto:legal@visa-wise.com"
                className="text-dark underline underline-offset-2 hover:text-muted"
              >
                legal@visa-wise.com
              </a>
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}
