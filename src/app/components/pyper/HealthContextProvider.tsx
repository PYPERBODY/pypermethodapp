import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createInitialHealthContext,
  calcBmi,
  uid,
  type BodyMetricsProfile,
  type ConditionEntry,
  type ExportSectionId,
  type HealthContextState,
  type HealthModuleId,
  type MedicationEntry,
  type SymptomEntry,
  type TimelineEvent,
} from "./healthContextData";

type HealthContextApi = {
  state: HealthContextState;
  startingBmi: number | null;
  currentBmi: number | null;
  bmiChange: number | null;
  setModules: (modules: HealthModuleId[]) => void;
  updateBodyMetrics: (patch: Partial<BodyMetricsProfile>) => void;
  toggleMulti: (group: string, option: string) => void;
  setMultiGroup: (group: string, values: string[]) => void;
  addCondition: (entry: Omit<ConditionEntry, "id">) => void;
  updateCondition: (id: string, patch: Partial<ConditionEntry>) => void;
  removeCondition: (id: string) => void;
  addMedication: (entry?: Partial<MedicationEntry>) => void;
  updateMedication: (id: string, patch: Partial<MedicationEntry>) => void;
  removeMedication: (id: string) => void;
  addSymptom: (name: string) => void;
  selectSymptom: (name: string) => void;
  updateSymptom: (id: string, patch: Partial<SymptomEntry>) => void;
  removeSymptom: (id: string) => void;
  pushTimeline: (label: string) => void;
  setShowDashboardReminders: (on: boolean) => void;
  setExportSections: (sections: ExportSectionId[]) => void;
  toggleExportSection: (id: ExportSectionId) => void;
  markUpdated: (label?: string) => void;
  resetPrototype: () => void;
};

const Ctx = createContext<HealthContextApi | null>(null);

function withUpdate(
  prev: HealthContextState,
  patch: Partial<HealthContextState>,
  timelineLabel?: string
): HealthContextState {
  const next: HealthContextState = {
    ...prev,
    ...patch,
    lastUpdated: new Date().toISOString(),
  };
  if (timelineLabel) {
    const event: TimelineEvent = {
      id: uid("tl"),
      label: timelineLabel,
      at: next.lastUpdated!,
    };
    next.timeline = [event, ...prev.timeline].slice(0, 40);
  }
  return next;
}

