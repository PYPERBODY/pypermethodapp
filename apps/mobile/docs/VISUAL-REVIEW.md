# Phase 2A — Visual Review Set

Updated after the focused visual-fidelity correction. PR #14 remains an
unmerged draft.

**Native build:** `phase-2a-entry-access-migration`, post-correction, rendered at
390 × 844 (and 340 × 720 where noted), 2× device pixel ratio.

**Prototype reference:** `.migration-source/ThePyperMethod_v2.jsx`, SHA-256
`ccd780740a500250421bc5f829431a3d9c400e93c2ffaf831588a5b2396d9d43` — verified
unchanged. It was rendered read-only in a throwaway Vite harness **outside the
repository** and driven through the same flow as the native build. The frozen
file was not modified and the repo was not touched by the harness.

---

## Folder map

| Folder | Contents | Use for approval? |
|---|---|---|
| `screenshots/phase-2a-approval-set/` | The 8 requested Phase 2A surfaces + Welcome at 340 × 720 | **Yes — this is the review set** |
| `screenshots/prototype-reference/` | The matching frozen-prototype states | Reference |
| `screenshots/side-by-side/` | Native vs prototype, paired | Reference |
| `screenshots/phase-2a-development-placeholders/` | Temporary Home / Method / Track / Dose / Profile content | **No — not designed surfaces** |
| `screenshots/supporting-states/` | Validation, keyboard-open, narrow plan screen | Supplementary |

---

## Status of every Phase 2A surface

### Visually implemented in Phase 2A — ready for visual approval

| # | Surface | File |
|---|---|---|
| 1 | Welcome | `1-welcome-390x844.png` |
| 2 | Annual plan selected | `2-plan-annual-selected.png` |
| 3 | Monthly plan selected | `3-plan-monthly-selected.png` |
| 4 | Create Account — pending plan | `4-create-account-pending-plan.png` |
| 5 | Sign In — pending plan | `5-sign-in-pending-plan.png` |
| 6 | Purchase confirmation — no account | `6-purchase-confirmation-no-account-DEV-SIMULATION.png` |
| 7 | Purchase confirmation — with account | `7-purchase-confirmation-with-account-DEV-SIMULATION.png` |
| 8 | Five-tab navigation treatment | `8-five-tab-navigation-treatment.png` |
| 9 | Welcome at 340 × 720 | `9-welcome-340x720.png` |

Screens 6 and 7 are **development billing simulation — not production purchase
UI.** No payment system is connected; production requires Apple StoreKit and
Google Play Billing.

### Navigation placeholders only — not designed surfaces

The five tab destinations render an intentional holding state built from the
approved tokens. They exist to prove routing and access gating, not to be
approved as final screens:

Home · Method · Track · Dose · Profile
(`screenshots/phase-2a-development-placeholders/`)

Access-state chrome that **is** final and visible on those screens: the preview
and read-only banners, and the entry-locked capability chip.

### Deferred to later migration phases

Today dashboard content · Method chapters · all trackers · dose tools ·
reminders · Progress · Weekly Review · exports · PYPER Perks · intake profile ·
photos · Supabase · RevenueCat · production billing and authentication.

---

## Screen-by-screen comparison

### 1. Welcome — `side-by-side/01-welcome.png`

**CORRECTED.** The spacer between the membership note and the primary CTA is
now pinned to the prototype's 16pt at both 390 x 844 and 340 x 720. Leftover
viewport height is absorbed after the disclaimer instead of in the middle of
the composition, so no void opens on taller screens.

Remaining visible differences:
- **Headline break point.** The prototype breaks after "feel"; native breaks one
  word later, after "supported".
- **Sign-in line break.** The prototype keeps "member? Sign in" together on the
  second line; native pushes the whole action to its own line.
- **Care row is title-only.** Two approved-source elements are deliberately
  omitted on approver instruction:
  1. the trailing `›` chevron (`.exChev`, line 2651), so there is a single
     external-link indicator;
  2. the secondary sentence "Clinical care is managed through the secure PYPER
     Member Portal." (`.exCopy`, line 2649).
  The row is now "Explore PYPER GLP-1 Care ↗" followed directly by the approved
  medical disclaimer, which is unchanged and still carries the same Member
  Portal language. The string is retained in `copy.ts` if the decision is
  revisited.
- Wordmark scale, weight, Steel period, headline, supporting copy, membership
  note, both buttons and the disclaimer match.
- Environmental: the prototype draws a simulated iOS status bar and notch; the
  native web capture has none.

### 2 & 3. Plan selection — `side-by-side/02-plan-annual.png`, `03-plan-monthly.png`

Visible differences:
- **Radio alignment.** The prototype centres the radio against the full card
  body; native pins it to the top of the card.
- **Back chip height.** Prototype 33pt; native 44pt to meet the minimum touch
  target. Deliberate accessibility divergence.
- **"Included" copy.** The prototype reads "Hyperhuman-powered Strength and
  Movement"; native omits "Hyperhuman-powered" because Hyperhuman is on the
  Phase 2A deferred list.
