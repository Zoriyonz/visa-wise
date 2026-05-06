import { Suspense } from "react";

import type { IntakeQuestion } from "@/../lib/intake/questionTreeTypes";
import { IntakeWizard } from "@/components/form/IntakeWizard";

import questionTreeJson from "../../../data/intake_question_tree.json";

const questions = questionTreeJson as readonly IntakeQuestion[];

export default function FormPage() {
  return (
    <main className="min-h-screen bg-[#0d1117] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-2xl">
        <Suspense fallback={
          <div className="rounded-2xl border border-[#30363d] bg-[#1c2128] p-12 text-center text-sm text-[#8b949e]">
            Loading…
          </div>
        }>
          <IntakeWizard questions={questions} />
        </Suspense>
      </div>
    </main>
  );
}
