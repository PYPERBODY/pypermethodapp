/**
 * Native design tokens for The PYPER Method.
 *
 * Every value is derived from the approved frozen prototype
 * `.migration-source/ThePyperMethod_v2.jsx` (SHA-256
 * ccd780740a500250421bc5f829431a3d9c400e93c2ffaf831588a5b2396d9d43), which
 * declares them as CSS custom properties on `.app` (light theme) and in the
 * Welcome / plan / purchase style blocks. The CSS variable each token maps to
 * is noted inline so the mapping stays auditable.
 *
 * Do not invent new palette values. If a screen needs a colour that is not
 * here, take it from the prototype and add it with its source noted.
 */

import { mono, ui } from './typography';

export const Colors = {
  /** --bg — Porcelain app canvas */
  bg: '#F7F6F2',
  /** --card — elevated surface */
  surface: '#FFFFFF',
  /** --card2 — Ivory recessed surface (inputs, muted cards) */
  surfaceAlt: '#ECEAE4',
  /** --line — Bone hairline border */
  border: '#E3E1DA',
  /** --ink — primary text */
  text: '#211F1C',
  /** --soft — secondary text */
  textSoft: '#4A4A4A',
  /** --mut — muted / Steel micro text */
  textMuted: '#7C8991',
  /** --gph — Espresso/graphite: primary buttons, dark section moments */
  espresso: '#171717',
  /**
   * --med — Steel accent: Welcome wordmark period, selected plan borders,
   * links and chevrons.
   *
   * NOTE: the Phase 2A brief calls this "the Steel accent". The prototype's
   * `.welcomeTitleAccent` resolves to `--med` (#6F8491), not `--mut`
   * (#7C8991). The prototype value is authoritative; both are Steel family.
   */
  accent: '#6F8491',
  /** --alert — warning / read-only emphasis. Never decorative. */
  alert: '#9A4634',
  /** --pos — positive state */
  positive: '#6F8060',
  /** --onhero — text on Espresso surfaces */
  onEspresso: '#F7F6F2',
  /** #9aa6a9 — muted label on Espresso (purchase sheet) */
  onEspressoMuted: '#9AA6A9',
  /** #cfd6d9 — soft body copy on Espresso */
  onEspressoSoft: '#CFD6D9',
  /** #c4cccc — faint footnote on Espresso */
  onEspressoFaint: '#C4CCCC',
  /** #333 — divider inside the Espresso purchase sheet */
  onEspressoRule: '#333333',
  /** #EDF0F1 — selected plan card fill */
  planSelected: '#EDF0F1',
  /** #7C8991 — selected plan card border + radio fill */
  planSelectedBorder: '#7C8991',
  /** #E6E9EB — lock glyph chip background */
  lockChip: '#E6E9EB',
  /** rgba(154,70,52,.08) / .3 — inline error surface (.inlineerr) */
  errorSurface: 'rgba(154,70,52,0.08)',
  errorBorder: 'rgba(154,70,52,0.30)',
  /** translucent outline on Espresso (purchase Cancel button) */
  onEspressoBorder: 'rgba(247,246,242,0.35)',
} as const;

/** --space-1 … --space-7 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  /** .tag */
  xs: 6,
  /** .field input */
  sm: 10,
  /** .inlineerr */
  md: 11,
  /** .pvban, .nav button */
  lg: 14,
  /** .card */
  card: 16,
  /** .hero, Welcome hero buttons */
  xl: 20,
  /** purchase confirmation sheet */
  sheet: 24,
  /** .btn, .chip */
  pill: 999,
} as const;

/**
 * Type scale, transcribed from the frozen prototype's CSS.
 *
 * Every entry names the prototype rule it comes from. `lineHeight` converts the
 * CSS unitless value (size x ratio); `letterSpacing` converts `em` to points
 * (size x em). Families come from `typography.ts` — React Native selects a
 * weight by family name, so `fontFamily` and `fontWeight` are set together.
 *
 * Do not round these "for tidiness" and do not scale them up to compensate for
 * a missing font.
 */
