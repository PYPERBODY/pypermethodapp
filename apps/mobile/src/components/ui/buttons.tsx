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

type BaseProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Shows a spinner and announces the control as busy. */
  busy?: boolean;
  /** Height floor. Welcome's hero actions use `hero` (58). */
  size?: 'action' | 'hero';
  style?: StyleProp<ViewStyle>;
  /** Renders for placement on an Espresso surface. */
  onEspresso?: boolean;
};

function useButtonA11y(disabled: boolean | undefined, busy: boolean | undefined) {
  return {
    accessibilityRole: 'button' as const,
    // Announced by screen readers rather than being conveyed by opacity alone.
    accessibilityState: { disabled: !!disabled || !!busy, busy: !!busy },
    // Explicit ARIA for react-native-web, which does not derive these from
    // `accessibilityState`.
    'aria-disabled': !!disabled || !!busy,
    'aria-busy': !!busy,
    disabled: !!disabled || !!busy,
  };
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
  const a11y = useButtonA11y(disabled, busy);

  return (
    <Pressable
      onPress={onPress}
      {...a11y}
      {...rest}
      style={({ pressed }) => [
        styles.base,
        size === 'hero' ? styles.hero : styles.action,
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
          style={styles.centeredLabel}
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
  size = 'action',
  style,
  onEspresso,
  ...rest
}: BaseProps) {
  const a11y = useButtonA11y(disabled, busy);

  return (
    <Pressable
      onPress={onPress}
      {...a11y}
      {...rest}
      style={({ pressed }) => [
        styles.base,
        size === 'hero' ? styles.hero : styles.action,
        onEspresso ? styles.secondaryOnEspresso : styles.secondary,
        (disabled || busy) && styles.dimmed,
        pressed && !disabled && !busy && styles.pressed,
        style,
      ]}
    >
      <AppText
        variant="button"
        tone={onEspresso ? 'onEspresso' : 'default'}
        style={styles.centeredLabel}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

/**
 * The Welcome screen's "Explore the app" treatment: canvas fill with a 1.5px
 * Espresso outline, so it reads as a full-weight alternative rather than a
 * quiet link.
 */
export function OutlineButton({
  label,
  onPress,
  disabled,
  size = 'hero',
  style,
  ...rest
}: BaseProps) {
  const a11y = useButtonA11y(disabled, false);

  return (
    <Pressable
      onPress={onPress}
      {...a11y}
      {...rest}
      style={({ pressed }) => [
        styles.base,
        size === 'hero' ? styles.hero : styles.action,
        styles.outline,
        disabled && styles.dimmed,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <AppText variant="button" style={styles.centeredLabel}>
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

/**
 * Inline text action (the Welcome "Sign in" link, "Contact Support").
 * Padded to keep a usable touch target without visually inflating the text.
 */
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
      hitSlop={8}
      style={({ pressed }) => [
        styles.textAction,
        pressed && styles.pressed,
        style,
      ]}
    >
      <AppText variant="bodyStrong" tone={tone} style={styles.underlined}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    width: '100%',
  },
  action: {
    minHeight: TouchTarget.action,
    borderRadius: Radius.pill,
  },
  hero: {
    minHeight: TouchTarget.hero,
    // The Welcome hero actions use a 20pt radius, not a full pill.
    borderRadius: Radius.xl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  centeredLabel: {
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
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.75,
  },
  textAction: {
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
  },
  underlined: {
    textDecorationLine: 'underline',
  },
});
