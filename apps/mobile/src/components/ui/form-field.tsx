import Feather from '@expo/vector-icons/Feather';
import { useId, useState, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { AppText } from './app-text';

import { Colors, Radius, Spacing, TouchTarget } from '@/theme/tokens';

export interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  /** Inline validation message. Rendered with an icon, never colour alone. */
  error?: string;
  /** Supporting hint shown under the label. */
  hint?: string;
}

/**
 * Labelled text input.
 *
 * Accessibility: the visible label is bound to the input via
 * `accessibilityLabel`, and any error is appended to the field's accessible
 * value so screen readers announce it in the same breath as the field.
 */
export function FormField({
  label,
  error,
  hint,
  ...inputProps
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  const inputId = useId();

  return (
    <View style={styles.field}>
      <AppText variant="mono" tone="muted" nativeID={`${inputId}-label`}>
        {label}
      </AppText>
      {hint ? (
        <AppText variant="micro" tone="soft" style={styles.hint}>
          {hint}
        </AppText>
      ) : null}
      <TextInput
        accessibilityLabel={label}
        accessibilityLabelledBy={`${inputId}-label`}
        accessibilityHint={error ? `Error: ${error}` : hint}
        placeholderTextColor={Colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...inputProps}
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      />
      {error ? <InlineError>{error}</InlineError> : null}
    </View>
  );
}

/** Calm inline validation. Icon + text, so the state is not colour-only. */
export function InlineError({ children }: { children: ReactNode }) {
  return (
    <View accessible accessibilityRole="alert" style={styles.error}>
      <Feather
        name="alert-circle"
        size={14}
        color={Colors.alert}
        style={styles.errorIcon}
      />
      <AppText variant="micro" tone="alert" style={styles.errorText}>
        {children}
      </AppText>
    </View>
  );
}

export interface CheckboxRowProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  children: ReactNode;
  /** Marks the confirmation as required in the accessible name. */
  required?: boolean;
}

/**
 * Affirmative-action confirmation row. Uses the native checkbox role so the
 * checked state is announced, and keeps a full-width touch target.
 */
export function CheckboxRow({
  checked,
  onChange,
  children,
  required,
}: CheckboxRowProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      // Explicit for react-native-web, which does not derive it from
      // `accessibilityState`.
      aria-checked={checked}
      accessibilityHint={required ? 'Required to create your account' : undefined}
      onPress={() => onChange(!checked)}
      style={({ pressed }) => [styles.checkRow, pressed && styles.pressed]}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? (
          <Feather name="check" size={14} color={Colors.onEspresso} />
        ) : null}
      </View>
      <View style={styles.checkCopy}>
        <AppText variant="bodyStrong" style={styles.checkLabel}>
          {children}
          {required ? (
            <AppText variant="bodyStrong" tone="alert">
              {' *'}
            </AppText>
          ) : null}
        </AppText>
      </View>
    </Pressable>
  );
}

/** Mono micro-label heading a group of fields. `.formsec > .fslabel` */
export function FieldGroupLabel({ children }: { children: ReactNode }) {
  return (
    <AppText
      variant="mono"
      tone="accent"
      accessibilityRole="header"
      style={styles.groupLabel}
    >
      {children}
    </AppText>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: Spacing.lg,
  },
  hint: {
    marginTop: 2,
  },
  input: {
    marginTop: Spacing.sm,
    minHeight: TouchTarget.min,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 15,
    color: Colors.text,
  },
  inputFocused: {
    borderColor: Colors.accent,
    // Doubles as the visible focus ring on web.
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.alert,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    backgroundColor: Colors.errorSurface,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  errorIcon: {
    marginTop: 1,
  },
  errorText: {
    flex: 1,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: TouchTarget.min,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.espresso,
    borderColor: Colors.espresso,
  },
  checkCopy: {
    flex: 1,
  },
  checkLabel: {
    lineHeight: 20,
  },
  groupLabel: {
    marginTop: Spacing.xxl,
  },
  pressed: {
    opacity: 0.7,
  },
});
