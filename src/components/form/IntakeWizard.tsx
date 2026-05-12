"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import {
  applyAutoFill,
  getNextQuestion,
  getProgress,
  INITIAL_ANSWERS,
  isComplete,
} from "@/lib/intake-engine";
import type { IntakeQuestion, TreeAnswersState } from "../../../lib/intake/questionTreeTypes";

import { IntakeInputQuestion } from "./IntakeInputQuestion";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";

type Direction = 1 | -1;

function encodeAnswers(answers: TreeAnswersState): string {
  const json = JSON.stringify(answers);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function toQuestionCardProps(question: IntakeQuestion) {
  return {
    id: question.id,
    type: "select" as const,
    prompt: question.question,
    helpText: question.help_text || undefined,
    options: question.options ?? undefined,
  };
}

export function IntakeWizard() {
  const router = useRouter();
  const [answers, setAnswers] = useState<TreeAnswersState>(INITIAL_ANSWERS);
  const [currentQuestion, setCurrentQuestion] = useState<IntakeQuestion | null>(
    () => getNextQuestion(INITIAL_ANSWERS),
  );
  const [history, setHistory] = useState<string[]>([]);
  const [direction, setDirection] = useState<Direction>(1);
  const [textValue, setTextValue] = useState("");
  const [numberValue, setNumberValue] = useState("");

  const progress = getProgress(answers);
  const stepLabel = `Step ${history.length + 1}`;

  const advance = (nextAnswers: TreeAnswersState, questionId: string) => {
    setHistory((previous) => [...previous, questionId]);
    if (isComplete(nextAnswers)) {
      router.push(`/results?a=${encodeAnswers(nextAnswers)}`);
      return;
    }
    setCurrentQuestion(getNextQuestion(nextAnswers));
  };

  const handleAnswer = (value: string | number | boolean) => {
    if (!currentQuestion) return;
    const withAutoFill = applyAutoFill(currentQuestion, value, answers);
    const nextAnswers = { ...withAutoFill, [currentQuestion.id]: value };
    setAnswers(nextAnswers);
    setDirection(1);
    setTextValue("");
    setNumberValue("");
    advance(nextAnswers, currentQuestion.id);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const lastId = history[history.length - 1];
    const nextHistory = history.slice(0, -1);
    const nextAnswers = { ...answers };
    delete nextAnswers[lastId];
    setHistory(nextHistory);
    setAnswers(nextAnswers);
    setDirection(-1);
    setTextValue("");
    setNumberValue("");
    setCurrentQuestion(getNextQuestion(nextAnswers));
  };

  if (!currentQuestion) return null;

  const motionKey = `${currentQuestion.id}:${currentQuestion.question}`;

  return (
    <div className="mx-auto max-w-xl">
      <div className="relative bg-surface border border-border rounded-[20px] p-6 md:p-12 overflow-hidden">
        <ProgressBar progress={progress} />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={motionKey}
            custom={direction}
            initial={{ x: direction === 1 ? 32 : -32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === 1 ? -32 : 32, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentQuestion.type === "single_select" ? (
              <QuestionCard
                question={toQuestionCardProps(currentQuestion)}
                stepLabel={stepLabel}
                onAnswer={(value) => handleAnswer(value)}
              />
            ) : (
              <IntakeInputQuestion
                question={currentQuestion}
                stepLabel={stepLabel}
                textValue={textValue}
                numberValue={numberValue}
                onTextChange={setTextValue}
                onNumberChange={setNumberValue}
                onSubmit={handleAnswer}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {history.length > 0 && (
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
