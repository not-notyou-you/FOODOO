# FINAL_DAY.md — FOODOO Final Day plan

Team **Calon Mantu Idaman**, STACK 2026, Case 2. This file is the feature list and completion plan the handbook asks teams to show at check-in (Final Phase, Build Session, item 2). The feature status table in `PLAN.md` section 4 is the single source of truth; this file must agree with it.

## 1. Starting point: what is done before Final Day

Every Core row in `PLAN.md` section 4 is Done. Each one meets its acceptance criteria in `SPEC.md` and has tests.

| ID       | Feature                                          | Evidence                                                           |
| -------- | ------------------------------------------------ | ------------------------------------------------------------------ |
| ON       | Onboarding and setup                             | `tests/screens/onboarding.test.tsx`                                |
| TD       | Today screen (loop view)                         | `tests/screens/today.test.tsx`, `tests/domain/phase.test.ts`       |
| PL       | Morning plan with reasons                        | `tests/screens/plan.test.tsx`, `tests/db/dayFlow.test.ts`          |
| SV       | Service: one-tap sold out and undo               | `tests/screens/service.test.tsx`, `tests/app/toast.test.tsx`       |
| CL       | Night close, missed sell-out, unusual day        | `tests/screens/close.test.tsx`, `tests/domain/close.test.ts`       |
| EST      | Demand estimation and suggestion logic           | T1 to T16, 100% coverage of `src/domain`                           |
| DEMO     | Demo stall generator and labels                  | `tests/demo/`, "Demo data" sticker on every screen                 |
| PWA      | Offline and installable                          | `e2e/coreLoop.spec.ts` (online and offline), `e2e/smoke.spec.ts`   |
| I18N     | English and Bahasa Indonesia                     | `tests/i18n/messages.test.ts`                                      |
| DM-1/2/5 | Delete all, demo load/remove, persistent storage | `tests/db/repositories.test.ts`, `tests/screens/settings.test.tsx` |
| BT       | Backtest report                                  | `npm run backtest` regenerates `docs/BACKTEST.md` byte for byte    |

Also built in F3 and not a separate status row:

- the "How FOODOO calculates" page (`/how`)
- edge-case hardening and a schema-upgrade test
- a bundle-size budget check
- measured Lighthouse scores
- a no-network end-to-end test for the local fallback

## 2. Not finished before Final Day

| Item                                                | State                                                 | Why                                                      |
| --------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| R1 Weekly summary (WS)                              | Reserved for Final Day                                | Reserved by `PLAN.md` F4                                 |
| R2 Export / import (DM-3, DM-4)                     | Reserved for Final Day                                | Reserved by `PLAN.md` F4                                 |
| R3 Top usability fix from owner testing (UX-FIX)    | Reserved for Final Day, **blocked on owner findings** | No owner testing has been done yet (see section 3, R3)   |
| Owner testing (PLAN F3 item 1)                      | Not done                                              | No findings were available during F3. None are invented. |
| Physical phone install                              | Not done                                              | Only Chromium's installability report is checked         |
| Largest contentful paint < 2 s on simulated Slow 4G | Missed by about 30 ms                                 | Measured; see README section 12                          |

## 3. Completion plan for the reserved tasks

None of these is started or scaffolded in the repository. Work begins only after the `final-day-start` tag exists.

### R1 Weekly summary (`SPEC.md` 5.6, `DESIGN.md` 5.6)

- **Owner:** Vassel (screen and components), with Hakim checking the numbers.
- **Builds on:** `weeklyMetrics(menuDays, days, endDate)` in `src/domain/metrics.ts`. It already returns leftover portions, sell-out events, estimated lost sales and the share of suggestions accepted without edit, for the whole stall and per menu. It is already tested (100% coverage).
- **New files:**
  - `src/screens/Summary.tsx` at route `/summary`
  - `src/components/StatTile.tsx`
  - `src/components/CookedDemandChart.tsx`, an inline SVG bar chart: navy bars for cooked, orange for demand, and a legend that uses both shape and text
- **Changes:**
  - a link from Today, and an entry in the sidebar and Settings
  - strings in `en.ts` and `id.ts`
- **Rules:**
  - numbers come only from stored data
  - estimated lost sales and estimated demand carry the "estimate" label (`EstimateValue`)
  - an empty state shows when there are no closed days in the last 7
- **Done when:**
  - WS-1, WS-2 and WS-3 pass as component tests in `tests/screens/summary.test.tsx`
  - one e2e step opens the summary after the core loop
  - lint, test, build and e2e are green
- **Time box:** first half of the session.

