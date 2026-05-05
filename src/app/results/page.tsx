import { Suspense } from "react";

import { ResultsClient } from "@/components/results/ResultsClient";

export default function ResultsPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center">Loading results...</main>}><ResultsClient /></Suspense>;
}
