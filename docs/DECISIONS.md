# Decision log

Each entry: the decision, the alternatives considered, and why. Appended after each phase. Owner names follow `AGENTS.md` section 4.

## Phase F0: Foundation (2026-11-25)

### D-001 Scaffold by hand, in the repository root (Sonny)

- **Decision:** write the Vite + React + TypeScript layout directly in the repo root, matching the `AGENTS.md` section 7 layout.
- **Alternatives:** `npm create vite` (adds `App.css`, sample assets and a nested folder we would then delete); a `foodoo/` subfolder (the layout lists `foodoo/` as the repo root itself).
- **Why:** nothing unwanted to remove, and the originality rule allows only the standard scaffold anyway.

### D-002 Pin Node 22.12.0 (Sonny)

- **Decision:** `.nvmrc` contains `22.12.0`, `package.json` has `engines: ">=22.12.0 <23"`, `.npmrc` sets `engine-strict=true` and `save-exact=true`. CI reads `.nvmrc`.
- **Alternatives:** Node 20 (below the Vite 7 and Vitest floors we want); an unpinned "latest LTS" (builds drift between machines and CI).
- **Why:** 22.12.0 is what the team machine runs, and one file drives local, CI and host.
- **Consequence:** some newest tool releases need Node 22.13 or higher, so we picked the newest versions that still run on 22.12 (see D-003).

### D-003 Dependency versions chosen for compatibility, not for "latest" (Sonny)

All versions are exact and in the lockfile. Where we are not on the newest release, the reason was observed during install:

| Package                     | Chosen | Newer exists | Reason we did not use it                                                                                                                                                                                                                                        |
| --------------------------- | ------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| react, react-dom            | 18.3.1 | 19           | `AGENTS.md` locks React 18                                                                                                                                                                                                                                      |
| react-router-dom            | 6.30.6 | 7            | stable with React 18; v7 flags enabled early to silence warnings                                                                                                                                                                                                |
| vite                        | 7.3.8  | 8            | `@vitejs/plugin-react` 6 needs Vite 8 and pulled Babel 8 into conflict with Babel 7 required by `workbox-build` (npm `ERESOLVE`)                                                                                                                                |
| @vitejs/plugin-react        | 5.2.0  | 6            | see above                                                                                                                                                                                                                                                       |
| typescript                  | 5.9.3  | 7            | `typescript-eslint` peer range is below 6.1                                                                                                                                                                                                                     |
| eslint, @eslint/js          | 9.39.5 | 10           | ESLint 10 needs Node 22.13 or higher                                                                                                                                                                                                                            |
| typescript-eslint           | 8.55.0 | 8.74         | later releases need `eslint-visitor-keys` 5, which needs Node 22.13 or higher                                                                                                                                                                                   |
| jsdom                       | 28.1.0 | 31           | jsdom 31 needs Node 22.22 or higher                                                                                                                                                                                                                             |
| vitest, @vitest/coverage-v8 | 3.2.7  | 5.1          | 5.1.1 installed but every test file failed with "failed to find the current suite", even a one-line test and in the node environment (root cause not investigated). 4.1.12 hit an npm 11.1.0 internal error (`edgesOut`) at install. 3.2.7 installs and passes. |

- **Also installed automatically:** `workbox-build` and `workbox-window` 7.4.1 are required peer dependencies of `vite-plugin-pwa` 2.0.0. They are not in the `AGENTS.md` allowed list by name, but the allowed plugin cannot work without them.
- **Revisit:** when the team upgrades Node, move to current releases and re-run the checkpoint commands.

### D-004 Lint: ESLint 9 flat config with type-aware rules (Sonny)

- **Decision:** `@eslint/js` recommended, `typescript-eslint` `recommendedTypeChecked`, `eslint-plugin-react-hooks`, `no-explicit-any` as an error. `npm run lint` runs ESLint with `--max-warnings 0`, then `prettier --check`.
- **Local rule:** a small inline rule in `eslint.config.js` fails any file in `src/`, `scripts/`, `tests/` or `e2e/` whose first line is not `// <its own path>`. This enforces `AGENTS.md` section 6 automatically instead of by review.
- **Alternatives:** a stricter shared config such as Airbnb (many extra plugins, noisy); `eslint-config-prettier` (not approved, and unnecessary because no stylistic ESLint rules are enabled).

