"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { evaluateAutoFillCondition } from "@/../lib/intake/conditions";
import { ApiError, postIntakeAnalysis } from "@/../lib/intake/postIntakeAnalysis";
import type { IntakeQuestion, TreeAnswersState } from "@/../lib/intake/questionTreeTypes";
import { clearAnswersAfterIndex, getVisiblePathIndices, nextTreeIndexAfter } from "@/../lib/intake/path";

import { IntakeProgressBar } from "./IntakeProgressBar";
import { IntakeQuestionFields } from "./IntakeQuestionFields";

interface Props {
  questions: readonly IntakeQuestion[];
}

function normalizeAnswer(q: IntakeQuestion, v: string): string | number | boolean | null {
  if (q.type === "number") { const n = v === "" ? 0 : Number(v); return Number.isFinite(n) ? n : 0; }
  if (q.type === "text") return v.trim();
  return v;
}

export function IntakeWizard({ questions }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<TreeAnswersState>({} as TreeAnswersState);
  const [history, setHistory] = useState<number[]>([0]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pendingValue, setPendingValue] = useState<string | undefined>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryRef = useRef<(() => void) | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const activeTreeIndex = history[history.length - 1] ?? 0;
  const activeQuestion = questions[activeTreeIndex];
  const path = useMemo(() => getVisiblePathIndices(questions, answers), [questions, answers]);
  const stepIndex = path.indexOf(activeTreeIndex);
  const currentStep = stepIndex >= 0 ? stepIndex + 1 : 1;
  const totalSteps = path.length;

  const draftText = activeQuestion?.type === "text" ? String(answers[activeQuestion.id] ?? "") : "";
  const rawSingle = activeQuestion?.type === "single_select" ? answers[activeQuestion.id] : undefined;
  const selectedSingle = typeof rawSingle === "string" ? rawSingle : undefined;
  const draftNumber = activeQuestion?.type === "number" && typeof answers[activeQuestion.id] === "number"
    ? String(answers[activeQuestion.id]) : "";

  const advance = useCallback((nextAnswers: TreeAnswersState, answeredIndex: number) => {
    const nextIdx = nextTreeIndexAfter(questions, nextAnswers, answeredIndex);
    if (nextIdx === null) {
      const submitAnalysis = () => {
        setLoading(true);
        setSubmitError(null);
        void postIntakeAnalysis(nextAnswers)
          .then((payload) => {
            const id = payload.id;
            if (!id || id === "undefined") {
              setLoading(false);
              setSubmitError("Something went wrong. Please try again.");
              return;
            }
            sessionStorage.setItem(`analysis:${id}`, JSON.stringify({ id, analysis_result: payload.result, eligibility_report: payload.report }));
            router.push(`/results?id=${id}`);
          })
          .catch((err: unknown) => {
            setLoading(false);
            if (err instanceof ApiError) {
              if (err.status === 429) {
                setSubmitError("You've reached the limit of 3 analyses per hour. Please try again later.");
              } else if (err.status === 402) {
                setSubmitError("Our service is temporarily unavailable. Please try again in a few minutes.");
              } else {
                setSubmitError("Something went wrong. Please try again.");
              }
            } else {
              setSubmitError("Something went wrong. Please try again.");
            }
          });
      };
      retryRef.current = submitAnalysis;
      submitAnalysis();
      return;
    }
    setPendingValue(undefined);
    setAnswers(nextAnswers);
    setHistory((h) => [...h, nextIdx]);
  }, [questions, router]);

  const selectOption = useCallback((value: string) => {
    if (!activeQuestion) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const coerced = normalizeAnswer(activeQuestion, value);
    let next: TreeAnswersState = { ...answers, [activeQuestion.id]: coerced };
    const rule = activeQuestion.auto_fill;
    if (rule && evaluateAutoFillCondition(rule.condition, coerced)) next = { ...next, [rule.field]: rule.value };
    setPendingValue(value);
    timerRef.current = setTimeout(() => advance(next, activeTreeIndex), 320);
  }, [activeQuestion, activeTreeIndex, answers, advance]);

  const applyTextOrNumber = useCallback((rawDisplay: string) => {
    if (!activeQuestion) return;
    const coerced = normalizeAnswer(activeQuestion, rawDisplay);
    let next: TreeAnswersState = { ...answers, [activeQuestion.id]: coerced };
    const rule = activeQuestion.auto_fill;
    if (rule && evaluateAutoFillCondition(rule.condition, coerced)) next = { ...next, [rule.field]: rule.value };
    advance(next, activeTreeIndex);
  }, [activeQuestion, activeTreeIndex, answers, advance]);

  const goBack = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPendingValue(undefined);
    setHistory((prev) => {
      if (prev.length <= 1) return prev;
      const nextH = prev.slice(0, -1);
      const prevIdx = nextH[nextH.length - 1];
      setAnswers((a) => clearAnswersAfterIndex(questions, a, prevIdx));
      return nextH;
    });
  }, [questions]);

  if (loading || !activeQuestion) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#0d1117] px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#30363d] border-t-[#c9922a]" />
        <p className="display-font text-center text-2xl text-[#f0ece4] md:text-3xl">Analyzing your profile…</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#30363d] bg-[#1c2128]">
      <IntakeProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <div className="px-6 pb-10 pt-6 md:px-12 md:pb-12">
        <h2 className="display-font mb-6 text-[22px] leading-snug text-[#f0ece4] md:text-[28px]">
          {activeQuestion.question}
        </h2>
        <IntakeQuestionFields
          question={activeQuestion}
          selectedSingleValue={selectedSingle}
          pendingValue={pendingValue}
          textValue={draftText}
          numberValue={draftNumber}
          onSelectOption={selectOption}
          onNumberChange={(v) => setAnswers((a) => ({ ...a, [activeQuestion.id]: Number.isFinite(Number(v)) ? Number(v) : 0 }))}
          onNumberContinue={() => applyTextOrNumber(draftNumber === "" ? "0" : draftNumber)}
          onTextChange={(v) => setAnswers((a) => ({ ...a, [activeQuestion.id]: v }))}
          onTextContinue={() => applyTextOrNumber(draftText)}
        />
        <p className="mt-6 text-sm italic leading-relaxed text-[#8b949e]">{activeQuestion.help_text}</p>
        {submitError && (
          <div role="alert" className="mt-4 rounded-lg border border-[#da3633]/40 bg-[#da3633]/10 px-4 py-3">
            <p className="text-sm text-[#da3633]">{submitError}</p>
            <button
              type="button"
              onClick={() => { setSubmitError(null); retryRef.current?.(); }}
              className="mt-2 text-xs font-medium text-[#da3633] underline underline-offset-2 hover:opacity-80"
            >
              Try Again
            </button>
          </div>
        )}
        <div className="mt-8">
          <button type="button" onClick={goBack} className="flex items-center gap-1.5 text-sm text-[#8b949e] transition-colors hover:text-[#f0ece4]">
            <span aria-hidden>←</span> Back
          </button>
        </div>
      </div>
    </div>
  );
}
