import Link from "next/link";
import { redirect } from "next/navigation";

import type { TreeAnswersState } from "@/lib/intake/questionTreeTypes";
import { Logo } from "@/components/Logo";
import { Wordmark } from "@/components/Wordmark";

import { ResultsDisplay } from "./ResultsDisplay";

function decodeAnswers(encoded: string): TreeAnswersState | null {
  try {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) {
      bytes[index] = binary.charCodeAt(index);
    }
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as TreeAnswersState;
  } catch {
    return null;
  }
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string }>;
}) {
  const params = await searchParams;
  const encoded = params.a;
  if (!encoded) redirect("/form");

  const decoded = decodeAnswers(encoded);
  if (!decoded) redirect("/form");

  return (
    <main className="min-h-screen bg-cream py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex flex-col items-center text-center mb-16">
          <Link href="/" aria-label="Visa-Wise home" className="flex items-center gap-3">
            <Logo size={48} />
            <Wordmark className="!text-[24px]" />
          </Link>
          <h1 className="font-display font-light text-display-md text-dark mt-10">
            Your Immigration Analysis
          </h1>
          <p className="font-body text-[15px] text-muted mt-3">
            Based on published IRCC guidelines
          </p>
        </header>

        <ResultsDisplay answers={decoded} />
      </div>
    </main>
  );
}
