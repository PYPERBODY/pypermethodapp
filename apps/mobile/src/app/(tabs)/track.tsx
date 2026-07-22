import { TabPlaceholder } from '@/features/onboarding/tab-placeholder';

/** Track — the trackers. Detailed content arrives in a later phase. */
export default function TrackTab() {
  return (
    <TabPlaceholder
      eyebrow="Track"
      title="Your trackers"
      detail="Repeatable entries for body metrics, nutrition, tolerance, training, and body care."
      sections={[
        'Body Metrics',
        'Protein and Hydration',
        'Tolerance',
        'Emotional Check-In',
        'Training Rhythm',
      ]}
    />
  );
}
