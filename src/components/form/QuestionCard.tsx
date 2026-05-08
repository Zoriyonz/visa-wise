"use client";

import type { Question } from "@/lib/questions";

import { OptionButton } from "./OptionButton";

interface QuestionCardProps {
  question: Question;
  stepLabel: string;
  onAnswer: (value: string) => void;
}

export function QuestionCard({
  question,
  stepLabel,
  onAnswer,
}: QuestionCardProps) {
  return (
    <div>
      <p
        className="font-mono uppercase text-[11px] text-muted mb-6"
        style={{ letterSpacing: "0.15em" }}
      >
        {stepLabel}
      </p>
      <h2
        className="font-display font-normal text-[24px] md:text-[32px] text-dark"
        style={{ lineHeight: 1.2 }}
      >
        {question.prompt}
      </h2>
      {question.helpText && (
        <p className="font-body italic text-[14px] text-muted mt-2">
          {question.helpText}
        </p>
      )}
      <div className="mt-8 space-y-3">
        {question.options?.map((opt) => (
          <OptionButton key={opt.value} onClick={() => onAnswer(opt.value)}>
            {opt.label}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
