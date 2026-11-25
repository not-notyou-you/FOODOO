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
