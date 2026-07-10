import { useMemo, useState } from "react";
import { PageHeader, Surface } from "./Shell";
import { useHealthContext } from "./HealthContextProvider";
import {
  ANDROGEN_SYMPTOMS,
  BMI_NOTE,
  CONDITION_STATUSES,
  EXPORT_DISCLAIMER,
  EXPORT_SECTIONS,
  GENDER_AFFIRMING_OPTIONS,
  GENERAL_CONDITIONS,
  HEALTH_MODULES,
  HEALTH_SCOPE_NOTE,
  HEALTH_SYMPTOMS,
  MEDICATION_CATEGORIES,
  MEDICATION_CHANGE_NOTE,
  MENSTRUAL_OPTIONS,
  METABOLIC_CONDITIONS,
  PCOS_OPTIONS,
  PERIMENOPAUSE_OPTIONS,
  PREGNANCY_OPTIONS,
  PREGNANCY_SAFETY_NOTE,
  PRIVACY_HEALTH_NOTE,
  PROSTATE_OPTIONS,
  REPRODUCTIVE_CONDITIONS,
  TESTICULAR_OPTIONS,
  TESTICULAR_RED_FLAG,
  TESTICULAR_SYMPTOMS,
  TESTOSTERONE_CONDITIONS,
  THYROID_CONDITIONS,
  URINARY_RED_FLAG,
  URINARY_SYMPTOMS,
  type ConditionStatus,
  type HealthModuleId,
  type SymptomSeverity,
} from "./healthContextData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  ArrowLeft,
  Lock,
  Plus,
  Save,
  ShieldAlert,
  Trash2,
} from "lucide-react";

type PanelProps = {
  onBack?: () => void;
  embedded?: boolean;
};

const PHASE2_MODULE_IDS: HealthModuleId[] = [
  "general",
  "metabolic",
  "thyroid",
  "testosterone",
  "menstrual",
  "pcos",
  "perimenopause",
  "pregnancy",
  "prostate",
  "testicular",
  "gender_affirming",
];

/**
 * Phase 4 — provider export, privacy controls, neutral timeline, safety scope.
 * Prototype React state only — production requires authenticated secure storage.
 * Health Context data never flows to partner/affiliate/member-benefit features.
 */
export function HealthContextPanel({ onBack, embedded }: PanelProps) {
  const hc = useHealthContext();
  const { state } = hc;
  const hasModules = state.selectedModules.some((m) => PHASE2_MODULE_IDS.includes(m));

  return (
    <div>
      {!embedded && (
        <PageHeader
          eyebrow="Private · Health Context"
          title="Your Health Context"
          subtitle="Your body does not change in isolation. Hormones, medical conditions, medications, sleep, stress, reproductive history, previous treatment, and changes in muscle or body composition may all shape how you feel and how you experience progress."
        />
      )}

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--steel)] hover:text-[var(--graphite)]"
        >
          <ArrowLeft size={16} /> Back to Method chapters
        </button>
      )}

      {embedded && (
        <div className="mb-6">
          <div className="mono-label mb-2">Private profile · Health Context</div>
          <h2 className="mb-2">Your Health Context</h2>
          <p className="text-sm max-w-2xl">
            This private section helps you record context and prepare for more informed
            conversations with your healthcare provider. You may skip any question. Your answers
            do not create a diagnosis and are not used to make automatic treatment recommendations.
          </p>
        </div>
      )}

      <Surface className="p-5 mb-6 flex items-start gap-3 bg-[var(--ivory)]">
        <Lock size={16} className="mt-0.5 shrink-0 text-[var(--steel)]" />
        <div className="text-sm space-y-2">
          <p>{HEALTH_SCOPE_NOTE}</p>
          <p>{PRIVACY_HEALTH_NOTE}</p>
          <p className="mono-label">
            Storage mode: {state.storageMode} · prototype React state only · production health data
            requires secure authenticated storage with RLS · never sent to forms, sheets, analytics,
            partners, affiliates, member benefits, or email marketing
          </p>
        </div>
      </Surface>

      <ModuleSelection />

      <div className="mt-8 space-y-6">
        <BodyMetricsSection />
        {hasModules && <ConditionalModules />}
        <MedicationsSection />
        <SymptomsSection />
        <PrivacyExportSection />
        <TimelineSection />
        <HealthContextSafetyNotes />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => hc.markUpdated("Health Context updated")}
          className="inline-flex items-center gap-2 bg-[var(--graphite)] text-[var(--porcelain)] px-4 py-2.5 rounded-md text-sm"
        >
          <Save size={14} /> Save and continue later
        </button>
        <button
          type="button"
          onClick={() => hc.markUpdated("Health Context reviewed")}
          className="inline-flex items-center gap-2 border border-[var(--border)] px-4 py-2.5 rounded-md text-sm hover:bg-[var(--ivory)]"
        >
          Mark section reviewed
        </button>
      </div>
    </div>
  );
}

