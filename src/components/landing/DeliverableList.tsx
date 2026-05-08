"use client";

import { motion } from "framer-motion";

import { Checkmark } from "@/components/Checkmark";
import { SectionLabel } from "@/components/SectionLabel";

const ITEMS = [
  "Pathway eligibility across 40+ programs",
  "Gap analysis with specific actionable fixes",
  "Step-by-step action plan with timeframes",
  "Province and state recommendations",
  "Processing time estimates",
  "Government fee breakdown",
  "Exportable PDF report",
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
            <Checkmark
              className="w-5 h-5 mt-1 text-cream"
              stroke="#F5F0E8"
            />
            <span className="font-body text-[16px] text-cream">{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
