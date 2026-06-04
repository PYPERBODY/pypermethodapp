import { useState } from "react";
import { PageHeader, Surface } from "./Shell";
import { TRACKERS } from "./data";
import { Slider } from "../ui/slider";
import { Copy, Plus, Save, Trash2, AlertTriangle } from "lucide-react";

type Entry = {
  id: string;
  date: string;
  nausea: number;
  abdominalPain: number;
  fatigue: number;
  vomiting: boolean;
  noHydrate: boolean;
  notes: string;
};

const initial: Entry[] = [
  {
    id: "e1",
    date: "2026-06-03",
    nausea: 2,
    abdominalPain: 1,
    fatigue: 3,
    vomiting: false,
    noHydrate: false,
    notes: "Calm day. Electrolytes consistent.",
  },
  {
    id: "e2",
    date: "2026-06-02",
    nausea: 4,
    abdominalPain: 2,
    fatigue: 5,
    vomiting: false,
    noHydrate: false,
    notes: "Slight nausea after dose. Resolved by evening.",
  },
];

export function Trackers() {
  const [selected, setSelected] = useState("tolerance");
  return (
    <>
      <PageHeader
        eyebrow="Track"
        title="Repeatable, reviewable, exportable."
        subtitle="Guide-related trackers support duplicate entries, routine templates, and exportable review. Demo data shown — secure storage attaches only to support guide use when authentication is connected."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <Surface className="p-3 h-fit lg:sticky lg:top-6">
          <ul>
            {TRACKERS.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setSelected(t.id)}
                  className={`w-full text-left px-3 py-3 rounded-md transition-colors ${
                    selected === t.id
                      ? "bg-[var(--graphite)] text-[var(--porcelain)]"
                      : "hover:bg-[var(--ivory)]"
                  }`}
                >
                  <div className="text-sm">{t.name}</div>
                  <div
                    className={`mono-label mt-0.5 ${
                      selected === t.id ? "text-[var(--bone)]" : ""
                    }`}
                  >
                    {t.note}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Surface>

        <div>
          {selected === "tolerance" ? (
            <ToleranceTracker />
          ) : (
            <Surface className="p-8 text-center">
              <div className="mono-label mb-2">
                {TRACKERS.find((t) => t.id === selected)?.name}
              </div>
              <h3 className="mb-3">Tracker scaffold ready</h3>
              <p className="text-sm max-w-md mx-auto">
                Fields, duplicate-entry, routine templates, and guide export follow the same
                pattern as the Tolerance Tracker. Open Tolerance to see the working pattern.
              </p>
            </Surface>
          )}
        </div>
      </div>
    </>
  );
}

