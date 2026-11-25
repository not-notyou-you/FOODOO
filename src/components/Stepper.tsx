// src/components/Stepper.tsx
import { useId, useState } from "react";
import { clampQty } from "../domain/plan.ts";
import { parseWholeInput } from "../i18n/format.ts";
import { StepButton } from "./StepButton.tsx";

interface StepperProps {
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function Stepper({
  label,
  decreaseLabel,
  increaseLabel,
  value,
  min,
  max,
  onChange,
}: StepperProps) {
  const id = useId();
  const [text, setText] = useState<string | null>(null);

  function stepBy(delta: number) {
    setText(null);
    onChange(clampQty(value + delta, min, max));
  }

  return (
    <div className="stepper">
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <StepButton
        label={decreaseLabel}
        disabled={value <= min}
        onStep={() => {
          stepBy(-1);
        }}
      >
        <span aria-hidden="true">−</span>
      </StepButton>
      <input
        id={id}
        className="stepper__input num"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={text ?? String(value)}
        onChange={(event) => {
          const raw = event.target.value;
          setText(raw);
          const parsed = parseWholeInput(raw);
          if (!Number.isNaN(parsed)) {
            onChange(clampQty(parsed, min, max));
          }
        }}
        onBlur={() => {
          setText(null);
        }}
        onFocus={(event) => {
          event.target.select();
        }}
      />
      <StepButton
        label={increaseLabel}
        disabled={value >= max}
        onStep={() => {
          stepBy(1);
        }}
      >
        <span aria-hidden="true">+</span>
      </StepButton>
    </div>
  );
}
