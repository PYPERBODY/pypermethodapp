import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppText } from './app-text';

import { Colors, Radius, Spacing, TouchTarget } from '@/theme/tokens';

/**
 * Buttons reproduce the prototype's `.btn` family:
 *
 *   .btn      background --gph, colour #F7F6F2, radius 999, min-height 44,
 *             padding 12/20, font-size 14, font-weight 700
 *   .btn.sec  transparent with a 1px --line border
 *
 * Individual prototype CTAs raise the height inline (52 on most primary
 * actions, 58 on the Welcome hero pair); `size` reproduces that.
 */
type BaseProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Shows a spinner and announces the control as busy. */
  busy?: boolean;
  size?: 'base' | 'action' | 'hero';
  style?: StyleProp<ViewStyle>;
  /** Renders for placement on an Espresso surface. */
  onEspresso?: boolean;
};

function useButtonA11y(disabled?: boolean, busy?: boolean) {
  return {
    accessibilityRole: 'button' as const,
    accessibilityState: { disabled: !!disabled || !!busy, busy: !!busy },
    // Explicit ARIA for react-native-web, which does not derive these from
    // `accessibilityState`.
    'aria-disabled': !!disabled || !!busy,
    'aria-busy': !!busy,
    disabled: !!disabled || !!busy,
  };
}

function sizeStyle(size: BaseProps['size']) {
  if (size === 'hero') return styles.hero;
  if (size === 'action') return styles.action;
  return styles.base;
}

/** Espresso pill — the single primary action on a screen. `.btn` */
export function PrimaryButton({
  label,
  onPress,
  disabled,
  busy,
  size = 'action',
  style,
  onEspresso,
  ...rest
}: BaseProps) {
  return (
    <Pressable
      onPress={onPress}
      {...useButtonA11y(disabled, busy)}
      {...rest}
      style={({ pressed }) => [
        styles.shell,
        sizeStyle(size),
        onEspresso ? styles.primaryOnEspresso : styles.primary,
        (disabled || busy) && styles.dimmed,
        pressed && !disabled && !busy && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        {busy ? (
          <ActivityIndicator
            size="small"
            color={onEspresso ? Colors.espresso : Colors.onEspresso}
          />
        ) : null}
        <AppText
          variant="button"
          tone={onEspresso ? 'default' : 'onEspresso'}
          style={styles.centered}
        >
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

/** Outlined pill — an equal-weight alternative action. `.btn.sec` */
export function SecondaryButton({
  label,
  onPress,
  disabled,
  busy,
  size = 'base',
  style,
  onEspresso,
  ...rest
}: BaseProps) {
  return (
    <Pressable
      onPress={onPress}
      {...useButtonA11y(disabled, busy)}
      {...rest}
      style={({ pressed }) => [
        styles.shell,
        sizeStyle(size),
        onEspresso ? styles.secondaryOnEspresso : styles.secondary,
        (disabled || busy) && styles.dimmed,
        pressed && !disabled && !busy && styles.pressed,
        style,
      ]}
    >
      <AppText
        variant="button"
        tone={onEspresso ? 'onEspresso' : 'default'}
        style={styles.centered}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

/**
 * The Welcome "Explore the app" treatment: canvas fill with a 1.5px Espresso
 * outline, so it reads as a full-weight alternative rather than a quiet link.
 */
export function OutlineButton({
  label,
  onPress,
  disabled,
  size = 'hero',
  style,
  ...rest
}: BaseProps) {
  return (
    <Pressable
      onPress={onPress}
      {...useButtonA11y(disabled, false)}
      {...rest}
      style={({ pressed }) => [
        styles.shell,
        sizeStyle(size),
        styles.outline,
        disabled && styles.dimmed,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <AppText variant="button" style={styles.centered}>
        {label}
      </AppText>
    </Pressable>
  );
}

export interface TextActionProps {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  tone?: 'accent' | 'muted';
  style?: StyleProp<ViewStyle>;
}

/** Inline text action. `.consentlink` — 700, underlined, Steel accent. */
export function TextAction({
  label,
  onPress,
  accessibilityLabel,
  tone = 'accent',
  style,
}: TextActionProps) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [styles.textAction, pressed && styles.pressed, style]}
    >
      <AppText variant="sub" tone={tone} style={styles.underlined}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: 'center',
    justifyContent: 'center',
    // .btn padding 12px 20px
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    width: '100%',
  },
  base: {
    minHeight: TouchTarget.min,
    borderRadius: Radius.pill,
  },
  action: {
    minHeight: TouchTarget.action,
    borderRadius: Radius.pill,
  },
  hero: {
    minHeight: TouchTarget.hero,
    // The Welcome hero pair uses a 20pt radius, not a full pill.
    borderRadius: Radius.xl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  centered: {
    textAlign: 'center',
  },
  primary: {
    backgroundColor: Colors.espresso,
  },
  primaryOnEspresso: {
    backgroundColor: Colors.onEspresso,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryOnEspresso: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.onEspressoBorder,
  },
  outline: {
    backgroundColor: Colors.bg,
    borderWidth: 1.5,
    borderColor: Colors.espresso,
  },
  dimmed: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.75,
  },
  textAction: {
    alignSelf: 'flex-start',
  },
  underlined: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
