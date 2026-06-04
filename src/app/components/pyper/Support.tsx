import { useState } from "react";
import { PageHeader, Surface } from "./Shell";
import { Download, Copy, MessageSquarePlus, FileText } from "lucide-react";

const QUESTIONS = [
  { q: "Nausea pattern after Sunday dose — is current timing optimal?", priority: "Medium", category: "Medication" },
  { q: "Approved electrolyte brand on travel weeks?", priority: "Low", category: "Hydration" },
];

export function Support() {
  const [showExport, setShowExport] = useState(false);
  return (
    <>
      <PageHeader
        eyebrow="Guide support"
        title="Guide questions, exports, and community boundaries."
        subtitle="Prepare your check-ins. Export a clean summary. Community guidelines keep the conversation safe."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Surface className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="mono-label mb-1">Provider queue</div>
              <h3>Guide questions for your clinician</h3>
            </div>
            <button className="text-xs inline-flex items-center gap-1.5 border border-[var(--border)] px-3 py-1.5 rounded-md hover:bg-[var(--ivory)]">
              <MessageSquarePlus size={14} /> Add question
            </button>
          </div>
          <ul className="space-y-3">
            {QUESTIONS.map((q) => (
              <li
                key={q.q}
                className="border border-[var(--border)] rounded-md p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="mono-label">{q.category}</span>
                  <span className="mono-label">{q.priority}</span>
                </div>
                <div className="text-sm">{q.q}</div>
              </li>
            ))}
          </ul>
        </Surface>

        <Surface className="p-6">
          <div className="mono-label mb-1">Export</div>
          <h3 className="mb-3">Check-in summary</h3>
          <p className="text-sm mb-4">
            A clean, printable summary of body metrics, medication rhythm, supplements,
            tolerance, mental health, protein/hydration, training, and skin — for your next
            clinician check-in.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowExport(true)}
              className="inline-flex items-center gap-2 bg-[var(--graphite)] text-[var(--porcelain)] px-4 py-2 rounded-md text-sm"
            >
              <FileText size={14} /> View summary
            </button>
            <button className="inline-flex items-center gap-2 border border-[var(--border)] px-4 py-2 rounded-md text-sm hover:bg-[var(--ivory)]">
              <Download size={14} /> Download PDF
            </button>
            <button className="inline-flex items-center gap-2 border border-[var(--border)] px-4 py-2 rounded-md text-sm hover:bg-[var(--ivory)]">
              <Copy size={14} /> Copy text
            </button>
          </div>
          <div className="mono-label mt-4">
            Guide exports do not automatically send to email or a clinician. Secure send-to-clinician support arrives
            with the clinical workflow.
          </div>
        </Surface>
      </div>

      <Surface className="p-6 mb-8">
        <div className="mono-label mb-2">Community guidelines</div>
        <h3 className="mb-3">Guide community</h3>
        <ul className="text-sm space-y-2 text-[var(--soft-text)]">
          <li>· No medical or dose advice in guide community spaces.</li>
          <li>· No body shaming, before/after pressure, or supplement pushing.</li>
          <li>· Escalate medical concerns to your clinician — not the community.</li>
          <li>· Community link is reserved for verified guide access.</li>
        </ul>
      </Surface>

      {showExport && <ExportPreview onClose={() => setShowExport(false)} />}
    </>
  );
}

function ExportPreview({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[var(--border)] p-5 flex items-center justify-between">
          <div>
            <div className="mono-label">Check-in summary</div>
            <h3>Last 30 days · Alex</h3>
          </div>
          <button
            onClick={onClose}
            className="text-sm text-[var(--steel)] hover:text-[var(--graphite)]"
          >
            Close
          </button>
        </div>
        <div className="p-6 space-y-5 text-sm">
          <Section title="Body metrics">Weight 184 → 173 lb · waist −2.5 in · steady barrier.</Section>
          <Section title="Medication rhythm">Sunday 8:00am · thigh rotation · no missed doses.</Section>
          <Section title="Supplements">Protein, electrolytes, magnesium, B12 — clinician approved.</Section>
          <Section title="Tolerance">Mild nausea after dose, resolved same day. No red flags.</Section>
          <Section title="Mental health">Mood steady · sleep 7.2h avg · low body-image concern.</Section>
          <Section title="Protein + hydration">Protein 96% of target · hydration 78% of target.</Section>
          <Section title="Training">3 strength · 2 Pilates · 38k steps/week avg.</Section>
          <Section title="Body-care">AM/PM 92% adherence · brief barrier flare W6 (resolved).</Section>
          <Section title="Provider questions">2 open — see queue.</Section>
          <Section title="Red flags">None this period.</Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mono-label mb-1">{title}</div>
      <div>{children}</div>
    </div>
  );
}
