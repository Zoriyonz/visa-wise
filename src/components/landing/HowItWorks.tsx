"use client";

import { motion } from "framer-motion";

import { SectionLabel } from "@/components/SectionLabel";

const STEPS = [
  {
    number: "01",
    title: "Answer targeted questions",
    body: "We ask exactly what a licensed immigration lawyer asks at intake — nothing more, nothing less.",
  },
  {
    number: "02",
    title: "Engine checks 40+ pathways",
    body: "Deterministic rules against published IRCC criteria. Same answers always produce the same result — no AI guesswork.",
  },
  {
    number: "03",
    title: "Receive your report",
    body: "Pathway matches ranked by fit, gap analysis with specific fixes, action plan, and timeline estimates.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream py-20 md:py-[120px] px-6 lg:px-10">
      <div className="mx-auto mb-16 max-w-3xl md:mb-20">
        <SectionLabel>THE PROCESS</SectionLabel>
        <h2 className="font-display font-light text-display-lg text-dark mt-6 max-w-[600px]">
          Three steps to clarity
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {STEPS.map((step, index) => (
          <motion.article
            key={step.number}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="bg-surface border border-border rounded-[16px] p-6 md:p-10"
          >
            <p
              className="font-mono uppercase text-[11px] text-muted mb-8"
              style={{ letterSpacing: "0.15em" }}
            >
              {step.number}
            </p>
            <h3
              className="font-display font-normal text-[28px] text-dark mb-4"
              style={{ lineHeight: 1.2 }}
            >
              {step.title}
            </h3>
            <p className="font-body text-[15px] text-muted" style={{ lineHeight: 1.6 }}>
              {step.body}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
