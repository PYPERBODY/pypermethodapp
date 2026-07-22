/**
 * Approved member-facing copy for the public entry and access surfaces.
 *
 * Every string is reproduced verbatim from the approved prototype
 * `.migration-source/ThePyperMethod_v2.jsx` or the Phase 2A brief. Safety,
 * disclaimer, billing-transparency and preview-mode language is legal-facing.
 * Do not paraphrase, shorten, or soften it.
 *
 * Consumer-facing PYPER is uppercase. The legal entity is Pyper Health, Inc.
 */

export const BRAND = {
  /** Rendered as "The PYPER / Method." with a Steel-accent period. */
  wordmarkLineOne: 'The PYPER',
  wordmarkLineTwo: 'Method',
  legalEntity: 'Pyper Health, Inc.',
} as const;

export const WELCOME_COPY = {
  headline: 'Everything you need to feel supported through life on GLP-1s.',
  supporting:
    'Track medication, build strength, support nutrition and body care, and follow your progress.',
  membershipNote:
    'App access is included with active PYPER GLP-1 membership.',
  primaryCta: 'Start your 7-day free trial',
  trialMicrocopy:
    '7 days free, then $14.99/month or $119/year depending on the plan you choose.',
  exploreCta: 'Explore the app',
  exploreAccessibilityLabel: 'Explore the app with sample data',
  signInPrompt: 'Already subscribed or an active PYPER member? ',
  signInAction: 'Sign in',
  careTitle: 'Explore PYPER GLP-1 Care',
  /**
   * Present in the approved prototype (`.exCopy`, line 2649) but deliberately
   * NOT rendered on approver instruction, so the care row is the title plus a
   * single external-link arrow. Retained here so the approved string is not
   * lost if the decision is revisited.
   */
  careCopy:
    'Clinical care is managed through the secure PYPER Member Portal.',
  careAccessibilityLabel: 'Explore PYPER GLP-1 Care in an external browser',
  careUrl: 'https://pyperbody.com',
  /** Approved medical disclaimer — preserved exactly. */
  disclaimer:
    'The PYPER Method app does not provide medical care. Clinical eligibility, prescriptions, refills, and care-team communication are managed through the secure PYPER Member Portal.',
} as const;

export const PLAN_COPY = {
  title: 'Choose Your Plan',
  subtitle:
    'Choose standalone paid App access. PYPER GLP-1 membership is not required.',
  includedLabel: 'Included',
  included:
    'Full access to app features. Medication, supplement, symptom, and body tracking. Strength and Movement. Reminders and reports. Member Toolkit. PYPER Perks.',
  exclusions:
    'A standalone App subscription does not include medication, prescribing, clinician appointments, refill management, or clinical messaging.',
  includedWithMembership:
    'Paid App access is included with an eligible active PYPER GLP-1 membership.',
  deletionNote: 'Deleting your account does not cancel your subscription.',
  restore: 'Restore Purchases',
  restoreUnavailable:
    'No purchases to restore. Store billing is not connected in this build.',
  signInAction: 'Already a member? Sign In',
  createAction: 'Create an account first',
  footer:
    'Cancel anytime. Subscription renews automatically unless cancelled. Terms apply.',
} as const;

export const PURCHASE_COPY = {
  /**
   * Development banner. The simulation must never present itself as a real
   * App Store or Google Play transaction.
   */
  eyebrow: 'DEVELOPMENT SIMULATION · NOT A REAL PURCHASE',
  title: 'The PYPER Method',
  subtitle: 'Public App Subscription',
  planLabel: 'Plan',
  priceLabel: 'Price',
  renewsLabel: 'Renews',
  accountLabel: 'Account',
  accountMissing: 'Account required',
  trialNote:
    'Your 7-day free trial begins when you confirm. Cancel before the trial ends and you will not be charged.',
  confirm: 'Confirm & Start Free Trial',
  confirmProcessing: 'Starting your free trial…',
  cancel: 'Cancel',
  simulationNote:
    'This is a development simulation, not an App Store or Google Play transaction. No payment method is charged and no subscription is created. Production billing uses Apple StoreKit and Google Play Billing.',
  needsAccount: 'Create your account to continue.',
} as const;

export const CREATE_ACCOUNT_COPY = {
  title: 'Create your account',
  subtitle:
    'The PYPER Method is available to anyone. Active PYPER GLP-1 members receive access at no additional cost.',
  ageConfirmation: 'I confirm that I am at least 18 years old.',
  legalConfirmation:
    'I agree to the Terms of Use and confirm that I have reviewed the Privacy Policy, Consumer Health Data Privacy Policy, and Medical Disclaimer.',
  submit: 'Create Account',
  signInAction: 'Already have an account? Sign In',
  pendingNoticeTitle: 'Your plan is saved',
  errors: {
    name: 'Add your name.',
    nameIsEmail: 'Enter your name, not your email address.',
    email: 'Enter a valid email address.',
    password: 'Use at least 8 characters for your password.',
    confirmations:
      'Confirm that you are at least 18 and accept the required account terms.',
  },
} as const;

export const SIGN_IN_COPY = {
  title: 'Welcome Back',
  subtitle: 'Sign in to access The PYPER Method.',
  submit: 'Sign In',
  createAction: 'New here? Create an account',
  restore: 'Restore Purchases',
  /** Distinguishes public paid access from included member access. */
  accessNote:
    'Anyone may create an App account. Eligible PYPER GLP-1 members receive paid App access at no additional cost.',
  supportPrompt: 'Having trouble signing in? ',
  supportAction: 'Contact Support',
  supportDetail: 'members@pyperbody.com',
  errors: {
    email: 'Enter a valid email address.',
    password: 'Enter your password.',
  },
} as const;

/** Preview-mode copy — reproduced exactly from the brief and prototype. */
export const PREVIEW_BANNER =
  "Preview mode — you're browsing sample data. Tracking and personal data entry are locked until you begin a trial or activate access.";

export const READ_ONLY_BANNER =
  'Read-only access. Your history stays available. New entries and protected PYPER Perks are locked.';

/**
 * Shown wherever a Phase 2A screen is intentionally a placeholder. This is a
 * product state, not a developer to-do.
 */
export const PHASE_NOTE =
  'This section arrives in a later migration phase. The foundation, access rules, and navigation are in place.';

export const MOCK_AUTH_NOTICE =
  'Accounts are simulated in this build. Production accounts require secure authentication and encrypted storage.';
