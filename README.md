# FOODOO

Daily portion planning that counts the customers a sold-out menu hides.

Team **Calon Mantu Idaman** (Samuel Matthew, Vassel Goleyu, Hakim Ulinnuha, Sonny Ferdinand), STACK 2026 by GDGoC ITB, Case 2: Stronger Communities and Everyday Services.

> **Current state: phases F0 and F1 done.** The pure domain logic (demand estimation, suggestions, metrics), its unit tests, the demo data generator and the backtest exist. There are no product screens yet: the app is an installable, offline-capable placeholder shell. See the status table for the exact state.

## 1. Overview

**Problem.** Small food stalls (_warung_) cook each menu once a morning and decide portions by feel. Leftovers waste money. Cooking too little makes popular menus sell out early, and that second loss is invisible: a sold-out day records sales, not how many people wanted to buy.

**Users.** Owners of small warung in residential neighbourhoods who cook in morning batches and record sales in a notebook or not at all. They use an Android phone, often with limited mobile data, and have a few seconds at a time during service.

**Core loop (planned, not built yet).**

1. One-time setup: menus, prices, costs, and busy hours.
2. Each morning: accept or edit a suggested portion count, each with a reason.
3. During service: one tap records when a menu sells out.
4. At night: enter leftovers and confirm any missed sell-out time.

FOODOO then estimates true demand on sold-out days from the sell-out time and the busy-hour profile, and suggests the next quantity by weighing margin against cost. All rules are deterministic TypeScript. No AI or machine-learning model is used inside the product.

## 2. Feature status

Single source of truth is `PLAN.md` section 4. This table is kept identical.

| ID       | Feature                                          | Priority | Status                 |
| -------- | ------------------------------------------------ | -------- | ---------------------- |
| ON       | Onboarding and setup                             | Core     | Not started            |
| TD       | Today screen (loop view)                         | Core     | Not started            |
| PL       | Morning plan with reasons                        | Core     | Not started            |
| SV       | Service: one-tap sold out + undo                 | Core     | Not started            |
| CL       | Night close + missed sell-out + unusual day      | Core     | Not started            |
| EST      | Demand estimation + suggestion logic             | Core     | Done                   |
| DEMO     | Demo stall generator + labels                    | Core     | In progress            |
| PWA      | Offline + installable                            | Core     | Not started            |
| I18N     | English / Bahasa Indonesia                       | Core     | Not started            |
| DM-1/2/5 | Delete all, demo load/remove, persistent storage | Core     | Not started            |
| BT       | Backtest report                                  | Core     | Done                   |
| WS       | Weekly summary                                   | Should   | Reserved for Final Day |
| DM-3/4   | Export / import                                  | Should   | Reserved for Final Day |
| UX-FIX   | Top usability fix from owner testing             | Should   | Reserved for Final Day |

Allowed status values: `Not started`, `In progress`, `Done`, `Reserved for Final Day`, `Simulated` (works on demo data only).

`EST` is Done because test cases T1 to T16 from `SPEC.md` section 6.6 pass with 100% coverage of `src/domain`. `BT` is Done because `npm run backtest` regenerates `docs/BACKTEST.md` with identical numbers on every run. `DEMO` is In progress: the generator exists, but the "Demo data" badge and loading it from the app are not built.

Foundation work that exists but does not meet any row's acceptance criteria: build tooling, lint, unit-test and end-to-end test setup, CI workflow, PWA manifest and service worker baseline, self-hosted fonts, design tokens. The PWA row stays `Not started` because installability and offline use are not yet verified against the product flow.

## 3. Setup

**Supported environment**

- Node.js 22.12.0 or a later 22.x release (pinned in `.nvmrc`; `engines` rejects other majors).
- npm 10 or later.
- Browsers: current Chrome and Edge (primary, including Android Chrome), Firefox, and Safari. End-to-end tests run on Chromium only.

**Commands**

```
npm ci
npm run dev            # development server
npm run lint           # ESLint (zero warnings) and Prettier check
npm test               # unit tests (Vitest)
npm run test:coverage  # unit tests with the 100% gate on src/domain
npm run build          # type-check and production build into dist/
npm run preview        # serve the production build on http://localhost:4173
npx playwright install chromium   # once, before the first e2e run
npm run e2e            # end-to-end tests against the production build
npm run backtest       # simulate both policies; rewrites docs/BACKTEST.md and the README table
npm run seed           # planned for F2; currently exits with an error
npm run icons          # re-render the placeholder PWA icons (needs Chromium)
```

