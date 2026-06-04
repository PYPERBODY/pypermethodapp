import { useState } from "react";
import { PageHeader, Surface } from "./Shell";
import { Bell, Pause, Copy, Trash2, Plus, Lock } from "lucide-react";

type R = {
  id: string;
  title: string;
  type: string;
  time: string;
  frequency: string;
  active: boolean;
};

const SEED: R[] = [
  { id: "r1", title: "AM body-care routine", type: "Body-care", time: "07:30", frequency: "Daily", active: true },
  { id: "r2", title: "GLP-1 dose reminder", type: "Medication", time: "08:00", frequency: "Weekly · Sun", active: true },
  { id: "r3", title: "Hydration check", type: "Hydration", time: "Every 2h", frequency: "Daily", active: true },
  { id: "r4", title: "Protein check", type: "Protein", time: "12:30", frequency: "Daily", active: true },
  { id: "r5", title: "PM body-care routine", type: "Body-care", time: "20:00", frequency: "Daily", active: true },
  { id: "r6", title: "Weekly check-in prep", type: "Provider", time: "Sun 18:00", frequency: "Weekly", active: false },
];

export function Reminders() {
  const [items, setItems] = useState<R[]>(SEED);

  return (
    <>
      <PageHeader
        eyebrow="Reminders"
        title="Calm cadence, private cues."
        subtitle="Lock-screen text is intentionally generic. Detailed medication, dose, symptom, weight, or mental health information is only visible after login."
      />

      <Surface className="p-5 mb-6 flex items-start gap-3 bg-[var(--ivory)]">
        <Lock size={16} className="text-[var(--steel)] mt-1 shrink-0" />
        <div className="text-sm">
          Push notifications use private labels like “PYPER reminder: hydration check.” Sensitive
          details stay inside The Guide.
        </div>
      </Surface>

      <div className="flex items-center justify-between mb-4">
        <div className="mono-label">{items.length} reminders</div>
        <button className="inline-flex items-center gap-2 bg-[var(--graphite)] text-[var(--porcelain)] px-4 py-2 rounded-md text-sm">
          <Plus size={14} /> New reminder
        </button>
      </div>

      <Surface className="divide-y divide-[var(--border)]">
        {items.map((r) => (
          <div key={r.id} className="p-5 flex items-center gap-5 flex-wrap">
            <Bell size={16} className="text-[var(--steel)]" />
            <div className="flex-1 min-w-[180px]">
              <div className="text-sm">{r.title}</div>
              <div className="mono-label mt-0.5">{r.type} · {r.frequency}</div>
            </div>
            <div className="font-mono text-sm text-[var(--steel)] w-28">{r.time}</div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-full border ${
                  r.active
                    ? "border-[var(--med-blue)] text-[var(--med-blue)]"
                    : "border-[var(--border)] text-[var(--steel)]"
                }`}
              >
                {r.active ? "Active" : "Paused"}
              </span>
              <IconBtn
                onClick={() =>
                  setItems(items.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x)))
                }
              >
                <Pause size={14} />
              </IconBtn>
              <IconBtn
                onClick={() =>
                  setItems([...items, { ...r, id: crypto.randomUUID(), title: r.title + " (copy)" }])
                }
              >
                <Copy size={14} />
              </IconBtn>
              <IconBtn onClick={() => setItems(items.filter((x) => x.id !== r.id))}>
                <Trash2 size={14} />
              </IconBtn>
            </div>
          </div>
        ))}
      </Surface>
    </>
  );
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-[var(--border)] hover:bg-[var(--ivory)] text-[var(--steel)]"
    >
      {children}
    </button>
  );
}
