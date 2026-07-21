import { FoundationFlowScreen } from '@/components/foundation-flow-screen';

export default function PreviewScreen() {
  return (
    <FoundationFlowScreen
      eyebrow="Preview access"
      title="Explore before you subscribe."
      body="Preview mode lets you understand The PYPER Method before beginning a trial or membership."
      items={[
        'Browse the app structure and educational sections.',
        'See PYPER Perks and partner offers.',
        'Tracking, personal data entry, and partner codes remain locked.',
      ]}
    />
  );
}
