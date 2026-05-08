"use client";

import { motion } from "framer-motion";

import { SectionLabel } from "@/components/SectionLabel";

interface PathwayRowProps {
  name: string;
  badgeLabel: string;
  badgeColor: string;
  scorePercent: number;
}

function PathwayRow({
  name,
  badgeLabel,
  badgeColor,
  scorePercent,
}: PathwayRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-display text-[24px] text-cream">{name}</h4>
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-cream text-[11px] font-medium"
          style={{ backgroundColor: badgeColor }}
        >
          {badgeLabel}
        </span>
      </div>
      <div className="h-1 bg-dark-border rounded-full mt-4 overflow-hidden">
        <div
          className="h-full bg-cream rounded-full"
          style={{ width: `${scorePercent}%` }}
        />
      </div>
      <p className="font-mono text-[11px] text-muted mt-2">
        {scorePercent} / 100
      </p>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F5F0E8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto w-6 h-6"
      aria-hidden="true"
    >
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function AnalysisPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="bg-dark-surface border border-dark-border rounded-[16px] p-8"
    >
      <span
        className="font-mono uppercase text-[10px] text-muted"
        style={{ letterSpacing: "0.2em" }}
      >
        ANALYSIS PREVIEW
      </span>

      <div className="mt-6 space-y-8">
        <PathwayRow
          name="Federal Skilled Worker"
          badgeLabel="Strong Match"
          badgeColor="#1A6B3C"
          scorePercent={74}
        />
        <PathwayRow
          name="Express Entry CEC"
          badgeLabel="Close Match"
          badgeColor="#B8860B"
          scorePercent={58}
        />
      </div>

      <div className="mt-8">
        <SectionLabel inverted>KEY GAPS</SectionLabel>
        <ul className="font-body text-[14px] text-muted-dark mt-3 space-y-2">
          <li>IELTS score below CLB 9 — affects French-speaking draws</li>
          <li>No Canadian work experience — limits CEC eligibility</li>
        </ul>
      </div>

      <div className="relative mt-8">
        <div
          className="space-y-2 text-[14px] font-body text-muted-dark"
          style={{ filter: "blur(6px)" }}
        >
          <p>
            Action plan: Step 1 — register IELTS retake within 30 days for
            CLB 9 eligibility.
          </p>
          <p>
            Step 2 — request ECA for foreign credentials, expected return
            within 4–6 weeks.
          </p>
          <p>
            Step 3 — enter Express Entry pool with updated CRS and target
            provincial draws.
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <LockIcon />
          <p className="font-body text-[13px] text-cream mt-2">
            Unlock the full report
          </p>
        </div>
      </div>
    </motion.div>
  );
}
