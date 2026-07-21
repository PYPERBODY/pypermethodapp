import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from './app-text';

import { Colors, Radius, Spacing, TouchTarget } from '@/theme/tokens';

export interface BackActionProps {
  onPress: () => void;
  label?: string;
}

/**
 * Chip-style back control used at the top of the account-entry screens.
 * Mirrors the prototype's `.chip` back button.
 */
export function BackAction({ onPress, label = 'Back' }: BackActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
    >
      <Feather name="chevron-left" size={16} color={Colors.text} />
      <AppText variant="bodyStrong">{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    minHeight: TouchTarget.min,
    paddingHorizontal: Spacing.md,
    paddingRight: Spacing.lg,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
});
