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
  sm: 10,
  md: 14,
  lg: 18,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

/**
 * Type scale lifted from the prototype's Welcome, form and card rules.
 * `letterSpacing` is in points (React Native) rather than `em`; each value is
 * the prototype's em figure multiplied by the font size.
 */
export const Type = {
  /** .welcomeTitle — clamped 38–56px in CSS; 46 is the 390pt-wide resolution */
  display: { fontSize: 46, lineHeight: 44, letterSpacing: -2.1 },
  /** .h2 */
  h2: { fontSize: 22, lineHeight: 26, letterSpacing: -0.5 },
  /** .h3 */
  h3: { fontSize: 16, lineHeight: 21, letterSpacing: -0.2 },
  /** .welcomeLead */
  lead: { fontSize: 18, lineHeight: 24, letterSpacing: -0.18 },
  /** .welcomeDescription */
  body: { fontSize: 15.5, lineHeight: 23, letterSpacing: 0 },
  /** .welcomeIncluded */
  bodyStrong: { fontSize: 13, lineHeight: 18, letterSpacing: 0 },
  /** .sub */
  sub: { fontSize: 12.5, lineHeight: 18, letterSpacing: 0 },
  /** .welcomeTrialMicro / .welcomeDisclaimer */
  micro: { fontSize: 11.5, lineHeight: 17, letterSpacing: 0 },
  /** .eyebrow / .mono — structural micro-labels */
  mono: { fontSize: 9.5, lineHeight: 13, letterSpacing: 1.4 },
  /** .btn */
  button: { fontSize: 15, lineHeight: 20, letterSpacing: -0.1 },
} as const;

/** --shadow (light theme), expressed with native shadow/elevation props. */
export const Shadow = {
  card: {
    shadowColor: '#171717',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
} as const;

/**
 * Minimum practical touch targets. The prototype's `.btn` floor is 44px and
 * primary Welcome actions are 58px.
 */
export const TouchTarget = {
  min: 44,
  action: 52,
  hero: 58,
} as const;

/**
 * Layout constraints from the prototype device frame (390 × 844) and its
 * narrow-screen media query at 349px.
 */
export const Layout = {
  screenPadding: 28,
  screenPaddingNarrow: 20,
  narrowBreakpoint: 350,
  measure: 350,
} as const;
