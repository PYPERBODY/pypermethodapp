import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { Colors, Type } from '@/theme/tokens';

/**
 * Variants map one-to-one onto the frozen prototype's type rules. Pick the
 * variant that matches the prototype element you are reproducing rather than
 * overriding `fontSize` at the call site.
 */
export type TextVariant = keyof typeof Type;

export type TextTone =
  | 'default'
  | 'soft'
  | 'muted'
  | 'accent'
  | 'alert'
  | 'onEspresso'
  | 'onEspressoSoft'
  | 'onEspressoMuted';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: TextTone;
}

/**
 * The single text primitive. Every string renders through this so the approved
 * families, weights, sizes, leading and tracking stay consistent.
 *
 * `allowFontScaling` keeps its default (true) so the OS text-size setting is
 * honoured.
 */
export function AppText({
  variant = 'body',
  tone = 'default',
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      style={[
        Type[variant] as TextStyle,
        UPPERCASE.has(variant) && styles.uppercase,
        toneStyles[tone],
        style,
      ]}
      {...rest}
    />
  );
}

/** Prototype rules that carry `text-transform: uppercase`. */
const UPPERCASE = new Set<TextVariant>([
  'eyebrow',
  'tag',
  'fieldLabel',
  'navLabel',
  'bannerKey',
]);

const styles = StyleSheet.create({
  uppercase: { textTransform: 'uppercase' },
});

const toneStyles = StyleSheet.create<Record<TextTone, TextStyle>>({
  default: { color: Colors.text },
  soft: { color: Colors.textSoft },
  muted: { color: Colors.textMuted },
  accent: { color: Colors.accent },
  alert: { color: Colors.alert },
  onEspresso: { color: Colors.onEspresso },
  onEspressoSoft: { color: Colors.onEspressoSoft },
  onEspressoMuted: { color: Colors.onEspressoMuted },
});
