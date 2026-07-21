import { FoundationFlowScreen } from '@/components/foundation-flow-screen';

export default function TrialScreen() {
  return (
    <FoundationFlowScreen
      eyebrow="7-day free trial"
      title="Full core access for seven days."
      body="Use the core PYPER Method experience while deciding whether it belongs in your routine."
      items={[
        'Track progress and use the core app features.',
        'Browse partner offers and open affiliate links.',
        'Partner discount codes unlock after the trial converts to a paid subscription.',
      ]}
    />
  );
}
