import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { SecondaryButton } from '@/components/ui/buttons';
import { Card, Rule } from '@/components/ui/card';
import { useAccess } from '@/features/access/access-context';
import {
  ENTITLEMENT_LABELS,
  ENTITLEMENT_STATES,
  type EntitlementState,
} from '@/features/access/entitlements';
import { APP_PLAN_CONFIG } from '@/features/access/plans';
import { TabPlaceholder } from '@/features/onboarding/tab-placeholder';
import { Colors, Radius, Spacing } from '@/theme/tokens';

/**
 * Profile — account, access status, and the isolated development controls.
 */
export default function ProfileTab() {
  const {
    entitlement,
    account,
    selectedPlan,
    trialEndsAt,
    capabilities,
    events,
    setEntitlement,
    signOut,
  } = useAccess();

  const status = entitlement ? ENTITLEMENT_LABELS[entitlement] : null;

  return (
    <TabPlaceholder
      eyebrow="Account"
      title="Your profile"
      detail="Access status, membership, privacy controls, and your PYPER intake profile."
      sections={[
        'Membership and access',
        'Privacy and data',
        'Reminders',
        'Legal documents',
        'Contact support',
      ]}
    >
      <Card style={styles.card}>
        <AppText variant="mono" tone="muted">
          Access status
        </AppText>

        {status ? (
          <>
            <AppText variant="h3" style={styles.statusLabel}>
              {status.label}
            </AppText>
            <AppText variant="sub" tone="soft" style={styles.statusDetail}>
              {status.detail}
            </AppText>
          </>
        ) : null}

        <Rule style={styles.rule} />

        <DetailRow label="Account" value={account?.email || 'Not signed in'} />
        <DetailRow label="Plan" value={APP_PLAN_CONFIG[selectedPlan].label} />
        {trialEndsAt ? (
          <DetailRow label="Trial ends" value={trialEndsAt} />
        ) : null}
        <DetailRow
          label="Personal entries"
          value={capabilities.canWriteHealthData ? 'Unlocked' : 'Locked'}
        />
        <DetailRow
          label="PYPER Perks"
          value={capabilities.canUseProtectedPyperPerks ? 'Unlocked' : 'Locked'}
        />
      </Card>

      <SecondaryButton
        label="Sign out"
        onPress={() => {
          signOut();
          router.replace('/');
        }}
        style={styles.signOut}
      />

      {/*
        DEVELOPMENT ONLY. Stripped from production builds by the __DEV__ guard.
        This exists so the five entitlement states can be exercised without a
        backend; it is not a member-facing control and must never ship.
      */}
      {__DEV__ ? (
        <Card tone="muted" style={styles.devCard}>
          <AppText variant="mono" tone="alert">
            Development simulation · not member facing
          </AppText>
          <AppText variant="micro" tone="soft" style={styles.devNote}>
            Switch entitlement state to verify access routing. Replaced by
            RevenueCat plus the PYPER membership record in production.
          </AppText>

          {/*
            The local event log. Verifies that a rapid double activation
            produces exactly one `trial_started` entry.
          */}
          <View style={styles.devEvents}>
            <AppText variant="mono" tone="muted">
              Local events ({events.length})
            </AppText>
            {events.map((event, index) => (
              <AppText
                key={`${event.name}-${event.at}-${index}`}
                variant="micro"
                tone="soft"
                testID={`event-${event.name}`}
              >
                {event.name}
                {event.plan ? ` · ${event.plan}` : ''}
              </AppText>
            ))}
          </View>

          <View style={styles.devRow}>
            {ENTITLEMENT_STATES.map((state: EntitlementState) => {
              const active = entitlement === state;
              return (
                <Pressable
                  key={state}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active, checked: active }}
                  aria-checked={active}
                  accessibilityLabel={`Simulate ${state}`}
                  onPress={() => setEntitlement(state)}
                  style={[styles.devChip, active && styles.devChipActive]}
                >
                  <AppText
                    variant="micro"
                    tone={active ? 'onEspresso' : 'default'}
                  >
                    {state}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </Card>
      ) : null}
    </TabPlaceholder>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={styles.detailRow}
    >
      <AppText variant="sub" tone="muted">
        {label}
      </AppText>
      <AppText variant="bodyStrong" style={styles.detailValue}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: Spacing.xl,
  },
  statusLabel: {
    marginTop: Spacing.sm,
  },
  statusDetail: {
    marginTop: Spacing.xs,
  },
  rule: {
    marginVertical: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.lg,
    paddingVertical: 6,
  },
  detailValue: {
    flexShrink: 1,
    textAlign: 'right',
  },
  signOut: {
    marginTop: Spacing.lg,
  },
  devCard: {
    marginTop: Spacing.xxl,
    borderColor: Colors.errorBorder,
  },
  devNote: {
    marginTop: Spacing.sm,
  },
  devEvents: {
    marginTop: Spacing.md,
    gap: 2,
  },
  devRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  devChip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 36,
    justifyContent: 'center',
  },
  devChipActive: {
    backgroundColor: Colors.espresso,
    borderColor: Colors.espresso,
  },
});
