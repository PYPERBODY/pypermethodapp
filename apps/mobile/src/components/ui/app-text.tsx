import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { Colors, Type } from '@/theme/tokens';

export type TextVariant =
  | 'display'
  | 'h2'
  | 'h3'
  | 'lead'
  | 'body'
  | 'bodyStrong'
  | 'sub'
  | 'micro'
  | 'mono'
  | 'button';

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
 * The single text primitive. Every string in the app renders through this so
 * the type scale and tone palette stay consistent across screens.
 *
 * `allowFontScaling` is left at its default (true) so the OS text-size setting
 * is honoured; no variant is small enough to break at larger scales.
 */
export function AppText({
  variant = 'body',
  tone = 'default',
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      style={[variantStyles[variant], toneStyles[tone], style]}
      {...rest}
    />
  );
}

const variantStyles = StyleSheet.create<Record<TextVariant, TextStyle>>({
  display: { ...Type.display, fontWeight: '900' },
  h2: { ...Type.h2, fontWeight: '800' },
  h3: { ...Type.h3, fontWeight: '800' },
  lead: { ...Type.lead, fontWeight: '700' },
  body: { ...Type.body, fontWeight: '400' },
  bodyStrong: { ...Type.bodyStrong, fontWeight: '600' },
  sub: { ...Type.sub, fontWeight: '400' },
  micro: { ...Type.micro, fontWeight: '400' },
  mono: { ...Type.mono, fontWeight: '600', textTransform: 'uppercase' },
  button: { ...Type.button, fontWeight: '800' },
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
