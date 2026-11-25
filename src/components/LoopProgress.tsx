// src/components/LoopProgress.tsx
import {
  LOOP_PHASES,
  segmentStatus,
  type Phase,
  type SegmentStatus,
} from "../domain/phase.ts";
import { useT } from "../i18n/index.ts";

interface LoopProgressProps {
  phase: Phase;
}

export function LoopProgress({ phase }: LoopProgressProps) {
  const t = useT();
  const statusLabel: Record<SegmentStatus, string> = {
    done: t("today.status.done"),
    current: t("today.status.current"),
    next: t("today.status.next"),
  };
  return (
    <figure className="loop">
      <figcaption>
        <h2 className="visually-hidden">{t("today.loopTitle")}</h2>
        <ol className="loop__steps">
          {LOOP_PHASES.map((segment) => {
            const status = segmentStatus(phase, segment);
            return (
              <li
                key={segment}
                className={`loop__step loop__step--${status}`}
                aria-current={status === "current" ? "step" : undefined}
              >
                <span className="loop__step-name">
                  {t(`today.phase.${segment}`)}
                </span>{" "}
                <span className="loop__step-status">{statusLabel[status]}</span>
              </li>
            );
          })}
        </ol>
      </figcaption>
    </figure>
  );
}
