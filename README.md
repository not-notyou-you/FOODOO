# FOODOO

Daily portion planning that counts the customers a sold-out menu hides.

Team **Calon Mantu Idaman** (Samuel Matthew, Vassel Goleyu, Hakim Ulinnuha, Sonny Ferdinand), STACK 2026 by GDGoC ITB, Case 2: Stronger Communities and Everyday Services.

> **Current state: product-improvement build (CHECKPOINT F3), ready for the Final Day.** The whole daily loop works on the device, online or offline: one-time setup, the morning plan with a reason per menu, one-tap sell-outs with undo, and the night close with leftovers, missed sell-out times and an unusual-day flag, ending with tomorrow's suggestions. It runs in English and Bahasa Indonesia and can load a clearly labelled demo stall. A "How FOODOO calculates" page shows the estimate and suggestion rules on a worked example computed by the app's own code. The weekly summary, export/import and the owner-testing fix are reserved for the Final Day (see `FINAL_DAY.md`). See the status table for the exact state.

## 1. Overview

**Problem.** Small food stalls (_warung_) cook each menu once a morning and decide portions by feel. Leftovers waste money. Cooking too little makes popular menus sell out early, and that second loss is invisible: a sold-out day records sales, not how many people wanted to buy.

**Users.** Owners of small warung in residential neighbourhoods who cook in morning batches and record sales in a notebook or not at all. They use an Android phone, often with limited mobile data, and have a few seconds at a time during service.

**Core loop (all four steps are built).**

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
| TD       | Today screen (loop view)                         | Core     | Done                   |
| PL       | Morning plan with reasons                        | Core     | Done                   |
| SV       | Service: one-tap sold out + undo                 | Core     | Done                   |
| CL       | Night close + missed sell-out + unusual day      | Core     | Done                   |
| EST      | Demand estimation + suggestion logic             | Core     | Done                   |
| DEMO     | Demo stall generator + labels                    | Core     | Done                   |
| PWA      | Offline + installable                            | Core     | Done                   |
| I18N     | English / Bahasa Indonesia                       | Core     | Done                   |
| DM-1/2/5 | Delete all, demo load/remove, persistent storage | Core     | Done                   |
| BT       | Backtest report                                  | Core     | Done                   |
| WS       | Weekly summary + history                         | Should   | Done                   |
| DM-3/4   | Export / import                                  | Should   | Done                   |
| UX-FIX   | Top usability fix from owner testing             | Should   | Reserved for Final Day |

Allowed status values: `Not started`, `In progress`, `Done`, `Reserved for Final Day`, `Simulated` (works on demo data only).

`EST` is Done because test cases T1 to T16 from `SPEC.md` section 6.6 pass with 100% coverage of `src/domain` (re-verified in the F1 review on 2026-11-25). `BT` is Done because `npm run backtest` regenerates `docs/BACKTEST.md` and the README block below byte-for-byte on every run (checked by file hash on two consecutive runs). `ON` is Done because the three acceptance criteria in `SPEC.md` section 5.1 pass as component tests (`tests/screens/onboarding.test.tsx`): Welcome shows both options with no data, a cost at or above the price shows an inline error and blocks saving, and a finished setup reopens on Today. ON-5 ("setup in under 3 minutes for 4 menus") is a timing target that code cannot measure; it has **not** been timed with an owner yet.

`TD` is Done:

- TD-1 to TD-3 are tested in `tests/screens/today.test.tsx` and `tests/domain/phase.test.ts`: the loop view, the phase from the clock and stored state, one primary action, and today's counts.
- The primary action now opens working Plan, Service and Close screens.
- Today also lists past days that were planned but never closed (CL-6).

`PL` is Done:

