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

interface FoundationFlowScreenProps {
  eyebrow: string;
  title: string;
  body: string;
  items?: string[];
}

export function FoundationFlowScreen({
  eyebrow,
  title,
  body,
  items = [],
}: FoundationFlowScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
        </View>

        {items.length > 0 ? (
          <View style={styles.card}>
            {items.map((item) => (
              <View key={item} style={styles.item}>
                <View style={styles.dot} />
                <Text style={styles.itemText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.xxl,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  backText: {
    color: Colors.espresso,
    fontSize: 16,
    fontWeight: '700',
  },
  copy: {
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
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: -1.3,
  },
  body: {
    color: Colors.mutedText,
    fontSize: 18,
    lineHeight: 27,
  },
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  dot: {
    width: 7,
    height: 7,
    marginTop: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.espresso,
  },
  itemText: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
});
