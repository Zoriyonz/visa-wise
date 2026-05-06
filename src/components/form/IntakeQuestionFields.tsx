import { COUNTRY_SUGGESTIONS } from "@/../lib/intake/countrySuggestions";
import type { IntakeQuestion } from "@/../lib/intake/questionTreeTypes";

interface Props {
  question: IntakeQuestion;
  selectedSingleValue?: string;
  pendingValue?: string;
  textValue: string;
  numberValue: string;
  onSelectOption: (value: string) => void;
  onNumberChange: (value: string) => void;
  onNumberContinue: () => void;
  onTextChange: (value: string) => void;
  onTextContinue: () => void;
}

const inputBase =
  "h-12 w-full rounded-lg border border-[#30363d] bg-[#161b22] px-4 text-base text-[#f0ece4] outline-none transition-colors focus:border-[#c9922a] focus:ring-1 focus:ring-[#c9922a]/30 placeholder:text-[#8b949e]";

const ctaButton =
  "h-12 w-full rounded-full bg-[#c9922a] font-semibold text-[#0d1117] transition-colors hover:bg-[#e0b060] active:scale-[0.98]";

export function IntakeQuestionFields({
  question, selectedSingleValue, pendingValue,
  textValue, numberValue,
  onSelectOption, onNumberChange, onNumberContinue, onTextChange, onTextContinue,
}: Props) {
  const activeValue = pendingValue ?? selectedSingleValue;
  const listId =
    question.id === "country_of_birth" || question.id === "current_country"
      ? `countries-${question.id}`
      : undefined;

  if (question.type === "single_select" && question.options) {
    return (
      <div className="grid w-full gap-2.5">
        {question.options.map((option) => {
          const selected = activeValue === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelectOption(option.value)}
              className={[
                "relative min-h-[52px] w-full overflow-hidden rounded-lg border px-5 py-4 text-left text-base transition-all",
                selected
                  ? "border-[#c9922a] bg-[#161b22] text-[#c9922a]"
                  : "border-[#30363d] bg-[#161b22] text-[#f0ece4] hover:border-[#c9922a]/60 hover:bg-[#1c2128]",
              ].join(" ")}
            >
              {selected && (
                <span className="absolute left-0 top-0 h-full w-[3px] bg-[#c9922a]" />
              )}
              <span className="pl-1">{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "number") {
    return (
      <div className="flex flex-col gap-4">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={numberValue}
          onChange={(e) => onNumberChange(e.target.value)}
          className={inputBase}
        />
        <button type="button" onClick={onNumberContinue} className={ctaButton}>
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        list={listId}
        value={textValue}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onTextContinue(); }}
        placeholder={question.id === "priority_date" ? "YYYY-MM-DD (from I-797)" : undefined}
        autoComplete={
          question.id === "country_of_birth" || question.id === "current_country"
            ? "country-name"
            : "off"
        }
        className={inputBase}
      />
      {listId && (
        <datalist id={listId}>
          {COUNTRY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}
        </datalist>
      )}
      <button type="button" onClick={onTextContinue} className={ctaButton}>
        Continue
      </button>
    </div>
  );
}
