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
    <Screen scroll gutter="welcome">
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

      {/* `.welcomeSpacer` — in the prototype this collapses to its 16pt
          min-height at 390x844 and 340x720, because the content fills the
          frame. Natively the frame is taller (no in-app status bar), so a
          growing spacer opened a ~70pt void before the CTA. The gap is pinned
          to the approved 16pt and the slack is absorbed below the disclaimer
          instead, which keeps the editorial-top / anchored-actions reading
          without a void between the membership note and the CTA. */}
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
        <AppText variant="sub" tone="soft" style={styles.signInRow}>
          {WELCOME_COPY.signInPrompt}
          <AppText
            variant="sub"
            tone="accent"
            accessibilityRole="link"
            onPress={() => router.push('/sign-in')}
            style={styles.signInAction}
          >
            {/* Non-breaking space so the action never splits across lines;
                the rendered glyphs are identical to the approved copy. */}
            {WELCOME_COPY.signInAction.replace(' ', '\u00A0')}
          </AppText>
        </AppText>

        <Pressable
          accessibilityRole="link"
          accessibilityLabel={WELCOME_COPY.careAccessibilityLabel}
          onPress={openCare}
          style={({ pressed }) => [styles.careRow, pressed && styles.pressed]}
        >
          {/* One external-link indicator only: the inline arrow on the title.
              The prototype also carries a trailing chevron; it was removed as
              redundant on approver instruction. */}
          <View style={styles.careCopy}>
            <AppText variant="h3" style={styles.careTitle}>
              {WELCOME_COPY.careTitle}{' '}
              <AppText variant="h3" tone="accent">
                ↗
              </AppText>
            </AppText>
          </View>
        </Pressable>

        {/* Approved medical disclaimer — preserved exactly. Do not shorten. */}
        <AppText variant="fine" tone="soft" style={styles.disclaimer}>
          {WELCOME_COPY.disclaimer}
        </AppText>
      </View>

      <View style={styles.tailSpacer} />
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
    // .welcomeSpacer min-height, held exactly.
    height: 16,
    flexGrow: 0,
    flexShrink: 0,
  },
  // Absorbs any leftover viewport height at the end of the page rather than
  // in the middle of the composition.
  tailSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 0,
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
    // .welcomeSignin — margin 14 2 0; 13.5px / 1.4
    marginTop: 14,
    marginHorizontal: 2,
    fontSize: 13.5,
    lineHeight: 18.9,
  },
  signInAction: {
    // .welcomeSignin button — 13.5px / 800 / --med / underline
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
    // .exTitle — 14px / 800 / -.01em
    fontSize: 14,
    letterSpacing: -0.14,
  },
  disclaimer: {
    // .welcomeDisclaimer — max-width 340; margin 12 0 4
    maxWidth: 340,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
});
