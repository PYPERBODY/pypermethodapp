import { useEffect, useMemo, useState } from "react";
import { PageHeader, Surface } from "./Shell";
import { BodyCarePlan } from "./BodyCarePlan";
import { CHAPTERS } from "./data";
import { Slider } from "../ui/slider";
import { useGuideAuth } from "../auth/AuthGate";
import {
  backendUnavailableMessage,
  createUserRow,
  dateRangeForView,
  deleteRoutineTemplate,
  deleteUserRow,
  isBackendAvailable,
  listRoutineTemplates,
  listUserRows,
  saveRoutineTemplate,
  updateUserRow,
  type GuideStorageRecord,
} from "../../../lib/secureGuideStorage";
import {
  AlertTriangle,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  Edit3,
  FileText,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

type TrackerKey =
  | "overview"
  | "body"
  | "medication"
  | "supplements"
  | "tolerance"
  | "emotional"
  | "nutrition"
  | "training"
  | "provider"
  | "chapters"
  | "skin";

type FieldKind = "text" | "number" | "date" | "time" | "select" | "toggle" | "slider" | "textarea" | "photo";

type FieldConfig = {
  key: string;
  label: string;
  kind: FieldKind;
  options?: string[];
  placeholder?: string;
  full?: boolean;
};

type Entry = Record<string, string | number | boolean> & {
  id: string;
  entryDate?: string;
  reviewedForCheckIn?: boolean;
  includeInExport?: boolean;
  copiedFrom?: string;
};

type TrackerConfig = {
  key: TrackerKey;
  navLabel: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  fields: FieldConfig[];
  entries: Entry[];
  highlights: { label: string; value: string; hint: string }[];
  quickCopy?: string;
  caution?: string;
  safety?: (draft: Entry) => string | null;
  status?: (draft: Entry) => string[];
  actions?: string[];
};

const HISTORY_VIEWS = ["Today", "Week", "Month", "90 Days", "Year", "All"];
const DUPLICATE_OPTIONS = [
  "Duplicate previous entry",
  "Duplicate most recent",
  "Duplicate yesterday",
  "Duplicate last week",
  "Duplicate selected date",
];

type TrackerStorage = { table: string; dateColumn: string };

const TRACKER_STORAGE: Partial<Record<TrackerKey, TrackerStorage>> = {
  body: { table: "weight_logs", dateColumn: "entry_date" },
  medication: { table: "dose_logs", dateColumn: "entry_date" },
  supplements: { table: "supplement_logs", dateColumn: "entry_date" },
  tolerance: { table: "symptom_logs", dateColumn: "entry_date" },
  emotional: { table: "mental_health_logs", dateColumn: "entry_date" },
  nutrition: { table: "nutrition_logs", dateColumn: "entry_date" },
  training: { table: "training_logs", dateColumn: "entry_date" },
  provider: { table: "provider_questions", dateColumn: "created_at" },
  chapters: { table: "chapter_progress", dateColumn: "last_opened_at" },
};

const FIELD_TO_COLUMN: Record<string, string> = {
  entryDate: "entry_date",
  clothingFit: "clothing_fit",
  medicationName: "medication_name",
  doseAmount: "dose_amount",
  doseUnit: "dose_unit",
  injectionDate: "injection_date",
  injectionTime: "injection_time",
  injectionSite: "injection_site",
  missedDose: "missed_dose",
  sideEffectsAfterDose: "side_effects_after_dose",
  notesForProvider: "notes_for_provider",
  supplementName: "supplement_name",
  timeTaken: "time_taken",
  clinicianApproved: "clinician_approved",
  sideEffectsOrTolerance: "side_effects_or_tolerance",
  abdominalPain: "abdominal_pain",
  unableToHydrate: "unable_to_hydrate",
  bowelMovement: "bowel_movement",
  appetiteTooLow: "appetite_too_low",
  sleepQuality: "sleep_quality",
  bodyImageConcern: "body_image_concern",
  emotionalEatingUrge: "emotional_eating_urge",
  fearOfRegain: "fear_of_regain",
  socialPressure: "social_pressure_trigger",
  medicationMoodConcern: "medication_related_mood_concern",
  panicSymptoms: "panic_symptoms",
  severeDepression: "severe_mental_health_concern",
  inabilityToFunction: "inability_to_function",
  selfHarmConcern: "self_harm_concern",
  suicidalThoughts: "suicidal_thoughts",
  notesForProviderSupport: "notes_for_provider",
  proteinTarget: "protein_target",
  proteinConsumed: "protein_consumed",
  waterTarget: "water_target",
  waterConsumed: "water_consumed",
  foodNoise: "food_noise",
  mealTolerance: "meal_tolerance",
  constipationSupportNote: "constipation_support_note",
  strengthSession: "strength_session",
  workoutType: "workout_type",
  duration: "duration_minutes",
  injuryOrPainNote: "injury_or_pain_note",
  createdDate: "created_at",
  linkedTracker: "linked_tracker",
  linkedGuideSection: "linked_guide_section",
  includeInExport: "include_in_export",
  reviewedForCheckIn: "reviewed_for_checkin",
  copiedFromEntryId: "duplicated_from_entry_id",
  chapterId: "chapter_id",
  chapterTitle: "chapter_title",
  lastOpened: "last_opened_at",
  relatedTracker: "related_tracker",
  relatedReminderPlaceholder: "related_reminder_placeholder",
};

const COLUMN_TO_FIELD = Object.fromEntries(Object.entries(FIELD_TO_COLUMN).map(([field, column]) => [column, field]));


const trackerConfigs: TrackerConfig[] = [
  {
    key: "body",
    navLabel: "Body Metrics",
    eyebrow: "Body Metrics",
    title: "Calm, multi-signal body tracking.",
    subtitle: "Measurements, clothing fit, notes, and future secure photo placeholders support the guide without making weight the only signal.",
    quickCopy: "Progress is broader than weight. Use measured, non-shaming notes for review.",
    highlights: [
      { label: "Latest weight", value: "173.4 lb", hint: "Down 1.2 from last check" },
      { label: "Latest measurements", value: "Waist 32.5 · Hips 41", hint: "Chest, arm, thigh also tracked" },
      { label: "Clothing fit", value: "Denim easier at waist", hint: "Subjective fit note" },
      { label: "Trend", value: "Steady", hint: "Body metrics trend placeholder" },
    ],
    fields: [
      dateField(),
      numberField("weight", "Weight"),
      numberField("waist", "Waist"),
      numberField("hips", "Hips"),
      numberField("chest", "Chest"),
      numberField("arm", "Arm"),
      numberField("thigh", "Thigh"),
      textField("clothingFit", "Clothing fit", "How clothing feels, without judgment", true),
      { key: "photo", label: "Future secure photo placeholder", kind: "photo", full: true },
      notesField(),
    ],
    entries: [
      { id: "bm1", entryDate: "2026-06-04", weight: 173.4, waist: 32.5, hips: 41, chest: 36, arm: 12.5, thigh: 22, clothingFit: "Denim easier at waist", reviewedForCheckIn: true, includeInExport: true, notes: "Energy steady." },
      { id: "bm2", entryDate: "2026-05-28", weight: 174.6, waist: 33, hips: 41.2, chest: 36.2, arm: 12.6, thigh: 22.1, clothingFit: "Blazer smoother", reviewedForCheckIn: false, includeInExport: true, notes: "No photo stored." },
    ],
  },
  {
    key: "medication",
    navLabel: "Medication Rhythm",
    eyebrow: "Medication Rhythm",
    title: "Track rhythm without dose advice.",
    subtitle: "Record medication timing, site, missed-dose status, side effects, and notes for clinician discussion. The Guide never calculates or recommends dose changes.",
    quickCopy: "No dose calculations, schedule adjustments, or double-dose instructions are provided here.",
    highlights: [
      { label: "Last injection", value: "Sun · 8:00 AM", hint: "Left thigh" },
      { label: "Dose tracked", value: "2.5 mg", hint: "Demo entry only" },
      { label: "Missed dose", value: "No", hint: "Safety copy appears if yes" },
      { label: "Reviewed", value: "1 entry", hint: "Marked for Weekly Review" },
    ],
    fields: [
      dateField(),
      textField("medicationName", "Medication name", "Semaglutide demo"),
      numberField("doseAmount", "Dose amount"),
      selectField("doseUnit", "Dose unit", ["mg", "mL", "units", "as prescribed"]),
      dateField("injectionDate", "Injection date"),
      timeField("injectionTime", "Injection time"),
      selectField("injectionSite", "Injection site", ["abdomen", "thigh", "upper arm", "clinician-directed site"]),
      toggleField("missedDose", "Missed dose"),
      textField("sideEffectsAfterDose", "Side effects after dose", "Nausea 2/10, fatigue 3/10", true),
      textField("notesForProvider", "Notes for provider", "Question or context for check-in", true),
    ],
    entries: [
      { id: "med1", entryDate: "2026-06-02", medicationName: "Semaglutide demo", doseAmount: 2.5, doseUnit: "mg", injectionDate: "2026-06-02", injectionTime: "08:00", injectionSite: "thigh", missedDose: false, sideEffectsAfterDose: "Mild nausea", notesForProvider: "Ask whether fatigue pattern matters", reviewedForCheckIn: true, includeInExport: true },
      { id: "med2", entryDate: "2026-05-26", medicationName: "Semaglutide demo", doseAmount: 2.5, doseUnit: "mg", injectionDate: "2026-05-26", injectionTime: "08:15", injectionSite: "abdomen", missedDose: false, sideEffectsAfterDose: "None", notesForProvider: "", reviewedForCheckIn: false, includeInExport: true },
    ],
    safety: (draft) => draft.missedDose ? "Follow your prescriber's instructions for missed doses. Do not double dose unless directed by your clinician." : null,
    actions: ["Add to Provider Questions"],
  },
  {
    key: "supplements",
    navLabel: "Supplements",
    eyebrow: "Supplement Routine",
    title: "Track use without supplement claims.",
    subtitle: "Record what was taken, timing, clinician approval status, side effects or tolerance, and check-in notes.",
    caution: "Supplements can interact with medications or medical conditions. Discuss supplement use with your clinician, especially if pregnant, breastfeeding, taking medication, or managing kidney, liver, heart, gastrointestinal, or mental health conditions.",
    highlights: [
      { label: "Today", value: "3 / 4 taken", hint: "Demo routine" },
      { label: "Clinician-approved", value: "2 items", hint: "Review status tracked" },
      { label: "Tolerance", value: "Calm", hint: "No claims made" },
      { label: "Template", value: "AM stack", hint: "Prototype only" },
    ],
    fields: [
      dateField(),
      selectField("supplementType", "Supplement type", ["protein powder", "electrolytes", "magnesium", "fiber", "omega-3", "vitamin D", "multivitamin", "creatine", "collagen", "probiotic", "other"]),
      textField("supplementName", "Supplement name", "Magnesium glycinate demo"),
      numberField("dose", "Dose"),
      selectField("doseUnit", "Dose unit", ["mg", "g", "scoop", "capsule", "serving", "as directed"]),
      selectField("frequency", "Frequency", ["Daily", "Weekly", "As needed", "Clinician-directed", "Custom"]),
      timeField("timeTaken", "Time taken"),
      toggleField("taken", "Taken"),
      toggleField("clinicianApproved", "Clinician-approved"),
      textField("sideEffectsOrTolerance", "Side effects or tolerance", "Any tolerance notes", true),
      notesField(),
    ],
    entries: [
      { id: "sup1", entryDate: "2026-06-04", supplementType: "electrolytes", supplementName: "Electrolytes demo", dose: 1, doseUnit: "serving", frequency: "Daily", timeTaken: "09:00", taken: true, clinicianApproved: true, sideEffectsOrTolerance: "Tolerated", notes: "Hydration day", reviewedForCheckIn: false, includeInExport: true },
      { id: "sup2", entryDate: "2026-06-03", supplementType: "fiber", supplementName: "Fiber demo", dose: 5, doseUnit: "g", frequency: "Daily", timeTaken: "19:30", taken: false, clinicianApproved: false, sideEffectsOrTolerance: "Not taken", notes: "Ask clinician before continuing", reviewedForCheckIn: true, includeInExport: true },
    ],
  },
  {
    key: "tolerance",
    navLabel: "Tolerance",
    eyebrow: "Tolerance Tracker",
    title: "Symptom tolerance, without diagnosis.",
    subtitle: "Use severity sliders and flags to prepare check-in notes. The Guide does not diagnose symptoms or suggest dose changes.",
    highlights: [
      { label: "Nausea", value: "2 / 10", hint: "Mild" },
      { label: "Constipation", value: "3 / 10", hint: "Mild" },
      { label: "Red flags", value: "None", hint: "Demo state" },
      { label: "Bowel movement", value: "Yes", hint: "Logged today" },
    ],
    fields: [
      dateField(),
      sliderField("nausea", "Nausea"),
      sliderField("constipation", "Constipation"),
      sliderField("reflux", "Reflux"),
      sliderField("headache", "Headache"),
      sliderField("dizziness", "Dizziness"),
      sliderField("fatigue", "Fatigue"),
      sliderField("abdominalPain", "Abdominal pain"),
      toggleField("vomiting", "Vomiting"),
      toggleField("unableToHydrate", "Unable to hydrate"),
      toggleField("bowelMovement", "Bowel movement"),
      toggleField("appetiteTooLow", "Appetite too low"),
      toggleField("fainting", "Fainting"),
      toggleField("chestPain", "Chest pain"),
      toggleField("allergicReaction", "Allergic reaction"),
      notesField(),
    ],
    entries: [
      { id: "tol1", entryDate: "2026-06-04", nausea: 2, constipation: 3, reflux: 1, headache: 0, dizziness: 1, fatigue: 3, abdominalPain: 1, vomiting: false, unableToHydrate: false, bowelMovement: true, appetiteTooLow: false, reviewedForCheckIn: false, includeInExport: true, notes: "Calm day" },
      { id: "tol2", entryDate: "2026-06-03", nausea: 4, constipation: 4, reflux: 2, headache: 1, dizziness: 2, fatigue: 5, abdominalPain: 2, vomiting: false, unableToHydrate: false, bowelMovement: true, appetiteTooLow: false, reviewedForCheckIn: true, includeInExport: true, notes: "Moderate fatigue" },
    ],
    safety: (draft) => (Number(draft.abdominalPain || 0) >= 7 || Number(draft.dizziness || 0) >= 7 || draft.vomiting || draft.unableToHydrate || draft.fainting || draft.chestPain || draft.allergicReaction)
      ? "This may require urgent medical attention. Contact your clinician or seek urgent/emergency care. Do not rely on this guide for urgent medical decisions."
      : null,
    status: (draft) => ["0 = none", "1-3 = mild", "4-6 = moderate", "7-10 = severe"],
  },
  {
    key: "emotional",
    navLabel: "Emotional Check-In",
    eyebrow: "Emotional Check-In",
    title: "Emotional adjustment, safely framed.",
    subtitle: "Track mood and adjustment signals. The Guide does not diagnose, provide therapy, or give medication advice.",
    highlights: [
      { label: "Mood", value: "7 / 10", hint: "Steady" },
      { label: "Stress", value: "4 / 10", hint: "Moderate" },
      { label: "Sleep", value: "6 / 10", hint: "Review pattern" },
      { label: "Safety", value: "No crisis flags", hint: "Demo state" },
    ],
    fields: [
      dateField(),
      sliderField("mood", "Mood"),
      sliderField("anxiety", "Anxiety"),
      sliderField("stress", "Stress"),
      sliderField("irritability", "Irritability"),
      sliderField("sleepQuality", "Sleep quality"),
      sliderField("energy", "Energy"),
      sliderField("confidence", "Confidence"),
      sliderField("bodyImageConcern", "Body image concern"),
      sliderField("emotionalEatingUrge", "Emotional eating urge"),
      sliderField("fearOfRegain", "Fear of regain"),
      toggleField("socialPressure", "Social pressure or comparison trigger"),
      toggleField("medicationMoodConcern", "Medication-related mood concern"),
      toggleField("panicSymptoms", "Panic symptoms"),
      toggleField("severeDepression", "Severe depression"),
      toggleField("inabilityToFunction", "Inability to function"),
      toggleField("selfHarmConcern", "Self-harm concern"),
      toggleField("suicidalThoughts", "Suicidal thoughts"),
      textField("notesForProviderSupport", "Notes for provider/support", "Context for support or check-in", true),
    ],
    entries: [
      { id: "emo1", entryDate: "2026-06-04", mood: 7, anxiety: 3, stress: 4, irritability: 2, sleepQuality: 6, energy: 6, confidence: 7, bodyImageConcern: 4, emotionalEatingUrge: 2, fearOfRegain: 3, socialPressure: false, medicationMoodConcern: false, panicSymptoms: false, inabilityToFunction: false, selfHarmConcern: false, suicidalThoughts: false, severeDepression: false, notesForProviderSupport: "Felt steady after walk", reviewedForCheckIn: false, includeInExport: true },
      { id: "emo2", entryDate: "2026-06-02", mood: 5, anxiety: 5, stress: 6, irritability: 4, sleepQuality: 4, energy: 5, confidence: 5, bodyImageConcern: 6, emotionalEatingUrge: 3, fearOfRegain: 5, socialPressure: true, medicationMoodConcern: false, panicSymptoms: false, inabilityToFunction: false, selfHarmConcern: false, suicidalThoughts: false, severeDepression: false, notesForProviderSupport: "Comparison trigger at dinner", reviewedForCheckIn: true, includeInExport: true },
    ],
    safety: (draft) => (draft.suicidalThoughts || draft.selfHarmConcern || draft.severeDepression || draft.panicSymptoms || draft.inabilityToFunction || Number(draft.mood || 10) <= 2)
      ? "This may require immediate support. Contact your clinician, crisis support, or emergency services if you feel unsafe or at risk of harming yourself."
      : null,
    actions: ["Add to Provider Questions"],
  },
  {
    key: "nutrition",
    navLabel: "Protein + Hydration",
    eyebrow: "Protein + Hydration",
    title: "Protect protein and hydration calmly.",
    subtitle: "Use exact number fields for targets and consumed amounts, with appetite and tolerance sliders for guide review.",
    highlights: [
      { label: "Protein protected", value: "88 / 130 g", hint: "Needs dinner support" },
      { label: "Hydration steady", value: "62 / 96 oz", hint: "Two glasses remaining" },
      { label: "Food noise", value: "3 / 10", hint: "Low" },
      { label: "Check-in", value: "Bring constipation note", hint: "No shame, just pattern" },
    ],
    fields: [
      dateField(),
      numberField("proteinTarget", "Protein target"),
      numberField("proteinConsumed", "Protein consumed"),
      numberField("waterTarget", "Water target"),
      numberField("waterConsumed", "Water consumed"),
      toggleField("electrolytes", "Electrolytes"),
      sliderField("appetite", "Appetite"),
      sliderField("fullness", "Fullness"),
      sliderField("cravings", "Cravings"),
      sliderField("foodNoise", "Food noise"),
      sliderField("mealTolerance", "Meal tolerance"),
      textField("constipationSupportNote", "Constipation support note", "Fiber, hydration, clinician question", true),
      notesField(),
    ],
    entries: [
      { id: "nut1", entryDate: "2026-06-04", proteinTarget: 130, proteinConsumed: 88, waterTarget: 96, waterConsumed: 62, electrolytes: true, appetite: 4, fullness: 6, cravings: 2, foodNoise: 3, mealTolerance: 7, constipationSupportNote: "Add to check-in if persists", notes: "Dinner protein planned", reviewedForCheckIn: false, includeInExport: true },
      { id: "nut2", entryDate: "2026-06-03", proteinTarget: 130, proteinConsumed: 122, waterTarget: 96, waterConsumed: 90, electrolytes: true, appetite: 5, fullness: 6, cravings: 3, foodNoise: 3, mealTolerance: 8, constipationSupportNote: "Calm", notes: "Steady day", reviewedForCheckIn: true, includeInExport: true },
    ],
    status: () => ["protein protected", "hydration steady", "needs attention", "bring to check-in"],
  },
  {
    key: "training",
    navLabel: "Training",
    eyebrow: "Training Rhythm",
    title: "Movement supports the guide rhythm.",
    subtitle: "Training supports body composition, strength, and maintenance. Adjust activity based on clinician guidance, injuries, recovery, and how you feel.",
    highlights: [
      { label: "Strength", value: "Yes", hint: "42 minutes" },
      { label: "Steps", value: "8,420", hint: "Walking logged" },
      { label: "Recovery", value: "7 / 10", hint: "Steady" },
      { label: "Pain note", value: "None", hint: "No medical exercise plan" },
    ],
    fields: [
      dateField(),
      toggleField("strengthSession", "Strength session"),
      toggleField("pilates", "Pilates"),
      toggleField("walking", "Walking"),
      numberField("steps", "Steps"),
      selectField("workoutType", "Workout type", ["strength", "Pilates", "walking", "mobility", "Zone 2 cardio", "recovery session", "rest day", "other"]),
      numberField("duration", "Duration"),
      sliderField("effort", "Effort"),
      sliderField("soreness", "Soreness"),
      sliderField("recovery", "Recovery"),
      textField("injuryOrPainNote", "Injury or pain note", "Bring concerns to clinician if needed", true),
      notesField(),
    ],
    entries: [
      { id: "train1", entryDate: "2026-06-04", strengthSession: true, pilates: false, walking: true, steps: 8420, workoutType: "strength", duration: 42, effort: 7, soreness: 3, recovery: 7, injuryOrPainNote: "None", notes: "Good session", reviewedForCheckIn: false, includeInExport: true },
      { id: "train2", entryDate: "2026-06-03", strengthSession: false, pilates: true, walking: true, steps: 7200, workoutType: "Pilates", duration: 50, effort: 5, soreness: 2, recovery: 8, injuryOrPainNote: "Left hip tight", notes: "Modified range", reviewedForCheckIn: true, includeInExport: true },
    ],
  },
  {
    key: "provider",
    navLabel: "Provider Questions",
    eyebrow: "Provider Questions",
    title: "Questions prepared for check-ins.",
    subtitle: "Collect questions from trackers and guide sections. Phase 4 does not send data to providers.",
    highlights: [
      { label: "Open", value: "4", hint: "Demo queue" },
      { label: "Urgent", value: "0", hint: "Emergency guidance appears if selected" },
      { label: "Linked trackers", value: "3", hint: "Medication, body-care, tolerance" },
      { label: "Export", value: "3 included", hint: "Placeholder only" },
    ],
    fields: [
      textField("question", "Question", "What should I ask?", true),
      selectField("category", "Category", ["medication", "side effects", "nutrition", "supplements", "mental health", "body image", "body-care plan", "skin irritation", "training", "maintenance", "other"]),
      selectField("priority", "Priority", ["low", "normal", "important", "urgent"]),
      dateField("createdDate", "Created date"),
      textField("source", "Source", "Tracker or guide section"),
      selectField("linkedTracker", "Linked tracker", ["Medication Rhythm", "Tolerance", "Emotional Check-In", "Protein + Hydration", "Training", "PYPER Body-Care Plan", "None"]),
      textField("linkedGuideSection", "Linked guide section", "Medication Window"),
      toggleField("resolved", "Resolved"),
      toggleField("includeInExport", "Include in export"),
      notesField(),
    ],
    entries: [
      { id: "q1", question: "Should I discuss the fatigue pattern after dose day?", category: "side effects", priority: "important", createdDate: "2026-06-04", source: "Medication Rhythm", linkedTracker: "Medication Rhythm", linkedGuideSection: "Medication Window", resolved: false, includeInExport: true, reviewedForCheckIn: true, notes: "Bring to routine check-in" },
      { id: "q2", question: "Can I keep using the non-prescription moisturizer with Pigment Rx?", category: "body-care plan", priority: "normal", createdDate: "2026-06-03", source: "PYPER Body-Care Plan", linkedTracker: "PYPER Body-Care Plan", linkedGuideSection: "Skin & Body Refinement", resolved: false, includeInExport: true, reviewedForCheckIn: true, notes: "Phase 3 question" },
    ],
    safety: (draft) => draft.priority === "urgent" ? "If this is a medical emergency or urgent safety concern, seek urgent/emergency care instead of waiting for a routine check-in." : null,
  },
  {
    key: "chapters",
    navLabel: "Chapter Progress",
    eyebrow: "Chapter Progress",
    title: "Keep the Guide at the center.",
    subtitle: "Track completed chapters, saved sections, notes, related trackers, and reminder placeholders without turning the guide into a portal.",
    highlights: [
      { label: "Guide completion", value: "47%", hint: "7 of 15 chapters" },
      { label: "Saved chapters", value: "4", hint: "saved chapters ready to revisit" },
      { label: "Continue", value: "Medication Window", hint: "Last opened yesterday" },
      { label: "Suggested next", value: "Skin & Body Refinement", hint: "Pairs with Body-Care Plan" },
    ],
    fields: [
      selectField("chapterId", "Chapter id", CHAPTERS.map((c) => c.id)),
      selectField("chapterTitle", "Chapter title", CHAPTERS.map((c) => c.title)),
      toggleField("completed", "Completed"),
      toggleField("saved", "Saved"),
      dateField("lastOpened", "Last opened"),
      textField("relatedTracker", "Related tracker", "Tolerance Tracker"),
      textField("relatedReminderPlaceholder", "Related reminder placeholder", "Future guide reminder", true),
      notesField(),
    ],
    entries: [
      { id: "cp1", chapterId: "window", chapterTitle: "The Medication Window", completed: true, saved: true, lastOpened: "2026-06-04", relatedTracker: "Medication Rhythm", relatedReminderPlaceholder: "Weekly review reminder placeholder", notes: "Re-read missed-dose safety", reviewedForCheckIn: true, includeInExport: true },
      { id: "cp2", chapterId: "skin", chapterTitle: "Skin & Body Refinement", completed: false, saved: true, lastOpened: "2026-06-03", relatedTracker: "PYPER Body-Care Plan", relatedReminderPlaceholder: "Body-care review placeholder", notes: "Continue here", reviewedForCheckIn: false, includeInExport: true },
    ],
  },
];

const TRACK_NAV = [
  { key: "overview" as TrackerKey, label: "Overview" },
  ...trackerConfigs.map((config) => ({ key: config.key, label: config.navLabel })),
  { key: "skin" as TrackerKey, label: "PYPER Body-Care Plan" },
];

export function Trackers() {
  const [selected, setSelected] = useState<TrackerKey>("overview");
  const activeConfig = trackerConfigs.find((tracker) => tracker.key === selected);

  return (
    <>
      <PageHeader
        eyebrow="Track"
        title="Guide-related trackers, calmly organized."
        subtitle="Create, duplicate, review, and export fictional demo entries. Tracker data stays local to the demo UI in Phase 4; no backend, auth, reminders, or provider sending is connected."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <Surface className="p-3 h-fit lg:sticky lg:top-6">
          <nav aria-label="Track navigation">
            <ul>
              {TRACK_NAV.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => setSelected(item.key)}
                    className={`w-full text-left px-3 py-3 rounded-md transition-colors ${
                      selected === item.key
                        ? "bg-[var(--graphite)] text-[var(--porcelain)]"
                        : "hover:bg-[var(--ivory)]"
                    }`}
                  >
                    <div className="text-sm">{item.label}</div>
                    <div className={`mono-label mt-0.5 ${selected === item.key ? "text-[var(--bone)]" : ""}`}>
                      {item.key === "overview" ? "Dashboard" : item.key === "skin" ? "Phase 3 dedicated tracker" : "Guide tracker"}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </Surface>

        <div>
          {selected === "overview" && <TrackerOverview onSelect={setSelected} />}
          {selected === "skin" && <BodyCarePlan />}
          {activeConfig && <TrackerWorkspace config={activeConfig} />}
        </div>
      </div>
    </>
  );
}

function TrackerOverview({ onSelect }: { onSelect: (key: TrackerKey) => void }) {
  const totalReviewed = trackerConfigs.reduce((sum, config) => sum + config.entries.filter((entry) => entry.reviewedForCheckIn).length, 0);
  return (
    <div className="space-y-6">
      <Surface className="p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="mono-label mb-2">Tracker overview dashboard</div>
            <h2>Learn → Track → Review → Maintain</h2>
            <p className="text-sm text-[var(--soft-text)] mt-2 max-w-2xl">
              Trackers support The Guide. Use quick entries first, open full details when needed,
              and mark only the entries you want included in future check-in summaries.
            </p>
          </div>
          <Badge>{totalReviewed} marked for Weekly Review</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Metric label="Today's quick entries" value="6" hint="fictional demo cards" />
          <Metric label="Routine templates" value="5" hint="AM stack, hydration, training" />
          <Metric label="Recent entries" value="18" hint="across guide trackers" />
          <Metric label="Export placeholder" value="Ready" hint="selected date range only" />
        </div>
      </Surface>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {trackerConfigs.map((config) => (
          <Surface key={config.key} className="p-5 flex flex-col gap-4">
            <div>
              <div className="mono-label mb-2">{config.eyebrow}</div>
              <h3>{config.navLabel}</h3>
              <p className="text-sm text-[var(--soft-text)] mt-2">{config.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {config.highlights.slice(0, 2).map((item) => <Badge key={item.label}>{item.label}: {item.value}</Badge>)}
            </div>
            <button onClick={() => onSelect(config.key)} className="mt-auto inline-flex items-center justify-center gap-2 bg-[var(--graphite)] text-[var(--porcelain)] px-4 py-2.5 rounded-md text-sm">
              Open {config.navLabel}
            </button>
          </Surface>
        ))}
        <Surface className="p-5 flex flex-col gap-4">
          <div>
            <div className="mono-label mb-2">Dedicated Phase 3 tracker</div>
            <h3>PYPER Body-Care Plan</h3>
            <p className="text-sm text-[var(--soft-text)] mt-2">Preserved as the dedicated body skin-care tracker with prescribed plan and application log kept separate.</p>
          </div>
          <button onClick={() => onSelect("skin")} className="mt-auto inline-flex items-center justify-center gap-2 border border-[var(--graphite)] px-4 py-2.5 rounded-md text-sm hover:bg-[var(--graphite)] hover:text-[var(--porcelain)]">
            Open PYPER Body-Care Plan
          </button>
        </Surface>
      </div>

      <Surface className="p-6">
        <div className="mono-label mb-2">Today's quick entries</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {trackerConfigs.slice(0, 6).map((config) => (
            <button key={config.key} onClick={() => onSelect(config.key)} className="text-left border border-[var(--border)] rounded-md p-4 hover:bg-[var(--ivory)]">
              <div className="font-medium">{config.navLabel}</div>
              <div className="text-xs text-[var(--soft-text)] mt-1">Create new entry · duplicate most recent</div>
            </button>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function TrackerWorkspace({ config }: { config: TrackerConfig }) {
  const storage = TRACKER_STORAGE[config.key];
  const { user } = useGuideAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [templates, setTemplates] = useState<GuideStorageRecord[]>([]);
  const [draft, setDraft] = useState<Entry>(() => makeBlankEntry(config));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [view, setView] = useState("Week");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const safety = config.safety?.(draft);
  const statuses = config.status?.(draft) || [];
  const backendReady = Boolean(user?.id && storage && isBackendAvailable());

  useEffect(() => {
    setDraft(makeBlankEntry(config));
    setEditingId(null);
    setNotice(null);
    setError(null);
  }, [config.key]);

  useEffect(() => {
    void loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.key, user?.id, view]);

  async function loadEntries() {
    if (!storage) return;
    if (!user?.id) {
      setError("Signed out state. Sign in to load secure tracker entries.");
      return;
    }
    if (!isBackendAvailable()) {
      setEntries([]);
      setError(backendUnavailableMessage);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rows = await listUserRows(storage.table, user.id, storage.dateColumn, dateRangeForView(view));
      setEntries(rows.map((row) => fromDbRecord(row, config)));
      const storedTemplates = await listRoutineTemplates(user.id, config.key);
      setTemplates(storedTemplates);
    } catch (err) {
      setError(toFriendlyError(err, "Failed to load saved entries."));
    } finally {
      setLoading(false);
    }
  }

  function updateDraft(next: Entry) {
    setDraft(next);
    setHasUnsavedChanges(true);
  }

  function makeCopy(source: Entry | undefined, label: string) {
    const copied = source || makeBlankEntry(config);
    setDraft({
      ...copied,
      id: crypto.randomUUID(),
      entryDate: new Date().toISOString().slice(0, 10),
      copiedFrom: label,
      copiedFromEntryId: source?.id,
      reviewedForCheckIn: false,
    });
    setEditingId(null);
    setHasUnsavedChanges(true);
    setNotice("Copied from a previous entry. Review and update before saving.");
  }

  async function saveEntry() {
    if (!storage || !user?.id) return;
    const validation = validateEntry(config, draft);
    if (validation) {
      setError(validation);
      return;
    }
    if (!isBackendAvailable()) {
      setError(backendUnavailableMessage);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = toDbPayload(config, draft);
      if (editingId) {
        await updateUserRow(storage.table, user.id, editingId, payload);
        setNotice("Saved successfully. Entry updated in secure guide storage.");
      } else {
        await createUserRow(storage.table, user.id, payload);
        setNotice("Saved successfully. Entry created in secure guide storage.");
      }
      setDraft(makeBlankEntry(config));
      setEditingId(null);
      setHasUnsavedChanges(false);
      await loadEntries();
    } catch (err) {
      setError(toFriendlyError(err, "Failed to save. Your entry was not stored."));
    } finally {
      setSaving(false);
    }
  }

  function editEntry(entry: Entry) {
    if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Discard them and edit this entry?")) return;
    setDraft({ ...entry });
    setEditingId(entry.id);
    setHasUnsavedChanges(false);
    setNotice("Editing saved entry. Review changes before saving.");
  }

  async function deleteEntry(id: string) {
    if (!storage || !user?.id) return;
    if (!window.confirm("Delete this saved guide entry? This cannot be undone.")) return;
    setError(null);
    try {
      await deleteUserRow(storage.table, user.id, id);
      setNotice("Entry deleted.");
      await loadEntries();
    } catch (err) {
      setError(toFriendlyError(err, "Failed to delete entry."));
    }
  }

  async function saveTemplate() {
    if (!user?.id) return;
    if (!isBackendAvailable()) {
      setError(backendUnavailableMessage);
      return;
    }
    try {
      await saveRoutineTemplate(user.id, config.key, `${config.navLabel} template`, toDbPayload(config, draft));
      setNotice("Routine template saved securely.");
      setTemplates(await listRoutineTemplates(user.id, config.key));
    } catch (err) {
      setError(toFriendlyError(err, "Failed to save routine template."));
    }
  }

  function applyTemplate(template: GuideStorageRecord) {
    const data = (template.template_data || {}) as GuideStorageRecord;
    setDraft({ ...fromDbRecord(data, config), id: crypto.randomUUID(), entryDate: new Date().toISOString().slice(0, 10), copiedFrom: String(template.template_name || "template") });
    setHasUnsavedChanges(true);
    setNotice("Template applied. Review and update before saving.");
  }

  async function removeTemplate(id: string) {
    if (!user?.id) return;
    if (!window.confirm("Delete this routine template?")) return;
    try {
      await deleteRoutineTemplate(user.id, id);
      setTemplates(await listRoutineTemplates(user.id, config.key));
      setNotice("Routine template deleted.");
    } catch (err) {
      setError(toFriendlyError(err, "Failed to delete routine template."));
    }
  }

  return (
    <div className="space-y-6">
      <Surface className="p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="mono-label mb-2">{config.eyebrow}</div>
            <h2>{config.title}</h2>
            <p className="text-sm text-[var(--soft-text)] mt-2 max-w-3xl">{config.subtitle}</p>
          </div>
          <button onClick={() => { setDraft(makeBlankEntry(config)); setEditingId(null); setHasUnsavedChanges(false); setNotice("Blank entry ready."); }} className="inline-flex items-center gap-2 bg-[var(--graphite)] text-[var(--porcelain)] px-4 py-2.5 rounded-md text-sm">
            <Plus size={14} /> Create new entry
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {config.highlights.map((item) => <Metric key={item.label} {...item} />)}
        </div>

        <div className="mb-4 rounded-md border border-[var(--border)] bg-[var(--ivory)] p-3 text-sm">
          Secure storage: {backendReady ? `Connected to ${storage?.table}. Queries are scoped to your signed-in user.` : "Unavailable. Sign in and configure Supabase to save entries."}
        </div>
        {config.quickCopy && <p className="text-sm text-[var(--soft-text)] mb-4">{config.quickCopy}</p>}
        {config.caution && <SafetyNotice>{config.caution}</SafetyNotice>}
        {statuses.length > 0 && <div className="flex flex-wrap gap-2 mb-4">{statuses.map((status) => <Badge key={status}>{status}</Badge>)}</div>}
        {safety && <SafetyNotice>{safety}</SafetyNotice>}
        {error && <SafetyNotice>{error}</SafetyNotice>}
        {notice && <div className="mb-4 border border-[var(--border)] bg-[var(--ivory)] rounded-md p-3 text-sm">{notice}</div>}
        {hasUnsavedChanges && <div className="mb-4 rounded-md border border-[var(--border)] p-3 text-sm">Unsaved changes. Save or reset before leaving this entry.</div>}

        <DuplicateControls
          selectedDate={selectedDate}
          onSelectedDate={setSelectedDate}
          onDuplicate={(label) => makeCopy(findDuplicateSource(entries, label, selectedDate), label)}
          onTemplate={saveTemplate}
        />

        {templates.length > 0 && (
          <div className="mb-4 mt-4 rounded-md border border-[var(--border)] p-4">
            <div className="mono-label mb-2">Routine templates</div>
            <div className="flex flex-wrap gap-2">
              {templates.map((template) => (
                <span key={String(template.id)} className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-xs">
                  {String(template.template_name)}
                  <button type="button" onClick={() => applyTemplate(template)} className="underline">Apply</button>
                  <button type="button" onClick={() => removeTemplate(String(template.id))} className="underline">Delete</button>
                </span>
              ))}
            </div>
          </div>
        )}

        <details className="mt-6" open>
          <summary className="cursor-pointer text-sm font-medium py-2">Quick entry and full detail</summary>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-5 pt-4">
            {config.fields.map((field) => <TrackerField key={field.key} field={field} draft={draft} setDraft={updateDraft} />)}
            <ToggleField label="Marked for Weekly Review" checked={!!draft.reviewedForCheckIn} onChange={(checked) => updateDraft({ ...draft, reviewedForCheckIn: checked })} />
            <ToggleField label="Add to Check-In Summary" checked={draft.includeInExport !== false} onChange={(checked) => updateDraft({ ...draft, includeInExport: checked })} />
          </div>
        </details>

        <div className="flex flex-wrap gap-2 mt-6">
          <button disabled={saving || !backendReady} onClick={saveEntry} className="inline-flex items-center gap-2 bg-[var(--graphite)] text-[var(--porcelain)] px-5 py-2.5 rounded-md text-sm disabled:opacity-50"><Save size={14} /> {saving ? "Saving..." : editingId ? "Save edits" : "Save entry"}</button>
          {config.actions?.map((action) => <button key={action} onClick={() => setNotice(`${action} placeholder added to Provider Questions demo queue. No data sent.`)} className="inline-flex items-center gap-2 border border-[var(--border)] px-5 py-2.5 rounded-md text-sm hover:bg-[var(--ivory)]"><ClipboardList size={14} /> {action}</button>)}
          <button onClick={() => setNotice("Export selected date range placeholder only. Nothing is sent.")} className="inline-flex items-center gap-2 border border-[var(--border)] px-5 py-2.5 rounded-md text-sm hover:bg-[var(--ivory)]"><Download size={14} /> Export selected date range</button>
        </div>
      </Surface>

      <Surface className="p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div>
            <div className="mono-label mb-1">History views</div>
            <h3>Recent entries</h3>
          </div>
          <div className="flex flex-wrap gap-1" role="tablist" aria-label="History view filters">
            {HISTORY_VIEWS.map((item) => (
              <button key={item} onClick={() => setView(item)} className={`px-3 py-2 rounded-md text-xs ${view === item ? "bg-[var(--graphite)] text-[var(--porcelain)]" : "hover:bg-[var(--ivory)]"}`} role="tab" aria-selected={view === item}>
                {item}
              </button>
            ))}
          </div>
        </div>
        {loading && <div className="rounded-md border border-[var(--border)] p-4 text-sm">Loading saved entries...</div>}
        {!loading && entries.length === 0 && <div className="rounded-md border border-dashed border-[var(--border)] p-6 text-sm text-[var(--soft-text)]">Your first entry will appear here. Track only what is useful. You do not need to log everything every day.</div>}
        <div className="space-y-3">
          {entries.map((entry) => <EntryRow key={entry.id} entry={entry} config={config} onEdit={editEntry} onDelete={deleteEntry} />)}
        </div>
      </Surface>
    </div>
  );
}

function DuplicateControls({ selectedDate, onSelectedDate, onDuplicate, onTemplate }: { selectedDate: string; onSelectedDate: (value: string) => void; onDuplicate: (label: string) => void; onTemplate: () => void }) {
  return (
    <div className="border border-[var(--border)] rounded-md p-4 bg-[var(--porcelain)]">
      <div className="flex items-center gap-2 mb-3"><Copy size={16} /><div className="mono-label">Duplicate-entry controls</div></div>
      <div className="flex flex-wrap gap-2 items-end">
        {DUPLICATE_OPTIONS.map((option) => <button key={option} onClick={() => onDuplicate(option.replace("Duplicate ", ""))} className="text-xs px-3 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--ivory)]">{option}</button>)}
        <label className="text-xs"><span className="mono-label block mb-1">Selected date</span><input type="date" value={selectedDate} onChange={(event) => onSelectedDate(event.target.value)} className="bg-[var(--porcelain)] border border-[var(--border)] rounded-md px-3 py-2" /></label>
        <button onClick={onTemplate} className="text-xs px-3 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--ivory)]"><Bookmark size={12} className="inline mr-1" />Save as routine template</button>
      </div>
    </div>
  );
}

function TrackerField({ field, draft, setDraft }: { field: FieldConfig; draft: Entry; setDraft: (entry: Entry) => void }) {
  const value = draft[field.key];
  const className = field.full ? "md:col-span-2 xl:col-span-3" : "";
  if (field.kind === "slider") {
    const numeric = Number(value ?? 0);
    return <div className={className}><label className="mono-label block mb-2">{field.label} · {numeric}/10</label><Slider min={0} max={10} step={1} value={[numeric]} onValueChange={(next) => setDraft({ ...draft, [field.key]: next[0] })} aria-label={`${field.label} slider current value ${numeric}`} /></div>;
  }
  if (field.kind === "toggle") {
    return <ToggleField label={field.label} checked={!!value} onChange={(checked) => setDraft({ ...draft, [field.key]: checked })} />;
  }
  if (field.kind === "select") {
    return <Field label={field.label} className={className}><select value={String(value ?? field.options?.[0] ?? "")} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} className="w-full bg-[var(--porcelain)] border border-[var(--border)] rounded-md px-3 py-2 text-sm">{field.options?.map((option) => <option key={option}>{option}</option>)}</select></Field>;
  }
  if (field.kind === "textarea") {
    return <Field label={field.label} className={className}><textarea rows={3} value={String(value ?? "")} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} placeholder={field.placeholder} className="w-full bg-[var(--porcelain)] border border-[var(--border)] rounded-md px-3 py-2 text-sm resize-none" /></Field>;
  }
  if (field.kind === "photo") {
    return <div className={className}><div className="border border-dashed border-[var(--border)] rounded-md p-4 text-sm text-[var(--soft-text)]"><FileText size={16} className="mb-2" />Future secure photo upload placeholder. Do not store real photos in this demo.</div></div>;
  }
  return <Field label={field.label} className={className}><input type={field.kind} value={String(value ?? "")} onChange={(event) => setDraft({ ...draft, [field.key]: field.kind === "number" ? Number(event.target.value) : event.target.value })} placeholder={field.placeholder} className="w-full bg-[var(--porcelain)] border border-[var(--border)] rounded-md px-3 py-2 text-sm" /></Field>;
}

function EntryRow({ entry, config, onEdit, onDelete }: { entry: Entry; config: TrackerConfig; onEdit: (entry: Entry) => void; onDelete: (id: string) => void }) {
  const primary = config.fields.slice(0, 4).map((field) => `${field.label}: ${formatValue(entry[field.key])}`).join(" · ");
  return (
    <div className="border border-[var(--border)] rounded-md p-4 grid grid-cols-1 lg:grid-cols-[120px_1fr_auto] gap-3">
      <div className="font-mono text-sm text-[var(--steel)]">{String(entry.entryDate || entry.createdDate || "demo")}</div>
      <div>
        <div className="text-sm">{primary}</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {entry.reviewedForCheckIn && <Badge><CheckCircle2 size={12} className="inline mr-1" />Marked for Weekly Review</Badge>}
          {entry.includeInExport !== false && <Badge>Add to Check-In Summary</Badge>}
          {entry.copiedFrom && <Badge>Copied from {String(entry.copiedFrom)}</Badge>}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit(entry)} className="text-xs inline-flex items-center gap-1 px-3 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--ivory)]"><Edit3 size={12} />Edit</button>
        <button onClick={() => onDelete(entry.id)} className="text-xs inline-flex items-center gap-1 px-3 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--ivory)]"><Trash2 size={12} />Delete</button>
      </div>
    </div>
  );
}

function makeBlankEntry(config: TrackerConfig): Entry {
  const entry: Entry = { id: crypto.randomUUID(), entryDate: new Date().toISOString().slice(0, 10), reviewedForCheckIn: false, includeInExport: true };
  config.fields.forEach((field) => {
    if (field.key in entry) return;
    if (field.kind === "slider" || field.kind === "number") entry[field.key] = 0;
    else if (field.kind === "toggle") entry[field.key] = false;
    else if (field.kind === "date") entry[field.key] = new Date().toISOString().slice(0, 10);
    else if (field.kind === "time") entry[field.key] = "08:00";
    else if (field.kind === "select") entry[field.key] = field.options?.[0] || "";
    else entry[field.key] = "";
  });
  return entry;
}

function toDbPayload(config: TrackerConfig, entry: Entry): GuideStorageRecord {
  const payload: GuideStorageRecord = {};
  const allowedKeys = new Set(config.fields.map((field) => field.key));
  allowedKeys.add("reviewedForCheckIn");
  allowedKeys.add("includeInExport");
  allowedKeys.add("copiedFromEntryId");
  if (config.key !== "provider" && config.key !== "chapters") allowedKeys.add("entryDate");

  for (const key of allowedKeys) {
    if (key === "photo" || key === "supplementType" || key === "copiedFrom" || key === "id") continue;
    const value = entry[key];
    if (value === undefined || value === "") continue;
    const column = FIELD_TO_COLUMN[key] || camelToSnake(key);
    payload[column] = value;
  }

  if (config.key === "provider") {
    payload.created_at = entry.createdDate || new Date().toISOString();
  }
  if (config.key === "chapters") {
    payload.last_opened_at = entry.lastOpened ? `${entry.lastOpened}T00:00:00.000Z` : new Date().toISOString();
  }

  return payload;
}

function fromDbRecord(row: GuideStorageRecord, config: TrackerConfig): Entry {
  const entry: Entry = { id: String(row.id || crypto.randomUUID()) };
  for (const [key, value] of Object.entries(row)) {
    if (key === "user_id") continue;
    const field = COLUMN_TO_FIELD[key] || snakeToCamel(key);
    if (field === "lastOpened" && typeof value === "string") entry[field] = value.slice(0, 10);
    else if (field === "createdDate" && typeof value === "string") entry[field] = value.slice(0, 10);
    else entry[field] = value as string | number | boolean;
  }
  if (!entry.entryDate && typeof row.entry_date === "string") entry.entryDate = row.entry_date;
  if (config.key === "provider" && !entry.entryDate && typeof row.created_at === "string") entry.entryDate = row.created_at.slice(0, 10);
  if (config.key === "chapters" && !entry.entryDate && typeof row.last_opened_at === "string") entry.entryDate = row.last_opened_at.slice(0, 10);
  return entry;
}

function validateEntry(config: TrackerConfig, entry: Entry) {
  const dateValue = String(entry.entryDate || entry.createdDate || entry.lastOpened || "");
  if (!dateValue) return "Add a valid date before saving.";
  if (dateValue && Number.isNaN(Date.parse(dateValue))) return "Use a valid date format before saving.";

  for (const field of config.fields) {
    const value = entry[field.key];
    if (field.kind === "number" && Number(value) < 0) {
      return `${field.label} cannot be negative.`;
    }
    if (field.kind === "slider" && (Number(value) < 0 || Number(value) > 10)) {
      return `${field.label} must be between 0 and 10.`;
    }
  }

  if (config.key === "medication" && Number(entry.doseAmount || 0) < 0) return "Dose cannot be negative.";
  if (config.key === "body" && ["weight", "waist", "hips", "chest", "arm", "thigh"].some((key) => Number(entry[key] || 0) < 0)) return "Weight and measurements cannot be negative.";
  if (config.key === "nutrition" && ["proteinTarget", "proteinConsumed", "waterTarget", "waterConsumed"].some((key) => Number(entry[key] || 0) < 0)) return "Protein and water values cannot be negative.";
  return null;
}

function findDuplicateSource(entries: Entry[], label: string, selectedDate: string) {
  if (!entries.length) return undefined;
  if (label.includes("selected date")) return entries.find((entry) => entry.entryDate === selectedDate) || entries[0];
  if (label.includes("yesterday")) return entries.find((entry) => isDaysAgo(entry.entryDate, 1)) || entries[0];
  if (label.includes("last week")) return entries.find((entry) => isDaysAgo(entry.entryDate, 7)) || entries[0];
  return entries[0];
}

function isDaysAgo(value: unknown, days: number) {
  if (typeof value !== "string") return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const target = new Date();
  target.setDate(target.getDate() - days);
  return date.toISOString().slice(0, 10) === target.toISOString().slice(0, 10);
}

function camelToSnake(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function snakeToCamel(value: string) {
  return value.replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase());
}

function toFriendlyError(error: unknown, fallback: string) {
  if (error instanceof Error) {
    if (/Failed to fetch|NetworkError|fetch/i.test(error.message)) return backendUnavailableMessage;
    return fallback;
  }
  return fallback;
}

function formatValue(value: unknown) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === undefined || value === "") return "Not entered";
  return String(value);
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="mono-label block mb-2">{label}</span>{children}</label>;
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="inline-flex min-h-11 items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="accent-[var(--graphite)] w-4 h-4" />{label}</label>;
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return <div className="border border-[var(--border)] rounded-md p-4"><div className="mono-label mb-2">{label}</div><div className="text-2xl" style={{ fontFamily: "var(--font-serif)" }}>{value}</div><p className="text-xs text-[var(--soft-text)] mt-1">{hint}</p></div>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-[var(--border)] px-2.5 py-1 mono-label bg-[var(--ivory)]">{children}</span>;
}

function SafetyNotice({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 border border-[#8a2a2a]/30 bg-[#fdf4f4] rounded-md p-4 flex gap-3"><AlertTriangle size={18} className="text-[#8a2a2a] shrink-0 mt-0.5" /><p className="text-sm text-[#8a2a2a]">{children}</p></div>;
}

function dateField(key = "entryDate", label = "Entry date"): FieldConfig { return { key, label, kind: "date" }; }
function timeField(key: string, label: string): FieldConfig { return { key, label, kind: "time" }; }
function numberField(key: string, label: string): FieldConfig { return { key, label, kind: "number" }; }
function textField(key: string, label: string, placeholder = "", full = false): FieldConfig { return { key, label, placeholder, full, kind: "text" }; }
function notesField(): FieldConfig { return { key: "notes", label: "Notes", kind: "textarea", full: true }; }
function selectField(key: string, label: string, options: string[]): FieldConfig { return { key, label, options, kind: "select" }; }
function toggleField(key: string, label: string): FieldConfig { return { key, label, kind: "toggle" }; }
function sliderField(key: string, label: string): FieldConfig { return { key, label, kind: "slider" }; }
