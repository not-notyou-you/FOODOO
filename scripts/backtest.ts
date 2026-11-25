// scripts/backtest.ts
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  DEMO_MENUS,
  DEMO_SETTINGS,
  DEMO_TRUE_MEANS,
  WEEKDAY_FACTORS,
  createRng,
  drawDay,
  observeOutcome,
  toMenuDay,
} from "../src/demo/generator.ts";
import { suggestQty } from "../src/domain/suggest.ts";
import { addDays } from "../src/domain/time.ts";
import type { DayRecord, MenuDay } from "../src/domain/types.ts";
import type { DayDraw } from "../src/demo/generator.ts";

const SEEDS = ["backtest-1", "backtest-2", "backtest-3"];
const WEEKS = 12;
const FIRST_SCORED_WEEK = 3;
const START_DATE = "2026-01-05";
const DAYS = WEEKS * 7;
const FIRST_SCORED_DAY = (FIRST_SCORED_WEEK - 1) * 7;
const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const rootUrl = new URL("../", import.meta.url);
const backtestPath = fileURLToPath(new URL("docs/BACKTEST.md", rootUrl));
const readmePath = fileURLToPath(new URL("README.md", rootUrl));
const MARKER_START = "<!-- backtest:start -->";
const MARKER_END = "<!-- backtest:end -->";

interface Totals {
  leftover: number;
  lostSales: number;
  sellOutDays: number;
  profit: number;
  menuDays: number;
  estimatorErrors: number[];
  naiveErrors: number[];
}

type Policy = "Baseline" | "FOODOO";

function emptyTotals(): Totals {
  return {
    leftover: 0,
    lostSales: 0,
    sellOutDays: 0,
    profit: 0,
    menuDays: 0,
    estimatorErrors: [],
    naiveErrors: [],
  };
}

function simulate(seed: string): Record<Policy, Totals> {
  const rng = createRng(seed);
  const draws: DayDraw[] = [];
  for (let index = 0; index < DAYS; index += 1) {
    draws.push(
      drawDay(rng, addDays(START_DATE, index), DEMO_MENUS, DEMO_SETTINGS),
    );
  }

  const baseline = emptyTotals();
  const foodoo = emptyTotals();
  const days: DayRecord[] = [];
  const menuDays: MenuDay[] = [];

  draws.forEach((draw, dayIndex) => {
    const scored = dayIndex >= FIRST_SCORED_DAY;
    const todays: MenuDay[] = [];
    for (const menu of DEMO_MENUS) {
      const demand = draw.demand[menu.id] as number;
      const arrivals = draw.arrivals[menu.id] as number[];

      const baseOutcome = observeOutcome(menu.usualQty, demand, arrivals);
      const suggestion = suggestQty(menu, draw.weekday, menuDays, days);
      const foodooOutcome = observeOutcome(suggestion.qty, demand, arrivals);
      todays.push(
        toMenuDay(draw.date, menu.id, foodooOutcome, DEMO_SETTINGS, {
          suggestedQty: suggestion.qty,
          reason: suggestion.reason,
        }),
      );

      if (!scored) {
        continue;
      }
      const baseDay = toMenuDay(draw.date, menu.id, baseOutcome, DEMO_SETTINGS);
      const foodooDay = todays[todays.length - 1] as MenuDay;
      const pairs: [Totals, typeof baseOutcome, MenuDay][] = [
        [baseline, baseOutcome, baseDay],
        [foodoo, foodooOutcome, foodooDay],
      ];
      for (const [totals, outcome, recorded] of pairs) {
        totals.menuDays += 1;
        totals.leftover += outcome.leftover;
        totals.lostSales += Math.max(0, demand - outcome.cooked);
        totals.sellOutDays += outcome.soldOutAt === null ? 0 : 1;
        totals.profit += outcome.sold * menu.price - outcome.cooked * menu.cost;
        if (outcome.soldOutAt !== null) {
          totals.estimatorErrors.push(
            Math.abs((recorded.estimatedDemand as number) - demand),
          );
          totals.naiveErrors.push(Math.abs(outcome.cooked - demand));
        }
      }
    }
    menuDays.push(...todays);
    days.push({
      date: draw.date,
      weekday: draw.weekday,
      unusual: draw.unusual,
      closed: true,
    });
  });

  return { Baseline: baseline, FOODOO: foodoo };
}

