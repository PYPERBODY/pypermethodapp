import { TabPlaceholder } from '@/features/onboarding/tab-placeholder';

/** Home — "Today in The Guide". Detailed content arrives in a later phase. */
export default function HomeTab() {
  return (
    <TabPlaceholder
      eyebrow="Today"
      title="Today in The Guide"
      detail="Your daily rhythm: what to do next, what is due, and what needs attention."
      sections={[
        'Next best action',
        "Today's reminders",
        'Medication rhythm',
        'Hydration and protein check',
        'Weekly check-in progress',
      ]}
    />
  );
}
