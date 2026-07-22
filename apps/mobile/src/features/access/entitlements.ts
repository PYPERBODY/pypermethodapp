/**
 * The five approved entitlement states and the centralized capability model.
 *
 * These five values are frozen product vocabulary. Do not rename, merge, or
 * add states. They mirror the approved prototype
 * `.migration-source/ThePyperMethod_v2.jsx` (lines ~2094–2225), which is the
 * source of truth for every allow/lock decision below.
 */

export const ENTITLEMENT_STATES = [
  'preview',
  'trialing',
  'method_digital_active',
  'pyper_member_active',
  'expired_read_only',
] as const;

export type EntitlementState = (typeof ENTITLEMENT_STATES)[number];

export function isEntitlementState(value: unknown): value is EntitlementState {
  return (
    typeof value === 'string' &&
    (ENTITLEMENT_STATES as readonly string[]).includes(value)
  );
}

/**
 * Capabilities are the ONLY thing screens should branch on. No screen should
 * compare an entitlement string directly — that is what let gating drift in
 * the prototype. Add a named capability here instead.
 */
export interface Capabilities {
  /** May enter the tab shell and read sample/placeholder content. */
  canBrowse: boolean;
  /** May write personal health data (all trackers, notes, entries). */
  canWriteHealthData: boolean;
  /** May leave the app through an affiliate link (affiliate credit). */
  canUseAffiliateLinks: boolean;
  /**
   * May reveal / copy / redeem a protected PYPER Perk — codes, private rates,
   * member-only bookings, protected redemption links. Browsing an offer card
   * is never gated by this.
   */
  canUseProtectedPyperPerks: boolean;
  /** Existing history is visible but the account can no longer write. */
  isReadOnly: boolean;
}

/**
 * Approved Phase 2A matrix.
 *
 *                          write   affiliate   protected perks   read-only
 *   preview                 no        no             no             yes
 *   trialing                yes       yes            no             no
 *   method_digital_active   yes       yes            yes            no
 *   pyper_member_active     yes       yes            yes            no
 *   expired_read_only       no        no             no             yes
 */
const CAPABILITIES: Record<EntitlementState, Capabilities> = {
  preview: {
    canBrowse: true,
    canWriteHealthData: false,
    canUseAffiliateLinks: false,
    canUseProtectedPyperPerks: false,
    isReadOnly: true,
  },
  trialing: {
    canBrowse: true,
    canWriteHealthData: true,
    canUseAffiliateLinks: true,
    // Protected Perks stay locked until a trial converts to paid access.
    canUseProtectedPyperPerks: false,
    isReadOnly: false,
  },
  method_digital_active: {
    canBrowse: true,
    canWriteHealthData: true,
    canUseAffiliateLinks: true,
    canUseProtectedPyperPerks: true,
    isReadOnly: false,
  },
  pyper_member_active: {
    canBrowse: true,
    canWriteHealthData: true,
    canUseAffiliateLinks: true,
    canUseProtectedPyperPerks: true,
    isReadOnly: false,
  },
  expired_read_only: {
    canBrowse: true,
    canWriteHealthData: false,
    canUseAffiliateLinks: false,
    canUseProtectedPyperPerks: false,
    isReadOnly: true,
  },
};

export function getCapabilities(state: EntitlementState): Capabilities {
  return CAPABILITIES[state];
}

/** Member-facing description of each state. Used by the Profile tab. */
export const ENTITLEMENT_LABELS: Record<
  EntitlementState,
  { label: string; detail: string }
> = {
  preview: {
    label: 'Preview',
    detail: 'Browsing sample data. Personal tracking is locked.',
  },
  trialing: {
    label: 'Free trial',
    detail: 'Full access to tracking while your 7-day trial is active.',
  },
  method_digital_active: {
    label: 'The PYPER Method member',
    detail: 'Standalone digital membership.',
  },
  pyper_member_active: {
    label: 'PYPER GLP-1 member',
    detail: 'The PYPER Method is included with membership.',
  },
  expired_read_only: {
    label: 'Read-only access',
    detail:
      'Your history remains available, but new entries and protected PYPER Perks are locked.',
  },
};
