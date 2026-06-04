import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, Camera, CheckCircle2, ClipboardList, History, MessageSquarePlus, ShieldCheck, Sun } from "lucide-react";
import { Surface } from "./Shell";
import { useGuideAuth } from "../auth/AuthGate";
import { backendUnavailableMessage, createUserRow, deleteUserRow, isBackendAvailable, listUserRows, updateUserRow, type GuideStorageRecord } from "../../../lib/secureGuideStorage";
import { Slider } from "../ui/slider";
import {
  BODY_AREA_ROUTINES,
  BODY_CARE_APPLICATION_LOG,
  BODY_CARE_PLAN_PRODUCTS,
  BODY_CARE_PLAN_VERSIONS,
  BODY_CARE_QUESTIONS,
  BODY_CARE_SPF_PLAN,
  BODY_CARE_SPF_TRACKING,
  BODY_CARE_SUPPORT_PRODUCTS,
  BODY_CARE_TODAY_ROUTINE,
  BODY_CARE_TOLERANCE_TREND,
} from "./data";

const SECTIONS = [
  { id: "plan", label: "My Plan" },
  { id: "today", label: "Today's Routine" },
  { id: "application", label: "Track Application" },
  { id: "progress", label: "Skin Progress" },
  { id: "questions", label: "Questions for Clinician" },
  { id: "history", label: "Plan History" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

type RoutineAction =
  | "Applied as planned"
  | "Applied partially"
  | "Skipped"
  | "Held per clinician"
  | "Not due"
  | "Add note";

const BODY_ZONES = [
  "Chest",
  "Back",
  "Shoulders",
  "Upper arms",
  "Forearms",
  "Hands",
  "Abdomen",
  "Buttocks",
  "Thighs",
  "Lower legs",
  "Feet",
  "Underarms",
  "Custom area",
];

const PRODUCT_TYPES = [
  "PYPER Clinical Body Care",
  "Prescription",
  "Non-Prescription",
  "Self-Added · Not Yet Reviewed",
];

const PATHWAYS = ["Pigment", "Acne", "Texture", "Stretch", "Calm", "Recover"];
const TIERS = ["Rx", "Rx+", "Maintain", "Intensive"];
const PLAN_STATUSES = [
  "Clinician-Entered",
  "Clinician-Approved",
  "Patient-Entered",
  "Not Yet Reviewed",
  "Archived",
  "Completed",
  "Held by Clinician",
];
const AMOUNT_UNITS = [
  "pump",
  "pumps",
  "thin layer",
  "fingertip unit",
  "gram",
  "grams",
  "pea-sized amount",
  "prescribed amount",
  "custom instruction",
];
const FREQUENCIES = ["Daily", "Twice daily", "Every other day", "Weekly", "Custom days", "As directed", "Short cycle", "Maintenance schedule"];
const TIMES = ["AM", "PM", "AM + PM", "After shower", "After training", "Custom time"];
const APPLICATION_STATUSES: RoutineAction[] = ["Applied as planned", "Applied partially", "Skipped", "Held per clinician", "Not due"];
const SKIP_REASONS = ["forgot", "irritation", "ran out", "traveling", "not feeling well", "not due", "other"];

export function BodyCarePlan() {
  const [section, setSection] = useState<SectionId>("plan");

  return (
    <div className="space-y-6">
      <Surface className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <div className="mono-label mb-2">Phase 3</div>
            <h2>PYPER Body-Care Plan</h2>
            <p className="text-sm text-[var(--soft-text)] max-w-3xl mt-3">
              The prescribed plan and the application log stay separate. The plan is the source
              of truth; logs capture what actually happened without changing clinician instructions.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <Badge>Plan source of truth</Badge>
            <Badge>Application log separate</Badge>
            <Badge>SPF privacy-safe</Badge>
            <Badge>Fictional demo data</Badge>
          </div>
        </div>
      </Surface>

      <SecureBodyCareStoragePanel />

      <Surface className="p-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`px-4 py-2.5 rounded-md text-sm transition-colors ${
                section === item.id
                  ? "bg-[var(--graphite)] text-[var(--porcelain)]"
                  : "hover:bg-[var(--ivory)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Surface>

      {section === "plan" && <MyPlan />}
      {section === "today" && <TodaysRoutine />}
      {section === "application" && <TrackApplication />}
      {section === "progress" && <SkinProgress />}
      {section === "questions" && <QuestionsAndSummary />}
      {section === "history" && <PlanHistory />}
    </div>
  );
}

function SecureBodyCareStoragePanel() {
  const { user } = useGuideAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [status, setStatus] = useState("Secure storage is ready for authenticated guide data.");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void loadCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function loadCounts() {
    if (!user?.id) return;
    if (!isBackendAvailable()) {
      setStatus(backendUnavailableMessage);
      return;
    }
    setLoading(true);
    try {
      const [plans, products, applications, tolerance, spf, versions] = await Promise.all([
        listUserRows("body_care_plans", user.id, "created_at"),
        listUserRows("body_care_products", user.id, "created_at"),
        listUserRows("body_care_applications", user.id, "application_date"),
        listUserRows("body_care_skin_tolerance_logs", user.id, "entry_date"),
        listUserRows("body_care_spf_logs", user.id, "entry_date"),
        listUserRows("body_care_plan_versions", user.id, "effective_date"),
      ]);
      setCounts({ plans: plans.length, products: products.length, applications: applications.length, tolerance: tolerance.length, spf: spf.length, versions: versions.length });
      setStatus("Loaded your saved PYPER Body-Care Plan records. Demo data is not mixed into storage unless you choose to save it to a fictional test account.");
    } catch {
      setStatus("Failed to load saved body-care records. Check Supabase availability and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function saveDemoPlan() {
    if (!user?.id || !isBackendAvailable()) {
      setStatus(backendUnavailableMessage);
      return;
    }
    setLoading(true);
    try {
      const plan = await createUserRow("body_care_plans", user.id, { plan_name: "Demo PYPER Body-Care Plan", plan_status: "Clinician-Approved" });
      await Promise.all(BODY_CARE_PLAN_PRODUCTS.map((product) => createUserRow("body_care_products", user.id, bodyCareProductToDb(product, String(plan.id || "")))));
      await createUserRow("body_care_plan_versions", user.id, { plan_id: plan.id, version_number: 1, effective_date: "2026-06-01", changed_by: "Dr. Elaine Mercer", reason_for_change: "Initial fictional test plan", previous_plan_archived: false, is_active: true, version_data: { source: "Phase 6 fictional demo" } });
      setStatus("Saved fictional body-care plan, products, and active version to secure storage for this signed-in user.");
      await loadCounts();
    } catch {
      setStatus("Failed to save the body-care plan. Nothing was silently stored.");
    } finally {
      setLoading(false);
    }
  }

  async function saveDemoLogs() {
    if (!user?.id || !isBackendAvailable()) {
      setStatus(backendUnavailableMessage);
      return;
    }
    setLoading(true);
    try {
      await Promise.all(BODY_CARE_APPLICATION_LOG.map((entry) => createUserRow("body_care_applications", user.id, bodyCareApplicationToDb(entry))));
      await createUserRow("body_care_skin_tolerance_logs", user.id, {
        entry_date: new Date().toISOString().slice(0, 10),
        body_area: "Upper arms",
        dryness: 3,
        irritation: 4,
        itching: 2,
        burning_stinging: 1,
        peeling: 2,
        redness_discoloration: 3,
        acne_flare: 1,
        texture_concern: 5,
        pigmentation_concern: 4,
        eczema_flare: 0,
        new_rash: false,
        swelling: false,
        blistering: false,
        open_broken_skin: false,
        signs_of_infection: false,
        product_wrong_area: false,
        product_eyes_mouth: false,
        contact_clinician_requested: false,
        notes: "Fictional Phase 6 test tolerance log.",
        reviewed_for_checkin: true,
        include_in_export: true,
      });
      await createUserRow("body_care_spf_logs", user.id, {
        entry_date: new Date().toISOString().slice(0, 10),
        spf_product: BODY_CARE_SPF_PLAN.spfProduct,
        spf_level: BODY_CARE_SPF_PLAN.spfLevel,
        body_areas: BODY_CARE_SPF_TRACKING.bodyAreasCovered.split(", "),
        applied_today: BODY_CARE_SPF_TRACKING.appliedToday,
        reapplication_completed: BODY_CARE_SPF_TRACKING.reapplicationCompleted,
        outdoor_exposure_expected: BODY_CARE_SPF_PLAN.outdoorExposureExpected,
        swimming_or_sweating_expected: BODY_CARE_SPF_PLAN.swimmingOrSweatingExpected,
        skipped_reason: BODY_CARE_SPF_TRACKING.skippedReason,
        notes: BODY_CARE_SPF_TRACKING.notes,
        reviewed_for_checkin: true,
        include_in_export: true,
      });
      setStatus("Saved fictional application, tolerance, and SPF logs to secure storage for this signed-in user.");
      await loadCounts();
    } catch {
      setStatus("Failed to save body-care logs. Nothing was silently stored.");
    } finally {
      setLoading(false);
    }
  }

  async function archiveFirstProduct() {
    if (!user?.id || !isBackendAvailable()) return;
    setLoading(true);
    try {
      const products = await listUserRows("body_care_products", user.id, "created_at");
      const first = products[0];
      if (!first?.id) {
        setStatus("No saved product to archive yet. Start by saving the demo plan.");
      } else {
        await updateUserRow("body_care_products", user.id, String(first.id), { archived: true, plan_status: "Archived" });
        setStatus("Archived one saved body-care product. Archived products are not reactivated automatically.");
      }
      await loadCounts();
    } catch {
      setStatus("Failed to archive product.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteLatestApplication() {
    if (!user?.id || !isBackendAvailable()) return;
    if (!window.confirm("Delete the latest saved body-care application log?")) return;
    setLoading(true);
    try {
      const applications = await listUserRows("body_care_applications", user.id, "application_date");
      const first = applications[0];
      if (!first?.id) setStatus("No application log to delete yet.");
      else {
        await deleteUserRow("body_care_applications", user.id, String(first.id));
        setStatus("Deleted latest saved body-care application log.");
      }
      await loadCounts();
    } catch {
      setStatus("Failed to delete application log.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Surface className="p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mono-label mb-2">Secure body-care storage</div>
          <h3>Authenticated, user-specific records</h3>
          <p className="mt-2 text-sm text-[var(--soft-text)]">{status}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(counts).map(([key, value]) => <Badge key={key}>{key}: {value}</Badge>)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button disabled={loading} onClick={loadCounts} className="rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--ivory)]">Load saved</button>
          <button disabled={loading} onClick={saveDemoPlan} className="rounded-md bg-[var(--graphite)] px-3 py-2 text-sm text-[var(--porcelain)] disabled:opacity-50">Create plan + products</button>
          <button disabled={loading} onClick={saveDemoLogs} className="rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--ivory)]">Save application/SPF/tolerance logs</button>
          <button disabled={loading} onClick={archiveFirstProduct} className="rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--ivory)]">Archive product</button>
          <button disabled={loading} onClick={deleteLatestApplication} className="rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--ivory)]">Delete latest log</button>
        </div>
      </div>
    </Surface>
  );
}

function bodyCareProductToDb(product: any, planId: string): GuideStorageRecord {
  return {
    plan_id: planId,
    product_name: product.productName,
    brand: product.brand,
    product_type: product.productType,
    pyper_pathway: product.pathway,
    pyper_tier: product.tier,
    active_ingredient: product.activeIngredient,
    strength: product.strength,
    formulation: product.formulation,
    prescriber_name: product.prescriberName,
    plan_status: product.planStatus,
    treatment_purpose: product.treatmentPurpose,
    body_areas: String(product.bodyArea || "").split(", ").filter(Boolean),
    prescribed_amount: product.prescribedAmount,
    amount_unit: product.amountUnit,
    frequency: product.frequency,
    days_of_week: String(product.daysOfWeek || "").split(", ").filter(Boolean),
    time_of_day: product.timeOfDay,
    start_date: product.startDate || null,
    end_date: product.endDate || null,
    review_date: product.reviewDate || null,
    cycle_or_rest_period: product.cycleOrRestPeriod,
    layering_order: product.layeringOrder,
    special_instructions: product.specialInstructions,
    spf_required: product.spfRequired,
    refill_reminder: Boolean(product.refillReminder),
    notes: product.notes,
  };
}

function bodyCareApplicationToDb(entry: any): GuideStorageRecord {
  return {
    application_date: entry.date,
    time_applied: entry.timeApplied,
    body_area: entry.bodyArea,
    amount_applied: entry.amountApplied,
    applied_as_prescribed: entry.appliedAsPrescribed === "Yes",
    application_status: entry.status,
    moisturizer_layered: entry.moisturizerLayered,
    spf_used: entry.spfUsed,
    reapplication_needed: entry.reapplicationNeeded,
    irritation_after_application: entry.irritationAfter,
    notes: entry.notes,
    reviewed_for_checkin: true,
    include_in_export: true,
  };
}

function MyPlan() {
  return (
    <div className="space-y-6">
      <Surface className="p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="mono-label mb-2">My Body-Care Plan</div>
            <h3>Prescribed plan source of truth</h3>
            <p className="text-sm text-[var(--soft-text)] mt-2 max-w-2xl">
              Prescription instructions, body areas, dose or amount, cadence, SPF requirements,
              review dates, and rest cycles live here. Application logs do not overwrite these instructions.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 bg-[var(--graphite)] text-[var(--porcelain)] px-4 py-2.5 rounded-md text-sm">
            <ClipboardList size={14} /> Add plan product
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {BODY_CARE_PLAN_PRODUCTS.map((product) => (
            <div key={product.id} className="border border-[var(--border)] rounded-md p-5 bg-[var(--porcelain)]">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="mono-label mb-1">{product.productType}</div>
                  <h4>{product.productName}</h4>
                  <p className="text-sm text-[var(--soft-text)]">{product.brand}</p>
                </div>
                <Badge>{product.planStatus}</Badge>
              </div>
              <DefinitionGrid
                items={[
                  ["Pathway", product.pathway],
                  ["Tier", product.tier],
                  ["Active", product.activeIngredient],
                  ["Strength", product.strength],
                  ["Formulation", product.formulation],
                  ["Prescriber", product.prescriberName || "Not entered"],
                  ["Body area", product.bodyArea],
                  ["Amount", `${product.prescribedAmount} · ${product.amountUnit}`],
                  ["Frequency", product.frequency],
                  ["Days", product.daysOfWeek],
                  ["Time", product.timeOfDay],
                  ["Start", product.startDate],
                  ["End", product.endDate || "Open"],
                  ["Review", product.reviewDate || "Not scheduled"],
                  ["Cycle / rest", product.cycleOrRestPeriod],
                  ["Layering", `Order ${product.layeringOrder}`],
                  ["SPF", product.spfRequired ? "Required" : "Not required"],
                  ["Refill", product.refillReminder || "Not set"],
                ]}
              />
              <div className="rule my-4" />
              <p className="text-sm"><strong>Special instructions:</strong> {product.specialInstructions}</p>
              <p className="text-sm text-[var(--soft-text)] mt-2">{product.notes}</p>
            </div>
          ))}
        </div>
      </Surface>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.9fr] gap-6">
        <Surface className="p-6">
          <div className="mono-label mb-2">Structured plan fields</div>
          <h3 className="mb-4">Plan entry scaffold</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Product name" placeholder="Texture Rx Smoothing Cream" />
            <TextField label="Brand" placeholder="PYPER Clinical Body Care" />
            <SelectField label="Product type" options={PRODUCT_TYPES} />
            <SelectField label="PYPER pathway" options={PATHWAYS} />
            <SelectField label="PYPER tier" options={TIERS} />
            <TextField label="Active ingredient" placeholder="Ingredient" />
            <TextField label="Strength" placeholder="0.025%" />
            <TextField label="Formulation" placeholder="Cream, serum, lotion" />
            <TextField label="Prescriber name" placeholder="Clinician name" />
            <SelectField label="Plan status" options={PLAN_STATUSES} />
            <TextField label="Treatment purpose" placeholder="Guide-supported purpose" />
            <SelectField label="Body area" options={BODY_ZONES} />
            <TextField label="Prescribed amount" placeholder="pea-sized amount" />
            <SelectField label="Amount unit" options={AMOUNT_UNITS} />
            <SelectField label="Frequency" options={FREQUENCIES} />
            <TextField label="Days of week" placeholder="Monday, Wednesday, Friday" />
            <SelectField label="Time of day" options={TIMES} />
            <TextField label="Start date" type="date" />
            <TextField label="End date" type="date" />
            <TextField label="Review date" type="date" />
            <TextField label="Cycle or rest period" placeholder="Short cycle / rest period" />
            <TextField label="Layering order" placeholder="1, 2, 3" />
            <TextField label="Special instructions" placeholder="Clinician-provided instructions" className="md:col-span-2" />
            <SelectField label="SPF required" options={["Yes", "No"]} />
            <TextField label="Refill reminder" type="date" />
            <TextField label="Notes" placeholder="Plan notes" className="md:col-span-2" />
          </div>
        </Surface>

        <Surface className="p-6">
          <div className="mono-label mb-2">Body area mapping</div>
          <h3 className="mb-4">View routines by zone</h3>
          <div className="flex flex-wrap gap-2 mb-5">
            {BODY_ZONES.map((zone) => <Badge key={zone}>{zone}</Badge>)}
          </div>
          <div className="space-y-3">
            {BODY_AREA_ROUTINES.map((routine) => (
              <div key={routine.area} className="border border-[var(--border)] rounded-md p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4>{routine.area}</h4>
                  <span className="mono-label">{routine.time}</span>
                </div>
                <ul className="text-sm text-[var(--soft-text)] space-y-1">
                  {routine.items.map((item) => <li key={item}>· {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}

function TodaysRoutine() {
  const [actions, setActions] = useState<Record<string, RoutineAction | "">>({});
  const grouped = useMemo(() => {
    return ["AM", "PM", "After shower", "After training", "SPF", "Custom time"].map((group) => ({
      group,
      items: BODY_CARE_TODAY_ROUTINE.filter((item) => item.timeOfDay === group || (group === "SPF" && item.spfRequirement.includes("SPF"))),
    }));
  }, []);

  return (
    <div className="space-y-6">
      <Surface className="p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="mono-label mb-2">Today's Routine</div>
            <h3>Generated from My Body-Care Plan</h3>
            <p className="text-sm text-[var(--soft-text)] mt-2 max-w-2xl">
              Routine cards come from the prescribed plan. Logging partial, skipped, or held applications
              records what happened today without editing the plan.
            </p>
          </div>
          <Badge>Today · demo</Badge>
        </div>

        <div className="space-y-6">
          {grouped.map(({ group, items }) => (
            <div key={group}>
              <div className="mono-label mb-3">{group}</div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {items.length === 0 && (
                  <div className="border border-dashed border-[var(--border)] rounded-md p-5 text-sm text-[var(--soft-text)] bg-[var(--porcelain)]">
                    No scheduled body-care items for this time bucket today.
                  </div>
                )}
                {items.map((item) => {
                  const action = actions[item.id] || "";
                  return (
                    <div key={`${group}-${item.id}`} className="border border-[var(--border)] rounded-md p-5 bg-[var(--porcelain)]">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h4>{item.productName}</h4>
                          <p className="text-sm text-[var(--soft-text)]">{item.bodyArea}</p>
                        </div>
                        <Badge>{item.dueStatus}</Badge>
                      </div>
                      <DefinitionGrid items={[["Type", item.productType], ["Amount", item.amount], ["Instructions", item.instructions], ["SPF", item.spfRequirement]]} />
                      <div className="flex flex-wrap gap-2 mt-4">
                        {["Applied as planned", "Applied partially", "Skipped", "Held per clinician", "Not due", "Add note"].map((label) => (
                          <button
                            key={label}
                            onClick={() => setActions({ ...actions, [item.id]: label as RoutineAction })}
                            className={`text-xs px-3 py-2 rounded-md border border-[var(--border)] ${action === label ? "bg-[var(--graphite)] text-[var(--porcelain)]" : "hover:bg-[var(--ivory)]"}`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      {action && <ActionDetails action={action} />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Surface>

      <SpfSupport />
    </div>
  );
}

function ActionDetails({ action }: { action: RoutineAction }) {
  if (action === "Applied partially") {
    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-[var(--border)] pt-4">
        <TextField label="Actual amount applied" placeholder="half pea-sized amount" />
        <TextField label="Reason" placeholder="dryness, travel, other" />
        <TextField label="Notes" placeholder="Details for review" />
      </div>
    );
  }
  if (action === "Skipped") {
    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-[var(--border)] pt-4">
        <SelectField label="Skipped reason" options={SKIP_REASONS} />
        <TextField label="Notes" placeholder="Optional note" />
      </div>
    );
  }
  if (action === "Held per clinician") {
    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-[var(--border)] pt-4">
        <TextField label="Clinician instruction date" type="date" />
        <TextField label="Reason" placeholder="Clinician-provided reason" />
        <TextField label="Restart or review date if known" type="date" />
        <TextField label="Notes" placeholder="Do not restart without clinician instruction" />
      </div>
    );
  }
  if (action === "Add note") {
    return <TextField label="Routine note" placeholder="Add a guide note" className="mt-4 border-t border-[var(--border)] pt-4" />;
  }
  return <p className="text-xs text-[var(--soft-text)] mt-4 border-t border-[var(--border)] pt-4">Logged as: {action}. Prescribed instructions remain unchanged.</p>;
}

function TrackApplication() {
  const [status, setStatus] = useState("Applied as planned");
  const [tolerance, setTolerance] = useState({ dryness: 3, irritation: 4, itching: 2, burning: 1, peeling: 2, redness: 3, acne: 1, texture: 5, pigment: 4, eczema: 0 });
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const serious = Object.values(flags).some(Boolean);

  return (
    <div className="space-y-6">
      <Surface className="p-6 lg:p-8">
        <div className="mono-label mb-2">Track Application</div>
        <h3>What was actually applied</h3>
        <p className="text-sm text-[var(--soft-text)] mt-2 mb-6 max-w-2xl">
          This log captures actual use, missed applications, partial applications, held applications,
          and deviations. It does not change the prescribed plan automatically.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <TextField label="Application date" type="date" />
          <TextField label="Time applied" type="time" />
          <SelectField label="Product" options={BODY_CARE_PLAN_PRODUCTS.map((p) => p.productName)} />
          <SelectField label="Body area" options={BODY_ZONES} />
          <TextField label="Amount applied" placeholder="pea-sized amount" />
          <SelectField label="Applied as prescribed" options={["Yes", "No"]} />
          <SelectField label="Application status" options={APPLICATION_STATUSES} value={status} onChange={setStatus} />
          <SelectField label="Moisturizer layered" options={["Yes", "No"]} />
          <SelectField label="SPF used" options={["Yes", "No"]} />
          <SelectField label="Reapplication needed" options={["Yes", "No"]} />
          <SelectField label="Irritation after application" options={["Yes", "No"]} />
          <TextField label="Notes" placeholder="Application notes" className="md:col-span-2 xl:col-span-3" />
        </div>
      </Surface>

      <Surface className="p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="mono-label mb-2">Skin tolerance tracking</div>
            <h3>0-10 skin tolerance sliders</h3>
            <p className="text-sm text-[var(--soft-text)] mt-2">Do not diagnose skin reactions. Do not alter a prescription plan unless the clinician has provided instructions.</p>
          </div>
          <Badge>{status}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {Object.entries({
            dryness: "Dryness",
            irritation: "Irritation",
            itching: "Itching",
            burning: "Burning or stinging",
            peeling: "Peeling",
            redness: "Redness or discoloration",
            acne: "Acne flare",
            texture: "Texture concern",
            pigment: "Pigmentation concern",
            eczema: "Eczema flare",
          }).map(([key, label]) => (
            <SliderField
              key={key}
              label={label}
              value={tolerance[key as keyof typeof tolerance]}
              onChange={(value) => setTolerance({ ...tolerance, [key]: value })}
            />
          ))}
        </div>
        <div className="rule my-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {["new rash", "swelling", "blistering", "open or broken skin", "signs of infection", "product applied to wrong area", "product entered eyes or mouth", "contact clinician requested"].map((label) => (
            <Toggle key={label} label={label} checked={!!flags[label]} onChange={(checked) => setFlags({ ...flags, [label]: checked })} />
          ))}
        </div>
        {serious && (
          <SafetyNotice>
            This may require clinician review. Seek urgent care for severe allergic reaction,
            swelling, difficulty breathing, severe pain, open wounds, or signs of infection.
          </SafetyNotice>
        )}
      </Surface>

      <Surface className="p-6">
        <div className="mono-label mb-2">Recent application log</div>
        <div className="space-y-3">
          {BODY_CARE_APPLICATION_LOG.map((entry) => (
            <div key={`${entry.date}-${entry.product}`} className="border border-[var(--border)] rounded-md p-4 grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-3">
              <div className="font-mono text-sm text-[var(--steel)]">{entry.date}<br />{entry.timeApplied}</div>
              <div>
                <h4>{entry.product}</h4>
                <p className="text-sm text-[var(--soft-text)]">{entry.bodyArea} · {entry.amountApplied} · {entry.notes}</p>
              </div>
              <Badge>{entry.status}</Badge>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function SpfSupport() {
  return (
    <Surface className="p-6 lg:p-8">
      <div className="flex items-start gap-3 mb-5">
        <Sun size={20} className="text-[var(--steel)] shrink-0 mt-1" />
        <div>
          <div className="mono-label mb-2">SPF tracking and reminder support</div>
          <h3>SPF is part of body care</h3>
          <p className="text-sm text-[var(--soft-text)] mt-2">Reminder text stays privacy-safe and does not show prescription or body-area details on lock screens.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="border border-[var(--border)] rounded-md p-4">
          <h4 className="mb-3">SPF plan fields</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField label="SPF product" placeholder={BODY_CARE_SPF_PLAN.spfProduct} />
            <TextField label="SPF level" placeholder={BODY_CARE_SPF_PLAN.spfLevel} />
            <TextField label="Exposed body areas" placeholder={BODY_CARE_SPF_PLAN.exposedBodyAreas} />
            <TextField label="Usual application time" placeholder={BODY_CARE_SPF_PLAN.usualApplicationTime} />
            <SelectField label="Outdoor exposure expected" options={["Yes", "No"]} />
            <SelectField label="Swimming or sweating expected" options={["Yes", "No"]} />
            <TextField label="Reapplication reminder preference" placeholder={BODY_CARE_SPF_PLAN.reapplicationReminderPreference} className="sm:col-span-2" />
            <SelectField label="Water-resistant" options={["Yes", "No"]} />
            <TextField label="Notes" placeholder={BODY_CARE_SPF_PLAN.notes} className="sm:col-span-2" />
          </div>
        </div>
        <div className="border border-[var(--border)] rounded-md p-4">
          <h4 className="mb-3">SPF tracking fields</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectField label="Applied today" options={[BODY_CARE_SPF_TRACKING.appliedToday ? "Yes" : "No", BODY_CARE_SPF_TRACKING.appliedToday ? "No" : "Yes"]} />
            <TextField label="Body areas covered" placeholder={BODY_CARE_SPF_TRACKING.bodyAreasCovered} />
            <SelectField label="Reapplication completed" options={[BODY_CARE_SPF_TRACKING.reapplicationCompleted ? "Yes" : "No", BODY_CARE_SPF_TRACKING.reapplicationCompleted ? "No" : "Yes"]} />
            <TextField label="Skipped reason" placeholder={BODY_CARE_SPF_TRACKING.skippedReason || "none"} />
            <TextField label="Notes" placeholder={BODY_CARE_SPF_TRACKING.notes} className="sm:col-span-2" />
          </div>
          <div className="rule my-4" />
          <div className="grid gap-2 text-sm">
            <Badge>PYPER reminder: sun protection check</Badge>
            <Badge>PYPER reminder: body-care routine</Badge>
            <Badge>PYPER reminder: reapplication may be due</Badge>
          </div>
        </div>
      </div>
    </Surface>
  );
}

function SkinProgress() {
  const latest = BODY_CARE_TOLERANCE_TREND[BODY_CARE_TOLERANCE_TREND.length - 1];
  return (
    <div className="space-y-6">
      <Surface className="p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="mono-label mb-2">Skin Progress</div>
            <h3>Review body-care patterns over time</h3>
          </div>
          <Badge>Treatment cycle: Week 4 of 6</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <Metric label="Weekly adherence" value="9 / 12" hint="scheduled applications" />
          <Metric label="Monthly adherence" value="74%" hint="all body-care actions" />
          <Metric label="SPF consistency" value={`${latest.spf}%`} hint="logged coverage" />
          <Metric label="Held or missed" value="3 days" hint="includes clinician-held" />
          <Metric label="Flare frequency" value="1 / week" hint="acne or eczema flare logged" />
          <Metric label="Unresolved questions" value="3" hint="ready for clinician review" />
          <Metric label="Treatment cycle status" value="Week 4 / 6" hint="active Texture Rx cycle" />
          <Metric label="Monthly photo" value="Placeholder" hint="future secure upload" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="border border-[var(--border)] rounded-md p-5">
            <h4 className="mb-3">Dryness trend · Irritation trend · Flare frequency · SPF consistency</h4>
            <div className="space-y-3">
              {BODY_CARE_TOLERANCE_TREND.map((week) => (
                <div key={week.week} className="grid grid-cols-[40px_1fr] gap-3 items-center text-sm">
                  <span className="font-mono text-[var(--steel)]">{week.week}</span>
                  <div className="grid grid-cols-4 gap-2">
                    <ProgressBar label="Dry" value={week.dryness * 10} />
                    <ProgressBar label="Irr" value={week.irritation * 10} />
                    <ProgressBar label="Flare" value={week.flare * 10} />
                    <ProgressBar label="SPF" value={week.spf} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-[var(--border)] rounded-md p-5">
            <h4 className="mb-3">Products by body zone</h4>
            <div className="space-y-3">
              {BODY_AREA_ROUTINES.map((routine) => (
                <div key={routine.area} className="text-sm">
                  <div className="font-medium">{routine.area}</div>
                  <div className="text-[var(--soft-text)]">{routine.items.join(" · ")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Surface>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Surface className="p-6">
          <div className="flex items-center gap-3 mb-3"><Camera size={18} /><h3>Monthly photo placeholder</h3></div>
          <p className="text-sm text-[var(--soft-text)]">Future secure upload only. Do not store sensitive photos without authenticated secure storage and appropriate safeguards.</p>
        </Surface>
        <Surface className="p-6">
          <div className="mono-label mb-2">Example review language</div>
          <h3>Texture Rx · Upper Arms</h3>
          <p className="text-sm text-[var(--soft-text)] mt-2">Applied 9 of 12 scheduled days. Irritation increased from 2 to 5 this week. Add this pattern to your clinician questions.</p>
        </Surface>
      </div>
    </div>
  );
}

function QuestionsAndSummary() {
  const summary = ["prescribed plan", "products and strengths", "body areas", "actual use", "missed applications", "partial applications", "held applications", "non-prescription products", "tolerance trends", "SPF consistency", "unresolved clinician questions", "deviations from plan"];
  return (
    <div className="space-y-6">
      <Surface className="p-6 lg:p-8">
        <div className="flex items-start gap-3 mb-5">
          <MessageSquarePlus size={20} className="text-[var(--steel)] shrink-0 mt-1" />
          <div>
            <div className="mono-label mb-2">Questions for Clinician</div>
            <h3>Prepare guide questions without sending data</h3>
            <p className="text-sm text-[var(--soft-text)] mt-2">Phase 3 does not send data to providers. These cards prepare future check-in exports only.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {BODY_CARE_QUESTIONS.map((q) => (
            <div key={q.question} className="border border-[var(--border)] rounded-md p-4">
              <Badge>{q.priority}</Badge>
              <p className="text-sm mt-3">{q.question}</p>
              <div className="mono-label mt-3">Source · {q.source}</div>
            </div>
          ))}
        </div>
      </Surface>

      <Surface className="p-6 lg:p-8">
        <div className="mono-label mb-2">Clinician check-in summary placeholder</div>
        <h3 className="mb-4">Future export inputs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {summary.map((item) => <div key={item} className="border border-[var(--border)] rounded-md p-3 text-sm capitalize">{item}</div>)}
        </div>
      </Surface>

      <Surface className="p-6 lg:p-8">
        <div className="mono-label mb-2">Related Support Products</div>
        <h3 className="mb-2">Separate from prescription instructions and safety alerts</h3>
        <p className="text-sm text-[var(--soft-text)] mb-4">PYPER may earn commission, referral fees, sponsorship fees, or other compensation from some products. Discuss with your clinician if you have medical conditions or use prescription body-care products.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BODY_CARE_SUPPORT_PRODUCTS.map((product) => (
            <div key={product.name} className="border border-[var(--border)] rounded-md p-4">
              <div className="mono-label mb-2">{product.category}</div>
              <h4>{product.name}</h4>
              <p className="text-sm text-[var(--soft-text)] mt-2">{product.reason}</p>
              <p className="text-xs mt-3">{product.caution}</p>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function PlanHistory() {
  return (
    <Surface className="p-6 lg:p-8">
      <div className="flex items-start gap-3 mb-6">
        <History size={20} className="text-[var(--steel)] shrink-0 mt-1" />
        <div>
          <div className="mono-label mb-2">Plan History</div>
          <h3>Versioned plan changes</h3>
          <p className="text-sm text-[var(--soft-text)] mt-2">Old prescribed plans are archived, not overwritten. Archived plans can be viewed but should not be accidentally reactivated without confirmation.</p>
        </div>
      </div>
      <div className="space-y-4">
        {BODY_CARE_PLAN_VERSIONS.map((version) => (
          <div key={version.version} className="border border-[var(--border)] rounded-md p-5 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h4>{version.version} — effective {version.effectiveDate}</h4>
                <Badge>{version.status}</Badge>
              </div>
              <DefinitionGrid items={[["Created", version.createdDate], ["Changed by", version.changedBy], ["Reason", version.reasonForChange], ["Previous archived", version.previousPlanArchived ? "Yes" : "No"]]} />
            </div>
            <button className="self-start border border-[var(--border)] px-4 py-2 rounded-md text-sm hover:bg-[var(--ivory)]">View archived plan</button>
          </div>
        ))}
      </div>
    </Surface>
  );
}

function DefinitionGrid({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
      {items.map(([label, value]) => (
        <div key={`${label}-${value}`}>
          <dt className="mono-label">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="mono-label block mb-2">{label}</span>{children}</label>;
}

function TextField({ label, placeholder = "", type = "text", className = "" }: { label: string; placeholder?: string; type?: string; className?: string }) {
  return <Field label={label} className={className}><input type={type} placeholder={placeholder} className="w-full bg-[var(--porcelain)] border border-[var(--border)] rounded-md px-3 py-2 text-sm" /></Field>;
}

function SelectField({ label, options, value, onChange }: { label: string; options: readonly string[]; value?: string; onChange?: (value: string) => void }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(event) => onChange?.(event.target.value)} className="w-full bg-[var(--porcelain)] border border-[var(--border)] rounded-md px-3 py-2 text-sm">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </Field>
  );
}

function SliderField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div>
      <label className="mono-label block mb-2">{label} · {value}/10</label>
      <Slider min={0} max={10} step={1} value={[value]} onValueChange={(next) => onChange(next[0])} aria-label={label} />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="inline-flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="accent-[var(--graphite)] w-4 h-4" />{label}</label>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-[var(--border)] px-2.5 py-1 mono-label bg-[var(--ivory)]">{children}</span>;
}

function SafetyNotice({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 border border-[#8a2a2a]/30 bg-[#fdf4f4] rounded-md p-4 flex gap-3"><AlertTriangle size={18} className="text-[#8a2a2a] shrink-0 mt-0.5" /><p className="text-sm text-[#8a2a2a]">{children}</p></div>;
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return <div className="border border-[var(--border)] rounded-md p-4"><div className="mono-label mb-2">{label}</div><div className="text-2xl" style={{ fontFamily: "var(--font-serif)" }}>{value}</div><p className="text-xs text-[var(--soft-text)] mt-1">{hint}</p></div>;
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return <div><div className="h-2 rounded-full bg-[var(--bone)] overflow-hidden"><div className="h-full bg-[var(--steel)]" style={{ width: `${Math.min(100, value)}%` }} /></div><div className="mono-label mt-1">{label}</div></div>;
}
