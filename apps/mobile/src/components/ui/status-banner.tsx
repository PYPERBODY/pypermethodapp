import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from './app-text';

import { Colors, Radius, Spacing } from '@/theme/tokens';

export type BannerTone = 'locked' | 'info' | 'caution';

export interface StatusBannerProps {
  tone?: BannerTone;
  /** Short status key. Carries the meaning colour must not carry alone. */
  label: string;
  message: string;
  style?: StyleProp<ViewStyle>;
}

const ICONS: Record<BannerTone, keyof typeof Feather.glyphMap> = {
  locked: 'lock',
  info: 'info',
  caution: 'alert-triangle',
};

/**
 * Status banner. Reproduces the prototype's `.pvban`:
 *
 *   .pvban       --gph fill, #f4f3ef text, radius 14, padding 10/12, gap 10
 *   .pvban .pk   mono 8px, .16em, 700
 *   .pvban .pm   10.5px / 1.35, #d9d6cf
 *
 * This is a compact dark strip, not a large card — it must never read as a
 * headline. `caution` keeps the light alert surface for red-flag messaging.
 *
 * Accessibility: one accessible element with `alert` semantics, and the tone is
 * always paired with an icon and an explicit text key.
 */
export function StatusBanner({
  tone = 'locked',
  label,
  message,
  style,
}: StatusBannerProps) {
  const onDark = tone !== 'caution';

  return (
    <View
      accessible
      accessibilityRole="alert"
      accessibilityLabel={`${label}. ${message}`}
      style={[styles.banner, onDark ? styles.dark : styles.caution, style]}
    >
      <Feather
        name={ICONS[tone]}
        size={13}
        color={onDark ? Colors.onEspresso : Colors.alert}
        style={styles.icon}
      />
      <View style={styles.copy}>
        <AppText
          variant="bannerKey"
          tone={onDark ? 'onEspresso' : 'alert'}
        >
          {label}
        </AppText>
        <AppText
          variant="bannerBody"
          tone={onDark ? 'onEspressoSoft' : 'alert'}
          style={styles.message}
        >
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
    gap: 10,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  dark: {
    backgroundColor: Colors.espresso,
  },
  caution: {
    backgroundColor: Colors.errorSurface,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
  },
  icon: {
    marginTop: 1,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  message: {
    marginTop: 3,
  },
});