### D-005 Prettier with defaults (Sonny)

- **Decision:** no `.prettierrc`; defaults apply as `AGENTS.md` requires. `.prettierignore` skips generated files, binaries, third-party documents and the four planning documents the team wrote.
- **Why:** zero configuration to explain, and we do not reformat the team's own specification files.

### D-006 Unit tests: Vitest with a per-folder coverage gate (Hakim, Sonny)

- **Decision:** jsdom environment, V8 coverage, and a threshold of 100% for lines, functions, branches and statements applied only to `src/domain/**/*.ts`.
- **Checked:** with a throwaway file in `src/domain` covered at 66%, `npm run test:coverage` exited with code 1 and listed all four thresholds; with the file removed it exits 0. The gate currently has nothing to measure because the domain layer starts in F1.
- **Alternatives:** a global threshold (would fail on UI code, which does not need 100%); Istanbul provider (slower, no benefit here).

### D-007 End-to-end tests: Playwright on the production build, offline-capable (Sonny)

- **Decision:** Chromium with the Pixel 7 profile, against `npm run build && npm run preview` on port 4173. Setting `E2E_BASE_URL` runs the same tests against the deployed URL. The offline check waits for the service worker, calls `context.setOffline(true)`, reloads, and asserts the page still renders.
- **Alternatives:** testing against the dev server (no service worker, so offline cannot be proven); adding Firefox and WebKit now (slower CI, little extra evidence at this stage).

### D-008 PWA baseline (Sonny)

- **Decision:** `vite-plugin-pwa` with `generateSW`, `registerType: "autoUpdate"`, precache of js, css, html, svg, png, woff2 and the manifest, `navigateFallback` to `index.html`, manifest with `standalone` display, navy theme and cream background, and 192, 512 and maskable 512 icons.
- **Placeholder icons:** `public/icons/icon.svg` is a temporary "FO / OD" mark with a diagonal infinity loop. `scripts/makeIcons.ts` renders the PNGs using Playwright's Chromium, so no image library was added. The real `AppIcon` component and final icons arrive in F2.
- **Alternatives:** `injectManifest` (more code for no gain); `@vite-pwa/assets-generator` or `sharp` (not approved dependencies).

### D-009 Self-hosted fonts, and the font mismatch (Sonny, Samuel)

- **Decision:** ship `Space Grotesk` (variable weight 500 to 700, latin subset) and `Rubik Mono One` (400, latin subset) as WOFF2 in `public/fonts/`, with their OFL texts. Declared in `src/styles/tokens.css`, preloaded for the UI font, precached by the service worker. The files were downloaded once from Google Fonts' static host; the app makes no font request at runtime.
- **Alternatives:** `@fontsource/*` packages (new dependencies); a font CDN (breaks offline use).
- **Mismatch to resolve:** `DESIGN.md` names Space Grotesk and Rubik Mono One. The submitted proposal's third-party table names Outfit, Inter, JetBrains Mono and Rubik Mono One. By the authority order in `AGENTS.md`, `DESIGN.md` wins, so the README lists only the fonts actually shipped. The team should correct or explain the proposal wording before judging.
- **Subset note:** latin only, which covers English and Bahasa Indonesia.

### D-010 Running TypeScript scripts without a new dependency (Hakim)

- **Decision:** `backtest`, `seed` and `icons` run with `node --experimental-strip-types`. Source rules that make this work everywhere: imports carry the `.ts` suffix; `erasableSyntaxOnly` bans enums and parameter properties; `verbatimModuleSyntax` and `allowImportingTsExtensions` are on. The same files then import cleanly under Vite, Vitest and Node.
- **Trade-off:** Node prints an experimental warning on 22.12.
- **Alternatives:** `tsx` (not approved); compiling first (extra build step).
- **Honest stubs:** `scripts/backtest.ts` and `scripts/seed.ts` print that they are not implemented and exit with code 1, so no one can mistake them for a passing step.

### D-011 CI (Sonny)

