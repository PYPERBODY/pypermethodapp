import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNarrowLayout } from '@/hooks/use-narrow-layout';
import { Colors, Layout, Spacing } from '@/theme/tokens';

export interface ScreenProps {
  children: ReactNode;
  /**
   * `scroll` puts the content in a ScrollView that grows to fill the viewport,
   * so an anchored-actions layout still works when content is short.
   */
  scroll?: boolean;
  /** Adds keyboard avoidance. Use on any screen containing a TextInput. */
  keyboardAware?: boolean;
  /** Espresso canvas for the purchase surface. */
  surface?: 'canvas' | 'espresso';
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  /** Set false when a bottom tab bar already supplies the bottom inset. */
  edgeToEdgeBottom?: boolean;
}

/**
 * The screen container. Owns safe-area handling, horizontal rhythm, the
 * narrow-screen padding step-down, and the readable measure cap on tablets.
 */
export function Screen({
  children,
  scroll = false,
  keyboardAware = false,
  surface = 'canvas',
  contentContainerStyle,
  style,
  edgeToEdgeBottom = true,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const narrow = useNarrowLayout();

  const horizontal = narrow
    ? Layout.screenPaddingNarrow
    : Layout.screenPadding;

  const padding: ViewStyle = {
    paddingHorizontal: horizontal,
    paddingTop: insets.top + Spacing.xxl,
    paddingBottom:
      (edgeToEdgeBottom ? insets.bottom : 0) + Spacing.xxl,
  };

  const background =
    surface === 'espresso' ? Colors.espresso : Colors.bg;

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.scrollContent,
        padding,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <View style={styles.measure}>{children}</View>
    </ScrollView>
  ) : (
    <View style={[styles.flex, padding, contentContainerStyle]}>
      <View style={styles.measure}>{children}</View>
    </View>
  );

  const content = keyboardAware ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {body}
    </KeyboardAvoidingView>
  ) : (
    body
  );

  return (
    <View style={[styles.flex, { backgroundColor: background }, style]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  measure: {
    flex: 1,
    width: '100%',
    // Keeps line length readable on tablets without stretching the layout.
    maxWidth: 560,
    alignSelf: 'center',
  },
});
