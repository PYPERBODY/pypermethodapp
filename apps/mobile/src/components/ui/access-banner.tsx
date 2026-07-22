import { StyleSheet } from 'react-native';

import { StatusBanner } from './status-banner';

import { useAccess } from '@/features/access/access-context';
import { PREVIEW_BANNER, READ_ONLY_BANNER } from '@/features/access/copy';

/**
 * Persistent access state banner shown at the top of every tab.
 *
 * Preview and read-only members must always be able to see why writing is
 * locked. The banner carries an icon and an explicit label, so the state is
 * never signalled by colour alone.
 */
export function AccessBanner() {
  const { entitlement } = useAccess();

  if (entitlement === 'preview') {
    return (
      <StatusBanner
        tone="locked"
        label="Preview mode"
        message={PREVIEW_BANNER}
        style={styles.banner}
      />
    );
  }

  if (entitlement === 'expired_read_only') {
    return (
      <StatusBanner
        tone="locked"
        label="Read-only"
        message={READ_ONLY_BANNER}
        style={styles.banner}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  banner: {
    // .pvban — margin-bottom 14
    marginBottom: 14,
  },
});
