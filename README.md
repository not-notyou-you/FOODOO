# FOODOO

Daily portion planning that counts the customers a sold-out menu hides.

Team **Calon Mantu Idaman** (Samuel Matthew, Vassel Goleyu, Hakim Ulinnuha, Sonny Ferdinand), STACK 2026 by GDGoC ITB, Case 2: Stronger Communities and Everyday Services.

> **Current state: F0 and F1 done; first half of F2 done (interim checkpoint).** The app stores data on the device, runs onboarding, the Today screen and Settings in English and Bahasa Indonesia, and can load a clearly labelled demo stall. The Plan, Service and Close screens are not built yet: their tabs are marked "Soon" and the screens say "Coming soon". See the status table for the exact state.

## 1. Overview

**Problem.** Small food stalls (_warung_) cook each menu once a morning and decide portions by feel. Leftovers waste money. Cooking too little makes popular menus sell out early, and that second loss is invisible: a sold-out day records sales, not how many people wanted to buy.

**Users.** Owners of small warung in residential neighbourhoods who cook in morning batches and record sales in a notebook or not at all. They use an Android phone, often with limited mobile data, and have a few seconds at a time during service.

**Core loop (setup is built; the daily plan, service and close screens are not built yet).**

1. One-time setup: menus, prices, costs, and busy hours.
2. Each morning: accept or edit a suggested portion count, each with a reason.
3. During service: one tap records when a menu sells out.
4. At night: enter leftovers and confirm any missed sell-out time.

FOODOO then estimates true demand on sold-out days from the sell-out time and the busy-hour profile, and suggests the next quantity by weighing margin against cost. All rules are deterministic TypeScript. No AI or machine-learning model is used inside the product.

## 2. Feature status

Single source of truth is `PLAN.md` section 4. This table is kept identical.

| ID       | Feature                                          | Priority | Status                 |
| -------- | ------------------------------------------------ | -------- | ---------------------- |
| ON       | Onboarding and setup                             | Core     | Done                   |
| TD       | Today screen (loop view)                         | Core     | In progress            |
| PL       | Morning plan with reasons                        | Core     | Not started            |
| SV       | Service: one-tap sold out + undo                 | Core     | Not started            |
| CL       | Night close + missed sell-out + unusual day      | Core     | Not started            |
| EST      | Demand estimation + suggestion logic             | Core     | Done                   |
| DEMO     | Demo stall generator + labels                    | Core     | In progress            |
| PWA      | Offline + installable                            | Core     | In progress            |
| I18N     | English / Bahasa Indonesia                       | Core     | Done                   |
| DM-1/2/5 | Delete all, demo load/remove, persistent storage | Core     | Done                   |
| BT       | Backtest report                                  | Core     | Done                   |
| WS       | Weekly summary                                   | Should   | Reserved for Final Day |
| DM-3/4   | Export / import                                  | Should   | Reserved for Final Day |
| UX-FIX   | Top usability fix from owner testing             | Should   | Reserved for Final Day |

Allowed status values: `Not started`, `In progress`, `Done`, `Reserved for Final Day`, `Simulated` (works on demo data only).

`EST` is Done because test cases T1 to T16 from `SPEC.md` section 6.6 pass with 100% coverage of `src/domain` (re-verified in the F1 review on 2026-11-25). `BT` is Done because `npm run backtest` regenerates `docs/BACKTEST.md` and the README block below byte-for-byte on every run (checked by file hash on two consecutive runs). `ON` is Done because the three acceptance criteria in `SPEC.md` section 5.1 pass as component tests (`tests/screens/onboarding.test.tsx`): Welcome shows both options with no data, a cost at or above the price shows an inline error and blocks saving, and a finished setup reopens on Today. ON-5 ("setup in under 3 minutes for 4 menus") is a timing target that code cannot measure; it has **not** been timed with an owner yet.

`TD` is In progress: the loop view, the phase from the clock and stored state, the primary action and today's counts work and are tested (`tests/screens/today.test.tsx`, `tests/domain/phase.test.ts`), but the primary action leads to Plan, Service and Close screens that are still "Coming soon".

`I18N` is Done: every visible string is in `src/i18n/en.ts` and `src/i18n/id.ts` with identical keys and placeholders (checked by tests), the language toggle is in Settings and on the Welcome screen, and the choice persists across restarts (tested).

