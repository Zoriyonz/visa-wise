import jsPDF from "jspdf";

import type { AnalysisResult } from "@/../lib/ai";
import type { EligibilityReport } from "@/../lib/eligibility/types";

export interface ReportData {
  id: string;
  analysis_result: AnalysisResult;
  eligibility_report: EligibilityReport;
  paid?: boolean;
}

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_Y = 287;
const BREAK_Y = 270;

export function generateVisaWiseReport(data: ReportData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // ── Page 1: Cover ──────────────────────────────────────────────────────────
  doc.setFillColor(13, 17, 23);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // "VISA-WISE" — gold, letter-spaced, small caps feel
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(201, 146, 42);
  doc.setCharSpace(3);
  doc.text("VISA-WISE", MARGIN, 21);
  doc.setCharSpace(0);

  // Gold horizontal rule
  doc.setDrawColor(201, 146, 42);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, 25, PAGE_W - MARGIN, 25);

  // Main heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(240, 236, 228);
  doc.text("Immigration Pathway Report", PAGE_W / 2, 128, { align: "center" });

  // Top pathway subheading
  const top =
    data.eligibility_report.qualifying[0] ??
    data.eligibility_report.borderline[0];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(139, 148, 158);
  doc.text(top?.pathway_name ?? "Analysis Complete", PAGE_W / 2, 141, {
    align: "center",
  });

  // Generation date
  const dateStr = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(8);
  doc.setTextColor(139, 148, 158);
  doc.text(`Generated ${dateStr}`, MARGIN, 278);
  doc.text(
    "For informational purposes only. Not legal advice.",
    MARGIN,
    284,
  );

  // ── Page 2+: Content ───────────────────────────────────────────────────────
  doc.addPage();

  let y = MARGIN;
  let pageNum = 2;

  function addFooter() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120, 130, 140);
    doc.text(
      "Visa-Wise  |  For informational purposes only  |  Not legal advice",
      MARGIN,
      FOOTER_Y,
    );
    doc.text(`Page ${pageNum}`, PAGE_W - MARGIN, FOOTER_Y, { align: "right" });
  }

  function checkBreak(needed = 12) {
    if (y + needed > BREAK_Y) {
      addFooter();
      doc.addPage();
      pageNum++;
      y = MARGIN;
    }
  }

  function sectionTitle(title: string) {
    checkBreak(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(201, 146, 42);
    doc.setCharSpace(1.5);
    doc.text(title.toUpperCase(), MARGIN, y);
    doc.setCharSpace(0);
    y += 2.5;
    doc.setDrawColor(201, 146, 42);
    doc.setLineWidth(0.25);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 5;
  }

  function pathwayBlock(
    name: string,
    score: number,
    threshold: number,
    detail: string | null,
  ) {
    const detailLines = detail
      ? (doc.splitTextToSize(detail, CONTENT_W) as string[])
      : [];
    checkBreak(10 + detailLines.length * 4.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 35, 42);
    doc.text(name, MARGIN, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 130, 140);
    doc.text(`Score ${score}  ·  qualifies at ${threshold}`, MARGIN, y);
    y += 4.5;

    if (detailLines.length > 0) {
      doc.setTextColor(90, 98, 108);
      doc.text(detailLines, MARGIN, y);
      y += detailLines.length * 4.5;
    }
    y += 3;
  }

  function numberedList(items: string[]) {
    const NUM_W = 8;
    items.forEach((item, i) => {
      const lines = doc.splitTextToSize(item, CONTENT_W - NUM_W) as string[];
      checkBreak(lines.length * 4.8 + 2);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(201, 146, 42);
      doc.text(`${String(i + 1).padStart(2, "0")}.`, MARGIN, y);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 35, 42);
      doc.text(lines, MARGIN + NUM_W, y);
      y += lines.length * 4.8 + 2;
    });
  }

  // Qualifying pathways
  if (data.eligibility_report.qualifying.length > 0) {
    sectionTitle("Pathways You Qualify For");
    for (const p of data.eligibility_report.qualifying) {
      const reason = p.matched_soft_factors.slice(0, 2).join(" · ") || null;
      pathwayBlock(p.pathway_name, p.score, p.threshold_qualifies, reason);
    }
    y += 4;
  }

  // Borderline/close matches
  if (data.eligibility_report.borderline.length > 0) {
    sectionTitle("Close Matches");
    for (const p of data.eligibility_report.borderline) {
      const detail =
        p.unmet_gaps[0] ?? p.failed_hard_requirements[0] ?? null;
      pathwayBlock(p.pathway_name, p.score, p.threshold_qualifies, detail);
    }
    y += 4;
  }

  // Key gaps
  const gaps =
    data.analysis_result.key_gaps.length > 0
      ? data.analysis_result.key_gaps
      : data.eligibility_report.computed_gaps;
  if (gaps.length > 0) {
    sectionTitle("Key Gaps & How to Fix Them");
    numberedList(gaps);
    y += 4;
  }

  // Action plan
  const steps =
    data.analysis_result.next_steps.length > 0
      ? data.analysis_result.next_steps
      : data.eligibility_report.action_steps;
  if (steps.length > 0) {
    sectionTitle("Your Action Plan");
    numberedList(steps);
  }

  addFooter();

  doc.save("visa-wise-report.pdf");
}
