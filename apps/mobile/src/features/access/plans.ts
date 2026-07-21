/**
 * The single approved plan configuration.
 *
 * Copy is reproduced verbatim from the approved prototype's
 * `APP_PLAN_CONFIG` (`.migration-source/ThePyperMethod_v2.jsx` lines 812–822)
 * and the Phase 2A brief. Pricing and transparency strings are legal-facing:
 * do not paraphrase, reflow, or shorten them.
 *
 * There is NO real billing in Phase 2A. Production must integrate Apple
 * StoreKit (iOS) and Google Play Billing (Android); see
 * `src/features/access/access-context.tsx` for the simulation boundary.
 */

export const PLAN_IDS = ['annual', 'monthly'] as const;

export type PlanId = (typeof PLAN_IDS)[number];

/** Annual is selected by default on the plan screen. */
export const DEFAULT_PLAN_ID: PlanId = 'annual';

/** Both plans carry the same 7-day free trial. */
export const TRIAL_DAYS = 7;

export interface PlanConfig {
  id: PlanId;
  label: string;
  /** Long-form price, e.g. "$119 per year". */
  price: string;
  /** Purchase-sheet price line. */
  priceLine: string;
  /** Purchase-sheet renewal line. */
  renewsLine: string;
  /** Headline on the plan card. */
  headline: string;
  /** Short renewal note under the plan card headline. */
  cardNote: string;
  /** Optional supporting line (annual only). */
  equivalence?: string;
  /** Optional savings tag (annual only). */
  savingsTag?: string;
  /** Optional emphasis tag (annual only). */
  popularTag?: string;
  /** Required App Store / Play Store billing transparency copy. */
  transparency: string;
}

export const APP_PLAN_CONFIG: Record<PlanId, PlanConfig> = {
  annual: {
    id: 'annual',
    label: 'Annual',
    price: '$119 per year',
    priceLine: '7 days free, then $119/year',
    renewsLine: 'At $119/year unless cancelled',
    headline: '7 days free, then $119 per year.',
    cardNote:
      '7 days free, then $119/year. Renews automatically unless cancelled.',
    equivalence: 'Equivalent to approximately $9.92 per month.',
    savingsTag: 'SAVE $60 COMPARED WITH MONTHLY',
    popularTag: 'MOST POPULAR',
    transparency:
      'Free for 7 days, then $119/year unless cancelled before your trial ends. Billing begins when your 7-day trial ends. Your subscription renews automatically until cancelled. Cancel before your trial ends through your Apple App Store or Google Play subscription settings.',
  },
  monthly: {
    id: 'monthly',
    label: 'Monthly',
    price: '$14.99 per month',
    priceLine: '7 days free, then $14.99/month',
    renewsLine: 'At $14.99/month unless cancelled',
    headline: '$14.99 per month',
    cardNote:
      '7 days free, then $14.99/month. Renews automatically unless cancelled.',
    transparency:
      'Free for 7 days, then $14.99/month unless cancelled before your trial ends. Billing begins when your 7-day trial ends. Your subscription renews automatically until cancelled. Cancel before your trial ends through your Apple App Store or Google Play subscription settings.',
  },
};

/** Both purchase buttons use this exact label. */
export const START_TRIAL_LABEL = 'Start 7-Day Free Trial';

export const PLAN_LIST: PlanConfig[] = PLAN_IDS.map((id) => APP_PLAN_CONFIG[id]);
