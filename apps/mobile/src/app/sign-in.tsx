import { FoundationFlowScreen } from '@/components/foundation-flow-screen';

export default function SignInScreen() {
  return (
    <FoundationFlowScreen
      eyebrow="Welcome back"
      title="Sign in to The PYPER Method."
      body="Secure Supabase authentication and account recovery will be connected in the next foundation step."
      items={[
        'Digital subscribers receive full app access.',
        'Active PYPER GLP-1 members receive included access.',
        'Expired accounts retain read-only access to historical information.',
      ]}
    />
  );
}
