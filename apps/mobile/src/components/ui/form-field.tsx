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

import { Colors, Radius, Spacing, TouchTarget, Type } from '@/theme/tokens';

export interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  /** Inline validation message. Rendered with an icon, never colour alone. */
  error?: string;
  /** Supporting hint shown under the label. */
  hint?: string;
}

/**
 * Labelled text input. Reproduces `.field`:
 *
 *   .field           margin-top 12
 *   .field label     UI 12px, .05em, uppercase, --mut, 600, margin-bottom 6
 *   .field input     --card2 fill, 1px --line, radius 10, padding 11/12, 14px
 *   :focus           border-color --med
 *
 * Accessibility: the visible label is bound to the input, and any error is
 * announced with it.
 */
export function FormField({ label, error, hint, ...inputProps }: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  const inputId = useId();

  return (
    <View style={styles.field}>
      <AppText variant="fieldLabel" tone="muted" nativeID={`${inputId}-label`}>
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

/**
 * Calm inline validation. `.inlineerr` — radius 11, padding 10/12, 12px/1.45,
 * gap 7. Icon plus text, so the state is never colour-only.
 */
export function InlineError({ children }: { children: ReactNode }) {
  return (
    <View accessible accessibilityRole="alert" style={styles.error}>
      <Feather
        name="alert-circle"
        size={13}
        color={Colors.alert}
        style={styles.errorIcon}
      />
      <AppText variant="sub" tone="alert" style={styles.errorText}>
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
 * Affirmative-action confirmation row. `.reqrow` — gap 11, padding 11 vertical,
 * hairline top rule; `.cbx` 22x22; `.cbxlabel` 13px / 1.5.
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
      aria-checked={checked}
      accessibilityHint={required ? 'Required to create your account' : undefined}
      onPress={() => onChange(!checked)}
      style={({ pressed }) => [styles.checkRow, pressed && styles.pressed]}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? (
          <Feather name="check" size={13} color={Colors.onEspresso} />
        ) : null}
      </View>
      <View style={styles.checkCopy}>
        <AppText style={styles.checkLabel}>
          {children}
          {required ? <AppText style={styles.required}> *</AppText> : null}
        </AppText>
      </View>
    </Pressable>
  );
}

/** `.formsec > .fslabel` — mono 9px, .14em, uppercase, --med. */
export function FieldGroupLabel({ children }: { children: ReactNode }) {
  return (
    <AppText
      variant="tag"
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
    marginTop: Spacing.md,
  },
  hint: {
    marginTop: 2,
  },
  input: {
    marginTop: 6,
    minHeight: TouchTarget.min,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 11,
    color: Colors.text,
    ...Type.input,
  },
  inputFocused: {
    borderColor: Colors.accent,
  },
  inputError: {
    borderColor: Colors.alert,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: Spacing.md,
    backgroundColor: Colors.errorSurface,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  errorIcon: {
    marginTop: 2,
  },
  errorText: {
    flex: 1,
    lineHeight: 17.4,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    paddingVertical: 11,
    minHeight: TouchTarget.min,
  },
  checkboxChecked: {
    backgroundColor: Colors.espresso,
    borderColor: Colors.espresso,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkCopy: {
    flex: 1,
  },
  checkLabel: {
    fontSize: 13,
    lineHeight: 19.5,
  },
  required: {
    color: Colors.alert,
    fontWeight: '700',
  },
  groupLabel: {
    marginTop: 18,
    marginBottom: 9,
    letterSpacing: 1.26,
  },
  pressed: {
    opacity: 0.7,
  },
});