function ToleranceTracker() {
  const [entries, setEntries] = useState<Entry[]>(initial);
  const [draft, setDraft] = useState<Entry>(blankEntry());

  function blankEntry(): Entry {
    return {
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      nausea: 0,
      abdominalPain: 0,
      fatigue: 0,
      vomiting: false,
      noHydrate: false,
      notes: "",
    };
  }

  function saveEntry() {
    setEntries([{ ...draft }, ...entries]);
    setDraft(blankEntry());
  }

  function duplicate(e: Entry) {
    setDraft({ ...e, id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10) });
  }

  function remove(id: string) {
    setEntries(entries.filter((e) => e.id !== id));
  }

  const flagged =
    draft.abdominalPain >= 7 || draft.vomiting || draft.noHydrate;

  return (
    <Surface className="p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="mono-label mb-2">Tolerance Tracker</div>
          <h2>New entry</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => entries[0] && duplicate(entries[0])}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--ivory)]"
          >
            <Copy size={14} /> Duplicate most recent
          </button>
          <button
            onClick={() => setDraft(blankEntry())}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--ivory)]"
          >
            <Plus size={14} /> Blank entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        <Field label="Entry date">
          <input
            type="date"
            value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            className="w-full bg-[var(--porcelain)] border border-[var(--border)] rounded-md px-3 py-2 text-sm"
          />
        </Field>
        <div />
        <SliderField
          label="Nausea severity"
          value={draft.nausea}
          onChange={(v) => setDraft({ ...draft, nausea: v })}
        />
        <SliderField
          label="Abdominal pain severity"
          value={draft.abdominalPain}
          onChange={(v) => setDraft({ ...draft, abdominalPain: v })}
        />
        <SliderField
          label="Fatigue severity"
          value={draft.fatigue}
          onChange={(v) => setDraft({ ...draft, fatigue: v })}
        />
        <Field label="Flags">
          <div className="flex gap-4 flex-wrap">
            <Toggle
              label="Vomiting"
              checked={draft.vomiting}
              onChange={(v) => setDraft({ ...draft, vomiting: v })}
            />
            <Toggle
              label="Unable to hydrate"
              checked={draft.noHydrate}
              onChange={(v) => setDraft({ ...draft, noHydrate: v })}
            />
          </div>
        </Field>
        <Field label="Notes for guide review" className="md:col-span-2">
          <textarea
            rows={3}
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            className="w-full bg-[var(--porcelain)] border border-[var(--border)] rounded-md px-3 py-2 text-sm resize-none"
            placeholder="Anything you want to bring to your clinician check-in"
          />
        </Field>
      </div>

      {flagged && (
        <div className="mt-6 border border-[#8a2a2a]/30 bg-[#fdf4f4] rounded-md p-4 flex gap-3">
          <AlertTriangle size={18} className="text-[#8a2a2a] shrink-0 mt-0.5" />
          <div>
            <div className="text-sm text-[#8a2a2a]" style={{ fontWeight: 500 }}>
              This may require urgent medical attention.
            </div>
            <p className="text-xs mt-1">
              Severe abdominal pain, repeated vomiting, or inability to hydrate may need urgent
              care. Contact your clinician or seek urgent/emergency care. Do not rely on this
              guide for urgent medical decisions.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <button
          onClick={saveEntry}
          className="inline-flex items-center gap-2 bg-[var(--graphite)] text-[var(--porcelain)] px-5 py-2.5 rounded-md text-sm"
        >
          <Save size={14} /> Save entry
        </button>
        <button className="inline-flex items-center gap-2 border border-[var(--border)] px-5 py-2.5 rounded-md text-sm hover:bg-[var(--ivory)]">
          Save as routine template
        </button>
      </div>

      <div className="rule my-8" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="mono-label mb-1">History</div>
          <h3>Recent entries</h3>
        </div>
        <div className="hidden sm:flex gap-1 mono-label">
          {["Day", "Week", "Month", "90d", "Year", "All"].map((r, i) => (
            <button
              key={r}
              className={`px-2.5 py-1 rounded-md ${
                i === 1 ? "bg-[var(--graphite)] text-[var(--porcelain)]" : "hover:bg-[var(--ivory)]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-2">
        {entries.map((e) => (
          <li
            key={e.id}
            className="border border-[var(--border)] rounded-md p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
          >
            <div className="font-mono text-sm text-[var(--steel)] w-24 shrink-0">{e.date}</div>
            <div className="flex-1 min-w-0">
              <div className="flex gap-4 text-xs text-[var(--soft-text)]">
                <span>Nausea {e.nausea}</span>
                <span>Abd. {e.abdominalPain}</span>
                <span>Fatigue {e.fatigue}</span>
              </div>
              {e.notes && (
                <p className="text-sm mt-1 truncate">{e.notes}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => duplicate(e)}
                className="text-xs inline-flex items-center gap-1 px-2.5 py-1.5 border border-[var(--border)] rounded-md hover:bg-[var(--ivory)]"
              >
                <Copy size={12} /> Duplicate
              </button>
              <button
                onClick={() => remove(e.id)}
                className="text-xs inline-flex items-center gap-1 px-2.5 py-1.5 border border-[var(--border)] rounded-md hover:bg-[var(--ivory)] text-[var(--steel)]"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Surface>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mono-label block mb-2">{label}</label>
      {children}
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={`${label} · ${value}/10`}>
      <Slider
        min={0}
        max={10}
        step={1}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        aria-label={label}
      />
    </Field>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[var(--graphite)] w-4 h-4"
      />
      {label}
    </label>
  );
}