- Title, subtitle, card fill and border, selected state, MOST POPULAR and
  SAVE $60 tags, price hierarchy, CTA and transparency copy match. Card padding
  (16), radius (16), `.h2` (22/23.1/-0.44/800), `.btn` (52pt/14px/700/pill) and
  `.sub` (12/18.6/#7C8991) were measured against the running prototype and are
  identical.

### 4. Create Account — pending plan — `side-by-side/04-create-account-pending.png`

Visible differences:
- **Native adds a password field.** The prototype has none. Required by the
  Phase 2A brief §11 ("secure text entry for passwords").
- **Native adds a pending-plan banner** ("Your plan is saved"). The prototype
  carries no pending context on this screen. Required by brief §8.
- **Native adds a mock-auth notice.** Not in the prototype.
- Heading, intro copy, field styling, required confirmations and the two
  actions match.

### 5. Sign In — pending plan — `side-by-side/05-sign-in-pending.png`

This screen diverges the most, all of it brief-driven rather than fidelity
drift. Flag it if the prototype's model should win instead:
- **Authentication model.** The prototype is magic-link — "Send Sign-In Link"
  and "Use One-Time Code", no password. Native is email + password, per brief
  §11.
- **Native adds** the pending-plan banner, a Restore Purchases control (brief
  §11 asked Sign In to distinguish it) and the mock-auth notice.
- **Contact Support placement.** Prototype above "Create an account"; native
  below Restore Purchases.
- Heading, intro copy, access-note card and "New here? Create an account" match.

### 6 & 7. Purchase confirmation — `side-by-side/06-…`, `07-…`

> **Development billing simulation — not production purchase UI.**

**CORRECTED.** The screen is now a Porcelain canvas with an inset Espresso card
— radius 24, padding 22/20, 4pt inset inside the 20pt gutter, 6pt top margin —
matching the prototype's purchase view. Plan, price, renewal, account rows,
Confirm and Cancel, the trial logic and the synchronous idempotency guard are
unchanged.

Remaining visible differences:
- **Eyebrow wording.** Prototype: "SUBSCRIPTION PREVIEW · NATIVE STORE BILLING
  IN PRODUCTION". Native: "DEVELOPMENT SIMULATION · NOT A REAL PURCHASE" —
  strengthened so the simulation cannot be mistaken for a real transaction.
- **Footnote.** Native adds "No payment method is charged and no subscription
  is created."
- Title, subtitle, rule, Plan / Price / Renews / Account rows, trial note and
  both buttons match.

### 8. Five-tab navigation — `side-by-side/08b-nav-only.png`

**CORRECTED.** My earlier report that the original icon assets were unavailable
was wrong. The frozen source contains the complete path data:

- `Ic` (line 2046) — 17x17, viewBox `0 0 24 24`, fill none, stroke
  currentColor, strokeWidth 1.8, round caps and joins.
- `ICONS` (lines 2049–2055) — the five glyph definitions.

All five are now reproduced verbatim via `react-native-svg` in
`src/components/ui/tab-icons.tsx`. No icon library substitutes remain in the
tab bar, and nothing was invented.

| Tab | Prototype definition | Native |
|---|---|---|
| Home | `<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>` | Exact |
| Method | `<circle cx=12 cy=12 r=8.5/><path d="M12 3.5v17M3.5 12h17"/>` | Exact |
| Track | `<path d="M4 19V9M10 19V5M16 19v-8M22 19H2"/>` | Exact |
| Dose | `<rect x=8.5 y=7.5 w=7 h=12.5 rx=2.4/><path d="M10 7.5V4.5h4v3M8.5 12h7M8.5 16h7"/>` | Exact |
| Profile | `<circle cx=12 cy=8.5 r=3.5/><path d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5"/>` | Exact |

Label text, order, uppercase treatment, 11pt size, active/inactive colour and
the active weight increase all match.

**Still using @expo/vector-icons (Feather), outside the tab bar:** the Welcome
membership lock, status-banner icons, form check and alert marks, and list
chevrons. The prototype defines its own inline SVG for several of these too.
They were left alone to keep this correction focused; they are visually close
and are a candidate for the same treatment in a later pass.

### 9. Welcome at 340 × 720 — `9-welcome-340x720.png`

Gutters step down to 20pt as the prototype's `@media(max-width:349px)` rule
specifies. Now fits without scrolling at all — removing the care-row sentence
shortened the page — and there is no horizontal scrolling. Short scrolling
remains permitted at this size; it is simply no longer needed.

---

## Summary of open visual items

| Item | Severity | Note |
|---|---|---|
| ~~Welcome spacer ~70pt vs ~16pt~~ | **Fixed** | Now 16pt at both viewports |
| ~~Purchase sheet full-bleed vs inset card~~ | **Fixed** | Inset Espresso card on Porcelain |
| ~~Tab icon set differs~~ | **Fixed** | Exact prototype paths reproduced |
| Plan radio top- vs centre-aligned | Low | One style change |
| Headline / sign-in line breaks | Low | Font metric rounding |
| Back chip 44pt vs 33pt | Low | Deliberate — touch target |
| Care-row chevron + secondary sentence removed | None | Approved divergences |
| Password fields, pending banners, Restore Purchases | None | Brief-mandated additions |
| Hyperhuman wording omitted | None | Deferred scope |

Feather icons remain outside the tab bar (Welcome lock, banner, form and
chevron marks) — visually close, candidate for a later focused pass.

The three medium-severity items are fixed. The remainder are low-severity or
deliberate.
