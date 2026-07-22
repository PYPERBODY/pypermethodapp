import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { BackAction } from '@/components/ui/back-action';
import {
  PrimaryButton,
  SecondaryButton,
  TextAction,
} from '@/components/ui/buttons';
import { Card, SectionHeading } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Screen } from '@/components/ui/screen';
import { StatusBanner } from '@/components/ui/status-banner';
import { useAccess } from '@/features/access/access-context';
import {
  MOCK_AUTH_NOTICE,
  PLAN_COPY,
  SIGN_IN_COPY,
} from '@/features/access/copy';
import { APP_PLAN_CONFIG } from '@/features/access/plans';
import { Spacing } from '@/theme/tokens';

/**
 * Sign In — validated mock form.
 *
 * PRODUCTION: this submits to Supabase Auth. No credential is stored or
 * transmitted here.
 *
 * Pending-purchase continuity (Phase 2A brief §8): signing in WITH a pending
 * purchase returns to the same purchase confirmation with the same plan. It
 * must not drop the member into Preview and must not start the trial. A normal
 * sign-in without a pending purchase behaves normally.
 */
export default function SignInScreen() {
  const { signIn, abandonPurchase, purchasePending, pendingPlan } = useAccess();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [supportShown, setSupportShown] = useState(false);

  const onSubmit = () => {
    const next: Record<string, string> = {};
    const trimmed = email.trim();

    if (!trimmed.includes('@') || trimmed.length < 5)
      next.email = SIGN_IN_COPY.errors.email;
    if (!password) next.password = SIGN_IN_COPY.errors.password;

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    signIn({ name: '', email: trimmed.toLowerCase() });

    if (purchasePending) {
      router.replace('/purchase');
      return;
    }

    router.replace('/home');
  };

  const backToWelcome = () => {
    abandonPurchase();
    router.replace('/');
  };

  return (
    <Screen scroll keyboardAware>
      <BackAction onPress={backToWelcome} />

      <SectionHeading
        title={SIGN_IN_COPY.title}
        detail={SIGN_IN_COPY.subtitle}
        style={styles.heading}
      />

      {purchasePending && pendingPlan ? (
        <StatusBanner
          tone="info"
          label="Your plan is saved"
          message={`Your ${APP_PLAN_CONFIG[pendingPlan].label} plan is held. You will return to confirmation after signing in, and your 7-day free trial starts only when you confirm.`}
          style={styles.banner}
        />
      ) : null}

      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        error={errors.email}
      />

      <FormField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Your password"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        error={errors.password}
      />

      <PrimaryButton
        label={SIGN_IN_COPY.submit}
        onPress={onSubmit}
        style={styles.submit}
      />

      {/*
        The access paths are kept visually distinct so no member is left
        thinking a clinical membership is the only way in.
      */}
      <Card tone="muted" style={styles.accessNote}>
        <AppText variant="sub" style={styles.accessNoteText}>
          {SIGN_IN_COPY.accessNote}
        </AppText>
      </Card>

      <SecondaryButton
        label={SIGN_IN_COPY.createAction}
        onPress={() => router.replace('/create-account')}
        style={styles.stacked}
      />

      <SecondaryButton
        label={SIGN_IN_COPY.restore}
        accessibilityHint={PLAN_COPY.restoreUnavailable}
        onPress={() => undefined}
        disabled
        style={styles.stacked}
      />
      <AppText variant="micro" tone="soft" style={styles.restoreNote}>
        {PLAN_COPY.restoreUnavailable}
      </AppText>

      <View style={styles.supportRow}>
        <AppText variant="micro" tone="soft">
          {SIGN_IN_COPY.supportPrompt}
        </AppText>
        <TextAction
          label={SIGN_IN_COPY.supportAction}
          onPress={() => setSupportShown(true)}
        />
      </View>
      {supportShown ? (
        <AppText variant="micro" tone="soft" style={styles.supportDetail}>
          {SIGN_IN_COPY.supportDetail}
        </AppText>
      ) : null}

      <Card tone="muted" style={styles.notice}>
        <AppText variant="micro" tone="soft">
          {MOCK_AUTH_NOTICE}
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop: 14,
  },
  banner: {
    marginTop: 14,
  },
  submit: {
    marginTop: 18,
  },
  accessNote: {
    marginTop: 18,
  },
  stacked: {
    marginTop: Spacing.md,
  },
  accessNoteText: {
    fontWeight: '600',
    lineHeight: 18.6,
  },
  restoreNote: {
    marginTop: Spacing.sm,
    marginHorizontal: 2,
  },
  supportRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  supportDetail: {
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  notice: {
    marginTop: 18,
  },
});
