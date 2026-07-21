import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { BackAction } from '@/components/ui/back-action';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { Card, SectionHeading } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { useAccess } from '@/features/access/access-context';
import { PLAN_COPY } from '@/features/access/copy';
import {
  APP_PLAN_CONFIG,
  PLAN_LIST,
  START_TRIAL_LABEL,
} from '@/features/access/plans';
import { PlanOption } from '@/features/onboarding/plan-option';
import { Spacing } from '@/theme/tokens';

/**
 * Native plan selection. Annual is selected by default.
 *
 * No billing is connected. Continuing opens the simulated purchase
 * confirmation, which is where the development-only activation lives.
 */
export default function PlanScreen() {
  const { selectedPlan, selectPlan, recordPlanViewed, abandonPurchase } =
    useAccess();

  useEffect(() => {
    recordPlanViewed();
  }, [recordPlanViewed]);

  const goBackToWelcome = () => {
    abandonPurchase();
    router.replace('/');
  };

  return (
    <Screen scroll>
      <BackAction onPress={goBackToWelcome} />

      <SectionHeading
        title={PLAN_COPY.title}
        detail={PLAN_COPY.subtitle}
        style={styles.heading}
      />

      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Choose your plan"
        style={styles.plans}
      >
        {PLAN_LIST.map((plan) => (
          <PlanOption
            key={plan.id}
            plan={plan}
            selected={selectedPlan === plan.id}
            onSelect={() => selectPlan(plan.id)}
          />
        ))}
      </View>

      <Card style={styles.block}>
        <AppText variant="mono" tone="muted">
          {PLAN_COPY.includedLabel}
        </AppText>
        <AppText variant="sub" style={styles.included}>
          {PLAN_COPY.included}
        </AppText>
      </Card>

      <AppText variant="micro" tone="soft" style={styles.note}>
        {PLAN_COPY.exclusions}
      </AppText>

      <AppText variant="bodyStrong" tone="soft" style={styles.note}>
        {PLAN_COPY.includedWithMembership}
      </AppText>

      <PrimaryButton
        label={START_TRIAL_LABEL}
        onPress={() => router.push('/purchase')}
        style={styles.block}
      />

      {/* Required billing transparency for the selected plan. Verbatim. */}
      <AppText variant="sub" tone="soft" style={styles.transparency}>
        {APP_PLAN_CONFIG[selectedPlan].transparency}
      </AppText>

      <AppText variant="micro" tone="soft" style={styles.note}>
        {PLAN_COPY.deletionNote}
      </AppText>

      <SecondaryButton
        label={PLAN_COPY.restore}
        accessibilityHint={PLAN_COPY.restoreUnavailable}
        onPress={() => undefined}
        disabled
        style={styles.block}
      />
      <AppText variant="micro" tone="soft" style={styles.note}>
        {PLAN_COPY.restoreUnavailable}
      </AppText>

      <SecondaryButton
        label={PLAN_COPY.signInAction}
        // The selected plan is preserved on the access state, so signing in
        // here returns to the same choice.
        onPress={() => router.push('/sign-in')}
        style={styles.block}
      />
      <SecondaryButton
        label={PLAN_COPY.createAction}
        onPress={() => router.push('/create-account')}
        style={styles.stacked}
      />

      <AppText variant="micro" tone="soft" style={styles.footer}>
        {PLAN_COPY.footer}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop: Spacing.lg,
  },
  plans: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  block: {
    marginTop: Spacing.lg,
  },
  stacked: {
    marginTop: Spacing.md,
  },
  included: {
    marginTop: Spacing.sm,
    lineHeight: 21,
  },
  note: {
    marginTop: Spacing.sm,
    marginHorizontal: 2,
  },
  transparency: {
    marginTop: Spacing.md,
    marginHorizontal: 2,
    lineHeight: 19,
  },
  footer: {
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
});
