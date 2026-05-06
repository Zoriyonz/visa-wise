"use client";

import { useState } from "react";

type Props = {
  onConfirm: () => void;
};

export function DisclaimerModal({ onConfirm }: Props) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]/90 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#30363d] bg-[#1c2128] p-8">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#c9922a] text-xl font-bold text-[#c9922a]">
            !
          </div>
        </div>

        <h2 className="display-font mt-5 text-center text-2xl text-[#f0ece4]">Before you read your report</h2>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#8b949e]">
          <p>
            This report is for informational and educational purposes only. It is not legal advice and does not
            create an attorney-client relationship.
          </p>
          <p>
            Immigration rules change frequently. Always verify current requirements directly with IRCC (ircc.canada.ca)
            or USCIS (uscis.gov) before taking any action.
          </p>
          <p>Visa-Wise is not responsible for decisions made based on this report.</p>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#c9922a]"
          />
          <span className="text-sm text-[#8b949e]">
            I understand this is informational only and I will verify details before making any decisions
          </span>
        </label>

        <button
          onClick={onConfirm}
          disabled={!checked}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#c9922a] px-8 font-semibold text-[#0d1117] transition-colors hover:bg-[#e0b060] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
        >
          I Understand — Show My Report
        </button>

        <div className="mt-4 text-center">
          <a href="/terms" className="text-xs text-[#8b949e] underline underline-offset-2 hover:text-[#f0ece4]">
            View full Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}
