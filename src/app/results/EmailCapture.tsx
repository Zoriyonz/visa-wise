"use client";

import { type FormEvent, useState } from "react";

import type { TreeAnswersState } from "@/lib/intake/questionTreeTypes";

interface EmailCaptureProps {
  answers: TreeAnswersState;
}

export function EmailCapture({ answers }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answers }),
      });
      const payload = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || payload.error) {
        setError(payload.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSaved(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (saved) {
    return (
      <section className="mt-16 text-center">
        <p className="font-body text-[15px] text-dark">
          You&apos;re on the list. We&apos;ll be in touch.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-16 border border-border rounded-[16px] bg-surface p-8">
      <h2 className="font-display text-[28px] text-dark text-center">
        Get notified when rules change
      </h2>
      <p className="font-body text-[15px] text-muted text-center mt-3 max-w-md mx-auto">
        Immigration rules update frequently. We&apos;ll email you if your eligibility changes.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="flex-1 bg-cream border border-border rounded-[10px] px-4 py-3 font-body text-[15px] text-dark"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-dark text-cream font-body text-[15px] px-6 py-3 rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          Save my results
        </button>
      </form>
      {error && <p className="font-body text-[13px] text-red-700 text-center mt-3">{error}</p>}
    </section>
  );
}
