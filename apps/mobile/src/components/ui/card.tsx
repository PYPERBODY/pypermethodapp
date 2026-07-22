import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from './app-text';

import { Colors, Layout, Radius, Shadow } from '@/theme/tokens';

export interface CardProps {
  children: ReactNode;
  /** `muted` uses the Ivory recessed surface. `espresso` is a dark moment. */
  tone?: 'surface' | 'muted' | 'espresso';
  style?: StyleProp<ViewStyle>;
  /** Groups the card's contents for screen readers. */
  accessibilityLabel?: string;
}

/** Clinical card: hairline border, generous padding, restrained shadow. */
export function Card({
  children,
  tone = 'surface',
  style,
  accessibilityLabel,
}: CardProps) {
  return (
    <View
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      style={[styles.card, toneStyles[tone], style]}
    >
      {children}
    </View>
  );
}

export interface SectionHeadingProps {
  /** Mono micro-label above the title. */
  eyebrow?: string;
  title: string;
  detail?: string;
  style?: StyleProp<ViewStyle>;
  onEspresso?: boolean;
}

/** Editorial section heading: mono eyebrow, display title, optional detail. */
export function SectionHeading({
  eyebrow,
  title,
  detail,
  style,
  onEspresso,
}: SectionHeadingProps) {
  return (
    <View style={style}>
      {eyebrow ? (
        <AppText
          variant="eyebrow"
          tone={onEspresso ? 'onEspressoMuted' : 'muted'}
          style={styles.eyebrow}
        >
          {eyebrow}
        </AppText>
      ) : null}
      <AppText
        variant="h2"
        tone={onEspresso ? 'onEspresso' : 'default'}
        accessibilityRole="header"
      >
        {title}
      </AppText>
      {detail ? (
        <AppText
          variant="sub"
          tone={onEspresso ? 'onEspressoSoft' : 'soft'}
          style={styles.detail}
        >
          {detail}
        </AppText>
      ) : null}
    </View>
  );
}

/** Slim rule used between editorial blocks. */
export function Rule({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.rule, style]} />;
}

const styles = StyleSheet.create({
  card: {
    // .card — radius 16, 1px --line, padding 16, --shadow
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: Layout.cardPadding,
    ...Shadow.card,
  },
  eyebrow: {
    // .stat .eyebrow — margin-bottom 6
    marginBottom: 6,
  },
  detail: {
    marginTop: 5,
  },
  rule: {
    height: 1,
    backgroundColor: Colors.border,
  },
});

const toneStyles = StyleSheet.create({
  surface: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  muted: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.border,
  },
  espresso: {
    backgroundColor: Colors.espresso,
    borderColor: Colors.espresso,
  },
});