function formatRp(value: number): string {
  const digits = String(Math.abs(Math.round(value))).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ".",
  );
  return `${value < 0 ? "-" : ""}Rp ${digits}`;
}

function signed(value: number, digits: number): string {
  const text = value.toFixed(digits);
  return value > 0 ? `+${text}` : text;
}

function mean(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function table(headers: string[], rows: string[][]): string {
  const widths = headers.map((header, column) =>
    Math.max(
      3,
      header.length,
      ...rows.map((row) => (row[column] as string).length),
    ),
  );
  const line = (cells: string[]): string =>
    `| ${cells.map((cell, column) => cell.padEnd(widths[column] as number)).join(" | ")} |`;
  return [
    line(headers),
    line(widths.map((width) => "-".repeat(width))),
    ...rows.map(line),
  ].join("\n");
}

function sum(results: Record<Policy, Totals>[], policy: Policy): Totals {
  const total = emptyTotals();
  for (const result of results) {
    const part = result[policy];
    total.leftover += part.leftover;
    total.lostSales += part.lostSales;
    total.sellOutDays += part.sellOutDays;
    total.profit += part.profit;
    total.menuDays += part.menuDays;
    total.estimatorErrors.push(...part.estimatorErrors);
    total.naiveErrors.push(...part.naiveErrors);
  }
  return total;
}

function comparisonRow(
  label: string,
  base: number,
  other: number,
  lowerIsBetter: boolean,
  format: (value: number) => string,
): string[] {
  const change = other - base;
  const percent = base === 0 ? "n/a" : `${signed((change / base) * 100, 1)}%`;
  let verdict = "Same";
  if (change !== 0) {
    verdict = change < 0 === lowerIsBetter ? "FOODOO better" : "FOODOO worse";
  }
  return [label, format(base), format(other), percent, verdict];
}

function main(): void {
  const results = SEEDS.map(simulate);
  const baseline = sum(results, "Baseline");
  const foodoo = sum(results, "FOODOO");
  const integer = (value: number): string => String(value);

  const summary = table(
    ["Metric", "Baseline", "FOODOO", "Change", "Verdict"],
    [
      comparisonRow(
        "Leftover portions",
        baseline.leftover,
        foodoo.leftover,
        true,
        integer,
      ),
      comparisonRow(
        "Lost sales (portions)",
        baseline.lostSales,
        foodoo.lostSales,
        true,
        integer,
      ),
      comparisonRow(
        "Sell-out menu-days",
        baseline.sellOutDays,
        foodoo.sellOutDays,
        true,
        integer,
      ),
      comparisonRow("Profit", baseline.profit, foodoo.profit, false, formatRp),
    ],
  );

  const estimator = table(
    ["Policy", "Sold-out menu-days", "Estimator MAE", "Sales = demand MAE"],
    (["Baseline", "FOODOO"] as Policy[]).map((policy) => {
      const totals = policy === "Baseline" ? baseline : foodoo;
      const count = totals.estimatorErrors.length;
      return [
        policy,
        String(count),
        count === 0 ? "n/a" : mean(totals.estimatorErrors).toFixed(2),
        count === 0 ? "n/a" : mean(totals.naiveErrors).toFixed(2),
      ];
    }),
  );

  const perSeed = table(
    [
      "Seed",
      "Policy",
      "Leftover",
      "Lost sales",
      "Sell-out menu-days",
      "Profit",
    ],
    SEEDS.flatMap((seed, index) =>
      (["Baseline", "FOODOO"] as Policy[]).map((policy) => {
        const totals = (results[index] as Record<Policy, Totals>)[policy];
        return [
          seed,
          policy,
          String(totals.leftover),
          String(totals.lostSales),
          String(totals.sellOutDays),
          formatRp(totals.profit),
        ];
      }),
    ),
  );

  const menus = table(
    ["Menu", "Price", "Cost", "Usual quantity", "True mean demand"],
    DEMO_MENUS.map((menu) => [
      menu.name,
      formatRp(menu.price),
      formatRp(menu.cost),
      String(menu.usualQty),
      String(DEMO_TRUE_MEANS[menu.id] as number),
    ]),
  );

  const parameters = table(
    ["Parameter", "Value"],
    [
      ["Seeds", SEEDS.join(", ")],
      ["Simulated weeks per seed", String(WEEKS)],
      ["Scored weeks", `${FIRST_SCORED_WEEK} to ${WEEKS}`],
      ["Menu-days scored per policy", String(baseline.menuDays)],
      ["First simulated day", `${START_DATE} (Monday)`],
      [
        "Weekday factors",
        WEEKDAY_FACTORS.map(
          (factor, index) =>
            `${WEEKDAY_NAMES[index] as string} ${factor.toFixed(2)}`,
        ).join(", "),
      ],
      ["Opening hours", `${DEMO_SETTINGS.openAt} to ${DEMO_SETTINGS.closeAt}`],
      [
        "Busy-hour weights",
        Object.entries(DEMO_SETTINGS.busyProfile)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([hour, weight]) => `${hour}:${weight}`)
          .join(", "),
      ],
      ["Baseline policy", "Cook the usual quantity every day"],
      [
        "FOODOO policy",
        "Cook suggestQty using only observed sales, sell-out times and leftovers",
      ],
    ],
  );

  const readmeBlock = [
    MARKER_START,
    "",
    "Simulated data only. Generated by `npm run backtest`; see `docs/BACKTEST.md` for parameters and limitations.",
    "",
    summary,
    "",
    "Estimator check (mean absolute error in portions, lower is better):",
    "",
    estimator,
    "",
    MARKER_END,
  ].join("\n");

  const report = `# Backtest report

Generated by \`npm run backtest\`. Do not edit by hand. Re-running the command reproduces this file exactly.

All data is **simulated**. It is not field evidence.

## Method

- Each seed simulates ${WEEKS} weeks of a stall with four menus. True demand is drawn from a Poisson distribution with the menu's mean times a weekday factor. Customers arrive following the reference busy-hour profile.
- A menu sells out at the arrival time of customer number cooked + 1. Otherwise leftover = cooked - demand.
- Both policies face exactly the same demand and arrival times on every day (common random numbers).
- **Baseline** cooks the usual quantity every day.
- **FOODOO** cooks \`suggestQty\` using only what the app would have recorded: leftovers, sell-out times and the demand estimate derived from them. It never reads the true demand.
- Metrics are summed over weeks ${FIRST_SCORED_WEEK} to ${WEEKS} (the first two weeks are warm-up) and over all ${SEEDS.length} seeds.
- Lost sales = true demand - cooked, when positive. Profit = sum of min(demand, cooked) x price - sum of cooked x cost. Leftovers have no salvage value.

## Parameters

${parameters}

${menus}

## Results

${summary}

"Change" is FOODOO relative to Baseline. The verdict is computed from the sign of the change, so a metric where FOODOO does worse is reported as worse.

## Estimator check

On menu-days that sold out, the table compares the error of \`estimateDemand\` against true demand with the error of the naive assumption that sales equal demand.

${estimator}

## Results by seed

${perSeed}

## Limitations

The data is synthetic. The simulated demand model uses the same busy-hour profile that the estimator assumes, so the estimator is tested on a world that matches its own assumptions; real arrival patterns will differ and the busy-hour profile entered by an owner may be wrong. Demand is Poisson with fixed means, with no trends, no weather or events (days flagged unusual are excluded from suggestions but their demand is not shocked), and no menu-to-menu substitution. The sell-out time is modelled at the arrival of customer cooked + 1, which is slightly later than the moment the last portion is actually sold. The baseline is a fixed usual quantity, not a real owner who adjusts by feel. Leftovers have no salvage value and profit ignores all other costs. Only ${SEEDS.length} seeds are used and no confidence intervals are reported. These results show how the rules behave under stated assumptions; they are not evidence of benefit to real stalls. A pilot with real owners is needed for that.
`;

  writeFileSync(backtestPath, report);

  const readme = readFileSync(readmePath, "utf8");
  const start = readme.indexOf(MARKER_START);
  const end = readme.indexOf(MARKER_END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error("README.md is missing the backtest markers");
  }
  writeFileSync(
    readmePath,
    readme.slice(0, start) +
      readmeBlock +
      readme.slice(end + MARKER_END.length),
  );

  console.log(summary);
  console.log("");
  console.log(estimator);
}

main();
