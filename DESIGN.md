# DESIGN.md — FOODOO Interface Specification

Visual style: **clean and formal**. That means thin 1 px borders in neutral grey, flat surfaces with no decorative shadows, small corner radii (6–8 px), a neutral grey page background with white cards, and the original FOODOO colours kept exactly: cream page, white cards, orange primary buttons and status fills with ink text, navy for done states and the toast, yellow for highlights and selection, sky blue for info. The team chose it over the earlier soft neo-brutalism (thick outlines, offset shadows, rotated stickers) because it reads as more trustworthy and professional, keeps attention on the numbers, and still renders cheaply on low-end phones. Elevation (`--shadow-overlay`) is used only for layers that float above the page: toast, sheet and the sticky action bar.

## 1. Brand

- **Logo:** "F∞ / DOO". The word is stacked on two lines; the "OO" of FOO is drawn as an infinity loop. White letters, orange loop, on deep navy.
- **App icon / favicon:** "FO / OD". F top-left, D bottom-right, one diagonal infinity loop through the centre. Navy rounded square, orange loop, white letters.
- **Meaning:** the infinity loop is the daily loop of plan, sell and record. It also stands for the customers a sold-out menu hides, still being counted.
- Build both as SVG components (`src/components/Logo.tsx`, `src/components/AppIcon.tsx`). The letters are Rubik Mono One glyph outlines stored as paths (no font is loaded at runtime), sized to match `docs/brand/FOODOO_logo.png`: in the logo, F is narrowed to about 0.93× and DOO widened to about 1.15× of the natural glyph width; in the icon both letters keep near-natural width. Both marks use one shared infinity path (`BRAND_LOOP`, stroke 50, crossing at about 41°), scaled for the logo and rotated −45° for the icon. Generate PWA icons at 192, 512 and maskable 512 from the icon SVG.

## 2. Tokens (`src/styles/tokens.css`)

```css
:root {
  --navy: #003049;
  --orange: #f77f00;
  --cream: #fff1dc;
  --paper: #ffffff;
  --ink: #141414;
  --muted: #4b4b4b;
  --yellow: #ffd166;
  --sky: #c6f1ff;
  --mint: #d7f5c9;
  --danger: #c1121f;
  --line: #d0d7de;
  --line-strong: #8c959f;
  --border: 1px solid var(--line);
  --shadow-overlay: 0 8px 24px rgb(20 20 20 / 14%);
  --radius: 8px;
  --radius-sm: 6px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --font-ui: "Space Grotesk", system-ui, sans-serif;
  --font-num: "Space Grotesk", system-ui, sans-serif;
}
```

- Fonts: Space Grotesk (500, 700) for all UI text and numbers, **self-hosted** in `public/fonts/` so the app works offline. The logo letters are Rubik Mono One outlines converted to SVG paths, so that font is not loaded at runtime. Both are under the SIL Open Font License.
- Type scale: 12 (tags) / 14 / 16 (body) / 20 / 24 / 32. Portion numbers use `--font-num` (Space Grotesk 700, tabular figures) at 28–32 px.
- **Press and hover feedback:** a colour change only, never movement. Controls get a darker border on hover and a slight darkening on `:active`.
- Respect `prefers-reduced-motion`: no translate or toast slide animations.

## 3. Language

- Default UI language: **English**. A toggle in Settings switches to **Bahasa Indonesia**, and the choice is persisted.
- All strings live in `src/i18n/en.ts` and `src/i18n/id.ts` with identical keys. Never hard-code strings.
- Currency: `Rp 8.000` in both languages. Time format: `10:32`, 24-hour.

## 4. Layout

- **Mobile first** (360–430 px): single column, bottom tab bar with 4 tabs (Today, Plan, Service, Close) and Settings in the header.
- **Desktop** (≥ 1024 px): left sidebar with the same items. Content max-width 1120 px. Cards use `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`.
- Header on every screen: app icon, screen title, date, and a **Demo data** badge (yellow, thin border, not rotated) when demo data is loaded. A thin divider line separates the header from the content.

## 5. Screens

Every screen needs these states designed and built: **default, empty, demo, offline**. Add **error** where input exists.

