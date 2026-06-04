import { PageHeader, Surface } from "./Shell";
import { PROGRESS_SERIES } from "./data";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

export function Progress({ onGoExport }: { onGoExport: () => void }) {
  return (
    <>
      <PageHeader
        eyebrow="Progress Studio"
        title="Steady. Tracked. Reviewable."
        subtitle="Trends, consistency, and clinician-ready signals. No aggressive red — only calm clarity. Safety alerts are the exception."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Body metrics" value="−11 lb" hint="8 weeks" />
        <Stat label="Dose adherence" value="100%" hint="No missed doses" />
        <Stat label="Protein consistency" value="92%" hint="≥ target days" />
        <Stat label="Hydration consistency" value="78%" hint="≥ target days" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Surface className="p-6 lg:col-span-2">
          <div className="mono-label mb-1">90-day trend</div>
          <h3 className="mb-5">Body metrics</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={PROGRESS_SERIES}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6F8491" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6F8491" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E3E1DA" vertical={false} />
                <XAxis dataKey="week" stroke="#7C8991" fontSize={11} />
                <YAxis stroke="#7C8991" fontSize={11} domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E3E1DA",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#171717"
                  strokeWidth={1.5}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        <Surface className="p-6">
          <div className="mono-label mb-1">Status</div>
          <h3 className="mb-5">Weekly signals</h3>
          <ul className="space-y-3">
            <Signal label="Mood / stress" status="steady" />
            <Signal label="Sleep" status="steady" />
            <Signal label="Side effects" status="steady" />
            <Signal label="Body-care barrier" status="attention" />
            <Signal label="Guide questions" status="provider" />
          </ul>
        </Surface>
      </div>

      <Surface className="p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <div className="mono-label mb-1">Tolerance + Protein</div>
            <h3>Trend overlay</h3>
          </div>
          <button
            onClick={onGoExport}
            className="text-sm border border-[var(--graphite)] px-4 py-2 rounded-md hover:bg-[var(--graphite)] hover:text-[var(--porcelain)]"
          >
            Export guide summary
          </button>
        </div>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={PROGRESS_SERIES}>
              <CartesianGrid stroke="#E3E1DA" vertical={false} />
              <XAxis dataKey="week" stroke="#7C8991" fontSize={11} />
              <YAxis stroke="#7C8991" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E3E1DA",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line key="protein" type="monotone" dataKey="protein" stroke="#6F8491" strokeWidth={1.5} dot={false} />
              <Line key="tolerance" type="monotone" dataKey="tolerance" stroke="#171717" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Surface>
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Surface className="p-5">
      <div className="mono-label mb-3">{label}</div>
      <div style={{ fontFamily: "var(--font-serif)" }} className="text-2xl">
        {value}
      </div>
      <div className="text-xs text-[var(--soft-text)] mt-1">{hint}</div>
    </Surface>
  );
}

function Signal({
  label,
  status,
}: {
  label: string;
  status: "steady" | "attention" | "provider";
}) {
  const map = {
    steady: { dot: "#6F8491", text: "Steady" },
    attention: { dot: "#C9A86A", text: "Needs attention" },
    provider: { dot: "#7C8991", text: "Discuss if needed" },
  };
  const m = map[status];
  return (
    <li className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <span className="text-xs inline-flex items-center gap-2 text-[var(--soft-text)]">
        <span className="w-2 h-2 rounded-full" style={{ background: m.dot }} />
        {m.text}
      </span>
    </li>
  );
}
