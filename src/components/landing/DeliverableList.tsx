"use client";

import { motion } from "framer-motion";

import { Checkmark } from "@/components/Checkmark";
import { SectionLabel } from "@/components/SectionLabel";

const ITEMS = [
  "Eligibility check across 40+ Canadian pathways",
  "Gap analysis — what's blocking you and why",
  "Step-by-step action plan with timeframes",
  "Province-specific recommendations",
  "Processing time estimates",
  "Email notification when rules change",
] as const;

export function DeliverableList() {
  return (
    <div>
      <SectionLabel inverted className="mb-8 block">
        WHAT&apos;S INCLUDED
      </SectionLabel>
      <ul className="space-y-5">
        {ITEMS.map((item, index) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="flex items-start gap-4"
          >
            <Checkmark className="w-5 h-5 mt-1 text-cream" stroke="#F5F0E8" />
            <span className="font-body text-[16px] text-cream">{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
