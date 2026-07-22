import Feather from '@expo/vector-icons/Feather';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AccessBanner } from '@/components/ui/access-banner';
import { AppText } from '@/components/ui/app-text';
import { Card, Rule, SectionHeading } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { useAccess } from '@/features/access/access-context';
import { PHASE_NOTE } from '@/features/access/copy';
import { Colors, Radius, Spacing } from '@/theme/tokens';

export interface TabPlaceholderProps {
  eyebrow: string;
  title: string;
  detail: string;
  /** The destinations this tab will hold once migrated. */
  sections: string[];
  /** Extra content rendered under the section list (Profile uses this). */
  children?: ReactNode;
}

/**
 * Intentional PYPER interface state for a tab whose detailed content arrives
 * in a later migration phase.
 *
 * This is a designed product state, not a developer placeholder: it uses the
 * approved tokens, states what the section will hold, and shows the member's
 * current write status honestly.
 */
export function TabPlaceholder({
  eyebrow,
  title,
  detail,
  sections,
  children,
}: TabPlaceholderProps) {
  const { capabilities } = useAccess();

  return (
    <Screen scroll edgeToEdgeBottom={false}>
      <AccessBanner />

      <SectionHeading eyebrow={eyebrow} title={title} detail={detail} />

      <Card style={styles.card}>
        <AppText variant="eyebrow" tone="muted">
          In this section
        </AppText>

        <View style={styles.list}>
          {sections.map((section, index) => (
            <View key={section}>
              {index > 0 ? <Rule /> : null}
              <View style={styles.row}>
                <AppText variant="h3" style={styles.rowLabel}>
                  {section}
                </AppText>
                <Feather
                  name="chevron-right"
                  size={16}
                  color={Colors.textMuted}
                />
              </View>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusChip,
            capabilities.canWriteHealthData
              ? styles.statusOpen
              : styles.statusLocked,
          ]}
        >
          <Feather
            name={capabilities.canWriteHealthData ? 'edit-3' : 'lock'}
            size={11}
            color={
              capabilities.canWriteHealthData ? Colors.text : Colors.textMuted
            }
          />
          <AppText
            variant="tag"
            tone={capabilities.canWriteHealthData ? 'default' : 'muted'}
          >
            {capabilities.canWriteHealthData
              ? 'Entry unlocked'
              : 'Entry locked'}
          </AppText>
        </View>
      </View>

      <AppText variant="micro" tone="soft" style={styles.note}>
        {PHASE_NOTE}
      </AppText>

      {children}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: Spacing.lg,
  },
  list: {
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingVertical: 11,
    minHeight: 44,
  },
  rowLabel: {
    // .obrow .rt — 14px / 800 / -.01em
    flex: 1,
    fontSize: 14,
    letterSpacing: -0.14,
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  statusOpen: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  statusLocked: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.planSelectedBorder,
  },
  note: {
    marginTop: 10,
  },
});