### R2 Export and import (`SPEC.md` 5.7 DM-3, DM-4)

- **Owner:** Samuel.
- **New file:** `src/db/exportImport.ts`.
  - `exportJson(db)` covers every table, with a format version and the schema version.
  - `exportCsv(db)` writes one row per menu-day.
  - `parseImport(text)` validates every field with the same rules as `src/domain/setup.ts`. It refuses unknown versions and any data that breaks a rule. Nothing is written until the whole file is valid.
  - `importJson(db, data)` runs in one Dexie transaction and refuses to overwrite an owner's stall without confirmation.
- **UI:** Settings → Data gets **Export (JSON)**, **Export (CSV)** and **Import**. Files are saved through a download link, so no new dependency is needed.
- **Done when:**
  - unit tests cover a valid file, each kind of invalid file, and the round trip
  - an e2e test runs export → delete all → import and restores identical data (the `PLAN.md` F4 criterion)
- **Time box:** second half of the session, in parallel with R1.

### R3 Top usability fix from owner testing

- **Owner:** Sonny (process and tests), with Vassel (UI).
- **Blocker:** R3 needs real findings from owners. Before 16 December the team should:
  - run short sessions with real warung owners
  - record each finding in `docs/DECISIONS.md`: what the owner tried, what went wrong, and how many owners hit it
  - choose the top issue
- **On the day:**
  - write a before note with a screenshot
  - fix the issue
  - add a test that fails before and passes after
  - write an after note in the decision log
- If no owner testing happens, R3 stays "Not started" in the status table. It is not replaced by an invented issue.

## 4. Session timeline

The committee announces the session hours, so slots are relative to the start.

| Slot            | What                                                                                 | Who                           |
| --------------- | ------------------------------------------------------------------------------------ | ----------------------------- |
| Start           | Check in, record the starting commit, create and push `final-day-start` (section 6)  | Sonny                         |
| Start + 15 min  | Show this file to the committee                                                      | All                           |
| First half      | R1 and R2 in parallel, R3 if findings exist                                          | Vassel + Hakim, Samuel, Sonny |
| Midpoint        | Merge, run `npm run lint && npm test && npm run build && npm run e2e`                | Sonny                         |
| Second half     | Finish R2's e2e round trip, then polish, then the status table                       | All                           |
| Cutoff − 30 min | Freeze features; update `PLAN.md` section 4, the README status and the Final Day log | Sonny, all                    |
| Cutoff          | Record the final commit; stop modifying the code                                     | All                           |

## 5. Setup checklist (before travelling and at the venue)

- [ ] Every laptop has Node 22.12.x (`.nvmrc`), Git, and a clone of the repository at the latest `main`
- [ ] `npm ci` done at home; `npx playwright install chromium` done, so no download is needed at the venue
- [ ] `npm run lint && npm test && npm run build && npm run e2e` green on each laptop
- [ ] The deployed URL https://foodoo-d5h.pages.dev loads, and **Try demo stall** works
- [ ] Local fallback rehearsed (section 7) with Wi-Fi turned off
- [ ] Each member can push to the repository (credentials set up at home; nothing secret committed)
- [ ] Each member has re-read their module's entries in `docs/DECISIONS.md`
- [ ] Chargers, a phone with Chrome for the demo, a USB cable or adapter if needed

## 6. Check-in and cutoff commands

At check-in:

```
git checkout main
git pull
git rev-parse HEAD
git tag -a final-day-start -m "Final Day start"
git push origin final-day-start
```

Write the commit hash and the tag in README section 10 ("Final Day log").

At cutoff:

```
git rev-parse HEAD
git log --oneline final-day-start..HEAD
```

Fill in README section 10:

- the final commit
- the list of changes in the session (from the log above)
- each member's contribution

Then stop modifying the code.

## 7. Local demonstration fallback

If the venue network fails:

1. `npm run build` (done beforehand), then `npm run preview`. The preview server runs on the laptop and needs no internet.
2. Open http://localhost:4173. Press **Try demo stall** and walk the loop.
3. To reset: **Settings → Data → Reset demo data**.

`e2e/noNetwork.spec.ts` checks that every screen works while all requests that are not to localhost are blocked. `e2e/coreLoop.spec.ts` checks the whole loop after the network is cut.

## 8. Risks

| Risk                                      | Plan                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------- |
| No owner findings by 16 December          | R3 stays Not started and the README says so; time moves to R1 and R2 tests            |
| Venue network down                        | Local fallback (section 7); dependencies and Playwright browsers installed beforehand |
| A reserved task is not finished at cutoff | Hide its UI (or label it "Coming soon") and record it as unfinished in the README     |
