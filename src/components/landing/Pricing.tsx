"use client";

import { motion } from "framer-motion";

import { CTAButton } from "@/components/CTAButton";
import { Checkmark } from "@/components/Checkmark";
import { SectionLabel } from "@/components/SectionLabel";

const FEATURES = [
  "Eligibility across 40+ pathways",
  "Gap analysis with specific fixes",
  "Step-by-step action plan",
  "Processing time + fee estimates",
  "Email notification when rules change",
] as const;

export function Pricing() {
  return (
    <section id="pricing" className="bg-dark py-20 md:py-[120px] px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="bg-dark-surface border border-dark-border rounded-[24px] p-8 md:p-16 max-w-[520px] mx-auto flex flex-col items-center text-center"
      >
        <SectionLabel inverted>PRICING</SectionLabel>
        <h2 className="font-display font-light text-cream mt-4 text-[40px] md:text-[48px] leading-tight tracking-[-0.02em]">
          Free. No account required.
        </h2>
        <p className="font-body text-[16px] text-muted-dark mt-4 max-w-sm">
          We believe everyone deserves to know their options before spending
          thousands on a lawyer.
        </p>

        <div className="h-px bg-dark-border my-8 w-full" />

        <ul className="space-y-3 self-stretch text-left">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Checkmark
                className="w-4 h-4 text-cream mt-1"
                stroke="#F5F0E8"
              />
              <span className="font-body text-[15px] text-cream">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 w-full">
          <CTAButton href="/form" variant="cream" size="lg" fullWidth>
            Start Your Analysis
          </CTAButton>
        </div>
        <p className="font-body text-[14px] text-muted mt-4">
          No signup required. Results in minutes.
        </p>
      </motion.div>
    </section>
  );
}