- PL-1 to PL-5 and both acceptance criteria in `SPEC.md` section 5.2 pass in `tests/screens/plan.test.tsx` and `tests/db/dayFlow.test.ts`.
- Each card shows the number and reason produced by `suggestQty`.
- Steppers step by one, repeat while held, and stay within 0 to 999.
- **Accept all** saves with one tap.
- Changing a suggestion N to N + 3 stores `suggestedQty = N` and `cookedQty = N + 3`, and the card shows "Edited".
- The plan locks after the first sell-out.

`SV` is Done:

- SV-1 to SV-4 and both acceptance criteria in `SPEC.md` section 5.3 pass in `tests/screens/service.test.tsx` and `tests/app/toast.test.tsx`.
- A tap at 10:32 shows "Sold out 10:32" and stores `"10:32"`.
- **Undo** returns `soldOutAt` to `null`, and the toast lasts exactly 10 seconds.
- A long press or **Edit time** changes the time.
- SV-5 (works fully offline) is shown by the offline end-to-end run below.

`CL` is Done:

- CL-1 to CL-6 and both acceptance criteria in `SPEC.md` section 5.4 pass in `tests/screens/close.test.tsx`, `tests/domain/close.test.ts` and `tests/db/dayFlow.test.ts`.
- Ayam Goreng cooked 31 with leftover 3 stores demand 28, not an estimate.
- Nasi Uduk cooked 42, sold out at 10:30, stores 81, shown as "≈ 81 (estimate)".
- The same 81 is checked in the real UI by the end-to-end test.

`DEMO` is Done:

- The demo loads from the Welcome screen or Settings.
- Every screen shows the "Demo data" sticker.
- Every estimated demand reads "≈ N (estimate)".

`PWA` is Done:

- `e2e/coreLoop.spec.ts` runs the full PLAN F2 item 7 loop against the production build, once online and once with the network cut after the first load. The loop is: load demo, edit one plan value, mark sold out, undo, mark again, close with a leftover and a missed sell-out time, see tomorrow's suggestions, reload, check the data persists.
- Chromium reports no installability errors (`e2e/smoke.spec.ts`).
- Installation on a physical phone has **not** been tested yet.

`I18N` is Done: every visible string is in `src/i18n/en.ts` and `src/i18n/id.ts` with identical keys and placeholders (checked by tests), the language toggle is in Settings and on the Welcome screen, and the choice persists across restarts (tested).

`DM-1/2/5` is Done: delete all (with a confirmation sheet), load, reset and remove the demo stall are tested in `tests/db/repositories.test.ts` and `tests/screens/settings.test.tsx`. Persistent storage is requested with `navigator.storage.persist()` after setup finishes or the demo loads; the browser decides whether to grant it. Settings → Data shows whether the browser protects the data and offers **Keep my data** to ask again (tested with a stubbed storage manager).

**Added in F3 (no separate status row):**

- **How FOODOO calculates** (`/how`, linked from Settings → About and the Close summary): the worked example "sold out at 10:30 → about 52% had arrived → ≈ 81 (estimate)" and the suggestion of 34 for an example menu, computed by `src/domain/explain.ts` with the same functions the app uses (`tests/domain/explain.test.ts`).
- **Data survives an app update:** `tests/db/migration.test.ts` fills a v1 database through the real repositories, upgrades it to a v2 schema and checks every row is unchanged.
- **Edge cases:** no menus, all menus archived, a day left unclosed, and the clock past closing time are tested in `tests/screens/edgeCases.test.tsx`; one gap found there was fixed (decision D-066).
- **Local fallback:** `e2e/noNetwork.spec.ts` walks every screen with all non-local requests blocked and checks that none was attempted.
- **Measured quality:** bundle size (`npm run size`) and Lighthouse scores (`npm run lighthouse`), in section 12.
- **Owner testing (PLAN F3 item 1): not done.** The team had no findings from owners yet; none are invented.

`WS` is Done (built early by team decision, D-083; it is no longer Final Day work):

