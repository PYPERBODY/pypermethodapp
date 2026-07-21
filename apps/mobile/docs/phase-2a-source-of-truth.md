# The PYPER Method — Mobile Source of Truth (Phase 2A)

This file records the frozen inputs the Expo application is migrated from, and
the product facts that later phases must not silently change.

## Approved prototype

| | |
|---|---|
| **Approved source filename** | `ThePyperMethod_v2.jsx` |
| **Location in this working tree** | `.migration-source/ThePyperMethod_v2.jsx` |
| **SHA-256** | `ccd780740a500250421bc5f829431a3d9c400e93c2ffaf831588a5b2396d9d43` |
| **Size** | 743,956 bytes (8,502 lines) |
| **Freeze date** | 2026-07-21 |
| **Tracked in git?** | No — intentionally untracked. This record is the durable artefact. |

**Hash correction.** The Phase 2A brief paired the filename
`ThePyperMethod_v2.jsx` with SHA-256
`d8b5482f251a16ee20033f96600f91b34dcf29d0e798d452fb58794804b4a0d8`. That hash
belongs to the *superseded* `ThePyperMethod.jsx`, not to `_v2`. Both files were
hashed from `the pyper method app tues 2028.zip` to confirm this. The filename
is authoritative; the hash above is the corrected value and was confirmed with
the product owner before any code was written.

`ThePyperMethod.jsx` (`d8b5482f…4b4a0d8`) is **not** a migration source.

### How the prototype may be used

`ThePyperMethod_v2.jsx` is a **visual and product reference only**. It is read
to derive colours, spacing, type hierarchy, copy and flow logic, which are then
rebuilt as genuine React Native components.

It **must not be shipped as a WebView**, embedded, transpiled wholesale, or
converted into a single large component. Neither prototype JSX file is ever
modified.

## Entitlement states

Exactly five. Do not rename, merge, or add states.

| State | Core writes | Affiliate links | Protected PYPER Perks |
|---|---|---|---|
| `preview` | Locked | Locked | Locked |
| `trialing` | Allowed | Allowed | Locked |
| `method_digital_active` | Allowed | Allowed | Allowed |
| `pyper_member_active` | Allowed | Allowed | Allowed |
| `expired_read_only` | Locked | Locked | Locked |

Screens branch on named capabilities — `canWriteHealthData`,
`canUseAffiliateLinks`, `canUseProtectedPyperPerks`, `isReadOnly` — never on an
entitlement string. See `src/features/access/entitlements.ts`.

## Pricing

Both plans carry a **7-day free trial**. Both purchase buttons read
**"Start 7-Day Free Trial"**. Annual is selected by default.

| Plan id | Price | Trial |
|---|---|---|
| `annual` | $119/year | 7 days free |
| `monthly` | $14.99/month | 7 days free |

Billing-transparency copy is legal-facing and reproduced verbatim in
`src/features/access/plans.ts`. Do not paraphrase or reflow it.

No billing is connected. Production must integrate Apple StoreKit (iOS) and
Google Play Billing (Android); the Phase 2A confirmation screen is an isolated
development simulation and is labelled as such on screen.

## Navigation

Five tabs, fixed labels, no sixth tab:

**Home · Method · Track · Dose · Profile**

Welcome, plan selection, purchase confirmation, Sign In and Create Account live
in the root stack, outside the tab navigator.

## Capitalization

Consumer-facing PYPER is **uppercase**. The legal entity is
**Pyper Health, Inc.** Do not introduce "Founder", "Pyper Body", or other
company language into member-facing copy.

## Phase 2A scope

Delivered:

- Native design tokens and shared primitives (`src/theme`, `src/components/ui`)
- Typed entitlement + capability model and a local mock access provider
- Approved public Welcome screen
- Trial plan selection and simulated purchase confirmation
- Sign In and Create Account (validated mock forms)
- Pending-trial continuity through account creation and sign-in
- One centralized abandon-purchase action
- Synchronous ref guard on trial confirmation
- Preview entry and browse-only shell
- Protected app-shell routing and the five-tab navigator
- Placeholder tab landing screens as intentional PYPER interface states
- Accessibility and responsive layout
- This record

## Deferred

Not in Phase 2A, and not to be started without a new scoped brief:

- Supabase, production authentication, secure health-data storage
- RevenueCat, Apple / Google billing
- Detailed Home, Method, Track, Dose and Profile content
- Full tracker functionality, reminders scheduling, reports, exports
- PYPER Perks, partner APIs, real redemption and code inventory
- Progress-photo storage, Hyperhuman, clinical portal integration
- Production analytics

## Replacement boundaries

`src/features/access/access-context.tsx` is the single seam. Swapping its
internals for Supabase Auth, RevenueCat and secure storage does not require a
screen rewrite, because screens consume `useAccess()` / `useCapabilities()`
only.

Row Level Security must be enabled on every health table when the database is
connected. No health data may be passed to affiliate links, partner links or
analytics.

## Typography assets

| Prototype variable | Family | Package | Loaded |
|---|---|---|---|
| `--font-display` / `--font-ui` | Hanken Grotesk | `@expo-google-fonts/hanken-grotesk` | 400, 500, 600, 700, 800, 900 |
| `--font-mono` | JetBrains Mono | `@expo-google-fonts/jetbrains-mono` | 400, 500, 700 |
| `--font-accent` | Fraunces | — | **Not loaded** |

Fraunces is deliberately absent: it appears only in the greeting, chapter
subtitles and legal bullets, none of which are migrated in Phase 2A. It must be
added when those screens arrive.

Fonts load in `src/app/_layout.tsx` via `expo-font`, behind a splash-screen
hold, so the app never renders a frame in a system fallback face. React Native
does not synthesise weights for custom families — `src/theme/typography.ts`
maps each weight to its own family name.

## Visual fidelity correction

The first Phase 2A implementation was functionally correct but visually
rejected: it rendered in system fallback fonts at inflated sizes. The
correction transcribed the prototype's CSS into `src/theme/tokens.ts`, with
every entry naming the rule it came from, and rebuilt the shared primitives
against it. Screens were not redesigned and no logic changed.

Two deliberate divergences from the prototype are on record:

1. **Welcome care row.** The prototype carries both an inline `↗` and a
   trailing `›` chevron (`.exChev`, line 2651). The chevron was removed on
   approver instruction so there is one external-link indicator.
2. **Welcome spacer.** `.welcomeSpacer` is unbounded (`flex: 1 1 auto`). It is
   capped at 64pt natively so a tall viewport cannot open a blank void between
   the editorial top and the anchored actions.

The sentence "Clinical care is managed through the secure PYPER Member Portal."
was verified as present in the approved Welcome (`.exCopy`, line 2649) and is
retained.