- **Decision:** `.github/workflows/ci.yml` runs on every push and pull request. Job `verify`: `npm ci`, lint, `test:coverage`, build. Job `e2e`: install Chromium, run the end-to-end tests, upload the report on failure. Read-only permissions; actions pinned to major versions.
- **Status:** written, not yet run. It needs the team to push to GitHub.
- **Alternatives:** one combined job (slower feedback); pinning actions by commit SHA (more maintenance at this stage).

### D-012 Hosting: Cloudflare Pages (Sonny, Samuel)

- **Decision:** Cloudflare Pages, as the team chose. Build command `npm run build`, output directory `dist`, Node version taken from `.nvmrc`. `public/_headers` sets no-cache on `index.html`, `sw.js` and the manifest, and long immutable caching on hashed assets and fonts.
- **No `_redirects`:** Cloudflare Pages serves single-page apps automatically when there is no top-level `404.html`, so a rewrite rule is unnecessary.
- **Status:** deployed at https://foodoo-d5h.pages.dev, connected to the GitHub repository so each push to `main` deploys. The Playwright smoke test (service worker and offline reload) passes against that URL, `sw.js` is served with `Cache-Control: no-cache`, and a deep link returns 200 (single-page fallback).

### D-013 Placeholder shell, routing and i18n baseline (Vassel, Sonny)

- **Decision:** React Router with a single `/` route. Strings live in `src/i18n/en.ts`; `src/i18n/id.ts` is typed `Record<keyof typeof en, string>`, so a missing or extra key fails the build, and a unit test also checks key parity and empty strings. Default language is English; the toggle and persistence arrive in F2.
- **Alternatives:** an i18n library (not approved).

### D-014 Styles (Vassel)

- **Decision:** `tokens.css` holds the exact tokens from `DESIGN.md`. `base.css` adds the reset, 16 px body text, the 3 px navy focus ring with 2 px offset, the pressed-button translate, 48 px minimum tap targets, and a `prefers-reduced-motion` override. `src/styles/` is not listed in the `AGENTS.md` owner table, so it is assigned to the screens owner; the team may reassign.

### D-015 Repository state (Samuel)

- **Decision:** `git init -b main` was run, with nothing staged or committed, per the team's instruction. `FOODOO_logo.png`, the abstract and proposal PDFs, and the handbook PDF were moved to `docs/brand/`, `docs/submissions/` and `docs/reference/`. No `LICENSE` file was created because the licence is the team's choice.

## Phase F0 follow-up (2026-11-25)

### D-016 Commits and remote (Samuel, Sonny)

- **Decision:** the team asked the AI to commit and gave the GitHub remote. F0 was committed in six commits grouped by module owner, authored with the repository's configured git identity and carrying a `Co-Authored-By` trailer for the AI, as `AGENTS.md` section 4 requires. `.gitattributes` forces LF line endings so Prettier checks behave the same on Windows and in CI. The branch was pushed to `origin/main`.
- **Alternative:** the owners commit by hand. Not chosen because the team asked otherwise.

## Phase F1: Domain logic and evidence (2026-11-25)

### D-017 Weekday and date conventions (Hakim)

- **Decision:** weekday is `0` for Sunday to `6` for Saturday, the JavaScript convention. Date arithmetic uses UTC so it does not depend on the device time zone. `src/domain/time.ts` validates every date and time and throws `RangeError` on bad input, so a malformed value fails loudly instead of producing a wrong suggestion.
- **Alternative:** ISO weekday (Monday is 1). Not chosen because `Date` already gives the JavaScript number.

### D-018 Arrival share uses whole minutes, so the maths is exact (Hakim)

- **Decision:** the profile weight of each opening hour is multiplied by the minutes of that hour the stall was open before time `t`. Both the arrived weight `A` and the total weight `W` are integers, and `share = A / W`. For opening hours on the hour this equals the formula in `SPEC.md` (for example `12/23` at 10:30). It also gives a correct answer if the owner opens at 06:30.
- **Rounding:** demand is `cooked x W / A` rounded half up using integer arithmetic, `floor((2 x cooked x W + A) / (2 x A))`. It gives the same result as `Math.round(x + 1e-9)` from the spec, without any floating-point correction. The `share >= 0.95` test is `20 x A >= 19 x W`. Cooked 42 sold out at 10:30 gives 80.5 exactly, which rounds to 81 as required.
- **Missing hours:** a busy-profile hour with no entry counts as normal (weight 2). If closing is not after opening, the share is 1, so the demand equals the cooked quantity and nothing divides by zero.