function ModuleSelection() {
  const { state, setModules } = useHealthContext();

  const toggle = (id: HealthModuleId) => {
    if (id === "none" || id === "prefer_not") {
      setModules(state.selectedModules.includes(id) ? [] : [id]);
      return;
    }
    const withoutExclusive = state.selectedModules.filter(
      (m) => m !== "none" && m !== "prefer_not"
    );
    if (withoutExclusive.includes(id)) {
      setModules(withoutExclusive.filter((m) => m !== id));
    } else {
      setModules([...withoutExclusive, id]);
    }
  };

  return (
    <Surface className="p-6">
      <div className="mono-label mb-2">Health module selection</div>
      <h3 className="mb-2">
        Which health areas would you like to include in your private profile? Select all that
        apply.
      </h3>
      <p className="text-sm mb-5 text-[var(--soft-text)]">
        Only questions connected to your selections will appear. You can add or remove modules
        later. This is not a binary male/female form. Every question can be skipped.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {HEALTH_MODULES.map((m) => {
          const on = state.selectedModules.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => toggle(m.id)}
              aria-pressed={on}
              className={`text-left px-4 py-3 rounded-md border text-sm transition-colors ${
                on
                  ? "border-[var(--graphite)] bg-[var(--graphite)] text-[var(--porcelain)]"
                  : "border-[var(--border)] hover:bg-[var(--ivory)]"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
      <p className="mono-label mt-4">Skip any question · Prefer not to answer is always available</p>
    </Surface>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mono-label mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function NumInput({
  value,
  onChange,
  placeholder,
  step = 0.1,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
  step?: number;
}) {
  return (
    <input
      type="number"
      step={step}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === "" ? null : Number(raw));
      }}
      className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-sm bg-white"
    />
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-sm bg-white"
    />
  );
}

function BodyMetricsSection() {
  const { state, updateBodyMetrics, startingBmi, currentBmi, bmiChange } = useHealthContext();
  const bm = state.bodyMetrics;
  const [skipped, setSkipped] = useState(false);

  if (skipped) {
    return (
      <Surface className="p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="mono-label mb-1">Body metrics & BMI</div>
          <p className="text-sm text-[var(--soft-text)]">Section skipped. You can return anytime.</p>
        </div>
        <button
          type="button"
          onClick={() => setSkipped(false)}
          className="text-xs border border-[var(--border)] px-3 py-1.5 rounded-md hover:bg-[var(--ivory)]"
        >
          Edit body metrics
        </button>
      </Surface>
    );
  }

  return (
    <Surface className="p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <div className="mono-label mb-2">Body metrics & BMI</div>
          <h3>Screening measurements</h3>
        </div>
        <button
          type="button"
          onClick={() => setSkipped(true)}
          className="text-xs border border-[var(--border)] px-3 py-1.5 rounded-md hover:bg-[var(--ivory)]"
        >
          Skip section
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <Field label="Height">
          <NumInput
            value={bm.heightInches}
            onChange={(v) => updateBodyMetrics({ heightInches: v })}
            placeholder="inches"
          />
        </Field>
        <Field label="Starting weight">
          <NumInput
            value={bm.startingWeightLb}
            onChange={(v) => updateBodyMetrics({ startingWeightLb: v })}
            placeholder="lb"
          />
        </Field>
        <Field label="Current weight">
          <NumInput
            value={bm.currentWeightLb}
            onChange={(v) => updateBodyMetrics({ currentWeightLb: v })}
            placeholder="lb"
          />
        </Field>
        <Field label="Goal weight, optional">
          <NumInput
            value={bm.goalWeightLb}
            onChange={(v) => updateBodyMetrics({ goalWeightLb: v })}
            placeholder="lb"
          />
        </Field>
        <Field label="Highest adult weight, optional">
          <NumInput
            value={bm.highestAdultWeightLb}
            onChange={(v) => updateBodyMetrics({ highestAdultWeightLb: v })}
            placeholder="lb"
          />
        </Field>
        <Field label="Lowest adult weight, optional">
          <NumInput
            value={bm.lowestAdultWeightLb}
            onChange={(v) => updateBodyMetrics({ lowestAdultWeightLb: v })}
            placeholder="lb"
          />
        </Field>
        <Field label="Waist measurement, optional">
          <NumInput value={bm.waist} onChange={(v) => updateBodyMetrics({ waist: v })} />
        </Field>
        <Field label="Hip measurement, optional">
          <NumInput value={bm.hips} onChange={(v) => updateBodyMetrics({ hips: v })} />
        </Field>
        <Field label="Chest measurement, optional">
          <NumInput value={bm.chest} onChange={(v) => updateBodyMetrics({ chest: v })} />
        </Field>
        <Field label="Arm measurement, optional">
          <NumInput value={bm.arm} onChange={(v) => updateBodyMetrics({ arm: v })} />
        </Field>
        <Field label="Thigh measurement, optional">
          <NumInput value={bm.thigh} onChange={(v) => updateBodyMetrics({ thigh: v })} />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Weight change during the previous 12 months">
          <TextInput
            value={bm.weightChange12Months}
            onChange={(v) => updateBodyMetrics({ weightChange12Months: v })}
            placeholder="Skip if preferred"
          />
        </Field>
        <Field label="Recent unexplained weight gain or loss">
          <TextInput
            value={bm.unexplainedChange}
            onChange={(v) => updateBodyMetrics({ unexplainedChange: v })}
            placeholder="Skip if preferred"
          />
        </Field>
        <Field label="Clothing fit">
          <TextInput
            value={bm.clothingFit}
            onChange={(v) => updateBodyMetrics({ clothingFit: v })}
            placeholder="Skip if preferred"
          />
        </Field>
        <Field label="Notes">
          <TextInput
            value={bm.notes}
            onChange={(v) => updateBodyMetrics({ notes: v })}
            placeholder="Skip if preferred"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <BmiCard label="Starting BMI" value={startingBmi} />
        <BmiCard label="Current BMI" value={currentBmi} />
        <BmiCard
          label="Change in BMI"
          value={bmiChange}
          display={bmiChange == null ? "—" : `${bmiChange > 0 ? "+" : ""}${bmiChange}`}
        />
      </div>
      <p className="text-sm text-[var(--soft-text)] border-l-2 border-[var(--med-blue)] pl-3">
        {BMI_NOTE}
      </p>
    </Surface>
  );
}

function BmiCard({
  label,
  value,
  display,
}: {
  label: string;
  value: number | null;
  display?: string;
}) {
  return (
    <div className="border border-[var(--border)] rounded-md p-4 bg-[var(--porcelain)]">
      <div className="mono-label mb-1">{label}</div>
      <div style={{ fontFamily: "var(--font-serif)" }} className="text-2xl">
        {display ?? (value == null ? "—" : value.toFixed(1))}
      </div>
    </div>
  );
}

function ChipGroup({
  group,
  options,
}: {
  group: string;
  options: string[];
}) {
  const { state, toggleMulti } = useHealthContext();
  const selected = state.multiSelect[group] ?? [];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggleMulti(group, opt)}
            aria-pressed={on}
            className={`px-3 py-1.5 rounded-md border text-xs transition-colors ${
              on
                ? "bg-[var(--graphite)] text-[var(--porcelain)] border-[var(--graphite)]"
                : "border-[var(--border)] hover:bg-[var(--ivory)]"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ModuleBlock({
  title,
  children,
  notice,
  alert,
}: {
  title: string;
  children: React.ReactNode;
  notice?: string;
  alert?: string;
}) {
  return (
    <div className="border border-[var(--border)] rounded-md p-5 bg-[var(--porcelain)]">
      <h4 className="mb-3">{title}</h4>
      {notice && <p className="text-sm text-[var(--soft-text)] mb-3">{notice}</p>}
      {alert && (
        <div className="mb-3 flex gap-2 items-start border border-[#8a2a2a]/30 bg-[#fdf4f4] rounded-md p-3 text-sm">
          <ShieldAlert size={16} className="text-[#8a2a2a] mt-0.5 shrink-0" />
          <span>{alert}</span>
        </div>
      )}
      {children}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="text-xs border border-[var(--border)] px-3 py-1.5 rounded-md hover:bg-[var(--ivory)]"
        >
          Skip
        </button>
        <button
          type="button"
          className="text-xs border border-[var(--border)] px-3 py-1.5 rounded-md hover:bg-[var(--ivory)]"
          onClick={() => {
            /* Prefer not handled via chip options */
          }}
        >
          Prefer not to answer
        </button>
      </div>
    </div>
  );
}

function ConditionalModules() {
  const { state, addCondition, updateCondition, removeCondition, setMultiGroup } =
    useHealthContext();
  const mods = state.selectedModules;
  const [draftName, setDraftName] = useState("");
  const [draftStatus, setDraftStatus] = useState<ConditionStatus>("diagnosed");
  const [draftModule, setDraftModule] = useState<HealthModuleId>("general");
  const [cycleLength, setCycleLength] = useState((state.multiSelect.cycle_length ?? [])[0] ?? "");
  const [lossHistory, setLossHistory] = useState("");

  const urinarySelected = state.multiSelect.urinary ?? [];
  const showUrinaryFlag = urinarySelected.some((s) =>
    ["Inability to urinate", "Blood in urine", "Severe pelvic pain", "Severe or rapidly worsening symptoms"].includes(
      s
    )
  );
  const testicularSx = state.multiSelect.testicular_symptoms ?? [];
  const showTesticularFlag = testicularSx.includes("Testicular discomfort") || testicularSx.includes("New testicular change");

  return (
    <Surface className="p-6">
      <div className="mono-label mb-2">Conditional health modules</div>
      <h3 className="mb-4">Context connected to your selections</h3>

      <Accordion type="multiple" className="w-full space-y-2">
        {mods.includes("general") && (
          <AccordionItem value="general">
            <AccordionTrigger>General health and medical conditions</AccordionTrigger>
            <AccordionContent>
              <ModuleBlock title="Conditions">
                <ChipGroup group="general" options={GENERAL_CONDITIONS} />
              </ModuleBlock>
            </AccordionContent>
          </AccordionItem>
        )}

        {mods.includes("metabolic") && (
          <AccordionItem value="metabolic">
            <AccordionTrigger>Metabolic health</AccordionTrigger>
            <AccordionContent>
              <ModuleBlock
                title="Metabolic context"
                notice="Do not interpret laboratory results or label results normal or abnormal unless that information comes from a licensed provider workflow."
              >
                <ChipGroup group="metabolic" options={METABOLIC_CONDITIONS} />
              </ModuleBlock>
            </AccordionContent>
          </AccordionItem>
        )}

        {mods.includes("thyroid") && (
          <AccordionItem value="thyroid">
            <AccordionTrigger>Thyroid and endocrine health</AccordionTrigger>
            <AccordionContent>
              <ModuleBlock title="Thyroid / endocrine">
                <ChipGroup group="thyroid" options={THYROID_CONDITIONS} />
              </ModuleBlock>
            </AccordionContent>
          </AccordionItem>
        )}

        {mods.includes("menstrual") && (
          <AccordionItem value="menstrual">
            <AccordionTrigger>Menstrual and cycle health</AccordionTrigger>
            <AccordionContent>
              <ModuleBlock title="Cycle history">
                <ChipGroup group="menstrual" options={MENSTRUAL_OPTIONS} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <Field label="Average cycle length (optional)">
                    <TextInput
                      value={cycleLength}
                      onChange={(v) => {
                        setCycleLength(v);
                        setMultiGroup("cycle_length", v ? [v] : []);
                      }}
                      placeholder="e.g. 28 days"
                    />
                  </Field>
                  <Field label="Date of most recent period (optional)">
                    <input
                      type="date"
                      className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-sm bg-white"
                      onChange={(e) =>
                        setMultiGroup("last_period", e.target.value ? [e.target.value] : [])
                      }
                    />
                  </Field>
                </div>
              </ModuleBlock>
              <div className="mt-4">
                <ModuleBlock title="Other reproductive conditions">
                  <ChipGroup group="reproductive" options={REPRODUCTIVE_CONDITIONS} />
                </ModuleBlock>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {mods.includes("pcos") && (
          <AccordionItem value="pcos">
            <AccordionTrigger>PCOS</AccordionTrigger>
            <AccordionContent>
              <ModuleBlock
                title="PCOS and related context"
                notice="The guide must not diagnose PCOS from selected symptoms."
              >
                <ChipGroup group="pcos" options={PCOS_OPTIONS} />
              </ModuleBlock>
            </AccordionContent>
          </AccordionItem>
        )}

        {mods.includes("perimenopause") && (
          <AccordionItem value="perimenopause">
            <AccordionTrigger>Perimenopause or menopause</AccordionTrigger>
            <AccordionContent>
              <ModuleBlock title="Perimenopause / menopause context">
                <ChipGroup group="perimenopause" options={PERIMENOPAUSE_OPTIONS} />
              </ModuleBlock>
            </AccordionContent>
          </AccordionItem>
        )}

        {mods.includes("pregnancy") && (
          <AccordionItem value="pregnancy">
            <AccordionTrigger>Pregnancy, postpartum or fertility</AccordionTrigger>
            <AccordionContent>
              <ModuleBlock title="Pregnancy / fertility context" alert={PREGNANCY_SAFETY_NOTE}>
                <ChipGroup group="pregnancy" options={PREGNANCY_OPTIONS} />
                <p className="text-xs text-[var(--soft-text)] mt-3">
                  Pregnancy loss questions are optional, gently worded, and skippable. Leave blank
                  if you prefer not to share.
                </p>
                <div className="mt-3">
                  <Field label="Pregnancy loss history (optional)">
                    <TextInput
                      value={lossHistory}
                      onChange={(v) => {
                        setLossHistory(v);
                        setMultiGroup("pregnancy_loss", v ? [v] : []);
                      }}
                      placeholder="Skip if preferred"
                    />
                  </Field>
                </div>
              </ModuleBlock>
            </AccordionContent>
          </AccordionItem>
        )}

        {mods.includes("testosterone") && (
          <AccordionItem value="testosterone">
            <AccordionTrigger>Testosterone and androgen health</AccordionTrigger>
            <AccordionContent>
              <ModuleBlock
                title="Androgen / testosterone context"
                notice="Symptoms must not trigger an automatic low-testosterone diagnosis or treatment suggestion."
              >
                <ChipGroup group="testosterone" options={TESTOSTERONE_CONDITIONS} />
                <div className="mt-4">
                  <div className="mono-label mb-2">Symptom baseline</div>
                  <ChipGroup group="androgen_symptoms" options={ANDROGEN_SYMPTOMS} />
                </div>
              </ModuleBlock>
            </AccordionContent>
          </AccordionItem>
        )}

        {mods.includes("testicular") && (
          <AccordionItem value="testicular">
            <AccordionTrigger>Testicular and reproductive health</AccordionTrigger>
            <AccordionContent>
              <ModuleBlock
                title="Testicular / reproductive context"
                alert={showTesticularFlag ? TESTICULAR_RED_FLAG : undefined}
                notice="Do not attempt to determine the cause."
              >
                <ChipGroup group="testicular" options={TESTICULAR_OPTIONS} />
                <div className="mt-4">
                  <div className="mono-label mb-2">Optional symptoms</div>
                  <ChipGroup group="testicular_symptoms" options={TESTICULAR_SYMPTOMS} />
                </div>
              </ModuleBlock>
            </AccordionContent>
          </AccordionItem>
        )}

        {mods.includes("prostate") && (
          <AccordionItem value="prostate">
            <AccordionTrigger>Prostate and urinary health</AccordionTrigger>
            <AccordionContent>
              <ModuleBlock
                title="Prostate / urinary context"
                alert={showUrinaryFlag ? URINARY_RED_FLAG : undefined}
                notice="Do not interpret the cause."
              >
                <ChipGroup group="prostate" options={PROSTATE_OPTIONS} />
                <div className="mt-4">
                  <div className="mono-label mb-2">Urinary symptoms</div>
                  <ChipGroup group="urinary" options={URINARY_SYMPTOMS} />
                </div>
              </ModuleBlock>
            </AccordionContent>
          </AccordionItem>
        )}

        {mods.includes("gender_affirming") && (
          <AccordionItem value="gender_affirming">
            <AccordionTrigger>Gender-affirming hormone and surgical context</AccordionTrigger>
            <AccordionContent>
              <ModuleBlock
                title="Optional and private"
                notice="Do not infer anatomy, identity, fertility, menstrual status, prostate status, or pregnancy potential from a gender label."
              >
                <ChipGroup group="gender_affirming" options={GENDER_AFFIRMING_OPTIONS} />
              </ModuleBlock>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <div className="rule my-6" />

      <div className="mono-label mb-2">Condition detail (optional)</div>
      <p className="text-sm mb-3 text-[var(--soft-text)]">
        For selected items, you may add status, date diagnosed, clinician, treatment, and notes.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <Field label="Condition name">
          <TextInput value={draftName} onChange={setDraftName} placeholder="Optional detail" />
        </Field>
        <Field label="Status">
          <select
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value as ConditionStatus)}
            className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-sm bg-white"
          >
            {CONDITION_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Module">
          <select
            value={draftModule}
            onChange={(e) => setDraftModule(e.target.value as HealthModuleId)}
            className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-sm bg-white"
          >
            {PHASE2_MODULE_IDS.map((id) => (
              <option key={id} value={id}>
                {HEALTH_MODULES.find((m) => m.id === id)?.label ?? id}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex items-end">
          <button
            type="button"
            disabled={!draftName.trim()}
            onClick={() => {
              addCondition({
                name: draftName.trim(),
                module: draftModule,
                status: draftStatus,
                includeInExport: true,
              });
              setDraftName("");
            }}
            className="inline-flex items-center gap-1.5 bg-[var(--graphite)] text-[var(--porcelain)] px-4 py-2 rounded-md text-sm disabled:opacity-40"
          >
            <Plus size={14} /> Add detail
          </button>
        </div>
      </div>
      {state.conditions.length > 0 && (
        <ul className="space-y-2">
          {state.conditions.map((c) => (
            <li
              key={c.id}
              className="border border-[var(--border)] rounded-md px-4 py-3 text-sm space-y-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div>{c.name}</div>
                  <div className="mono-label mt-0.5">
                    {CONDITION_STATUSES.find((s) => s.id === c.status)?.label} · {c.module}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeCondition(c.id)}
                  className="text-[var(--steel)] hover:text-[var(--graphite)]"
                  aria-label={`Delete ${c.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Edit status">
                  <select
                    value={c.status}
                    onChange={(e) =>
                      updateCondition(c.id, { status: e.target.value as ConditionStatus })
                    }
                    className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-sm bg-white"
                  >
                    {CONDITION_STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <label className="inline-flex items-center gap-2 text-xs self-end pb-2">
                  <input
                    type="checkbox"
                    checked={c.includeInExport}
                    onChange={(e) =>
                      updateCondition(c.id, { includeInExport: e.target.checked })
                    }
                  />
                  Include this item in provider export: {c.includeInExport ? "Yes" : "No"}
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Surface>
  );
}

function MedicationsSection() {
  const { state, addMedication, updateMedication, removeMedication } = useHealthContext();
  const [skipped, setSkipped] = useState(false);

  if (skipped) {
    return (
      <Surface className="p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="mono-label mb-1">Medications & treatments</div>
          <p className="text-sm text-[var(--soft-text)]">Section skipped. You can return anytime.</p>
        </div>
        <button
          type="button"
          onClick={() => setSkipped(false)}
          className="text-xs border border-[var(--border)] px-3 py-1.5 rounded-md hover:bg-[var(--ivory)]"
        >
          Edit medications
        </button>
      </Surface>
    );
  }

  return (
    <Surface className="p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <div className="mono-label mb-2">Medications & treatments</div>
          <h3>Beyond GLP-1</h3>
          <p className="text-sm mt-2 text-[var(--soft-text)] max-w-xl">{MEDICATION_CHANGE_NOTE}</p>
          <p className="text-sm mt-2 text-[var(--soft-text)] max-w-xl">
            Record medications and treatments privately. This section does not suggest medication
            changes or generate treatment recommendations. Data stays in Health Context — never in
            partner or member-benefit features.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSkipped(true)}
            className="text-xs border border-[var(--border)] px-3 py-1.5 rounded-md hover:bg-[var(--ivory)]"
          >
            Skip section
          </button>
          <button
            type="button"
            onClick={() => addMedication({ name: "" })}
            className="inline-flex items-center gap-1.5 border border-[var(--border)] px-3 py-2 rounded-md text-sm hover:bg-[var(--ivory)]"
          >
            <Plus size={14} /> Add entry
          </button>
        </div>
      </div>

      {state.medications.length === 0 ? (
        <p className="text-sm text-[var(--soft-text)]">
          No medications recorded yet. Add an entry or skip this section.
        </p>
      ) : (
        <div className="space-y-4">
          {state.medications.map((m) => (
            <div
              key={m.id}
              className="border border-[var(--border)] rounded-md p-4 bg-[var(--porcelain)]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Field label="Medication or treatment name">
                  <TextInput
                    value={m.name}
                    onChange={(v) => updateMedication(m.id, { name: v })}
                    placeholder="Name"
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={m.category}
                    onChange={(e) => updateMedication(m.id, { category: e.target.value })}
                    className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-sm bg-white"
                  >
                    {MEDICATION_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Formulation">
                  <TextInput
                    value={m.formulation}
                    onChange={(v) => updateMedication(m.id, { formulation: v })}
                    placeholder="e.g. tablet, injection"
                  />
                </Field>
                <Field label="Dose, optional">
                  <TextInput value={m.dose} onChange={(v) => updateMedication(m.id, { dose: v })} />
                </Field>
                <Field label="Frequency">
                  <TextInput
                    value={m.frequency}
                    onChange={(v) => updateMedication(m.id, { frequency: v })}
                  />
                </Field>
                <Field label="Currently taking">
                  <select
                    value={m.currentlyTaking ? "yes" : "no"}
                    onChange={(e) =>
                      updateMedication(m.id, { currentlyTaking: e.target.value === "yes" })
                    }
                    className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-sm bg-white"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </Field>
                <Field label="Start date">
                  <input
                    type="date"
                    value={m.startDate}
                    onChange={(e) => updateMedication(m.id, { startDate: e.target.value })}
                    className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-sm bg-white"
                  />
                </Field>
                <Field label="End date, if applicable">
                  <input
                    type="date"
                    value={m.endDate}
                    onChange={(e) => updateMedication(m.id, { endDate: e.target.value })}
                    className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-sm bg-white"
                  />
                </Field>
                <Field label="Reason prescribed, optional">
                  <TextInput
                    value={m.reason}
                    onChange={(v) => updateMedication(m.id, { reason: v })}
                    placeholder="Optional"
                  />
                </Field>
                <Field label="Member-observed changes">
                  <TextInput
                    value={m.observedChanges}
                    onChange={(v) => updateMedication(m.id, { observedChanges: v })}
                  />
                </Field>
                <Field label="Side effects or tolerance">
                  <TextInput
                    value={m.sideEffects}
                    onChange={(v) => updateMedication(m.id, { sideEffects: v })}
                  />
                </Field>
                <Field label="Notes for healthcare provider">
                  <TextInput
                    value={m.notesForProvider}
                    onChange={(v) => updateMedication(m.id, { notesForProvider: v })}
                  />
                </Field>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={m.includeInExport}
                    onChange={(e) =>
                      updateMedication(m.id, { includeInExport: e.target.checked })
                    }
                  />
                  Include this item in provider export: {m.includeInExport ? "Yes" : "No"}
                </label>
                <button
                  type="button"
                  onClick={() => removeMedication(m.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--steel)] hover:text-[var(--graphite)]"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Surface>
  );
}

function SymptomsSection() {
  const { state, selectSymptom, updateSymptom, removeSymptom, pushTimeline } = useHealthContext();
  const [skipped, setSkipped] = useState(false);
  const exclusive = ["None", "Prefer not to answer"];

  const available = useMemo(
    () => HEALTH_SYMPTOMS.filter((s) => !state.symptoms.some((x) => x.name === s)),
    [state.symptoms]
  );

  if (skipped) {
    return (
      <Surface className="p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="mono-label mb-1">Symptom baseline</div>
          <p className="text-sm text-[var(--soft-text)]">Section skipped. You can return anytime.</p>
        </div>
        <button
          type="button"
          onClick={() => setSkipped(false)}
          className="text-xs border border-[var(--border)] px-3 py-1.5 rounded-md hover:bg-[var(--ivory)]"
        >
          Edit symptoms
        </button>
      </Surface>
    );
  }

  return (
    <Surface className="p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <div className="mono-label mb-2">Hormonal & metabolic symptom baseline</div>
          <h3 className="mb-2">Track symptoms over time</h3>
          <p className="text-sm text-[var(--soft-text)] max-w-xl">
            Symptoms are recorded without assigning them to a diagnosis. No medication changes or
            treatment recommendations are generated from these selections.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSkipped(true)}
          className="text-xs border border-[var(--border)] px-3 py-1.5 rounded-md hover:bg-[var(--ivory)]"
        >
          Skip section
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {available.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => selectSymptom(s)}
            className="px-3 py-1.5 rounded-md border border-[var(--border)] text-xs hover:bg-[var(--ivory)]"
          >
            + {s}
          </button>
        ))}
      </div>

      {state.symptoms.length === 0 ? (
        <p className="text-sm text-[var(--soft-text)]">
          No symptoms recorded yet. Skip if preferred.
        </p>
      ) : (
        <ul className="space-y-3">
          {state.symptoms.map((s) => (
            <li key={s.id} className="border border-[var(--border)] rounded-md p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div style={{ fontFamily: "var(--font-serif)" }}>{s.name}</div>
                <button
                  type="button"
                  onClick={() => removeSymptom(s.id)}
                  aria-label={`Delete ${s.name}`}
                  className="text-[var(--steel)] hover:text-[var(--graphite)]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {!exclusive.includes(s.name) && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Field label="Severity">
                      <select
                        value={s.severity}
                        onChange={(e) =>
                          updateSymptom(s.id, { severity: e.target.value as SymptomSeverity })
                        }
                        className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-sm bg-white"
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="significant">Significant</option>
                      </select>
                    </Field>
                    <Field label="Start date, optional">
                      <input
                        type="date"
                        value={s.startDate}
                        onChange={(e) => updateSymptom(s.id, { startDate: e.target.value })}
                        className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-sm bg-white"
                      />
                    </Field>
                    <Field label="Pattern or frequency, optional">
                      <TextInput
                        value={s.pattern}
                        onChange={(v) => updateSymptom(s.id, { pattern: v })}
                      />
                    </Field>
                    <Field label="Notes, optional">
                      <TextInput
                        value={s.notes}
                        onChange={(v) => updateSymptom(s.id, { notes: v })}
                      />
                    </Field>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={s.addToProviderQuestions}
                        onChange={(e) => {
                          updateSymptom(s.id, { addToProviderQuestions: e.target.checked });
                          if (e.target.checked) pushTimeline("Provider question added");
                        }}
                      />
                      Add to provider questions
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={s.includeInExport}
                        onChange={(e) =>
                          updateSymptom(s.id, { includeInExport: e.target.checked })
                        }
                      />
                      Include this item in provider export: {s.includeInExport ? "Yes" : "No"}
                    </label>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </Surface>
  );
}

function PrivacyExportSection() {
  const { state, setShowDashboardReminders, toggleExportSection } = useHealthContext();
  const [showExport, setShowExport] = useState(false);

  return (
    <Surface className="p-6">
      <div className="mono-label mb-2">Privacy & export controls</div>
      <h3 className="mb-3">Member-controlled visibility</h3>
      <p className="text-sm mb-5 text-[var(--soft-text)]">
        All Health Context export sections are optional. Health information must not appear in
        public profiles, community features, partner offers, referral systems, social sharing,
        affiliate tracking, or marketing tools.
      </p>

      <div className="flex items-center justify-between gap-4 border border-[var(--border)] rounded-md px-4 py-3 mb-5">
        <div>
          <div className="text-sm">Show health-context reminders on my dashboard</div>
          <div className="mono-label mt-0.5">
            {state.showDashboardReminders ? "On" : "Off"} · Off by default · no diagnoses on dashboard
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={state.showDashboardReminders}
          aria-label="Show health-context reminders on my dashboard"
          onClick={() => setShowDashboardReminders(!state.showDashboardReminders)}
          className={`relative w-12 h-7 rounded-full transition-colors ${
            state.showDashboardReminders ? "bg-[var(--graphite)]" : "bg-[var(--bone)]"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
              state.showDashboardReminders ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      <div className="mono-label mb-2">Provider export sections</div>
      <p className="text-sm mb-3 text-[var(--soft-text)]">
        Before export, choose which sections to include. Uncheck any section to exclude it. Partner
        activity, affiliate clicks, and community browsing are never included.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {EXPORT_SECTIONS.map((s) => {
          const on = state.exportSections.includes(s.id);
          return (
            <label
              key={s.id}
              className="flex items-center gap-3 border border-[var(--border)] rounded-md px-3 py-2.5 text-sm"
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() => toggleExportSection(s.id)}
              />
              <span>
                {s.label}
                <span className="mono-label block mt-0.5">{on ? "Include: Yes" : "Include: No"}</span>
              </span>
            </label>
          );
        })}
      </div>

      <p className="text-sm border-l-2 border-[var(--med-blue)] pl-3 mb-5">{EXPORT_DISCLAIMER}</p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowExport(true)}
          className="inline-flex items-center gap-2 bg-[var(--graphite)] text-[var(--porcelain)] px-4 py-2 rounded-md text-sm"
        >
          View provider summary
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 border border-[var(--border)] px-4 py-2 rounded-md text-sm hover:bg-[var(--ivory)]"
        >
          Prefer not to answer
        </button>
      </div>

      {showExport && <HealthContextExportModal onClose={() => setShowExport(false)} />}
    </Surface>
  );
}

function HealthContextExportModal({ onClose }: { onClose: () => void }) {
  const { state, startingBmi, currentBmi, bmiChange, toggleExportSection } = useHealthContext();
  const enabled = useMemo(() => new Set(state.exportSections), [state.exportSections]);
  const include = (id: (typeof EXPORT_SECTIONS)[number]["id"]) => enabled.has(id);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[var(--border)] p-5 flex items-center justify-between gap-4">
          <div>
            <div className="mono-label">Provider-facing summary</div>
            <h3>Health Context export</h3>
          </div>
          <button
            type="button"
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

          <div>
            <div className="mono-label mb-2">Exclude any section before sharing</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {EXPORT_SECTIONS.map((s) => {
                const on = include(s.id);
                return (
                  <label
                    key={s.id}
                    className="flex items-center gap-3 border border-[var(--border)] rounded-md px-3 py-2 text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleExportSection(s.id)}
                    />
                    {s.label}
                  </label>
                );
              })}
            </div>
          </div>

          {include("body_bmi") && (
            <ExportBlock title="Body metrics and BMI">
              Height {state.bodyMetrics.heightInches ?? "—"} · starting BMI {startingBmi ?? "—"} ·
              current BMI {currentBmi ?? "—"} · change {bmiChange == null ? "—" : bmiChange}. BMI is
              a screening measurement only.
            </ExportBlock>
          )}
          {include("weight_trend") && (
            <ExportBlock title="Weight trend">
              {state.bodyMetrics.weightChange12Months || "No 12-month note recorded."}
            </ExportBlock>
          )}
          {include("medications") && (
            <ExportBlock title="Current medications and treatments">
              {state.medications
                .filter((m) => m.includeInExport)
                .map((m) => `${m.name || "Unnamed"} (${m.category}${m.currentlyTaking ? ", current" : ""})`)
                .join(" · ") || "None selected for export."}
            </ExportBlock>
          )}
          {include("conditions") && (
            <ExportBlock title="Diagnosed or suspected conditions">
              {state.conditions
                .filter((c) => c.includeInExport)
                .map((c) => `${c.name} — ${CONDITION_STATUSES.find((s) => s.id === c.status)?.label}`)
                .join("; ") ||
                Object.entries(state.multiSelect)
                  .filter(([k]) => ["general", "metabolic", "thyroid"].includes(k))
                  .flatMap(([, v]) => v)
                  .filter((v) => v !== "None known" && v !== "Prefer not to answer")
                  .join("; ") ||
                "No conditions selected for export."}
            </ExportBlock>
          )}
          {include("hormonal") && (
            <ExportBlock title="Hormonal and reproductive context">
              {[
                ...(state.multiSelect.menstrual ?? []),
                ...(state.multiSelect.pcos ?? []),
                ...(state.multiSelect.perimenopause ?? []),
                ...(state.multiSelect.pregnancy ?? []),
                ...(state.multiSelect.reproductive ?? []),
              ]
                .filter((v) => v !== "Prefer not to answer")
                .join("; ") || "No hormonal/reproductive items selected for export."}
            </ExportBlock>
          )}
          {include("testosterone") && (
            <ExportBlock title="Testosterone and androgen context">
              {[...(state.multiSelect.testosterone ?? []), ...(state.multiSelect.androgen_symptoms ?? [])]
                .filter((v) => !["Prefer not to answer", "None"].includes(v))
                .join("; ") || "No testosterone/androgen items selected for export."}
            </ExportBlock>
          )}
          {include("prostate_urinary_testicular") && (
            <ExportBlock title="Prostate, urinary or testicular context">
              {[
                ...(state.multiSelect.prostate ?? []),
                ...(state.multiSelect.urinary ?? []),
                ...(state.multiSelect.testicular ?? []),
                ...(state.multiSelect.testicular_symptoms ?? []),
              ]
                .filter((v) => !["None known", "Prefer not to answer"].includes(v))
                .join("; ") || "No prostate/urinary/testicular items selected for export."}
            </ExportBlock>
          )}
          {include("symptoms") && (
            <ExportBlock title="Selected symptoms and severity">
              {state.symptoms
                .filter((s) => s.includeInExport)
                .map((s) =>
                  ["None", "Prefer not to answer"].includes(s.name)
                    ? s.name
                    : `${s.name} (${s.severity})`
                )
                .join("; ") || "No symptoms marked for export."}
            </ExportBlock>
          )}
          {include("timeline") && (
            <ExportBlock title="Timeline changes">
              {state.timeline
                .slice(0, 8)
                .map((t) => t.label)
                .join(" · ") || "No timeline markers."}
            </ExportBlock>
          )}
          {include("provider_questions") && (
            <ExportBlock title="Questions for provider">
              {state.symptoms
                .filter((s) => s.addToProviderQuestions)
                .map((s) => `Discuss ${s.name.toLowerCase()} (${s.severity})`)
                .join(" · ") || "No provider questions from Health Context."}
            </ExportBlock>
          )}

          {state.exportSections.length === 0 && (
            <p className="text-sm text-[var(--soft-text)]">
              No sections selected. Check at least one section above to include it in the summary.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ExportBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mono-label mb-1">{title}</div>
      <div>{children}</div>
    </div>
  );
}

function TimelineSection() {
  const { state } = useHealthContext();
  return (
    <Surface className="p-6">
      <div className="mono-label mb-2">Private timeline</div>
      <h3 className="mb-3">Neutral markers only</h3>
      <p className="text-sm mb-4 text-[var(--soft-text)]">
        Timeline language stays factual. It does not say a condition caused a weight, skin, muscle,
        mood, or hormonal change.
      </p>
      <ul className="divide-y divide-[var(--border)]">
        {state.timeline.slice(0, 12).map((t) => (
          <li key={t.id} className="py-3 flex items-start justify-between gap-4">
            <span className="text-sm">{t.label}</span>
            <span className="mono-label shrink-0">
              {new Date(t.at).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </li>
        ))}
      </ul>
    </Surface>
  );
}

function HealthContextSafetyNotes() {
  return (
    <Surface className="p-6">
      <div className="mono-label mb-2">Safety & scope</div>
      <h3 className="mb-3">Boundaries</h3>
      <div className="space-y-3 text-sm">
        <p>{HEALTH_SCOPE_NOTE}</p>
        <p>{MEDICATION_CHANGE_NOTE}</p>
        <p>{PRIVACY_HEALTH_NOTE}</p>
      </div>
      <div className="mt-5 space-y-3">
        <div className="flex gap-2 items-start border border-[#8a2a2a]/30 bg-[#fdf4f4] rounded-md p-3 text-sm">
          <ShieldAlert size={16} className="text-[#8a2a2a] mt-0.5 shrink-0" />
          <span>
            Severe or persistent abdominal pain, repeated vomiting, inability to hydrate, fainting,
            chest pain, allergic reaction, or suicidal thoughts / immediate mental-health danger may
            require urgent medical attention. Contact your clinician or seek urgent/emergency care.
            Do not rely on this portal for urgent medical decisions.
          </span>
        </div>
        <div className="flex gap-2 items-start border border-[#8a2a2a]/30 bg-[#fdf4f4] rounded-md p-3 text-sm">
          <ShieldAlert size={16} className="text-[#8a2a2a] mt-0.5 shrink-0" />
          <span>
            {TESTICULAR_RED_FLAG} {URINARY_RED_FLAG}
          </span>
        </div>
      </div>
    </Surface>
  );
}
