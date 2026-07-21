import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from './app-text';

import { Colors, Radius, Spacing } from '@/theme/tokens';

export type BannerTone = 'info' | 'locked' | 'caution';

export interface StatusBannerProps {
  tone?: BannerTone;
  /** Short status word. Carries the meaning that colour must not carry alone. */
  label: string;
  message: string;
  style?: StyleProp<ViewStyle>;
}

const ICONS: Record<BannerTone, keyof typeof Feather.glyphMap> = {
  info: 'info',
  locked: 'lock',
  caution: 'alert-triangle',
};

/**
 * Status / banner treatment for preview, read-only and caution states.
 *
 * Accessibility: the tone is always accompanied by an icon and an explicit
 * text label, so locked status is never communicated by colour alone. The
 * whole banner is a single accessible element with `alert` semantics.
 */
export function StatusBanner({
  tone = 'info',
  label,
  message,
  style,
}: StatusBannerProps) {
  return (
    <View
      accessible
      accessibilityRole="alert"
      accessibilityLabel={`${label}. ${message}`}
      style={[styles.banner, toneStyles[tone], style]}
    >
      <Feather
        name={ICONS[tone]}
        size={16}
        color={tone === 'caution' ? Colors.alert : Colors.text}
        style={styles.icon}
      />
      <View style={styles.copy}>
        <AppText variant="mono" tone={tone === 'caution' ? 'alert' : 'muted'}>
          {label}
        </AppText>
        <AppText variant="sub" tone="soft" style={styles.message}>
          {message}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  icon: {
    marginTop: 2,
  },
  copy: {
    flex: 1,
  },
  message: {
    marginTop: 3,
  },
});

const toneStyles = StyleSheet.create({
  info: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.border,
  },
  locked: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.planSelectedBorder,
  },
  caution: {
    backgroundColor: Colors.errorSurface,
    borderColor: Colors.errorBorder,
  },
});
