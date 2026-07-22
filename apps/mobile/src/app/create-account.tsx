import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { BackAction } from '@/components/ui/back-action';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { Card, SectionHeading } from '@/components/ui/card';
import {
  CheckboxRow,
  FieldGroupLabel,
  FormField,
  InlineError,
} from '@/components/ui/form-field';
import { Screen } from '@/components/ui/screen';
import { StatusBanner } from '@/components/ui/status-banner';
import { useAccess } from '@/features/access/access-context';
import { CREATE_ACCOUNT_COPY, MOCK_AUTH_NOTICE } from '@/features/access/copy';
import { APP_PLAN_CONFIG } from '@/features/access/plans';
import { Spacing } from '@/theme/tokens';

/**
 * Create Account — validated mock form.
 *
 * PRODUCTION: this submits to Supabase Auth. No credential is stored or
 * transmitted here; `createAccount` writes to in-memory state only.
 *
 * Pending-purchase continuity (Phase 2A brief §8):
 *   • Creating an account WITH a pending purchase returns to the purchase
 *     confirmation with the same plan. The trial does not start here.
 *   • Creating an account WITHOUT one creates a Preview account.
 *   • "Already have an account? Sign In" PRESERVES the pending purchase — it
 *     must not call `abandonPurchase`.
 *   • Backing out to Welcome abandons it.
 */
export default function CreateAccountScreen() {
  const {
    createAccount,
    abandonPurchase,
    enterPreview,
    purchasePending,
    pendingPlan,
  } = useAccess();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [legalConfirmed, setLegalConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const validate = () => {
    const next: Record<string, string> = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) next.name = CREATE_ACCOUNT_COPY.errors.name;
    else if (trimmedName.includes('@'))
      next.name = CREATE_ACCOUNT_COPY.errors.nameIsEmail;

    if (!trimmedEmail.includes('@') || trimmedEmail.length < 5)
      next.email = CREATE_ACCOUNT_COPY.errors.email;

    if (password.length < 8) next.password = CREATE_ACCOUNT_COPY.errors.password;

    setErrors(next);

    if (!ageConfirmed || !legalConfirmed) {
      setFormError(CREATE_ACCOUNT_COPY.errors.confirmations);
      return false;
    }

    setFormError('');
    return Object.keys(next).length === 0;
  };

  const onSubmit = () => {
    if (!validate()) return;

    createAccount({ name: name.trim(), email: email.trim().toLowerCase() });

    if (purchasePending) {
      // Return to confirmation. The trial starts only on confirm.
      router.replace('/purchase');
      return;
    }

    // No pending purchase: a new account starts in Preview.
    enterPreview();
    router.replace('/home');
  };

  const backToWelcome = () => {
    abandonPurchase();
    router.replace('/');
  };

  const confirmationsMet = ageConfirmed && legalConfirmed;

  return (
    <Screen scroll keyboardAware>
      <BackAction onPress={backToWelcome} />

      <SectionHeading
        title={CREATE_ACCOUNT_COPY.title}
        detail={CREATE_ACCOUNT_COPY.subtitle}
        style={styles.heading}
      />

      {purchasePending && pendingPlan ? (
        <StatusBanner
          tone="info"
          label={CREATE_ACCOUNT_COPY.pendingNoticeTitle}
          message={`Your ${APP_PLAN_CONFIG[pendingPlan].label} plan is held. You will return to confirmation after creating your account, and your 7-day free trial starts only when you confirm.`}
          style={styles.banner}
        />
      ) : null}

      <FormField
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        error={errors.name}
      />

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
        placeholder="At least 8 characters"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        error={errors.password}
      />

      <FieldGroupLabel>Required confirmations</FieldGroupLabel>

      <CheckboxRow
        required
        checked={ageConfirmed}
        onChange={(next) => {
          setAgeConfirmed(next);
          if (next) setFormError('');
        }}
      >
        {CREATE_ACCOUNT_COPY.ageConfirmation}
      </CheckboxRow>

      <CheckboxRow
        required
        checked={legalConfirmed}
        onChange={(next) => {
          setLegalConfirmed(next);
          if (next) setFormError('');
        }}
      >
        {CREATE_ACCOUNT_COPY.legalConfirmation}
      </CheckboxRow>

      {formError ? (
        <View style={styles.formError}>
          <InlineError>{formError}</InlineError>
        </View>
      ) : null}

      <PrimaryButton
        label={CREATE_ACCOUNT_COPY.submit}
        onPress={onSubmit}
        disabled={!confirmationsMet}
        style={styles.submit}
      />

      <SecondaryButton
        label={CREATE_ACCOUNT_COPY.signInAction}
        // Deliberately does NOT abandon the pending purchase.
        onPress={() => router.replace('/sign-in')}
        style={styles.stacked}
      />

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
  formError: {
    marginTop: Spacing.xs,
  },
  submit: {
    marginTop: 18,
  },
  stacked: {
    marginTop: Spacing.md,
  },
  notice: {
    marginTop: 18,
  },
});