### D-019 `estimateDemand` returns `null` when it has no information (Hakim)

- **Decision:** with no sell-out time and no leftover, the function returns `null` instead of guessing. If both are present, the sell-out time wins. The Close screen must therefore collect one of them before a day can be closed.
- **Alternative:** throw an error, or treat a missing leftover as 0. Both would silently or loudly corrupt the history.

### D-020 Suggestion details the spec left open (Hakim)

- **Delta:** in the `history` case the delta is the suggestion minus the cooked quantity of the most recent day in the history used. In the cold-start cases it is the suggestion minus the usual quantity.
- **Observations:** `observations` is the number of days in the history that was actually used (at most 8 same-weekday days, or at most 14 days of any weekday).
- **Leftover days:** a day counts as a leftover day only if its leftover is greater than 0.
- **Critical ratio guard:** if the price is not above the salvage value, the ratio is 0.95 instead of dividing by zero or going negative. The settings screen should prevent this case.
- **Empty quantile:** throws `RangeError`. `suggestQty` never calls it with fewer than 5 values.
- **Cold-start rounding:** `ceil(base x 11 / 10)` is `floor((base x 11 + 9) / 10)` and the leftover test is `leftover x 100 > 20 x cooked`, so there is no floating point.

### D-021 Weekly metrics window (Hakim)

- **Decision:** `weeklyMetrics` takes an end date and covers that day and the six before it. Only closed, non-unusual days count, as in the proposal's metric definitions. Sell-out frequency is sell-outs divided by menu-days, lost sales sums `max(0, estimatedDemand - cookedQty)` on sold-out days, and the acceptance share is `null` when no suggestions exist, so the UI can show a dash instead of 0%.
- **Not built:** the per-menu table and chart of the weekly summary (WS-2 and WS-3). They belong to the reserved Final Day task.

### D-022 Demo generator and the true demand (Hakim)

- **Decision:** the generator follows `SPEC.md` section 7 with seed `foodoo-demo`. It takes today's date as an argument, so it never reads the clock. The true demand is returned in a separate `truth` array that the app must not store. Recorded fields (`estimatedDemand`, `demandIsEstimate`) come from `estimateDemand`, which sees only what an owner would record.
- **Unusual days:** about 10% of days are flagged unusual, but their demand is not changed, because the spec does not define a demand shock. The flag therefore only removes data in the demo.
- **Sell-out time:** as the spec says, a menu sells out at the arrival of customer number cooked + 1. The real last portion is sold one customer earlier, so the recorded sell-out time is slightly late and the estimate slightly low. The backtest limitations say so.
- **Reuse:** `drawDay`, `observeOutcome` and `toMenuDay` are exported so the backtest uses exactly the same demand model.

### D-023 Backtest design (Hakim)

- **Decision:** 3 seeds (`backtest-1` to `backtest-3`), 12 weeks each, metrics over weeks 3 to 12. Both policies face the same demand and arrival times (common random numbers), so differences come from the policy only. FOODOO sees only recorded data. Results are summed over seeds. The script writes `docs/BACKTEST.md` and replaces the block between the markers in the README, so the numbers are never typed by hand. Output contains no timestamps, so two runs give byte-identical files (checked).
- **Result as it came out:** FOODOO has fewer leftovers, fewer lost sales and higher profit than the baseline, and more sell-out menu-days (+4.3%). The estimator error is lower than "sales = demand". The worse sell-out count is reported, not hidden.
- **Likely reason sell-outs rise (not isolated by an experiment):** three of the four menus have a critical ratio below 0.5, so the rule cooks below the median demand for them, which trades some sell-outs for fewer leftovers. This is the newsvendor behaviour the proposal describes, but it has not been checked against owners.
- **Alternatives:** independent random draws per policy (noisier comparison); a tool like `tsx` to run the script (not approved).

### D-024 Windows drive-letter case and the coverage gate (Sonny)