- WS-1: Today and the new **History** screen show the last 7 days from stored data: leftover portions, sell-out events, estimated lost sales (labelled "estimate") and the share of plans accepted without edit (`tests/screens/today.test.tsx`).
- WS-2: History shows a per-menu table (cooked, sold, leftover, demand with the estimate label) computed by `menuTotals` in `src/domain/metrics.ts` (`tests/screens/history.test.tsx`).
- WS-3: History draws a bar chart of cooked vs demand per day for a chosen menu, with the number above each bar; estimated demand bars are dashed, and the legend uses shape and text.
- WS-4: History lists every past day (newest first, 14 at a time) and opens a read-only day view with the cooked, suggested, sell-out time, leftover, demand and reason for each menu. An unclosed day links to its close screen.
- The core-loop end-to-end test opens History and the day just closed.

`DM-3/4` is Done (built early by team decision, D-083):

- Export in **JSON** (full backup), **CSV** (one row per menu per day) or **XLSX** (full backup in four sheets: Stall, Menus, Days, MenuDays) from Settings → Data.
- Import from Settings → Data or from the Welcome screen. JSON and XLSX replace all data after a confirmation; CSV adds or updates daily records for menus that already exist. Every field is checked with the same rules as setup; nothing is written unless the whole file is valid, and the problems are listed.
- `tests/db/exportImport.test.ts` covers round trips, each kind of invalid file and spreadsheet-edited values. `e2e/exportImport.spec.ts` runs export → delete all → import for JSON and XLSX and checks the re-exported file is byte-identical (the `PLAN.md` F4 criterion).

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
npm run seed           # rewrites docs/DEMO_SCENARIOS.md from the four demo scenarios
npm run icons          # re-render the placeholder PWA icons (needs Chromium)
npm run size           # gzip size of the production JavaScript; fails above 250 KB
npm run lighthouse     # with npm run preview running: Lighthouse scores into docs/LIGHTHOUSE.md and section 12
```

**Windows note.** Run the test commands from a terminal whose path starts with an upper-case drive letter (`D:\...`, the default in PowerShell and VS Code). From a shell that reports `d:/...`, the coverage report lists every file twice and the 100% gate fails even though the tests pass. Linux and macOS are not affected, and CI runs on Linux.

**Demo setting.** `VITE_DEMO_SCENARIO` chooses which demo stall the app offers. Copy `.env.example` to `.env` and set it to `off` (no demo button anywhere), or `1`, `2`, `3` or `4` (see section 4). A missing or empty value means `1`. The value is fixed at build time, so rebuild after changing it; any other value stops the build with an error. Unit and end-to-end tests always use `1`. On Cloudflare Pages, set the same variable in the project's environment variables. `.env` is git-ignored and holds no secrets.

**Dependencies.** Runtime and development dependencies are listed with versions and licences in section 7. All versions are pinned exactly and the lockfile is committed.

## 4. Demo access

- Deployed URL: https://foodoo-d5h.pages.dev (Cloudflare Pages, deployed automatically from `main`). It serves the last pushed commit. Until the team commits and pushes the F2 and F3 work, it still shows the earlier build, where Plan, Service and Close say "Coming soon".
- Walk the loop: **Try demo stall** → **Plan today's portions** → **Accept all** or **Save plan** → **Service**, tap a menu when it sells out (**Undo** for 10 seconds) → **Close**, enter leftovers → **Close day** → **Confirm and close day**. Tomorrow's suggestions are then shown on the Close screen. **How is this worked out?** there, or **Settings → About → How FOODOO calculates**, opens the explanation page.
- Load demo data: on the first screen, press **Try demo stall**. The build offers one of four made-up stalls, chosen with `VITE_DEMO_SCENARIO` (section 3). Each has 4 menus and synthetic history ending yesterday, generated with a fixed seed. Details and generated numbers: `docs/DEMO_SCENARIOS.md`.

  | Value | Demo stall               | Hours          | What it shows                                                                   |
  | ----- | ------------------------ | -------------- | ------------------------------------------------------------------------------- |
  | `1`   | Warung Demo (default)    | 06:00 to 14:00 | Two rush hours; Nasi Uduk sells out most days, so demand is corrected (56 days) |
  | `2`   | Demo Warung Makan Kantor | 10:00 to 15:00 | Lunch peak, quiet weekends; suggestions differ by weekday (56 days)             |
  | `3`   | Demo Angkringan Malam    | 18:00 to 02:00 | Night stall whose day crosses midnight (56 days)                                |
  | `4`   | Demo Warung Baru Buka    | 07:00 to 13:00 | New stall with 4 days of history: cold-start suggestions, a salvage value       |
  | `off` | none                     |                | The demo button is hidden; only **Start setup** is offered                      |

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

Open http://localhost:4173. The preview server runs on the laptop itself, and the app loads nothing from the internet: fonts and icons are self-hosted and there is no backend. After the first load the service worker also serves the app with no server at all.

How this is verified:

- `e2e/noNetwork.spec.ts` blocks every request that is not to the local server, walks Welcome, demo, Plan, Service, Close, How FOODOO calculates and Settings, and checks that no request was blocked.
- `e2e/coreLoop.spec.ts` runs the whole core loop twice: once online and once with the network cut after the first load.
- The production bundle contains no external URL that the app fetches. A search of `dist/` finds only XML namespace strings, library error-message links and the README link in Settings.
- On 2026-11-25 the uncommitted working tree was copied without `node_modules` and `dist`, then `npm ci`, `npm run build` and `npm run preview` ran in the copy, and the e2e suite passed against it (`E2E_BASE_URL`). The install needs the npm registry once; nothing after it does.
- **Not done by the AI:** a run with the laptop's network adapter switched off. The team should rehearse this once before the Final Day (`FINAL_DAY.md` section 5).

## 6. Data and privacy

- No account, no server, no backend, no analytics. The app makes no network request for data.
- All stall data stays on the owner's device in IndexedDB (database `foodoo`, via Dexie): the stall (optional name, opening hours, busy-hour profile, a demo flag), the menus (name, price, cost, leftover value, usual portions), and per day and menu the planned and cooked quantities, sell-out time, leftovers and the estimated demand.
- No customer data is collected or stored.
- The language choice is kept in the browser's `localStorage` (`foodoo.language`). It is a device preference, so **Delete all data** keeps it.
- **Settings → Data → Delete all data** removes every stored record after a confirmation.
- **Settings → Data → Export** saves a file on the device only (JSON, CSV or XLSX); nothing is uploaded. **Import** reads a file the owner picks and validates it on the device before anything is written.
- The app asks the browser for persistent storage so data is not evicted under storage pressure; the browser may refuse. Settings → Data shows the browser's answer.
- No API keys or credentials exist in this project.

## 7. Third-party resources

Licences below were read from each package's own `package.json` and font licence file.

| Resource                                                       | Version        | Use                                                                            | Licence                   |
| -------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------ | ------------------------- |
| react, react-dom                                               | 18.3.1         | UI                                                                             | MIT                       |
| react-router-dom                                               | 6.30.6         | Routing                                                                        | MIT                       |
| dexie                                                          | 4.4.7          | IndexedDB storage                                                              | Apache-2.0                |
| dexie-react-hooks                                              | 4.4.0          | Live queries in screens                                                        | Apache-2.0                |
| vite-plugin-pwa                                                | 2.0.0          | Service worker and manifest                                                    | MIT                       |
| workbox-build, workbox-window                                  | 7.4.1          | Required peer dependencies of vite-plugin-pwa                                  | MIT                       |
| seedrandom                                                     | 3.0.5          | Deterministic demo data generator and backtest                                 | MIT                       |
| vite                                                           | 7.3.8          | Build tool                                                                     | MIT                       |
| @vitejs/plugin-react                                           | 5.2.0          | React support for Vite                                                         | MIT                       |
| typescript                                                     | 5.9.3          | Language                                                                       | Apache-2.0                |
| vitest, @vitest/coverage-v8                                    | 3.2.7          | Unit tests and coverage                                                        | MIT                       |
| jsdom                                                          | 28.1.0         | DOM for unit tests                                                             | MIT                       |
| fake-indexeddb                                                 | 6.2.8          | In-memory IndexedDB for unit tests (dev only)                                  | Apache-2.0                |
| @testing-library/react, @testing-library/dom                   | 16.3.3, 10.4.2 | Component tests                                                                | MIT                       |
| @playwright/test                                               | 1.65.1         | End-to-end tests and icon rendering                                            | Apache-2.0                |
| eslint, @eslint/js                                             | 9.39.5         | Linting                                                                        | MIT                       |
| typescript-eslint                                              | 8.55.0         | TypeScript lint rules                                                          | MIT                       |
| eslint-plugin-react-hooks                                      | 7.1.1          | Hooks lint rules                                                               | MIT                       |
| globals                                                        | 17.14.0        | Lint environment globals                                                       | MIT                       |
| prettier                                                       | 3.10.1         | Formatting                                                                     | MIT                       |
| @types/react, @types/react-dom, @types/node, @types/seedrandom | see lockfile   | Type definitions                                                               | MIT                       |
| lighthouse (run with `npx`, not installed)                     | 12.8.2         | Measurement only (`npm run lighthouse`); not part of the app or `package.json` | Apache-2.0                |
| Space Grotesk (latin subset, self-hosted)                      | v22            | UI typeface, `public/fonts/`                                                   | SIL Open Font License 1.1 |
| Rubik Mono One (glyph outlines F, D, O)                        | v20            | Logo and app-icon letters, converted to SVG paths; font not loaded at runtime  | SIL Open Font License 1.1 |

The ZIP and XLSX file handling (`src/db/zip.ts`, `src/db/xlsx.ts`) and CSV handling (`src/db/csv.ts`) were written for this project and use no library; compression uses the browser's built-in `CompressionStream` / `DecompressionStream` (decision D-086).

Icons: the UI icons (`src/components/icons/`), the logo, the app icon and the PWA icons were drawn for this project as SVG; the PWA PNGs are rendered from `public/icons/icon.svg` by `scripts/makeIcons.ts`. The logo and app icon follow the team's own brand sheet (`docs/brand/FOODOO_logo.png`): letter sizes, positions and the loop shape were measured from it, and the letters are Rubik Mono One outlines (the OFL text stays in `public/fonts/OFL-RubikMonoOne.txt`). No icon set or dataset is used.

Licence of this project: **pending team decision.** No `LICENSE` file has been added.

## 8. AI assistance

Per the competition rules, material AI assistance is disclosed here with the tool and its role. The team owns and must be able to explain every module.

| Date       | Tool                            | Module                                                                                                                                                                                                             | What the AI did                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Reviewed by                                                             |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 2026-11-25 | Claude Code (Claude Sonnet 5.5) | Foundation: platform, config, styles, docs (F0)                                                                                                                                                                    | Wrote the project scaffold, build and lint configuration, test setup, CI workflow, PWA baseline, design tokens, placeholder shell, i18n baseline, README skeleton and decision log; downloaded the fonts; chose and pinned dependency versions.                                                                                                                                                                                                                                                                                                | Pending owner review                                                    |
| 2026-11-25 | Claude Code (Claude Sonnet 5.5) | Domain logic, demo generator, backtest, scripts (F1)                                                                                                                                                               | Wrote `src/domain/` (types, time, estimate, suggest, metrics), the unit tests for cases T1 to T16 and edge cases, `src/demo/generator.ts`, `scripts/backtest.ts` and the generated `docs/BACKTEST.md`; made the F0 commits and pushed them at the team's request.                                                                                                                                                                                                                                                                              | Pending owner review                                                    |
| 2026-11-25 | Claude Code (Claude Opus 5.5)   | F1 review: domain, demo generator, backtest, coverage config                                                                                                                                                       | Re-ran the health checks; reviewed the F1 code against the spec and proposal; removed true demand from the demo history object; added per-menu weekly metrics and input validation to `estimateDemand` with tests; added the "without sell-out correction" diagnostic and per-menu tables to the backtest; excluded the type-only file from the coverage report; wrote decisions D-025 to D-033. Committed at the team's request after the CHECKPOINT F1 approval; not pushed.                                                                 | Team (approved at CHECKPOINT F1, 2026-11-25)                            |
| 2026-11-25 | Claude Code (Claude Opus 5.5)   | F2 first half: data layer, i18n, app shell, components, Onboarding, Today, Settings                                                                                                                                | Wrote `src/db/` (Dexie schema v1, repositories, hooks) and `src/demo/seed.ts`; `src/domain/phase.ts` and `setup.ts`; added `Reason.scope` (resolves D-033); wrote the i18n provider, formatters and reason rendering; the app shell, layout, clock and toast providers; the shared components, icons, logo and app icon; the Welcome, setup, Today, Settings and "Coming soon" screens; unit, component and e2e tests; decisions D-034 to D-046. Committed by the team as `4200c18`, `a3b9231`, `c60ee4a`, `bf53e19`, `60e9e41`.               | Pending owner review (Samuel, Vassel, Sonny, Hakim)                     |
| 2026-11-25 | Claude Code (Claude Opus 5.5)   | F2 second half: Plan, Service, Close, PWA proof, core-loop e2e (CHECKPOINT F2)                                                                                                                                     | Wrote `src/domain/plan.ts` and `close.ts` with tests; the `savePlan`, `setSoldOut`, `closeDay` and `getHistory` repositories with tests; the Plan, Service and Close screens and their components (stepper, service tile, time sheet, close row, close summary, estimate label); the CL-6 notice on Today; the English and Bahasa Indonesia strings; the core-loop Playwright test (online and offline) and the installability check; raised test wait limits; removed the "Coming soon" scaffolding; decisions D-047 to D-062. Not committed. | Pending owner review (Hakim, Samuel, Vassel, Sonny)                     |
| 2026-11-25 | Claude Code (Claude Opus 5.5)   | F3 product improvement: domain explain, db hardening, How page, storage status, performance, measurement, local fallback, Final Day plan (CHECKPOINT F3)                                                           | Wrote `src/domain/explain.ts` and the "How FOODOO calculates" screen with tests; the schema-upgrade and edge-case tests and the empty-tomorrow fix in the Close summary; the storage-protection status and its tests; route code splitting and the splash; `scripts/bundleSize.ts` (`npm run size`, added to CI) and `scripts/lighthouse.ts` (`npm run lighthouse`), and ran both; `e2e/noNetwork.spec.ts`; `FINAL_DAY.md`; decisions D-063 to D-072. Did not build R1 to R3 or create the `final-day-start` tag. Not committed.               | Pending owner review (Hakim, Samuel, Vassel, Sonny)                     |
| 2026-11-25 | Claude Code (Claude Opus 5.5)   | Visual restyle: `src/styles/`, `DESIGN.md`                                                                                                                                                                         | At the team's request, replaced the soft neo-brutalist style with a clean, formal one (thin borders, flat surfaces, navy primary, orange as a status accent); kept every class name; updated `DESIGN.md`; checked contrast; reran Lighthouse; decision D-073. Not committed.                                                                                                                                                                                                                                                                   | Pending owner review (Vassel)                                           |
| 2026-11-25 | Claude Code (Claude Opus 5.5)   | Logo and app icon: `Logo.tsx`, `AppIcon.tsx`, `public/icons/`                                                                                                                                                      | At the team's request, rebuilt the logo and app icon to match `docs/brand/FOODOO_logo.png`: measured the sheet, fitted one shared infinity curve, converted Rubik Mono One letters to paths, re-rendered the PWA icons, stopped loading Rubik Mono One at runtime; decision D-074. Not committed.                                                                                                                                                                                                                                              | Pending owner review (Vassel, Sonny)                                    |
| 2026-11-25 | Claude Code (Claude Opus 5.5)   | Colours: `src/styles/`, `DESIGN.md`                                                                                                                                                                                | At the team's request, restored the original colour use element by element (cream, orange, navy, yellow, sky) while keeping the thin-border flat style; decision D-075. Not committed.                                                                                                                                                                                                                                                                                                                                                         | Pending owner review (Vassel)                                           |
| 2026-11-25 | Claude Code (Claude Opus 5.5)   | Landing page: `src/screens/Welcome.tsx`, `src/components/`, `src/i18n/`, `e2e/`                                                                                                                                    | Proposed and built the landing page that new users see first, with EN and ID copy, new icons, an `/about` route and tests; decision D-076. Not committed.                                                                                                                                                                                                                                                                                                                                                                                      | Pending owner review (Vassel)                                           |
| 2026-11-25 | Claude Code (Claude Opus 5.5)   | Data-correctness fixes: `src/domain/`, `src/screens/`, `src/components/`, `src/app/`, `src/i18n/`, tests, e2e                                                                                                      | Found and fixed four issues at the team's request: an unfilled leftover was stored as a sell-out at closing time; past unclosed days could not be closed; stalls closing after midnight were refused; a sell-out tapped right after opening was stored without a check. Added tests; decisions D-078 to D-081. Not committed.                                                                                                                                                                                                                  | Pending owner review (Hakim, Vassel)                                    |
| 2026-11-25 | Claude Code (Claude Opus 5.5)   | Demo scenarios: `src/demo/`, `src/app/demoConfig.ts`, `src/screens/Welcome.tsx`, `src/screens/Settings.tsx`, `scripts/seed.ts`, config, tests                                                                      | At the team's request, added three more synthetic demo stalls (office lunch, night stall, new stall) and the `VITE_DEMO_SCENARIO` setting (`off`, 1 to 4); made `npm run seed` write `docs/DEMO_SCENARIOS.md`; kept scenario 1 and the backtest byte-identical; added tests; decision D-082. Not committed.                                                                                                                                                                                                                                    | Pending owner review (Hakim, Vassel)                                    |
| 2026-11-25 | Claude Code (Claude Opus 5.5)   | History, analytics and export/import: `src/domain/metrics.ts`, `src/db/` (exportImport, csv, xlsx, zip), `src/screens/` (Today, History, DayDetail, Settings, Welcome), `src/components/`, `src/i18n/`, tests, e2e | At the team's request, built WS and DM-3/4 before the Final Day tag: last-7-days metrics on Today; the History screen (per-menu table, cooked vs demand chart, past-day list) and a read-only day view; export to JSON, CSV and XLSX and import from all three with full validation, on Settings and Welcome; a dependency-free ZIP/XLSX codec; unit, component and e2e tests; updated SPEC, DESIGN, PLAN, FINAL_DAY and this README; decisions D-083 to D-086; then a layout pass on these screens after team review (D-087). Not committed.  | Pending owner review (Hakim, assigned by the team for all of this work) |

## 9. Known limitations

- The weekly summary and export/import were built on 2026-11-25, before the `final-day-start` tag, by team decision (D-083). Replacement Final Day tasks have not been chosen yet. UX-FIX (the owner-testing fix) is still reserved and not built.
- Export/import: XLSX and CSV files use plain cells with no formatting. Formulas in an edited XLSX file are not recalculated (the stored value is read). CSV import only adds or updates daily records for menus that already exist; it cannot create menus or change settings. Importing needs a browser with `DecompressionStream` (Chrome 103+, Safari 16.4+, Firefox 113+).
- The History chart shows the last 7 days only.
- The deployed site serves the earlier build until the F2 and F3 work is committed and pushed. The e2e suite has therefore only run against the local preview for this build, not against the deployed URL.
- **Owner testing has not happened yet** (PLAN F3 item 1). No owner-testing fixes exist, and R3 (the top usability fix) depends on real findings.
- A closed day cannot be reopened or corrected yet. A past day that was never closed can be closed later from the "Days not closed" card on Today.
- Night stalls that close after midnight are supported, but only the domain rules and unit tests cover them. No end-to-end test runs a night stall, and no night-stall owner has tried it.
- The **Undo** toast covers only the latest sell-out tap. An earlier tap is corrected with **Edit time** or **Not sold out**.
- Menu cards have a photo placeholder only; photos cannot be added.
- The app has not been tested with real warung owners yet. ON-5 (setup in under 3 minutes) and the under-one-minute daily input target have not been timed with an owner.
- Installation has been checked with Chromium's installability report only, not on a physical Android phone.
- Demo scenarios 2 to 4 are covered by unit and database tests only; the end-to-end suite runs scenario 1. Each build offers one scenario; switching needs a rebuild.
- With `VITE_DEMO_SCENARIO=off`, a demo stall stored earlier on a device stays until it is removed in Settings; it can no longer be reset.
- There is no `LICENSE` file yet.
- The app icon and logo are redrawn from the brand sheet as plain shapes; the team should confirm they match the intended mark.
- Only Chromium is covered by end-to-end tests.
- Lighthouse scores (section 12) come from one machine, with Lighthouse's simulated throttling. They vary between runs and devices. They were not measured on a real low-end phone.
- On a cold first visit with simulated Slow 4G, largest contentful paint is about 2.03 s, just above the 2 s target in `PLAN.md` F3; first contentful paint is about 1.49 s (decision D-069).
- A plan where every menu is set to 0 portions cannot be closed; Today stays on Plan for that day (decision D-066).
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

## 12. Lighthouse and bundle size

Generated by `npm run lighthouse` (scores) with the preview server running; never typed by hand. Bundle size comes from `npm run size`.

<!-- lighthouse:start -->

Measured with Lighthouse 12.8.2 (`npx lighthouse@12.8.2`) by `npm run lighthouse` against `npm run preview` on the machine that ran it. Mobile uses Lighthouse's default simulated Slow 4G network and 4x CPU slowdown; desktop uses `--preset=desktop`. "Cold" is a first visit with empty storage and no cache. The other rows load the demo and save a plan first, so the screens show real content; they are repeat visits served by the service worker, which is why they are faster. Performance scores vary between runs and machines.

| Page            | Preset  | State            | Accessibility | Best practices | Performance | First contentful paint | Largest contentful paint |
| --------------- | ------- | ---------------- | ------------- | -------------- | ----------- | ---------------------- | ------------------------ |
| / (first visit) | mobile  | cold, empty      | 100           | 100            | 99          | 1.50 s                 | 2.07 s                   |
| / (first visit) | desktop | cold, empty      | 100           | 100            | 100         | 0.42 s                 | 0.48 s                   |
| /today          | mobile  | demo, plan saved | 100           | 100            | 99          | 0.23 s                 | 0.39 s                   |
| /today          | desktop | demo, plan saved | 100           | 100            | 100         | 0.07 s                 | 0.11 s                   |
| /plan           | mobile  | demo, plan saved | 100           | 100            | 98          | 0.22 s                 | 0.44 s                   |
| /plan           | desktop | demo, plan saved | 100           | 100            | 100         | 0.08 s                 | 0.12 s                   |
| /service        | mobile  | demo, plan saved | 100           | 100            | 96          | 0.17 s                 | 0.38 s                   |
| /service        | desktop | demo, plan saved | 100           | 100            | 100         | 0.10 s                 | 0.14 s                   |
| /how            | mobile  | demo, plan saved | 100           | 100            | 96          | 0.22 s                 | 0.37 s                   |
| /how            | desktop | demo, plan saved | 100           | 100            | 100         | 0.10 s                 | 0.13 s                   |

Failed accessibility or best-practices audits: none.

<!-- lighthouse:end -->