export function HealthContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HealthContextState>(() => createInitialHealthContext());

  // Future: hydrate from Supabase Auth session + RLS-scoped health tables.
  // Do not persist sensitive health data to localStorage as the permanent system.
  // Prototype only — no third-party sync, affiliates, partners, or analytics.

  const startingBmi = calcBmi(state.bodyMetrics.startingWeightLb, state.bodyMetrics.heightInches);
  const currentBmi = calcBmi(state.bodyMetrics.currentWeightLb, state.bodyMetrics.heightInches);
  const bmiChange =
    startingBmi != null && currentBmi != null
      ? Math.round((currentBmi - startingBmi) * 10) / 10
      : null;

  const api = useMemo<HealthContextApi>(
    () => ({
      state,
      startingBmi,
      currentBmi,
      bmiChange,
      setModules: (modules) => {
        const cleaned = modules.includes("none")
          ? (["none"] as HealthModuleId[])
          : modules.includes("prefer_not")
            ? (["prefer_not"] as HealthModuleId[])
            : modules.filter((m) => m !== "none" && m !== "prefer_not");
        setState((prev) =>
          withUpdate(prev, { selectedModules: cleaned }, "Health Context updated")
        );
      },
      updateBodyMetrics: (patch) => {
        setState((prev) =>
          withUpdate(
            prev,
            { bodyMetrics: { ...prev.bodyMetrics, ...patch } },
            "Health Context updated"
          )
        );
      },
      toggleMulti: (group, option) => {
        setState((prev) => {
          const current = prev.multiSelect[group] ?? [];
          const exclusive = ["None known", "Prefer not to answer", "None"];
          let nextVals: string[];
          if (current.includes(option)) {
            nextVals = current.filter((v) => v !== option);
          } else if (exclusive.includes(option)) {
            nextVals = [option];
          } else {
            nextVals = [...current.filter((v) => !exclusive.includes(v)), option];
          }
          const timelineByGroup: Record<string, string> = {
            menstrual: "Cycle pattern updated",
            perimenopause: "Health Context updated",
            pregnancy: "Health Context updated",
            testosterone: "Testosterone treatment updated",
            androgen_symptoms: "Testosterone treatment updated",
            urinary: "Urinary symptom update recorded",
            testicular: "Health Context updated",
            testicular_symptoms: "Health Context updated",
            gender_affirming: "Hormone treatment updated",
          };
          return withUpdate(
            prev,
            { multiSelect: { ...prev.multiSelect, [group]: nextVals } },
            timelineByGroup[group] ?? "Health Context updated"
          );
        });
      },
      setMultiGroup: (group, values) => {
        setState((prev) =>
          withUpdate(prev, { multiSelect: { ...prev.multiSelect, [group]: values } })
        );
      },
      addCondition: (entry) => {
        setState((prev) =>
          withUpdate(
            prev,
            { conditions: [{ ...entry, id: uid("cond") }, ...prev.conditions] },
            "Health Context updated"
          )
        );
      },
      updateCondition: (id, patch) => {
        setState((prev) =>
          withUpdate(
            prev,
            {
              conditions: prev.conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)),
            },
            "Health Context updated"
          )
        );
      },
      removeCondition: (id) => {
        setState((prev) =>
          withUpdate(
            prev,
            { conditions: prev.conditions.filter((c) => c.id !== id) },
            "Health Context updated"
          )
        );
      },
      addMedication: (entry) => {
        const med: MedicationEntry = {
          id: uid("med"),
          name: "",
          category: "Other prescription medication",
          formulation: "",
          dose: "",
          frequency: "",
          startDate: "",
          endDate: "",
          reason: "",
          prescriber: "",
          currentlyTaking: true,
          observedChanges: "",
          sideEffects: "",
          notesForProvider: "",
          includeInExport: true,
          ...entry,
        };
        setState((prev) =>
          withUpdate(prev, { medications: [med, ...prev.medications] }, "Medication updated")
        );
      },
      updateMedication: (id, patch) => {
        const hormoneCats = [
          "Hormonal contraception",
          "Menopausal hormone therapy",
          "Testosterone therapy",
          "Estrogen therapy",
          "Progesterone therapy",
          "Anti-androgen medication",
          "Gender-affirming hormone treatment",
        ];
        setState((prev) => {
          const nextMeds = prev.medications.map((m) => (m.id === id ? { ...m, ...patch } : m));
          const med = nextMeds.find((m) => m.id === id);
          const label =
            med && hormoneCats.includes(med.category)
              ? med.category === "Testosterone therapy"
                ? "Testosterone treatment updated"
                : "Hormone treatment updated"
              : "Medication updated";
          return withUpdate(prev, { medications: nextMeds }, label);
        });
      },
      removeMedication: (id) => {
        setState((prev) =>
          withUpdate(
            prev,
            { medications: prev.medications.filter((m) => m.id !== id) },
            "Medication updated"
          )
        );
      },
      addSymptom: (name) => {
        const symptom: SymptomEntry = {
          id: uid("sx"),
          name,
          severity: "mild",
          startDate: "",
          pattern: "",
          notes: "",
          addToProviderQuestions: false,
          includeInExport: true,
        };
        const label =
          name === "Urinary changes"
            ? "Urinary symptom update recorded"
            : "Health Context updated";
        setState((prev) =>
          withUpdate(prev, { symptoms: [symptom, ...prev.symptoms] }, label)
        );
      },
      selectSymptom: (name) => {
        const exclusive = ["None", "Prefer not to answer"];
        setState((prev) => {
          if (prev.symptoms.some((s) => s.name === name)) return prev;
          const symptom: SymptomEntry = {
            id: uid("sx"),
            name,
            severity: "mild",
            startDate: "",
            pattern: "",
            notes: "",
            addToProviderQuestions: false,
            includeInExport: true,
          };
          let nextSymptoms: SymptomEntry[];
          if (exclusive.includes(name)) {
            nextSymptoms = [symptom];
          } else {
            nextSymptoms = [
              symptom,
              ...prev.symptoms.filter((s) => !exclusive.includes(s.name)),
            ];
          }
          const label =
            name === "Urinary changes"
              ? "Urinary symptom update recorded"
              : "Health Context updated";
          return withUpdate(prev, { symptoms: nextSymptoms }, label);
        });
      },
      updateSymptom: (id, patch) => {
        setState((prev) =>
          withUpdate(prev, {
            symptoms: prev.symptoms.map((s) => (s.id === id ? { ...s, ...patch } : s)),
          })
        );
      },
      removeSymptom: (id) => {
        setState((prev) =>
          withUpdate(prev, { symptoms: prev.symptoms.filter((s) => s.id !== id) })
        );
      },
      pushTimeline: (label) => {
        setState((prev) => withUpdate(prev, {}, label));
      },
      setShowDashboardReminders: (on) => {
        setState((prev) => withUpdate(prev, { showDashboardReminders: on }));
      },
      setExportSections: (sections) => {
        setState((prev) => withUpdate(prev, { exportSections: sections }));
      },
      toggleExportSection: (id) => {
        setState((prev) => {
          const has = prev.exportSections.includes(id);
          return withUpdate(prev, {
            exportSections: has
              ? prev.exportSections.filter((s) => s !== id)
              : [...prev.exportSections, id],
          });
        });
      },
      markUpdated: (label = "Health Context updated") => {
        setState((prev) => withUpdate(prev, {}, label));
      },
      resetPrototype: () => setState(createInitialHealthContext()),
    }),
    [state, startingBmi, currentBmi, bmiChange]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useHealthContext() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useHealthContext must be used within HealthContextProvider");
  return ctx;
}
