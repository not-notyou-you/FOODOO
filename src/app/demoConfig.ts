// src/app/demoConfig.ts
import { parseDemoScenario } from "../demo/scenarioId.ts";

export const DEMO_SCENARIO = parseDemoScenario(
  import.meta.env.VITE_DEMO_SCENARIO,
);