### 5.1 Onboarding
- Welcome: logo, one-line value statement ("Daily portion planning that counts the customers a sold-out menu hides"), buttons **Start setup** (primary) and **Try demo stall** (secondary).
- Step 1, Menus: list of menu cards plus **Add menu**. The add/edit sheet has labelled inputs with inline validation.
- Step 2, Hours: open and close time inputs, and the busy-hour strip (one tappable cell per hour; colours quiet = paper, normal = yellow, busy = orange, and **each cell also shows its label text**).
- A progress indicator: "Step 1 of 2".

### 5.2 Today (home)
- A large infinity loop graphic split into three segments: **Plan**, **Service**, **Close**. The current segment is filled orange, finished segments are navy, upcoming segments are outlined.
- Below it, one primary button for the current phase (e.g. "Plan today's portions"), plus today's counts.
- Empty state (no setup): a prompt to finish setup.

### 5.3 Plan (morning)
- One card per menu: name, photo slot (an optional user photo; a neutral placeholder if none), the stepper with the number in `--font-num`, the reason line, and an "edited" tag when changed.
- A sticky bottom bar shows the total portions and **Accept all** / **Save plan**.

### 5.4 Service
- A two-column grid of large tiles (minimum 150 px tall).
- Available tile: paper background, menu name, "Cooked 42", and the hint "Tap when sold out".
- Sold-out tile: orange background with a white label "SOLD OUT 10:32". The status text must always be present, never colour alone.
- Undo toast: navy bar at the bottom with an **Undo** button, for 10 s.
- Offline pill: "Offline. Saved on this device."

### 5.5 Close (night)
- One row per menu: a sold-out time chip with **Edit**, or a leftover stepper.
- The missed-sell-out prompt appears inline (yellow box with a time input).
- An **Unusual day** checkbox with a helper text.
- The **Close day** primary button opens a confirmation sheet listing tomorrow's suggestions.

### 5.6 History (weekly summary)
- Stat tiles: leftover portions, sell-out events, estimated lost sales (with an "estimate" tag), plans accepted as suggested. The same tiles appear on Today under "Last 7 days".
- Content sits in cards with a heading row; status is a coloured badge (Closed mint, Unusual sky, Not closed yellow). Estimates show `≈ N` with a small sky "estimate" tag under the number.
- Per-menu table and a bar chart of cooked vs demand, with the value above each bar and menu chips to switch. Bars are navy for cooked and orange for demand; estimated demand is a dashed orange outline on cream. The legend uses both shape and text, and a hidden table gives screen readers the numbers.
- A list of past days opens a read-only day view.

### 5.7 Settings
Sections: Stall (menus, hours, busy hours, salvage value), Data (export, import, load/remove demo, delete all, all destructive actions in `--danger` and confirmed), Language, About (version, licences, AI disclosure, "How FOODOO calculates" explainer page).

### 5.8 "How FOODOO calculates" page
A plain-language explanation with the worked example "Sold out at 10:30 → about 52% of customers had arrived → about 81 wanted it". This helps owners trust the suggestions, and judges can verify the logic from the UI.

## 6. Components

`Button` (primary/secondary/danger), `Stepper`, `MenuCard`, `ServiceTile`, `Toast`, `Sticker`, `StatTile`, `BusyHourStrip`, `TimeInput`, `Sheet`, `TabBar`, `Sidebar`, `LoopProgress`, `EmptyState`, `OfflinePill`, `Logo`, `AppIcon`, `icons/*`.

## 7. Accessibility targets (must be measured)

- Lighthouse Accessibility ≥ 95 and Best Practices ≥ 95 on Today, Plan and Service, in both mobile and desktop presets. Record the scores in the README.
- Text contrast ≥ 4.5:1 (orange `#F77F00` is used only as a background with ink text, or as a large graphic, never for small text on cream or white).
- Tap targets ≥ 48 × 48 px.
- Real `<button>`, `<input>` with `<label>`, and `<a href>`. `aria-label` on icon-only buttons. `aria-live="polite"` on the toast.
- Full keyboard operation on desktop with a visible focus ring (3 px navy outline with 2 px offset).
- No information conveyed by colour alone.

## 8. Feedback and microcopy

- Every save shows confirmation within 300 ms (a toast or an inline check).
- Errors say what to do: "Cost must be lower than price".
- Estimates always read "≈ 81 (estimate)", never as a bare number.
- No jargon in the UI: say "suggested portions", not "newsvendor quantile".
