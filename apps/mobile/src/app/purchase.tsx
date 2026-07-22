import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { Rule } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { useAccess } from '@/features/access/access-context';
import { PURCHASE_COPY } from '@/features/access/copy';
import { APP_PLAN_CONFIG } from '@/features/access/plans';
import { Colors, Radius, Spacing } from '@/theme/tokens';

/**
 * Simulated purchase confirmation.
 *
 * DEVELOPMENT SIMULATION ONLY. Nothing here touches a payment system. The
 * screen is labelled as a simulation throughout so it can never be mistaken
 * for a real App Store or Google Play transaction.
 *
 * PRODUCTION: replace `confirmTrial()` with Apple StoreKit (iOS) and Google
 * Play Billing (Android), and derive the entitlement from the verified
 * receipt rather than from local state.
 */
export default function PurchaseScreen() {
  const {
    selectedPlan,
    account,
    purchasePending,
    confirmProcessing,
    confirmTrial,
    abandonPurchase,
  } = useAccess();

  const plan = APP_PLAN_CONFIG[selectedPlan];

  const onConfirm = () => {
    const result = confirmTrial();

    if (result.status === 'needs-account') {
      // The plan and the pending-purchase flag are preserved; the member
      // returns here after creating an account (or signing in).
      router.replace('/create-account');
      return;
    }

    if (result.status === 'started') {
      router.replace('/home');
    }

    // 'ignored' — a duplicate activation was swallowed by the synchronous
    // latch. Deliberately does nothing: no second navigation, no second event.
  };

  const onCancel = () => {
    abandonPurchase();
    router.back();
  };

  return (
    // Porcelain screen with an inset Espresso card, matching the prototype's
    // purchase view (`.migration-source/ThePyperMethod_v2.jsx` line 2779:
    // background #171717, border-radius 24, padding 22/20, margin-top 6, sitting
    // inside the 20pt scroll gutter plus the 4pt onboarding inset).
    <Screen scroll>
      <View style={styles.sheet}>
      <AppText variant="bannerKey" tone="onEspressoMuted" style={styles.eyebrow}>
        {PURCHASE_COPY.eyebrow}
      </AppText>

      <AppText
        variant="h2"
        tone="onEspresso"
        accessibilityRole="header"
        style={styles.title}
      >
        {PURCHASE_COPY.title}
      </AppText>
      <AppText variant="sub" tone="onEspressoSoft" style={styles.subtitle}>
        {PURCHASE_COPY.subtitle}
      </AppText>

      <Rule style={styles.rule} />

      <SummaryRow label={PURCHASE_COPY.planLabel} value={plan.label} />
      <SummaryRow label={PURCHASE_COPY.priceLabel} value={plan.priceLine} />
      <SummaryRow label={PURCHASE_COPY.renewsLabel} value={plan.renewsLine} />

      <AppText variant="sub" tone="onEspressoSoft" style={styles.trialNote}>
        {PURCHASE_COPY.trialNote}
      </AppText>

      <SummaryRow
        label={PURCHASE_COPY.accountLabel}
        value={account?.email ?? PURCHASE_COPY.accountMissing}
      />

      {!account && purchasePending ? (
        <AppText variant="sub" tone="onEspresso" style={styles.pending}>
          {PURCHASE_COPY.needsAccount}
        </AppText>
      ) : null}

      <PrimaryButton
        onEspresso
        label={
          confirmProcessing
            ? PURCHASE_COPY.confirmProcessing
            : PURCHASE_COPY.confirm
        }
        busy={confirmProcessing}
        onPress={onConfirm}
        style={styles.confirm}
      />

      <SecondaryButton
        onEspresso
        label={PURCHASE_COPY.cancel}
        onPress={onCancel}
        disabled={confirmProcessing}
        style={styles.cancel}
      />

      <AppText variant="micro" tone="onEspressoSoft" style={styles.footnote}>
        {PURCHASE_COPY.simulationNote}
      </AppText>
      </View>
    </Screen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={styles.summaryRow}
    >
      <AppText variant="sub" tone="onEspressoMuted">
        {label}
      </AppText>
      <AppText
        variant="sub"
        tone="onEspresso"
        style={styles.summaryValue}
        numberOfLines={2}
      >
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: Colors.espresso,
    borderRadius: Radius.sheet,
    paddingVertical: 22,
    paddingHorizontal: Spacing.xl,
    marginTop: 6,
    marginHorizontal: 4,
  },
  eyebrow: {
    letterSpacing: 1.36,
  },
  subtitle: {
    marginTop: 2,
  },
  title: {
    marginTop: Spacing.md,
  },
  rule: {
    backgroundColor: Colors.onEspressoRule,
    marginVertical: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.lg,
    paddingVertical: 5,
  },
  summaryValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontWeight: '700',
  },
  trialNote: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    lineHeight: 19,
  },
  pending: {
    marginTop: Spacing.md,
  },
  confirm: {
    marginTop: Spacing.lg,
  },
  cancel: {
    marginTop: Spacing.md,
  },
  footnote: {
    marginTop: Spacing.lg,
    lineHeight: 17,
  },
});
