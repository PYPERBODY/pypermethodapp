import { useMemo, useState } from "react";
import { PageHeader, Surface } from "./Shell";
import { useHealthContext } from "./HealthContextProvider";
import {
  EXPORT_DISCLAIMER,
  EXPORT_SECTIONS,
  type ExportSectionId,
} from "./healthContextData";
import { Download, Copy, MessageSquarePlus, FileText, Lock } from "lucide-react";

const QUESTIONS = [
  { q: "Nausea pattern after Sunday dose — is current timing optimal?", priority: "Medium", category: "Medication" },
  { q: "Approved electrolyte brand on travel weeks?", priority: "Low", category: "Hydration" },
];

export function Support() {
  const [showExport, setShowExport] = useState(false);
  const hc = useHealthContext();

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Provider questions, exports, and community."
        subtitle="Prepare your check-ins. Export a clean summary. Community guidelines keep the conversation safe."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Surface className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="mono-label mb-1">Provider queue</div>
              <h3>Questions for provider</h3>
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
            {hc.state.symptoms
              .filter((s) => s.addToProviderQuestions)
              .map((s) => (
                <li key={s.id} className="border border-[var(--border)] rounded-md p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="mono-label">Health Context</span>
                    <span className="mono-label">From symptoms</span>
                  </div>
                  <div className="text-sm">
                    Discuss {s.name.toLowerCase()} ({s.severity})
                  </div>
                </li>
              ))}
          </ul>
        </Surface>

        <Surface className="p-6">
          <div className="mono-label mb-1">Export</div>
          <h3 className="mb-3">Check-in summary</h3>
          <p className="text-sm mb-4">
            A clean, printable summary of body metrics, medication rhythm, supplements,
            tolerance, mental health, protein/hydration, training, skin, and optional Health
            Context sections you choose to include.
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
            Exports do not automatically send to email or provider. Secure send-to-provider arrives
            with the clinical workflow.
          </div>
        </Surface>
      </div>

      <Surface className="p-6 mb-8">
        <div className="mono-label mb-2 inline-flex items-center gap-1.5">
          <Lock size={12} /> Health Context export preferences
        </div>
        <h3 className="mb-3">Choose sections before export</h3>
        <p className="text-sm mb-4 text-[var(--soft-text)]">
          All sensitive Health Context sections are optional. Partner activity, affiliate clicks,
          community activity, referral systems, social sharing, and marketing tools never receive
          this information.
        </p>
        <p className="text-sm border-l-2 border-[var(--med-blue)] pl-3 mb-4">{EXPORT_DISCLAIMER}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EXPORT_SECTIONS.map((s) => {
            const on = hc.state.exportSections.includes(s.id);
            return (
              <label
                key={s.id}
                className="flex items-center gap-3 border border-[var(--border)] rounded-md px-3 py-2.5 text-sm"
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => hc.toggleExportSection(s.id)}
                />
                <span>
                  {s.label}
                  <span className="mono-label block mt-0.5">
                    Include this item in provider export: {on ? "Yes" : "No"}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </Surface>

      <Surface className="p-6 mb-8">
        <div className="mono-label mb-2">Community guidelines</div>
        <h3 className="mb-3">Member community</h3>
        <ul className="text-sm space-y-2 text-[var(--soft-text)]">
          <li>· No medical or dose advice between members.</li>
          <li>· No body shaming, before/after pressure, or supplement pushing.</li>
          <li>· Escalate medical concerns to your clinician — not the community.</li>
          <li>· Health Context details never appear in community or public profiles.</li>
          <li>· Discord / member community link is reserved for verified members.</li>
        </ul>
      </Surface>

      {showExport && <ExportPreview onClose={() => setShowExport(false)} />}
    </>
  );
}

function ExportPreview({ onClose }: { onClose: () => void }) {
  const { state, startingBmi, currentBmi, bmiChange } = useHealthContext();
  const enabled = useMemo(
    () => new Set(state.exportSections),
    [state.exportSections]
  );

  const include = (id: ExportSectionId) => enabled.has(id);

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
          <p className="text-xs text-[var(--soft-text)] border-l-2 border-[var(--med-blue)] pl-3">
            {EXPORT_DISCLAIMER}
          </p>

          <Section title="Body metrics">Weight 184 → 173 lb · waist −2.5 in · steady barrier.</Section>

          {include("body_bmi") && (
            <Section title="Body metrics and BMI">
              Height {state.bodyMetrics.heightInches ?? "—"} in · starting BMI {startingBmi ?? "—"} ·
              current BMI {currentBmi ?? "—"} · change {bmiChange == null ? "—" : bmiChange}. BMI is a
              screening measurement only.
            </Section>
          )}

          {include("weight_trend") && (
            <Section title="Weight trend">
              {state.bodyMetrics.weightChange12Months || "No 12-month note recorded."}
            </Section>
          )}

          <Section title="Medication rhythm">Sunday 8:00am · thigh rotation · no missed doses.</Section>

          {include("medications") && (
            <Section title="Current medications and treatments">
              {state.medications
                .filter((m) => m.includeInExport)
                .map((m) => `${m.name} (${m.category}${m.currentlyTaking ? ", current" : ""})`)
                .join(" · ") || "None selected for export."}
            </Section>
          )}

          {include("conditions") && (
            <Section title="Diagnosed or suspected conditions">
              {state.conditions.length
                ? state.conditions
                    .filter((c) => c.includeInExport)
                    .map((c) => `${c.name} — ${c.status}`)
                    .join("; ") || "No detailed conditions marked for export."
                : Object.entries(state.multiSelect)
                    .filter(([k]) => ["general", "metabolic", "thyroid"].includes(k))
                    .flatMap(([, v]) => v)
                    .filter((v) => v !== "None known" && v !== "Prefer not to answer")
                    .join("; ") || "No conditions selected for export."}
            </Section>
          )}

          {include("hormonal") && (
            <Section title="Hormonal and reproductive context">
              {[
                ...(state.multiSelect.menstrual ?? []),
                ...(state.multiSelect.pcos ?? []),
                ...(state.multiSelect.perimenopause ?? []),
                ...(state.multiSelect.pregnancy ?? []),
              ]
                .filter((v) => v !== "Prefer not to answer")
                .join("; ") || "No hormonal/reproductive items selected for export."}
            </Section>
          )}

          {include("testosterone") && (
            <Section title="Testosterone and androgen context">
              {[...(state.multiSelect.testosterone ?? []), ...(state.multiSelect.androgen_symptoms ?? [])]
                .filter((v) => !["Prefer not to answer", "None"].includes(v))
                .join("; ") || "No testosterone/androgen items selected for export."}
            </Section>
          )}

          {include("prostate_urinary_testicular") && (
            <Section title="Prostate, urinary or testicular context">
              {[
                ...(state.multiSelect.prostate ?? []),
                ...(state.multiSelect.urinary ?? []),
                ...(state.multiSelect.testicular ?? []),
              ]
                .filter((v) => !["None known", "Prefer not to answer"].includes(v))
                .join("; ") || "No prostate/urinary/testicular items selected for export."}
            </Section>
          )}

          <Section title="Supplements">Protein, electrolytes, magnesium, B12 — clinician approved.</Section>
          <Section title="Tolerance">Mild nausea after dose, resolved same day. No red flags.</Section>
          <Section title="Mental health">Mood steady · sleep 7.2h avg · low body-image concern.</Section>

          {include("symptoms") && (
            <Section title="Selected symptoms and severity">
              {state.symptoms
                .filter((s) => s.includeInExport)
                .map((s) => `${s.name} (${s.severity})`)
                .join("; ") || "No symptoms marked for export."}
            </Section>
          )}

          <Section title="Protein + hydration">Protein 96% of target · hydration 78% of target.</Section>
          <Section title="Training">3 strength · 2 Pilates · 38k steps/week avg.</Section>
          <Section title="Body-care">AM/PM 92% adherence · brief barrier flare W6 (resolved).</Section>

          {include("timeline") && (
            <Section title="Timeline changes">
              {state.timeline
                .slice(0, 5)
                .map((t) => t.label)
                .join(" · ") || "No timeline markers."}
            </Section>
          )}

          {include("provider_questions") && (
            <Section title="Questions for provider">
              {[
                ...QUESTIONS.map((q) => q.q),
                ...state.symptoms
                  .filter((s) => s.addToProviderQuestions)
                  .map((s) => `Discuss ${s.name.toLowerCase()} (${s.severity})`),
              ].join(" · ")}
            </Section>
          )}

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
