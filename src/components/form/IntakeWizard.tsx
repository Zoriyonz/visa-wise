"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { questions } from "@/lib/questions";

import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";

type Direction = 1 | -1;

export function IntakeWizard() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<Direction>(1);

  const current = questions[index];
  const progress = ((index + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((previous) => ({ ...previous, [current.id]: value }));
    setDirection(1);
    if (index < questions.length - 1) {
      setTimeout(() => setIndex((position) => position + 1), 200);
    } else {
      router.push("/results");
    }
  };

  const handleBack = () => {
    if (index === 0) return;
    setDirection(-1);
    setIndex((position) => position - 1);
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="relative bg-surface border border-border rounded-[20px] p-6 md:p-12 overflow-hidden">
        <ProgressBar progress={progress} />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ x: direction === 1 ? 32 : -32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === 1 ? -32 : 32, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <QuestionCard
              question={current}
              stepLabel={`Step ${index + 1}`}
              onAnswer={handleAnswer}
            />
          </motion.div>
        </AnimatePresence>

        {index > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="mt-8 font-body text-[13px] text-muted hover:text-dark transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
