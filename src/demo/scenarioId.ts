// src/demo/scenarioId.ts
export type DemoScenarioId = 1 | 2 | 3 | 4;

export const DEMO_SCENARIO_IDS: readonly DemoScenarioId[] = [1, 2, 3, 4];
export const DEFAULT_DEMO_SCENARIO: DemoScenarioId = 1;

const OFF_VALUES = new Set(["off", "0", "false", "none"]);

export function parseDemoScenario(
  raw: string | undefined,
): DemoScenarioId | null {
  const value = (raw ?? "").trim().toLowerCase();
  if (value === "") {
    return DEFAULT_DEMO_SCENARIO;
  }
  if (OFF_VALUES.has(value)) {
    return null;
  }
  const match = DEMO_SCENARIO_IDS.find((id) => String(id) === value);
  if (match === undefined) {
    throw new RangeError(
      `Invalid VITE_DEMO_SCENARIO: "${raw ?? ""}". Use off, 1, 2, 3 or 4.`,
    );
  }
  return match;
}