- **Observed:** from a shell that reports the project path as `d:/...`, Vitest's V8 coverage lists every domain file twice, the second time at 0%, and the 100% gate fails although all tests pass. From `D:\...` (PowerShell, VS Code) it reports 100%.
- **Tried:** setting Vite `root` to the real path. It broke test discovery, so it was reverted.
- **Decision:** documented in the README setup section. Linux CI is not affected.

## Phase F1 review (Stage 2, 2026-11-25)

### D-025 Health check and review outcome (Hakim, Sonny)

- **Checked first:** `npm run lint`, `npm run test:coverage` (66 tests, 100% on `src/domain`), type-check of both TypeScript projects, and `npm run build` all passed before any change. Nothing was broken.
- **Reviewed:** every function in `src/domain/` against `SPEC.md` section 6, the generator against section 7, the backtest against section 8, and the metrics against section 9 and proposal section 6.1. The rounding, integer arithmetic, history selection, cold start and clamping match the spec. No T1 to T16 expected value changed.
- **Fixed:** the true demand could reach the app through the demo object (D-029), weekly metrics had no per-menu breakdown (D-030), and `estimateDemand` accepted impossible inputs (D-031). Added a diagnostic and a per-menu table to the backtest (D-032). The coverage report no longer lists `types.ts`, which holds only types and showed a misleading "0" row; the 100% gate is unchanged.

### D-026 How the generator samples arrival times (Hakim)

- **Decision:** for each customer, pick an opening hour with probability equal to its busy weight divided by the total weight, then a uniform minute inside that hour. Sort the times. Customer number cooked + 1 sets the sell-out time.
- **Why:** this is exactly the "weights per hour, even spread inside the hour" model that `arrivalShare` assumes, so the demo and the estimator describe the same world. The backtest limitations say plainly that this flatters the estimator.
- **Known gap:** an opening time that is not on the hour (for example 06:30) is not scaled by open minutes in the generator. The demo profile is on the hour, so it has no effect.

### D-027 What "delta" is compared against (Hakim)

- **Decision (unchanged from D-020, explained):** in the `history` case, delta = suggestion minus the cooked quantity of the newest day in the history actually used. With same-weekday history this is last week's same weekday, so "Sold out on 3 of the last 6 Mondays, +5" means "5 more than last Monday". With the 14-day fallback it is the most recent eligible day. In the cold-start cases it is the suggestion minus the usual quantity.
- **Alternative:** compare with yesterday. Rejected because yesterday may be a different weekday from the history the sentence talks about.

### D-028 How the backtest's FOODOO policy builds its history (Hakim)

- **Decision:** FOODOO starts with no history, like a new user, so it runs the cold-start rule at first. Weeks 1 and 2 are warm-up and are not scored. After each simulated day it stores only what the app would record: cooked, leftover, sell-out time, and the `estimateDemand` result from those. It never reads the true demand. It always cooks exactly its suggestion. Unusual days are flagged, skipped by `suggestQty`, and still scored.
- **Alternative:** start FOODOO with the 56-day demo history. Rejected because that history was made with knowledge of the generator and would hide the cold-start period.

### D-029 True demand removed from the demo history object (Hakim)

- **Decision:** `generateDemoHistory` now returns only `stallName`, `settings`, `menus`, `days` and `menuDays`, exactly what an owner could have recorded. The true demand exists only inside `drawDay`, which only the backtest script uses. A test fails if any other key appears.
- **Why:** the F2 seeder will store this object. Before, it also carried a `truth` array, so a careless seeder could have written the true demand into IndexedDB.

### D-030 Weekly metric definitions (Hakim)

- **Window:** the chosen end date and the 6 days before it, counting only closed, normal days. `SPEC.md` WS-1 says "last 7 days"; the proposal says "7 closed, normal days". The spec has higher authority, so a week with 2 unclosed days has 5 counted days, not 7 reached further back.
- **Definitions:** leftovers = sum of recorded leftovers. Sell-out frequency = menu-days with a sell-out time divided by menu-days. Estimated lost sales = sum of max(0, estimated demand minus cooked) on sold-out days. Acceptance = menu-days where cooked equals suggested, divided by menu-days that had a suggestion (`null` when there were none, so the UI shows a dash, not 0%).
- **Per menu:** `weeklyMetrics` now returns the same figures per menu in `byMenu`, as proposal section 6.1 promises ("per menu and in total"). The weekly summary screen (R1) is still untouched for Final Day.
- **Input time** is measured during owner testing, not computed by the domain.

