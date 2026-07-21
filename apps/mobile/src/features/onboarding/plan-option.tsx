import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import type { PlanConfig } from '@/features/access/plans';
import { Colors, Radius, Spacing } from '@/theme/tokens';

export interface PlanOptionProps {
  plan: PlanConfig;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Selectable plan card. Derived from the prototype's inline plan buttons
 * (`.migration-source/ThePyperMethod_v2.jsx` lines 2726–2750).
 *
 * Accessibility: exposed as a radio so the selected state is announced rather
 * than being conveyed only by the fill and border colour.
 */
export function PlanOption({ plan, selected, onSelect }: PlanOptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      // react-native-web does not derive `aria-checked` from
      // `accessibilityState`, so the selected state is passed explicitly.
      // Without it the choice would be conveyed by colour alone on web.
      aria-checked={selected}
      accessibilityLabel={`${plan.label}. ${plan.headline}`}
      accessibilityHint={plan.cardNote}
      onPress={onSelect}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.cardSelected : styles.cardIdle,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.row}>
        <View
          style={[styles.radio, selected ? styles.radioOn : styles.radioOff]}
        />

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <AppText variant="h3" style={styles.title}>
              {plan.label}
            </AppText>
            {plan.popularTag ? (
              <View style={styles.popularTag}>
                <AppText variant="mono" tone="onEspresso" style={styles.tagText}>
                  {plan.popularTag}
                </AppText>
              </View>
            ) : null}
          </View>

          <AppText variant="bodyStrong" style={styles.headline}>
            {plan.headline}
          </AppText>

          {plan.equivalence ? (
            <AppText variant="micro" tone="soft" style={styles.line}>
              {plan.equivalence}
            </AppText>
          ) : null}

          {plan.savingsTag ? (
            <View style={styles.savingsTag}>
              <AppText variant="mono" tone="muted" style={styles.tagText}>
                {plan.savingsTag}
              </AppText>
            </View>
          ) : null}

          <AppText variant="micro" tone="soft" style={styles.line}>
            {plan.cardNote}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  cardIdle: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardSelected: {
    backgroundColor: Colors.planSelected,
    borderWidth: 1.6,
    borderColor: Colors.planSelectedBorder,
  },
  pressed: {
    opacity: 0.85,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.bg,
    marginTop: 2,
  },
  radioOn: {
    borderWidth: 6,
    borderColor: Colors.planSelectedBorder,
  },
  radioOff: {
    borderWidth: 2,
    borderColor: Colors.border,
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  title: {
    fontSize: 15,
  },
  headline: {
    fontSize: 13.5,
    marginTop: 3,
  },
  line: {
    fontSize: 11,
    marginTop: 5,
  },
  popularTag: {
    backgroundColor: Colors.espresso,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  savingsTag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginTop: 7,
  },
  tagText: {
    fontSize: 8.5,
    letterSpacing: 0.8,
  },
});
