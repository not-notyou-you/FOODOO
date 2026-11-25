// tests/demo/scenarios.test.ts
import { describe, expect, it } from "vitest";
import {
  DEMO_SCENARIO_1,
  generateDemoHistory,
  generateScenarioHistory,
  type DemoScenario,
} from "../../src/demo/generator.ts";
import {
  DEFAULT_DEMO_SCENARIO,
  DEMO_SCENARIO_IDS,
  parseDemoScenario,
} from "../../src/demo/scenarioId.ts";
import { demoScenario } from "../../src/demo/scenarios.ts";
import {
  profileHours,
  validateHours,
  validateMenu,
} from "../../src/domain/setup.ts";
import { suggestQty } from "../../src/domain/suggest.ts";
import {
  addDays,
  closeMinute,
  dayMinute,
  openMinute,
  spansMidnight,
  weekdayOf,
} from "../../src/domain/time.ts";

const TODAY = "2026-03-02";
const ALL: DemoScenario[] = DEMO_SCENARIO_IDS.map((id) => demoScenario(id));

function suggestionsFor(scenario: DemoScenario, weekday: number) {
  const history = generateScenarioHistory(TODAY, scenario);
  return history.menus.map((menu) =>
    suggestQty(menu, weekday, history.menuDays, history.days),
  );
}

describe("parseDemoScenario", () => {
  it("defaults to scenario 1 when the variable is missing or empty", () => {
    expect(parseDemoScenario(undefined)).toBe(DEFAULT_DEMO_SCENARIO);
    expect(parseDemoScenario("  ")).toBe(1);
  });

  it("turns the demo off", () => {
    for (const value of ["off", "OFF", "0", "false", "none"]) {
      expect(parseDemoScenario(value)).toBeNull();
    }
  });

  it("selects scenarios 1 to 4", () => {
    expect(DEMO_SCENARIO_IDS.map((id) => parseDemoScenario(` ${id} `))).toEqual(
      [1, 2, 3, 4],
    );
  });

  it("rejects any other value", () => {
    expect(() => parseDemoScenario("5")).toThrow("Invalid VITE_DEMO_SCENARIO");
    expect(() => parseDemoScenario("on")).toThrow("Use off, 1, 2, 3 or 4");
  });
});

describe.each(ALL)("demo scenario $id ($stallName)", (scenario) => {
  const history = generateScenarioHistory(TODAY, scenario);

  it("is labelled as demo data", () => {
    expect(scenario.stallName).toContain("Demo");
    expect(history.settings.isDemo).toBe(true);
  });

  it("is deterministic", () => {
    expect(generateScenarioHistory(TODAY, scenario)).toEqual(history);
  });

  it("passes the app's own setup validation", () => {
    expect(
      validateHours(scenario.settings.openAt, scenario.settings.closeAt),
    ).toEqual({});
    expect(Object.keys(scenario.settings.busyProfile).sort()).toEqual(
      profileHours(scenario.settings.openAt, scenario.settings.closeAt).sort(),
    );
    for (const menu of scenario.menus) {
      expect(validateMenu(menu)).toEqual({});
      expect(scenario.trueMeans[menu.id]).toBeGreaterThan(0);
    }
    expect(scenario.weekdayFactors).toHaveLength(7);
  });

  it("has one closed day per history day and one row per menu", () => {
    expect(history.days).toHaveLength(scenario.historyDays);
    expect(history.days.every((day) => day.closed)).toBe(true);
    expect(history.menuDays).toHaveLength(
      scenario.historyDays * scenario.menus.length,
    );
  });

  it("stores consistent rows with sell-out times inside opening hours", () => {
    const open = openMinute(history.settings);
    const close = closeMinute(history.settings);
    for (const row of history.menuDays) {
      expect(row.estimatedDemand).not.toBeNull();
      if (row.soldOutAt === null) {
        expect(row.estimatedDemand).toBe(
          row.cookedQty - (row.leftover as number),
        );
        expect(row.demandIsEstimate).toBe(false);
      } else {
        const minute = dayMinute(row.soldOutAt, history.settings);
        expect(minute).toBeGreaterThanOrEqual(open);
        expect(minute).toBeLessThan(close);
        expect(row.leftover).toBe(0);
        expect(row.demandIsEstimate).toBe(true);
      }
    }
  });
});

describe("what makes each scenario different", () => {
  it("1: keeps the original Warung Demo data unchanged", () => {
    expect(demoScenario(1)).toBe(DEMO_SCENARIO_1);
    expect(generateScenarioHistory(TODAY, DEMO_SCENARIO_1)).toEqual(
      generateDemoHistory(TODAY),
    );
  });

  it("1: under-cooks Nasi Uduk, so it sells out on most days", () => {
    const rows = generateScenarioHistory(
      TODAY,
      DEMO_SCENARIO_1,
    ).menuDays.filter((row) => row.menuId === "nasi-uduk");
    const soldOut = rows.filter((row) => row.soldOutAt !== null).length;
    expect(soldOut / rows.length).toBeGreaterThan(0.5);
  });

  it("2: suggests much less for a quiet Saturday than for a Monday", () => {
    const monday = suggestionsFor(demoScenario(2), 1);
    const saturday = suggestionsFor(demoScenario(2), 6);
    for (const [index, suggestion] of saturday.entries()) {
      expect(suggestion.reason.scope).toBe("weekday");
      expect(suggestion.qty).toBeLessThan(
        (monday[index] as { qty: number }).qty,
      );
    }
  });

  it("3: is a night stall whose day runs past midnight", () => {
    const scenario = demoScenario(3);
    expect(spansMidnight(scenario.settings)).toBe(true);
    const history = generateScenarioHistory(TODAY, scenario);
    expect(history.menuDays.some((row) => row.soldOutAt !== null)).toBe(true);
  });

  it("4: is a new stall, so every suggestion is a cold start on any date", () => {
    for (let offset = 0; offset < 7; offset += 1) {
      const today = addDays(TODAY, offset);
      const history = generateScenarioHistory(today, demoScenario(4));
      const byMenu = new Map(
        history.menus.map((menu) => [
          menu.id,
          suggestQty(menu, weekdayOf(today), history.menuDays, history.days)
            .reason.code,
        ]),
      );
      expect(
        [...byMenu.values()].every((code) => code.startsWith("cold-start")),
      ).toBe(true);
      expect(byMenu.get("lontong-sayur")).toBe("cold-start-up");
      expect(byMenu.get("nasi-campur")).toBe("cold-start-down");
    }
  });

  it("4: gives Bakwan a salvage value", () => {
    const bakwan = demoScenario(4).menus.find((menu) => menu.id === "bakwan");
    expect(bakwan?.salvage).toBeGreaterThan(0);
  });
});