### D-031 `estimateDemand` rejects impossible inputs (Hakim)

- **Decision:** a cooked quantity that is negative or not an integer, or a leftover outside 0 to cooked, throws `RangeError`.
- **Why:** before, leftover 15 of 10 cooked produced a demand of minus 5 that would enter the history silently. This follows D-017: bad data fails loudly. The Close screen limits the stepper to 0 to cooked anyway (CL-2).

### D-032 Backtest diagnostic and per-menu tables (Hakim)

- **Decision:** the main table stays Baseline vs FOODOO, as `SPEC.md` section 8 asks. A third policy, "FOODOO without sell-out correction", runs the same rule on the same days but records a sold-out day as demand = sales. A per-menu table shows where gains and losses come from.
- **Why:** the product's central claim is that correcting sold-out days matters. Comparing FOODOO with the same rule without the correction measures that claim directly. It is a diagnostic in the report, not a product feature.
- **What it showed:** with the correction, FOODOO loses fewer sales, sells out on fewer menu-days and makes more profit, but has clearly more leftovers than the uncorrected rule. Both are reported; the exact figures live only in the generated `docs/BACKTEST.md`. Per menu, FOODOO is ahead of Baseline on profit for all four menus but worse on some single metrics (for example more Nasi Uduk leftovers, more Ayam Goreng and Sayur Lodeh sell-outs).

### D-033 Open item for F2: reason wording on the 14-day fallback (Vassel, Sonny)

- **Problem:** the spec's text "Sold out on {n} of the last {m} {weekday}s" is wrong when `suggestQty` fell back to the latest 14 days of any weekday. The `Reason` type in `SPEC.md` section 6.1 has no field saying which history was used.
- **Not changed now:** fixing it means adding a field to a type the spec defines exactly. The team should decide before F2, for example by adding `scope: "weekday" | "recent"` to `Reason` and updating `SPEC.md`.

## Phase F2, first half (Stage 3, 2026-11-25)

### D-034 Scope and starting state (all owners)

- **Checked first:** `npm run lint`, `npm test` (70 tests) and `npm run build` passed before any change.
- **Built:** the Dexie data layer, i18n with a persisted toggle, design-system components, the app layout, and the Onboarding, Today and Settings screens. Plan, Service and Close are the next stage; their routes exist and say "Coming soon" (D-044).
- **Not started on purpose:** export and import (DM-3, DM-4) and the weekly summary. They are reserved for Final Day and are not rendered anywhere.

### D-035 How "now" reaches the screens without making the domain impure (Sonny, Hakim)

- **Decision:** a `ClockProvider` (`src/app/ClockProvider.tsx`) holds a `now()` function, `new Date()` by default. `useNow()` re-reads it every 30 seconds. `toLocalStamp(date)` (`src/app/localStamp.ts`) turns a `Date` into the local `"YYYY-MM-DD"`, `"HH:MM"` and weekday. Domain functions only ever receive those strings.
- **Why:** `AGENTS.md` bans `Date.now()` in `src/domain/`. Tests pass a fixed `now` (Monday 2 March 2026, 09:00), so the phase and the date header are deterministic. Playwright can use its own clock API in Stage 4, so the app has no test-only switch.
- **Alternatives:** read the clock inside each screen (untestable); a URL parameter to fake the time (a test hook that ships to users).
- **Local time:** the date and time come from the device's local clock, because the stall works in local time (`AGENTS.md` section 6). Domain date arithmetic stays in UTC (D-017), which is safe because it only handles date strings.

### D-036 Which phase of the day is "now" (Hakim)