**Windows note.** Run the test commands from a terminal whose path starts with an upper-case drive letter (`D:\...`, the default in PowerShell and VS Code). From a shell that reports `d:/...`, the coverage report lists every file twice and the 100% gate fails even though the tests pass. Linux and macOS are not affected, and CI runs on Linux.

**Dependencies.** Runtime and development dependencies are listed with versions and licences in section 7. All versions are pinned exactly and the lockfile is committed.

## 4. Demo access

- Deployed URL: https://foodoo-d5h.pages.dev (Cloudflare Pages, deployed from `main`). It currently serves the placeholder shell only. The end-to-end smoke test passes against it, including a reload with the network off.
- Load demo data: not available yet (planned for F2).
- Reset demo data: not available yet (planned for F2).

When the demo exists, all synthetic data will carry a visible "Demo data" badge.

## 5. Local fallback

Run the production build locally, with no network after the install:

```
npm ci
npm run build
npm run preview
```

Open http://localhost:4173. After the first load the service worker serves the app offline. This has been verified for the placeholder shell by the end-to-end test in `e2e/smoke.spec.ts`; it has not yet been verified for any product flow.

## 6. Data and privacy

- No account, no server, no backend, no analytics.
- Planned: all stall data stays on the owner's device in IndexedDB (Dexie). No customer data is collected.
- Planned: delete-all, and export on Final Day.
- No API keys or credentials exist in this project.

Currently the app stores nothing.

## 7. Third-party resources

Licences below were read from each package's own `package.json` and font licence file.

| Resource                                                       | Version        | Use                                            | Licence                   |
| -------------------------------------------------------------- | -------------- | ---------------------------------------------- | ------------------------- |
| react, react-dom                                               | 18.3.1         | UI                                             | MIT                       |
| react-router-dom                                               | 6.30.6         | Routing                                        | MIT                       |
| dexie                                                          | 4.4.7          | IndexedDB storage (not used yet)               | Apache-2.0                |
| dexie-react-hooks                                              | 4.4.0          | Live queries (not used yet)                    | Apache-2.0                |
| vite-plugin-pwa                                                | 2.0.0          | Service worker and manifest                    | MIT                       |
| workbox-build, workbox-window                                  | 7.4.1          | Required peer dependencies of vite-plugin-pwa  | MIT                       |
| seedrandom                                                     | 3.0.5          | Deterministic demo data generator and backtest | MIT                       |
| vite                                                           | 7.3.8          | Build tool                                     | MIT                       |
| @vitejs/plugin-react                                           | 5.2.0          | React support for Vite                         | MIT                       |
| typescript                                                     | 5.9.3          | Language                                       | Apache-2.0                |
| vitest, @vitest/coverage-v8                                    | 3.2.7          | Unit tests and coverage                        | MIT                       |
| jsdom                                                          | 28.1.0         | DOM for unit tests                             | MIT                       |
| @testing-library/react, @testing-library/dom                   | 16.3.3, 10.4.2 | Component tests                                | MIT                       |
| @playwright/test                                               | 1.65.1         | End-to-end tests and icon rendering            | Apache-2.0                |
| eslint, @eslint/js                                             | 9.39.5         | Linting                                        | MIT                       |
| typescript-eslint                                              | 8.55.0         | TypeScript lint rules                          | MIT                       |
| eslint-plugin-react-hooks                                      | 7.1.1          | Hooks lint rules                               | MIT                       |
| globals                                                        | 17.14.0        | Lint environment globals                       | MIT                       |
| prettier                                                       | 3.10.1         | Formatting                                     | MIT                       |
| @types/react, @types/react-dom, @types/node, @types/seedrandom | see lockfile   | Type definitions                               | MIT                       |
| Space Grotesk (latin subset, self-hosted)                      | v22            | UI typeface, `public/fonts/`                   | SIL Open Font License 1.1 |
| Rubik Mono One (latin subset, self-hosted)                     | v20            | Number typeface, `public/fonts/`               | SIL Open Font License 1.1 |

