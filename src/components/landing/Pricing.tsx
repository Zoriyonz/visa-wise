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
  "Exportable PDF report",
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
        <span
          className="font-display font-light text-cream block mt-4 text-[64px] md:text-price"
          style={{ lineHeight: 1, letterSpacing: "-0.02em" }}
        >
          $19.99
        </span>
        <p className="font-body text-[16px] text-muted-dark mt-2">
          One-time payment. No subscription.
        </p>
        <p className="font-body text-[14px] text-muted mt-2">
          Compare: an initial lawyer consultation costs $300–500
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
      </motion.div>
    </section>
  );
}