`DM-1/2/5` is Done: delete all (with a confirmation sheet), load, reset and remove the demo stall are tested in `tests/db/repositories.test.ts` and `tests/screens/settings.test.tsx`. Persistent storage is requested with `navigator.storage.persist()` after setup finishes or the demo loads; the browser decides whether to grant it.

`DEMO` is In progress: the generator, loading the demo from the Welcome screen or Settings, and the "Demo data" sticker on every screen are built. The "estimate" labels belong to the Plan and Close screens, which are not built yet.

`PWA` is In progress: the end-to-end test loads the demo, goes offline, reloads and still shows the stored demo stall. It stays In progress until the full core loop is tested offline (PLAN F2 item 7).

Foundation work that exists but does not meet any row's acceptance criteria on its own: build tooling, lint, unit-test and end-to-end test setup, CI workflow, self-hosted fonts, design tokens and shared components.

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

- Deployed URL: https://foodoo-d5h.pages.dev (Cloudflare Pages, deployed from `main`). It serves the last pushed commit; the work of this interim checkpoint is not committed or deployed yet.
- Load demo data: on the first screen, press **Try demo stall**. The demo is a made-up stall, "Warung Demo", with 4 menus and 56 days of synthetic history ending yesterday, generated with the fixed seed `foodoo-demo`.
- Reset demo data: **Settings → Data → Reset demo data** reloads the demo history from scratch. **Remove demo stall** deletes it and returns to the first screen.
- The demo cannot be loaded over an owner's own data; Settings explains that the own data must be deleted first.

All synthetic data carries a yellow **Demo data** sticker in the header of every screen.

## 5. Local fallback

Run the production build locally, with no network after the install:

```
npm ci
npm run build
npm run preview
```

Open http://localhost:4173. After the first load the service worker serves the app offline. The end-to-end test in `e2e/smoke.spec.ts` verifies this for loading the demo and reloading offline; the full core loop is not built yet, so it is not verified offline yet.

## 6. Data and privacy

- No account, no server, no backend, no analytics. The app makes no network request for data.
- All stall data stays on the owner's device in IndexedDB (database `foodoo`, via Dexie): the stall (optional name, opening hours, busy-hour profile, a demo flag), the menus (name, price, cost, leftover value, usual portions), and per day and menu the planned and cooked quantities, sell-out time, leftovers and the estimated demand.
- No customer data is collected or stored.
- The language choice is kept in the browser's `localStorage` (`foodoo.language`). It is a device preference, so **Delete all data** keeps it.
- **Settings → Data → Delete all data** removes every stored record after a confirmation. Export and import are reserved for Final Day.
- The app asks the browser for persistent storage so data is not evicted under storage pressure; the browser may refuse.
- No API keys or credentials exist in this project.

## 7. Third-party resources

Licences below were read from each package's own `package.json` and font licence file.

| Resource                                                       | Version        | Use                                            | Licence                   |
| -------------------------------------------------------------- | -------------- | ---------------------------------------------- | ------------------------- |
| react, react-dom                                               | 18.3.1         | UI                                             | MIT                       |
| react-router-dom                                               | 6.30.6         | Routing                                        | MIT                       |
| dexie                                                          | 4.4.7          | IndexedDB storage                              | Apache-2.0                |
| dexie-react-hooks                                              | 4.4.0          | Live queries in screens                        | Apache-2.0                |
| vite-plugin-pwa                                                | 2.0.0          | Service worker and manifest                    | MIT                       |
| workbox-build, workbox-window                                  | 7.4.1          | Required peer dependencies of vite-plugin-pwa  | MIT                       |
| seedrandom                                                     | 3.0.5          | Deterministic demo data generator and backtest | MIT                       |
| vite                                                           | 7.3.8          | Build tool                                     | MIT                       |
| @vitejs/plugin-react                                           | 5.2.0          | React support for Vite                         | MIT                       |
| typescript                                                     | 5.9.3          | Language                                       | Apache-2.0                |
| vitest, @vitest/coverage-v8                                    | 3.2.7          | Unit tests and coverage                        | MIT                       |
| jsdom                                                          | 28.1.0         | DOM for unit tests                             | MIT                       |
| fake-indexeddb                                                 | 6.2.8          | In-memory IndexedDB for unit tests (dev only)  | Apache-2.0                |
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

