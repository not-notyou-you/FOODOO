// src/components/LoopProgress.tsx
import {
  LOOP_PHASES,
  segmentStatus,
  type LoopPhase,
  type Phase,
  type SegmentStatus,
} from "../domain/phase.ts";
import { useT } from "../i18n/index.ts";

const RADIUS = 110;
const STEPS = 48;
const OUTLINE_GAP = 0.07;
const FILL_GAP = 0.1;

const RANGES: Record<LoopPhase, [number, number]> = {
  plan: [Math.PI / 2, (3 * Math.PI) / 2],
  service: [(3 * Math.PI) / 2, 2 * Math.PI],
  close: [0, Math.PI / 2],
};

const LABEL_AT: Record<LoopPhase, [number, number]> = {
  plan: [-66, -60],
  service: [66, -60],
  close: [66, 74],
};

function lemniscate(angle: number): [number, number] {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const scale = RADIUS / (1 + sin * sin);
  return [cos * scale, sin * cos * scale];
}

function segmentPath(phase: LoopPhase, gap: number): string {
  const [from, to] = RANGES[phase];
  const start = from + gap;
  const span = to - gap - start;
  const points: string[] = [];
  for (let step = 0; step <= STEPS; step += 1) {
    const [x, y] = lemniscate(start + (span * step) / STEPS);
    points.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `M${points.join(" L")}`;
}

const OUTLINES: Record<LoopPhase, string> = {
  plan: segmentPath("plan", OUTLINE_GAP),
  service: segmentPath("service", OUTLINE_GAP),
  close: segmentPath("close", OUTLINE_GAP),
};

const FILLS: Record<LoopPhase, string> = {
  plan: segmentPath("plan", FILL_GAP),
  service: segmentPath("service", FILL_GAP),
  close: segmentPath("close", FILL_GAP),
};

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
      <svg
        className="loop__graphic"
        viewBox="-140 -86 280 176"
        aria-hidden="true"
        focusable="false"
      >
        {LOOP_PHASES.map((segment) => {
          const status = segmentStatus(phase, segment);
          const [x, y] = LABEL_AT[segment];
          return (
            <g
              key={segment}
              className={`loop__segment loop__segment--${status}`}
            >
              <path className="loop__outline" d={OUTLINES[segment]} />
              <path className="loop__fill" d={FILLS[segment]} />
              <text className="loop__label" x={x} y={y} textAnchor="middle">
                {t(`today.phase.${segment}`)}
              </text>
            </g>
          );
        })}
      </svg>
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
