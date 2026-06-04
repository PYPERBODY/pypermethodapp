import { useState } from "react";
import { ProtectedGuide, useGuideAuth } from "./components/auth/AuthGate";
import { Shell, Surface, TabKey } from "./components/pyper/Shell";
import { Today } from "./components/pyper/Today";
import { Method } from "./components/pyper/Method";
import { Trackers } from "./components/pyper/Trackers";
import { Reminders } from "./components/pyper/Reminders";
import { Progress } from "./components/pyper/Progress";
import { Edit } from "./components/pyper/Edit";
import { Safety } from "./components/pyper/Safety";
import { Support } from "./components/pyper/Support";

// Phase 5 foundation only: Supabase Auth protects the guide shell. Tracker forms remain demo state until Phase 6.
export default function App() {
  return (
    <ProtectedGuide>
      <AuthenticatedGuide />
    </ProtectedGuide>
  );
}

function AuthenticatedGuide() {
  const [tab, setTab] = useState<TabKey>("today");
  const { user, signOut } = useGuideAuth();

  return (
    <Shell active={tab} onChange={setTab} userEmail={user?.email} onSignOut={signOut}>
      <GuidePrivacyNotices />
      {tab === "today" && <Today onGoExport={() => setTab("support")} />}
      {tab === "method" && <Method />}
      {tab === "trackers" && <Trackers />}
      {tab === "reminders" && <Reminders />}
      {tab === "progress" && <Progress onGoExport={() => setTab("support")} />}
      {tab === "edit" && <Edit />}
      {tab === "safety" && <Safety />}
      {tab === "support" && <Support />}
    </Shell>
  );
}

function GuidePrivacyNotices() {
  return (
    <Surface className="mb-8 grid gap-3 p-4 text-sm lg:grid-cols-2">
      <p>
        <strong>Privacy notice:</strong> Your guide progress and trackers may include sensitive health information. PYPER should only store this information in a secure system with appropriate privacy, security, and vendor protections. Do not use this guide for emergencies.
      </p>
      <p>
        <strong>Future reminder privacy:</strong> Reminder notifications should remain brief for privacy. Detailed medication, dose, symptom, weight, prescription body-care, or mental health information should only be visible after sign-in.
      </p>
    </Surface>
  );
}