Icons: the current PWA icons are temporary placeholders drawn for this project and rendered by `scripts/makeIcons.ts`. No icon set or dataset is used yet.

Licence of this project: **pending team decision.** No `LICENSE` file has been added.

## 8. AI assistance

Per the competition rules, material AI assistance is disclosed here with the tool and its role. The team owns and must be able to explain every module.

| Date       | Tool                            | Module                                               | What the AI did                                                                                                                                                                                                                                                   | Reviewed by          |
| ---------- | ------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 2026-11-25 | Claude Code (Claude Sonnet 5.5) | Foundation: platform, config, styles, docs (F0)      | Wrote the project scaffold, build and lint configuration, test setup, CI workflow, PWA baseline, design tokens, placeholder shell, i18n baseline, README skeleton and decision log; downloaded the fonts; chose and pinned dependency versions.                   | Pending owner review |
| 2026-11-25 | Claude Code (Claude Sonnet 5.5) | Domain logic, demo generator, backtest, scripts (F1) | Wrote `src/domain/` (types, time, estimate, suggest, metrics), the unit tests for cases T1 to T16 and edge cases, `src/demo/generator.ts`, `scripts/backtest.ts` and the generated `docs/BACKTEST.md`; made the F0 commits and pushed them at the team's request. | Pending owner review |

## 9. Known limitations

- There are no product screens yet. The domain logic, demo generator and backtest exist, but nothing in the app calls them. Rows not marked `Done` or `In progress` in the status table are not built.
- The deployed site is the placeholder shell; there is no product flow to demo yet.
- There is no `LICENSE` file yet.
- PWA icons are temporary placeholders, not the final brand icons.
- Only Chromium is covered by end-to-end tests.
- No accessibility scores have been measured yet (planned for F3).
- All backtest and demo figures are simulated. They show how the rules behave under stated assumptions and are not evidence of benefit to real stalls; see the limitations in `docs/BACKTEST.md`.
- In the backtest, FOODOO has more sell-out menu-days than the baseline. This is reported as it came out.
- `npm run test:coverage` needs a terminal path with an upper-case drive letter on Windows (see Setup).

## 10. Final Day log

To be filled in on the Final Day (16 December 2026).

| Item                  | Value |
| --------------------- | ----- |
| Starting commit       |       |
| `final-day-start` tag |       |
| Final commit          |       |
| Changes in session    |       |
| Member contributions  |       |

## 11. Backtest results

<!-- backtest:start -->

Simulated data only. Generated by `npm run backtest`; see `docs/BACKTEST.md` for parameters, per-menu results and limitations.

| Metric                | Baseline      | FOODOO        | Change | Verdict       |
| --------------------- | ------------- | ------------- | ------ | ------------- |
| Leftover portions     | 2717          | 1935          | -28.8% | FOODOO better |
| Lost sales (portions) | 3950          | 2302          | -41.7% | FOODOO better |
| Sell-out menu-days    | 394           | 411           | +4.3%  | FOODOO worse  |
| Profit                | Rp 68.447.000 | Rp 78.053.000 | +14.0% | FOODOO better |

Diagnostic: the same FOODOO rule without the sell-out correction (sold-out days recorded as demand = sales), compared with FOODOO:

| Metric                | Without correction | FOODOO        | Change  | Verdict       |
| --------------------- | ------------------ | ------------- | ------- | ------------- |
| Leftover portions     | 821                | 1935          | +135.7% | FOODOO worse  |
| Lost sales (portions) | 4861               | 2302          | -52.6%  | FOODOO better |
| Sell-out menu-days    | 590                | 411           | -30.3%  | FOODOO better |
| Profit                | Rp 72.931.500      | Rp 78.053.000 | +7.0%   | FOODOO better |

Estimator check (mean absolute error in portions, lower is better):

| Policy   | Sold-out menu-days | Estimator MAE | Sales = demand MAE |
| -------- | ------------------ | ------------- | ------------------ |
| Baseline | 394                | 2.62          | 10.03              |
| FOODOO   | 411                | 2.09          | 5.60               |

<!-- backtest:end -->
