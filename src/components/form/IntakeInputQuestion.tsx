"use client";

import type { IntakeQuestion } from "../../../lib/intake/questionTreeTypes";

interface IntakeInputQuestionProps {
  question: IntakeQuestion;
  stepLabel: string;
  textValue: string;
  numberValue: string;
  onTextChange: (value: string) => void;
  onNumberChange: (value: string) => void;
  onSubmit: (value: string | number) => void;
}

export function IntakeInputQuestion({
  question,
  stepLabel,
  textValue,
  numberValue,
  onTextChange,
  onNumberChange,
  onSubmit,
}: IntakeInputQuestionProps) {
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
        {question.question}
      </h2>
      {question.help_text && (
        <p className="font-body italic text-[14px] text-muted mt-2">
          {question.help_text}
        </p>
      )}
      <form
        className="mt-8 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (question.type === "number") {
            const parsed = Number(numberValue);
            if (Number.isNaN(parsed)) return;
            onSubmit(parsed);
            return;
          }
          if (textValue.trim()) onSubmit(textValue.trim());
        }}
      >
        {question.type === "number" ? (
          <input
            type="number"
            value={numberValue}
            onChange={(event) => onNumberChange(event.target.value)}
            className="w-full bg-cream border border-border rounded-[10px] px-5 py-4 font-body text-[15px] text-dark"
          />
        ) : (
          <input
            type="text"
            value={textValue}
            onChange={(event) => onTextChange(event.target.value)}
            className="w-full bg-cream border border-border rounded-[10px] px-5 py-4 font-body text-[15px] text-dark"
          />
        )}
        <button
          type="submit"
          className="w-full text-left bg-cream border border-border rounded-[10px] px-5 py-4 font-body text-[15px] text-dark hover:bg-dark hover:text-cream hover:border-dark transition-colors duration-150"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