- **Rule (`todayPhase` in `src/domain/phase.ts`):** day closed â†’ done. Otherwise, nothing planned for today â†’ Plan, even after closing time, so a forgotten morning can still be recorded. Otherwise, every planned menu sold out, or the time is at or after closing â†’ Close. Otherwise â†’ Service, including before opening once the plan is saved.
- **"Planned"** means at least one menu-day row exists for today, so no extra schema field is needed. Plan (Stage 4) writes those rows when the owner accepts the plan.
- **Why pure:** the rule is part of the 100% coverage gate and is easy to explain: "the app shows the first step you have not done yet, and Close once the stall is closed or empty".
- **Display:** the loop graphic fills the current segment orange, done segments navy and upcoming ones white. Below it, a list says "Done", "Now" or "Next" in words, so the state never depends on colour.

### D-037 How screens read and write data (Samuel)

- **Decision:** one `FoodooDb` instance is supplied through a React context (`DbProvider`). Screens read with live queries (`useStall`, `useMenus`, `useTodayState` in `src/db/hooks.ts`), so every screen updates by itself after a write. All writes are plain async functions in `src/db/repositories.ts` that take the database as their first argument and validate before writing.
- **Why:** repositories are unit-tested without React, and component tests give each test its own fresh database. There is no global store to keep in sync with IndexedDB.
- **Alternatives:** a state library (not approved, and it would duplicate IndexedDB); calling Dexie directly from components (validation would be spread across screens).

### D-038 Schema v1, designed for migrations (Samuel)

- **Tables:** `stall` (one row with id `"stall"`: name, settings, `setupComplete`), `menus` (key `id`), `days` (key `date`), `menuDays` (compound key `[date+menuId]`, indexes `date` and `menuId`).
- **Why a compound key:** a menu can only have one record per day, so saving the plan twice replaces it instead of duplicating it (tested).
- **Migrations:** versions live in a list, `SCHEMA_VERSIONS`, and `createDb(name, versions)` applies them. A test opens a v1 database, writes a row, reopens it with an extra v2 step, and checks that the upgrade ran. A later real migration adds one list entry and one test like that one. A second test pins the exact v1 tables and indexes, so an accidental schema change fails CI.
- **Stall name:** stored and editable in Settings (optional, at most 40 characters). The spec does not require it; it exists because the demo stall has a name, "Warung Demo".

### D-039 Demo seeding and its safety rules (Samuel, Hakim)

- **Decision:** `buildDemoRecords(today)` (`src/demo/seed.ts`) copies the generator's history into database rows field by field, listing each field by name. Anything not in the domain types is dropped, even if the generator gains a field later (tested with an injected `trueDemand` field). The true demand cannot reach the database (see also D-029).
- **Rules:** the demo can be loaded only when there is no stall or the stall is already the demo; it never overwrites an owner's own data (tested). Loading again resets the demo. Removing the demo, or deleting all data, clears every table.
- **History:** 56 days ending yesterday, relative to the device date when it is loaded, so the demo always looks current. Today starts empty, in the Plan phase.

### D-040 Input validation lives in the domain (Hakim)

- **Decision:** `validateMenu` and `validateHours` in `src/domain/setup.ts` return error codes, not text. The screens turn codes into messages through i18n, for example "Cost must be lower than price". Repositories call the same functions and refuse invalid data, so the rules hold even if a screen forgets them.
- **Rules:** name 1 to 40 characters after trimming; price a whole number of rupiah above 0; cost a whole number from 0 to below the price; leftover (salvage) value a whole number from 0 to below the price; usual portions from 1 to 999; closing time after opening on the same day.
- **Salvage below price:** this guarantees that `criticalRatio` never hits the guard in D-020.
- **Busy hours:** one cell per opening hour (`profileHours`). Changing the hours keeps the levels of hours that remain and sets new hours to normal (`resizeProfile`). A tap cycles quiet, normal, busy (`nextBusyLevel`).
- **Number entry:** a field accepts `8000`, `8.000` or `8 000`; dots and spaces are read as thousands separators, as owners write them.

### D-041 i18n design (Sonny)

