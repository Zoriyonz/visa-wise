"use client";

import { motion } from "framer-motion";

import { SectionLabel } from "@/components/SectionLabel";

const PILLARS = [
  {
    number: "01",
    title: "Deterministic engine",
    body: "Same inputs always produce the same outputs. No AI model involved in eligibility scoring — just published IRCC and USCIS criteria encoded as rules.",
  },
  {
    number: "02",
    title: "40+ pathways checked",
    body: "Every analysis runs against all active Canadian federal, provincial, and US pathways simultaneously. Nothing is skipped based on assumptions.",
  },
  {
    number: "03",
    title: "Updated from official sources",
    body: "Pathway criteria are reviewed against IRCC.gc.ca and USCIS.gov on a regular basis. You're never working from stale data.",
  },
] as const;

export function Methodology() {
  return (
    <section className="bg-cream py-20 md:py-[120px] px-6 lg:px-10">
      <div className="mx-auto mb-16 max-w-3xl md:mb-20">
        <SectionLabel>THE ENGINE</SectionLabel>
        <h2 className="font-display font-light text-display-lg text-dark mt-6 max-w-[600px]">
          Built on rules, not guesswork.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {PILLARS.map((pillar, index) => (
          <motion.article
            key={pillar.number}
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
              {pillar.number}
            </p>
            <h3
              className="font-display font-normal text-[28px] text-dark mb-4"
              style={{ lineHeight: 1.2 }}
            >
              {pillar.title}
            </h3>
            <p
              className="font-body text-[15px] text-muted"
              style={{ lineHeight: 1.6 }}
            >
              {pillar.body}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
