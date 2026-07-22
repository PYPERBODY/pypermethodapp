import { TabPlaceholder } from '@/features/onboarding/tab-placeholder';

/** Dose — medication rhythm. Detailed content arrives in a later phase. */
export default function DoseTab() {
  return (
    <TabPlaceholder
      eyebrow="Medication"
      title="Medication rhythm"
      detail="Your dose record, injection sites, tolerance notes, and questions for your provider. This app never recommends a dose change."
      sections={[
        'Shot history',
        'Injection sites',
        'Symptoms and side effects',
        'Supplement routine',
        'Provider questions',
      ]}
    />
  );
}