- **Decision:** `translate(language, key, params)` replaces `{name}` placeholders. `useT()` returns a translator for the current language. The language lives in `localStorage` (`foodoo.language`), is read synchronously at start so the first screen is never in the wrong language, and also sets `<html lang>`. Reads and writes are wrapped so a blocked storage falls back to English.
- **Language is a device preference, not stall data,** so **Delete all data** keeps it.
- **Tests enforce:** identical keys, no empty strings, and identical placeholders in both languages.
- **Formatting:** `formatRupiah` writes `Rp 8.000` with plain integer grouping in both languages, so the output never depends on the browser's locale data. Long dates use the browser's `Intl` with `en-GB` or `id-ID`. A delta is shown as `+5`, `âˆ’3` (a true minus sign) or `0`.
- **Reason text:** `renderReason` (`src/i18n/reason.ts`) turns a stored `Reason` into the sentence from `SPEC.md` section 6.5, for every code and both scopes (D-042), in both languages. Plan uses it in Stage 4.
- **Language switch** sits in Settings and on the Welcome screen, so an owner can switch before setup starts.

### D-042 `Reason.scope` closes D-033 (Hakim)

- **Decision (approved by the team in this session):** `Reason` gains `scope: "weekday" | "recent"`. `suggestQty` sets `"weekday"` when it used the same-weekday history and `"recent"` when it fell back to the latest 14 days. A cold start is always `"recent"`. `SPEC.md` sections 6.1 and 6.5 were updated to match.
- **Effect:** "Sold out on 3 of the last 6 Mondays" is shown only when the history really is Mondays; otherwise "Sold out on 2 of the last 14 days".
- **Checked:** no quantity changes. `npm run backtest` regenerates `docs/BACKTEST.md` and the README block byte for byte (`git diff` is empty). T1 to T16 are unchanged; two tests now also check the scope.

### D-043 `fake-indexeddb` for database tests (Samuel, Sonny)

- **Decision (approved by the team in this session):** dev dependency `fake-indexeddb` 6.2.8 (Apache-2.0), loaded by `tests/setup.ts`. It gives Node an in-memory IndexedDB, so the real Dexie schema, repositories and migration test run in Vitest. It is never part of the app bundle.
- **Alternative:** test the database only through Playwright (slow, and migration tests would need a real browser).

### D-044 Unbuilt screens are visible but clearly unfinished (Vassel)

- **Decision:** the Plan, Service and Close tabs exist, so the layout and navigation can be tested now. Each tab carries a "Soon" tag, and each screen shows "Coming soon. This screen is built in the next step of the prototype." with a link back to Today.
- **Why:** `AGENTS.md` rule 3.4 requires unfinished UI to be hidden or labelled. Hiding the tabs would make the Today primary action a dead end with no explanation.

### D-045 Accessibility decisions made while building (Vassel)

- **Dialogs:** `Sheet` is a `role="dialog"` with `aria-modal`. It traps Tab, closes on Escape, moves focus to the first field and returns focus to the button that opened it. A native `<dialog>` was not used because jsdom does not support `showModal`, so it could not be component-tested.
- **Bug found by the tests:** busy-hour cells, loop steps and "Soon" tags were announced as "06:00Normal" and "PlanNow", because adjacent spans had no space between them. Explicit spaces were added, and the tests now query those buttons by the spoken name, for example "06:00 Normal".
- **Other rules applied:**
  - every input has a `<label>`; errors are linked with `aria-describedby` and marked with `aria-invalid`; the first invalid field gets focus after a failed save
  - toasts are in a polite live region
  - navigation uses `aria-current="page"`
  - one `h1` per screen and a skip link
  - 48 px minimum targets and the 3 px navy focus ring
  - orange only behind ink text; danger buttons are white on `#C1121F`
  - error borders are thicker and errors start with "!", so they do not rely on colour
- **Not done yet:** Lighthouse scores (PLAN F3 item 4).

### D-046 Logo and app icon (Vassel, Sonny)

- **Decision:**
  - `AppIcon` draws "FO / OD" with F and D as plain paths, so it renders the same without any font: F top-left, D bottom-right, one diagonal orange loop.
  - `public/icons/icon.svg` uses the same three paths, and `npm run icons` re-rendered the 192, 512 and maskable PNGs.
  - `Logo` draws "Fâˆž / DOO" using the self-hosted Rubik Mono One, with `textLength` so its width is stable while the font loads.
- **Source:** `docs/brand/FOODOO_logo.png` was used only as a visual reference; nothing was traced or embedded.
- **Known gap:** the icon SVG file and the component share the geometry by copy, not by import. Changing one means changing the other.
