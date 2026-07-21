import Feather from '@expo/vector-icons/Feather';
import { Redirect, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { OutlineButton, PrimaryButton } from '@/components/ui/buttons';
import { Screen } from '@/components/ui/screen';
import { Wordmark } from '@/components/ui/wordmark';
import { useAccess } from '@/features/access/access-context';
import { WELCOME_COPY } from '@/features/access/copy';
import { Colors, Spacing, TouchTarget } from '@/theme/tokens';

/**
 * Approved public Welcome screen.
 *
 * This screen is visually approved and must not be redesigned. Colours,
 * spacing, type hierarchy and button treatment are derived from
 * `.welcomeScreen` and its child rules in the approved prototype
 * (`.migration-source/ThePyperMethod_v2.jsx`, CSS lines 307–329, JSX lines
 * 2628–2657). The composition is editorial-top / flexible-spacer /
 * anchored-actions, so every primary decision stays visible at 390 × 844 and
 * scrolls only slightly at 340 × 720.
 */
export default function WelcomeScreen() {
  const { isSignedIn, purchasePending, abandonPurchase, enterPreview } =
    useAccess();

  // A member who already has access never sits on the public Welcome screen —
  // unless a purchase is mid-flight, which owns its own navigation.
  if (isSignedIn && !purchasePending) {
    return <Redirect href="/home" />;
  }

  const openCare = () => {
    WebBrowser.openBrowserAsync(WELCOME_COPY.careUrl);
  };

  const explore = () => {
    // Abandoning first guarantees "Explore the app" works normally after a
    // half-finished purchase (Phase 2A brief §10).
    abandonPurchase();
    enterPreview();
    router.replace('/home');
  };

  return (
    <Screen scroll>
      <Wordmark />

      <AppText variant="lead" style={styles.lead}>
        {WELCOME_COPY.headline}
      </AppText>

      <AppText variant="body" tone="soft" style={styles.description}>
        {WELCOME_COPY.supporting}
      </AppText>

      <View style={styles.included}>
        <Feather
          name="lock"
          size={16}
          color={Colors.accent}
          style={styles.includedIcon}
        />
        <AppText variant="bodyStrong" style={styles.includedCopy}>
          {WELCOME_COPY.membershipNote}
        </AppText>
      </View>

      {/* Flexible spacer: anchors the actions to the bottom on tall screens
          and collapses to a 16pt gap on short ones. */}
      <View style={styles.spacer} />

      <View>
        <PrimaryButton
          size="hero"
          label={WELCOME_COPY.primaryCta}
          onPress={() => router.push('/plan')}
        />

        <AppText variant="micro" tone="soft" style={styles.trialMicro}>
          {WELCOME_COPY.trialMicrocopy}
        </AppText>

        <OutlineButton
          size="hero"
          label={WELCOME_COPY.exploreCta}
          accessibilityLabel={WELCOME_COPY.exploreAccessibilityLabel}
          onPress={explore}
          style={styles.exploreButton}
        />

        {/* One inline text flow, as in the prototype — the action must not
            break onto its own line. */}
        <AppText variant="bodyStrong" tone="soft" style={styles.signInRow}>
          {WELCOME_COPY.signInPrompt}
          <AppText
            variant="bodyStrong"
            tone="accent"
            accessibilityRole="link"
            onPress={() => router.push('/sign-in')}
            style={styles.signInAction}
          >
            {WELCOME_COPY.signInAction}
          </AppText>
        </AppText>

        <Pressable
          accessibilityRole="link"
          accessibilityLabel={WELCOME_COPY.careAccessibilityLabel}
          onPress={openCare}
          style={({ pressed }) => [styles.careRow, pressed && styles.pressed]}
        >
          <View style={styles.careCopy}>
            <AppText variant="bodyStrong" style={styles.careTitle}>
              {WELCOME_COPY.careTitle}{' '}
              <AppText variant="bodyStrong" tone="accent">
                ↗
              </AppText>
            </AppText>
            <AppText variant="micro" tone="soft" style={styles.careDetail}>
              {WELCOME_COPY.careCopy}
            </AppText>
          </View>
          <Feather name="chevron-right" size={20} color={Colors.accent} />
        </Pressable>

        {/* Approved medical disclaimer — preserved exactly. Do not shorten. */}
        <AppText variant="micro" tone="soft" style={styles.disclaimer}>
          {WELCOME_COPY.disclaimer}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    maxWidth: 350,
    marginTop: 18,
  },
  description: {
    maxWidth: 350,
    marginTop: 10,
  },
  included: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    maxWidth: 350,
    marginTop: 14,
  },
  includedIcon: {
    marginTop: 1,
  },
  includedCopy: {
    flex: 1,
  },
  spacer: {
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 16,
  },
  trialMicro: {
    maxWidth: 350,
    marginTop: Spacing.sm,
    marginHorizontal: 2,
  },
  exploreButton: {
    marginTop: 14,
  },
  signInRow: {
    marginTop: 14,
    marginHorizontal: 2,
    fontSize: 13.5,
    lineHeight: 19,
  },
  signInAction: {
    fontSize: 13.5,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  careRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
    paddingTop: 13,
    paddingBottom: 11,
    paddingHorizontal: 2,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    minHeight: TouchTarget.min,
  },
  careCopy: {
    flex: 1,
  },
  careTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  careDetail: {
    fontSize: 12,
    marginTop: 2,
  },
  disclaimer: {
    maxWidth: 340,
    marginTop: Spacing.md,
    fontSize: 11,
  },
  pressed: {
    opacity: 0.7,
  },
});
