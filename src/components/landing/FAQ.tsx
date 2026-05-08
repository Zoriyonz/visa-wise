"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { SectionLabel } from "@/components/SectionLabel";

const FAQS = [
  {
    q: "Is this legal advice?",
    a: "No. Visa-Wise provides educational information based on publicly available IRCC and USCIS guidelines. We are not a law firm and no attorney-client relationship is created. Always verify with official sources before taking action.",
  },
  {
    q: "How accurate is the analysis?",
    a: "Our eligibility engine uses deterministic rules — the same inputs always produce the same outputs. We update our data weekly against official government sources. That said, immigration has discretionary elements no automated tool can fully predict.",
  },
  {
    q: "What if my situation is complex?",
    a: "The tool handles most standard immigration scenarios for Canada and the United States. If your situation involves criminal history, prior removals, or highly unusual circumstances, we flag these and recommend consulting a licensed professional.",
  },
  {
    q: "How is this different from just Googling it?",
    a: "Google gives you general information. Visa-Wise gives you a personalized analysis of your specific profile against 40+ pathways, identifies your gaps, tells you what to do next, and puts it all in a structured report you can reference and share.",
  },
  {
    q: "What do I get for $19.99?",
    a: "A complete pathway analysis including: eligibility assessment for 40+ programs, gap analysis with specific fixes, a step-by-step action plan, province/state recommendations, processing time estimates, government fee breakdown, and an exportable PDF report.",
  },
] as const;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-muted transition-transform duration-300"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
      aria-hidden="true"
    >
      <path d="M4 6.5 L8 10.5 L12 6.5" />
    </svg>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-surface py-20 md:py-[120px] px-6 lg:px-10"
    >
      <div className="mx-auto mb-12 max-w-3xl md:mb-16">
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="font-display font-light text-display-lg text-dark mt-6">
          Questions we get asked
        </h2>
      </div>

      <div className="max-w-3xl mx-auto">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.q} className="border-b border-border">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between py-6 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-body font-semibold text-[17px] text-dark pr-6">
                  {faq.q}
                </span>
                <Chevron open={isOpen} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p
                      className="font-body text-[15px] text-muted pb-6 pr-12"
                      style={{ lineHeight: 1.7 }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
