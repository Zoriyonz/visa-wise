import { Suspense } from "react";

import { IntakeWizard } from "@/components/form/IntakeWizard";

export default function FormPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">
        <Suspense fallback={<div className="rounded-2xl border border-[#1a1a1a] bg-[#111111] p-10">Loading form...</div>}>
          <IntakeWizard />
        </Suspense>
      </div>
    </main>
  );
}
