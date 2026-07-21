import type { Href } from 'expo-router';
import { router } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors, Radius, Spacing } from '@/theme/tokens';

interface ActionButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'text';
  onPress: () => void;
}

function ActionButton({
  label,
  variant = 'primary',
  onPress,
}: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'text' && styles.textButton,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          variant === 'primary' && styles.primaryButtonLabel,
          variant === 'secondary' && styles.secondaryButtonLabel,
          variant === 'text' && styles.textButtonLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function goTo(path: string) {
  router.push(path as Href);
}

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <Text style={styles.brand}>PYPER</Text>
          <View style={styles.brandRule} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>The PYPER Method</Text>
          <Text style={styles.title}>GLP-1 support for your whole body.</Text>
          <Text style={styles.description}>
            A structured companion for tracking, nourishment, strength,
            body care, progress, and the rhythm of your treatment.
          </Text>

          <View style={styles.tags}>
            <Text style={styles.tag}>Track</Text>
            <Text style={styles.tag}>Understand</Text>
            <Text style={styles.tag}>Build strength</Text>
            <Text style={styles.tag}>Care for your body</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <ActionButton
            label="Start your 7-day free trial"
            onPress={() => goTo('/trial')}
          />
          <ActionButton
            label="Explore the app"
            variant="secondary"
            onPress={() => goTo('/preview')}
          />
          <ActionButton
            label="Sign in"
            variant="text"
            onPress={() => goTo('/sign-in')}
          />
        </View>

        <Text style={styles.footnote}>
          Available in the United States. The PYPER Method supports your care
          but does not replace your prescribing clinician.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  brand: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2.4,
  },
  brandRule: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.lg,
  },
  eyebrow: {
    color: Colors.espresso,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.text,
    fontSize: 48,
    lineHeight: 51,
    fontWeight: '800',
    letterSpacing: -1.8,
  },
  description: {
    color: Colors.mutedText,
    fontSize: 18,
    lineHeight: 28,
    maxWidth: 520,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  tag: {
    color: Colors.espresso,
    backgroundColor: Colors.espressoSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 13,
    fontWeight: '700',
  },
  actions: {
    gap: Spacing.md,
  },
  button: {
    minHeight: 54,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  primaryButton: {
    backgroundColor: Colors.espresso,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.espresso,
    backgroundColor: Colors.canvas,
  },
  textButton: {
    minHeight: 44,
  },
  buttonPressed: {
    opacity: 0.78,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  primaryButtonLabel: {
    color: Colors.white,
  },
  secondaryButtonLabel: {
    color: Colors.espresso,
  },
  textButtonLabel: {
    color: Colors.text,
  },
  footnote: {
    color: Colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