export const Type = {
  /**
   * .welcomeTitle — `clamp(38px, 12.2cqi, 56px)` against the 390pt app
   * container resolves to 47.58px; line-height .96; letter-spacing -.045em.
   */
  display: {
    fontFamily: ui(900),
    fontWeight: '900',
    fontSize: 47.6,
    lineHeight: 45.7,
    letterSpacing: -2.14,
  },
  /** .h1 — 34px / 1.0 / -.03em */
  h1: {
    fontFamily: ui(900),
    fontWeight: '900',
    fontSize: 34,
    lineHeight: 34,
    letterSpacing: -1.02,
  },
  /** .h2 — 22px / 1.05 / -.02em */
  h2: {
    fontFamily: ui(800),
    fontWeight: '800',
    fontSize: 22,
    lineHeight: 23.1,
    letterSpacing: -0.44,
  },
  /** .h3 — 15.5px / -.012em */
  h3: {
    fontFamily: ui(800),
    fontWeight: '800',
    fontSize: 15.5,
    lineHeight: 20,
    letterSpacing: -0.19,
  },
  /** .welcomeLead — 18px / 1.32 / 700 / -.01em */
  lead: {
    fontFamily: ui(700),
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 23.8,
    letterSpacing: -0.18,
  },
  /** .welcomeDescription — 15.5px / 1.48 / 400 */
  body: {
    fontFamily: ui(400),
    fontWeight: '400',
    fontSize: 15.5,
    lineHeight: 22.9,
    letterSpacing: 0,
  },
  /** .welcomeIncluded — 13px / 1.4 / 600 */
  bodyStrong: {
    fontFamily: ui(600),
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 18.2,
    letterSpacing: 0,
  },
  /** .sub — 12px / 1.55 */
  sub: {
    fontFamily: ui(400),
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18.6,
    letterSpacing: 0,
  },
  /** .welcomeTrialMicro — 11.5px / 1.45 */
  micro: {
    fontFamily: ui(400),
    fontWeight: '400',
    fontSize: 11.5,
    lineHeight: 16.7,
    letterSpacing: 0,
  },
  /** .welcomeDisclaimer — 11px / 1.5 */
  fine: {
    fontFamily: ui(400),
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 0,
  },
  /** .eyebrow — mono 9.5px / .16em / 500 / uppercase */
  eyebrow: {
    fontFamily: mono(500),
    fontWeight: '500',
    fontSize: 9.5,
    lineHeight: 13,
    letterSpacing: 1.52,
  },
  /** .tag — mono 9px / .1em / 500 / uppercase */
  tag: {
    fontFamily: mono(500),
    fontWeight: '500',
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 0.9,
  },
  /** .field label — UI 12px / .05em / 600 / uppercase (NOT mono) */
  fieldLabel: {
    fontFamily: ui(600),
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  /** .field input — 14px */
  input: {
    fontFamily: ui(400),
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0,
  },
  /** .btn — 14px / 700 */
  button: {
    fontFamily: ui(700),
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.14,
  },
  /** .chip — 12.5px / 500 */
  chip: {
    fontFamily: ui(500),
    fontWeight: '500',
    fontSize: 12.5,
    lineHeight: 17,
    letterSpacing: 0,
  },
  /** .nav .lb — 11px / .03em / 500 / uppercase */
  navLabel: {
    fontFamily: ui(500),
    fontWeight: '500',
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0.33,
  },
  /** .pvban .pk — mono 8px / .16em / 700 */
  bannerKey: {
    fontFamily: mono(700),
    fontWeight: '700',
    fontSize: 8,
    lineHeight: 11,
    letterSpacing: 1.28,
  },
  /** .pvban .pm — 10.5px / 1.35 */
  bannerBody: {
    fontFamily: ui(400),
    fontWeight: '400',
    fontSize: 10.5,
    lineHeight: 14.2,
    letterSpacing: 0,
  },
} as const;

/** --shadow — 0 1px 2px rgba(23,23,23,.05), 0 10px 28px rgba(23,23,23,.07) */
export const Shadow = {
  card: {
    shadowColor: '#171717',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },
} as const;

/**
 * Control heights. `.btn` floors at 44px; individual prototype CTAs raise it
 * with an inline `minHeight`, which the call sites reproduce.
 */
export const TouchTarget = {
  /** .btn base */
  min: 44,
  /** inline minHeight:52 on primary CTAs */
  action: 52,
  /** inline minHeight:58 on the Welcome hero actions */
  hero: 58,
} as const;

/**
 * Layout constraints from the prototype device frame (390 × 844) and its
 * narrow-screen media query at 349px.
 */
export const Layout = {
  /** .scroll — in-app screens sit on a 20pt gutter */
  screenPadding: 20,
  /** .welcomeScreen — the public entry uses a wider 28pt gutter */
  welcomePadding: 28,
  /** @media(max-width:349px) drops the Welcome gutter to 20 */
  screenPaddingNarrow: 20,
  narrowBreakpoint: 350,
  /** max-width on Welcome copy blocks */
  measure: 350,
  /** .card padding */
  cardPadding: 16,
} as const;