Icons: the UI icons (`src/components/icons/`), the logo, the app icon and the PWA icons were drawn for this project as SVG; the PWA PNGs are rendered from `public/icons/icon.svg` by `scripts/makeIcons.ts`. The team's brand sheet (`docs/brand/FOODOO_logo.png`) was used only as a visual reference. No icon set or dataset is used.

Licence of this project: **pending team decision.** No `LICENSE` file has been added.

## 8. AI assistance

Per the competition rules, material AI assistance is disclosed here with the tool and its role. The team owns and must be able to explain every module.

| Date       | Tool                            | Module                                                                              | What the AI did                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Reviewed by                                         |
| ---------- | ------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| 2026-11-25 | Claude Code (Claude Sonnet 5.5) | Foundation: platform, config, styles, docs (F0)                                     | Wrote the project scaffold, build and lint configuration, test setup, CI workflow, PWA baseline, design tokens, placeholder shell, i18n baseline, README skeleton and decision log; downloaded the fonts; chose and pinned dependency versions.                                                                                                                                                                                                                                | Pending owner review                                |
| 2026-11-25 | Claude Code (Claude Sonnet 5.5) | Domain logic, demo generator, backtest, scripts (F1)                                | Wrote `src/domain/` (types, time, estimate, suggest, metrics), the unit tests for cases T1 to T16 and edge cases, `src/demo/generator.ts`, `scripts/backtest.ts` and the generated `docs/BACKTEST.md`; made the F0 commits and pushed them at the team's request.                                                                                                                                                                                                              | Pending owner review                                |
| 2026-11-25 | Claude Code (Claude Opus 5.5)   | F1 review: domain, demo generator, backtest, coverage config                        | Re-ran the health checks; reviewed the F1 code against the spec and proposal; removed true demand from the demo history object; added per-menu weekly metrics and input validation to `estimateDemand` with tests; added the "without sell-out correction" diagnostic and per-menu tables to the backtest; excluded the type-only file from the coverage report; wrote decisions D-025 to D-033. Committed at the team's request after the CHECKPOINT F1 approval; not pushed. | Team (approved at CHECKPOINT F1, 2026-11-25)        |
| 2026-11-25 | Claude Code (Claude Opus 5.5)   | F2 first half: data layer, i18n, app shell, components, Onboarding, Today, Settings | Wrote `src/db/` (Dexie schema v1, repositories, hooks) and `src/demo/seed.ts`; `src/domain/phase.ts` and `setup.ts`; added `Reason.scope` (resolves D-033); wrote the i18n provider, formatters and reason rendering; the app shell, layout, clock and toast providers; the shared components, icons, logo and app icon; the Welcome, setup, Today, Settings and "Coming soon" screens; unit, component and e2e tests; decisions D-034 to D-046. Not committed.                | Pending owner review (Samuel, Vassel, Sonny, Hakim) |

## 9. Known limitations

- The Plan, Service and Close screens are not built. Their tabs are marked "Soon" and the screens say "Coming soon", so the daily loop cannot be completed in the app yet. Rows not marked `Done` or `In progress` in the status table are not built.
- The deployed site still serves the earlier placeholder shell until this work is committed and pushed.
- ON-5 (setup in under 3 minutes for 4 menus) has not been timed with an owner.
- There is no `LICENSE` file yet.
- The app icon and logo are redrawn from the brand sheet as plain shapes; the team should confirm they match the intended mark.
- Only Chromium is covered by end-to-end tests.
- No Lighthouse accessibility scores have been measured yet (planned for F3). The screens follow the `DESIGN.md` section 7 rules (labels, 48 px targets, focus ring, no colour-only status), but that is not a measured score.
- All backtest and demo figures are simulated. They show how the rules behave under stated assumptions and are not evidence of benefit to real stalls; see the limitations in `docs/BACKTEST.md`.
- In the backtest, FOODOO has more sell-out menu-days than the baseline in total, and per menu it is worse than the baseline on some single metrics (see "Results by menu" in `docs/BACKTEST.md`). Compared with the same rule without the sell-out correction, FOODOO has more leftovers. All of this is reported as it came out.
- The backtest's FOODOO owner accepts every suggestion without editing; real owners will edit some.
- Weekly metrics (`src/domain/metrics.ts`) exist, including per menu, but no screen shows them yet; the weekly summary screen is reserved for Final Day.
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
