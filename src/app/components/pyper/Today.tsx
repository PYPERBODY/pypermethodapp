import { PageHeader, Surface } from "./Shell";
import { MEMBER, TODAY_CARDS, REMINDERS_TODAY } from "./data";
import { ArrowUpRight, Check, Clock } from "lucide-react";

function fmtDate() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function Today({ onGoExport }: { onGoExport: () => void }) {
  return (
    <>
      <PageHeader
        eyebrow={fmtDate()}
        title={`Good morning, ${MEMBER.firstName}.`}
        subtitle="Your PYPER Method Guide for today. Learn, track, review, and maintain a steady rhythm through the interactive guide."
      />

      {/* Next best action */}
      <Surface className="p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="mono-label mb-2">Next best action</div>
          <div style={{ fontFamily: "var(--font-serif)" }} className="text-xl leading-snug max-w-md">
            Log your tolerance check before lunch — keep the medication window calm.
          </div>
        </div>
        <button className="self-start md:self-auto inline-flex items-center gap-2 bg-[var(--graphite)] text-[var(--porcelain)] px-5 py-3 rounded-md text-sm hover:bg-black transition-colors">
          Open Tolerance Tracker
          <ArrowUpRight size={16} />
        </button>
      </Surface>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {TODAY_CARDS.map((c) => (
          <Surface key={c.key} className="p-5 flex flex-col gap-3">
            <div className="mono-label">{c.label}</div>
            <div className="text-lg" style={{ fontFamily: "var(--font-serif)" }}>
              {c.value}
            </div>
            <div className="h-[3px] w-full bg-[var(--bone)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--med-blue)]"
                style={{ width: `${c.progress}%` }}
              />
            </div>
            <p className="text-xs text-[var(--soft-text)]">{c.hint}</p>
          </Surface>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reminders today */}
        <Surface className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="mono-label mb-1">Today's reminders</div>
              <h3>Calm cadence</h3>
            </div>
            <span className="mono-label">{REMINDERS_TODAY.length} scheduled</span>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {REMINDERS_TODAY.map((r) => (
              <li key={r.time} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm w-12 text-[var(--steel)]">
                    {r.time}
                  </span>
                  <div>
                    <div className="text-sm">{r.label}</div>
                    <div className="mono-label">{r.type}</div>
                  </div>
                </div>
                <button className="inline-flex items-center gap-1.5 text-xs text-[var(--steel)] hover:text-[var(--graphite)]">
                  <Check size={14} /> Mark done
                </button>
              </li>
            ))}
          </ul>
        </Surface>

        {/* Weekly check-in */}
        <Surface className="p-6 flex flex-col">
          <div className="mono-label mb-2">Weekly PYPER Review</div>
          <h3 className="mb-3">Check-in is 64% prepared</h3>
          <div className="h-1.5 w-full bg-[var(--bone)] rounded-full overflow-hidden mb-4">
            <div className="h-full bg-[var(--graphite)]" style={{ width: "64%" }} />
          </div>
          <ul className="space-y-2 text-sm text-[var(--soft-text)] mb-5">
            <li className="flex items-center gap-2"><Check size={14} /> Body metrics reviewed</li>
            <li className="flex items-center gap-2"><Check size={14} /> Medication rhythm logged</li>
            <li className="flex items-center gap-2"><Clock size={14} /> Tolerance summary pending</li>
            <li className="flex items-center gap-2"><Clock size={14} /> 2 guide questions saved</li>
          </ul>
          <button
            onClick={onGoExport}
            className="mt-auto inline-flex items-center justify-center gap-2 border border-[var(--graphite)] text-[var(--graphite)] px-4 py-2.5 rounded-md text-sm hover:bg-[var(--graphite)] hover:text-[var(--porcelain)] transition-colors"
          >
            Export guide summary
            <ArrowUpRight size={14} />
          </button>
        </Surface>
      </div>
    </>
  );
}
