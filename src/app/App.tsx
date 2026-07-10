import { useState } from "react";
import { Shell, TabKey } from "./components/pyper/Shell";
import { Today } from "./components/pyper/Today";
import { Method } from "./components/pyper/Method";
import { Trackers } from "./components/pyper/Trackers";
import { Reminders } from "./components/pyper/Reminders";
import { Progress } from "./components/pyper/Progress";
import { Edit } from "./components/pyper/Edit";
import { Safety } from "./components/pyper/Safety";
import { Support } from "./components/pyper/Support";
import { HealthContextProvider } from "./components/pyper/HealthContextProvider";

// NOTE: Frontend prototype. Health data lives in component state for demo only.
// Production: connect Supabase Auth + RLS-protected tables for every health log.
// Health Context data must never flow to affiliates, partners, analytics, or community.
export default function App() {
  const [tab, setTab] = useState<TabKey>("today");

  return (
    <HealthContextProvider>
      <Shell active={tab} onChange={setTab}>
        {tab === "today" && (
          <Today
            onGoExport={() => setTab("support")}
            onGoMethod={() => setTab("method")}
          />
        )}
        {tab === "method" && <Method />}
        {tab === "trackers" && <Trackers />}
        {tab === "reminders" && <Reminders />}
        {tab === "progress" && <Progress onGoExport={() => setTab("support")} />}
        {tab === "edit" && <Edit />}
        {tab === "safety" && <Safety />}
        {tab === "support" && <Support />}
      </Shell>
    </HealthContextProvider>
  );
}
