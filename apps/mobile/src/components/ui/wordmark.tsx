import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, View } from 'react-native';

import { AppText } from './app-text';

import { BRAND } from '@/features/access/copy';
import { Colors, Radius, Spacing } from '@/theme/tokens';

export interface WordmarkProps {
  /** `hero` is the Welcome treatment; `compact` is for headers and cards. */
  size?: 'hero' | 'compact';
}

/**
 * "The PYPER / Method." — the period carries the Steel accent.
 *
 * The wordmark is one accessible element reading "The PYPER Method" so screen
 * readers do not announce the line break or the decorative period.
 */
export function Wordmark({ size = 'hero' }: WordmarkProps) {
  if (size === 'compact') {
    return (
      <AppText
        variant="h3"
        accessibilityRole="header"
        accessibilityLabel="The PYPER Method"
      >
        {BRAND.wordmarkLineOne} {BRAND.wordmarkLineTwo}
        <AppText variant="h3" tone="accent">
          .
        </AppText>
      </AppText>
    );
  }

  return (
    <AppText
      variant="display"
      accessibilityRole="header"
      accessibilityLabel="The PYPER Method"
      // The prototype keeps "The PYPER" on one line and never wraps it.
      style={styles.hero}
    >
      {BRAND.wordmarkLineOne}
      {'\n'}
      {BRAND.wordmarkLineTwo}
      <AppText variant="display" tone="accent">
        .
      </AppText>
    </AppText>
  );
}

/**
 * Lock glyph chip used beside gated copy. Always paired with text — it is
 * reinforcement, never the sole signal.
 */
export function LockGlyph({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.lockChip,
        tone === 'dark' ? styles.lockChipDark : styles.lockChipLight,
      ]}
    >
      <Feather
        name="lock"
        size={13}
        color={tone === 'dark' ? Colors.onEspresso : Colors.espresso}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    // .welcomeTitleLine sets `white-space: nowrap`; the explicit break below
    // reproduces it so "The PYPER" can never wrap.
    includeFontPadding: false,
  },
  lockChip: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  lockChipLight: {
    backgroundColor: Colors.lockChip,
  },
  lockChipDark: {
    backgroundColor: Colors.espresso,
  },
});
