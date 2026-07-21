export const entitlementStates = [
  'preview',
  'trialing',
  'method_digital_active',
  'pyper_member_active',
  'expired_read_only',
] as const;

export type EntitlementState = (typeof entitlementStates)[number];

export interface EntitlementCapabilities {
  canBrowse: boolean;
  canWriteHealthData: boolean;
  canUseAffiliateLinks: boolean;
  canViewPartnerOffers: boolean;
  canRevealPartnerCodes: boolean;
  canUseProtectedRedemptionLinks: boolean;
}

const capabilities: Record<EntitlementState, EntitlementCapabilities> = {
  preview: {
    canBrowse: true,
    canWriteHealthData: false,
    canUseAffiliateLinks: false,
    canViewPartnerOffers: true,
    canRevealPartnerCodes: false,
    canUseProtectedRedemptionLinks: false,
  },
  trialing: {
    canBrowse: true,
    canWriteHealthData: true,
    canUseAffiliateLinks: true,
    canViewPartnerOffers: true,
    canRevealPartnerCodes: false,
    canUseProtectedRedemptionLinks: false,
  },
  method_digital_active: {
    canBrowse: true,
    canWriteHealthData: true,
    canUseAffiliateLinks: true,
    canViewPartnerOffers: true,
    canRevealPartnerCodes: true,
    canUseProtectedRedemptionLinks: true,
  },
  pyper_member_active: {
    canBrowse: true,
    canWriteHealthData: true,
    canUseAffiliateLinks: true,
    canViewPartnerOffers: true,
    canRevealPartnerCodes: true,
    canUseProtectedRedemptionLinks: true,
  },
  expired_read_only: {
    canBrowse: true,
    canWriteHealthData: false,
    canUseAffiliateLinks: false,
    canViewPartnerOffers: true,
    canRevealPartnerCodes: false,
    canUseProtectedRedemptionLinks: false,
  },
};

export function getEntitlementCapabilities(
  state: EntitlementState
): EntitlementCapabilities {
  return capabilities[state];
}
