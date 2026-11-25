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
- **Status:** not deployed. The team creates the project and logs in.

### D-013 Placeholder shell, routing and i18n baseline (Vassel, Sonny)

- **Decision:** React Router with a single `/` route. Strings live in `src/i18n/en.ts`; `src/i18n/id.ts` is typed `Record<keyof typeof en, string>`, so a missing or extra key fails the build, and a unit test also checks key parity and empty strings. Default language is English; the toggle and persistence arrive in F2.
- **Alternatives:** an i18n library (not approved).

### D-014 Styles (Vassel)

- **Decision:** `tokens.css` holds the exact tokens from `DESIGN.md`. `base.css` adds the reset, 16 px body text, the 3 px navy focus ring with 2 px offset, the pressed-button translate, 48 px minimum tap targets, and a `prefers-reduced-motion` override. `src/styles/` is not listed in the `AGENTS.md` owner table, so it is assigned to the screens owner; the team may reassign.

### D-015 Repository state (Samuel)

- **Decision:** `git init -b main` was run, with nothing staged or committed, per the team's instruction. `FOODOO_logo.png`, the abstract and proposal PDFs, and the handbook PDF were moved to `docs/brand/`, `docs/submissions/` and `docs/reference/`. No `LICENSE` file was created because the licence is the team's choice.
