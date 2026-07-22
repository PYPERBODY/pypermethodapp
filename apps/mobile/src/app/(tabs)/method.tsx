import { TabPlaceholder } from '@/features/onboarding/tab-placeholder';

/** Method — the guide chapters. Detailed content arrives in a later phase. */
export default function MethodTab() {
  return (
    <TabPlaceholder
      eyebrow="Learn"
      title="The PYPER Method"
      detail="The guide chapters, pillars, and phase standards that the rest of the app supports."
      sections={[
        'Start Here',
        'Medical and Member Safety',
        'Seven PYPER Pillars',
        'The Three-Phase Standard',
        'The Medication Window',
      ]}
    />
  );
}
