// src/components/CloseRow.tsx
import type { HHMM } from "../domain/types.ts";
import { useT } from "../i18n/index.ts";
import { Button } from "./Button.tsx";
import { Stepper } from "./Stepper.tsx";
import { TimeInput } from "./TimeInput.tsx";

interface CloseRowProps {
  name: string;
  cooked: number;
  soldOutAt: HHMM | null;
  leftover: number;
  missedTime: HHMM;
  missedError: string | undefined;
  onLeftover: (value: number) => void;
  onMissedTime: (value: HHMM) => void;
  onEditTime: () => void;
}

export function CloseRow({
  name,
  cooked,
  soldOutAt,
  leftover,
  missedTime,
  missedError,
  onLeftover,
  onMissedTime,
  onEditTime,
}: CloseRowProps) {
  const t = useT();
  return (
    <li className="card close-row">
      <div className="close-row__head">
        <h2 className="close-row__name">{name}</h2>
        <p className="close-row__meta">
          {t("close.cookedOf", { qty: cooked })}
        </p>
      </div>
      {soldOutAt === null ? (
        <>
          <Stepper
            label={t("close.leftoverLabel", { name })}
            decreaseLabel={t("plan.decrease", { name })}
            increaseLabel={t("plan.increase", { name })}
            value={leftover}
            min={0}
            max={cooked}
            onChange={onLeftover}
          />
          {leftover === 0 ? (
            <div className="prompt">
              <TimeInput
                label={t("close.missedQuestion", { name })}
                value={missedTime}
                onChange={onMissedTime}
                error={missedError}
              />
              <p className="field__hint">{t("close.missedHint")}</p>
            </div>
          ) : null}
        </>
      ) : (
        <div className="close-row__soldout">
          <span className="chip">
            {t("close.soldOutChip", { time: soldOutAt })}
          </span>
          <Button
            variant="secondary"
            className="btn--small"
            aria-label={t("service.editTimeLabel", { name })}
            onClick={onEditTime}
          >
            {t("common.edit")}
          </Button>
        </div>
      )}
    </li>
  );
}
