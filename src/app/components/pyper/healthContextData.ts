/**
 * Health, Hormonal & Metabolic Context — prototype data model.
 *
 * Production: store each object in authenticated Supabase tables with RLS.
 * Do NOT send this data to affiliates, partners, analytics, community, or marketing tools.
 * localStorage is demo-only until secure backend review is complete.
 */

export type ConditionStatus =
  | "diagnosed"
  | "suspected"
  | "previously"
  | "resolved"
  | "prefer_not";

export type SymptomSeverity = "mild" | "moderate" | "significant";

export type HealthModuleId =
  | "general"
  | "metabolic"
  | "thyroid"
  | "testosterone"
  | "menstrual"
  | "pcos"
  | "perimenopause"
  | "pregnancy"
  | "prostate"
  | "testicular"
  | "gender_affirming"
  | "medication"
  | "none"
  | "prefer_not";

export const HEALTH_MODULES: { id: HealthModuleId; label: string }[] = [
  { id: "general", label: "General health and medical conditions" },
  { id: "metabolic", label: "Metabolic health" },
  { id: "thyroid", label: "Thyroid and endocrine health" },
  { id: "testosterone", label: "Testosterone and androgen health" },
  { id: "menstrual", label: "Menstrual and cycle health" },
  { id: "pcos", label: "PCOS" },
  { id: "perimenopause", label: "Perimenopause or menopause" },
  { id: "pregnancy", label: "Pregnancy, postpartum or fertility" },
  { id: "prostate", label: "Prostate and urinary health" },
  { id: "testicular", label: "Testicular and reproductive health" },
  { id: "gender_affirming", label: "Gender-affirming hormone care" },
  { id: "medication", label: "Medication and treatment history" },
  { id: "none", label: "None right now" },
  { id: "prefer_not", label: "Prefer not to answer" },
];

export const CONDITION_STATUSES: { id: ConditionStatus; label: string }[] = [
  { id: "diagnosed", label: "Diagnosed" },
  { id: "suspected", label: "Suspected or being investigated" },
  { id: "previously", label: "Previously diagnosed" },
  { id: "resolved", label: "Resolved or no longer active" },
  { id: "prefer_not", label: "Prefer not to specify" },
];

export const GENERAL_CONDITIONS = [
  "High blood pressure",
  "High cholesterol",
  "Cardiovascular condition",
  "Kidney condition",
  "Liver condition",
  "Gallbladder condition",
  "Gastrointestinal condition",
  "Pancreatic condition",
  "Sleep apnea",
  "Chronic pain",
  "Mobility limitation",
  "Eating disorder history",
  "Mental health condition",
  "Neurological condition",
  "Autoimmune condition",
  "Other medical condition",
  "None known",
  "Prefer not to answer",
];

export const METABOLIC_CONDITIONS = [
  "Insulin resistance",
  "Prediabetes",
  "Type 1 diabetes",
  "Type 2 diabetes",
  "History of gestational diabetes",
  "Metabolic syndrome",
  "Fatty liver disease",
  "High cholesterol",
  "High blood pressure",
  "Sleep apnea",
  "Previous bariatric surgery",
  "Previous medical weight-management treatment",
  "Other metabolic condition",
  "None known",
  "Prefer not to answer",
];

export const THYROID_CONDITIONS = [
  "Hypothyroidism",
  "Hyperthyroidism",
  "Hashimoto’s disease",
  "Graves’ disease",
  "Cushing syndrome",
  "Adrenal condition",
  "Pituitary condition",
  "Prolactin condition",
  "Growth hormone condition",
  "Other thyroid or endocrine condition",
  "None known",
  "Prefer not to answer",
];

export const MENSTRUAL_OPTIONS = [
  "Currently menstruating",
  "Regular cycles",
  "Irregular cycles",
  "Absent periods",
  "Changing cycle pattern",
  "Periods recently heavier, lighter, longer, shorter, or less predictable",
  "Hysterectomy",
  "Removal of one or both ovaries",
  "Hormonal contraception",
  "Prefer not to answer",
];

export const PCOS_OPTIONS = [
  "Diagnosed PCOS",
  "Suspected PCOS or being investigated",
  "Previous PCOS diagnosis",
  "High androgen levels",
  "Insulin resistance",
  "Irregular or absent periods",
  "Fertility concerns",
  "Acne or oily skin",
  "Increased facial or body hair",
  "Hair thinning or shedding",
  "Darkened skin patches",
  "Other PCOS-related concern",
  "Prefer not to answer",
];

export const PERIMENOPAUSE_OPTIONS = [
  "Perimenopause",
  "Menopause",
  "Premature or early menopause",
  "Surgical menopause",
  "Menopausal hormone therapy",
  "Previous hormone therapy",
  "Hot flashes",
  "Night sweats",
  "Sleep changes",
  "Mood changes",
  "Brain fog",
  "Vaginal dryness",
  "Change in libido",
  "Body-composition changes",
  "Other relevant change",
  "Prefer not to answer",
];

export const REPRODUCTIVE_CONDITIONS = [
  "PMS",
  "PMDD",
  "Endometriosis",
  "Adenomyosis",
  "Uterine fibroids",
  "Infertility or fertility treatment",
  "Other hormonal or reproductive condition",
  "None known",
  "Prefer not to answer",
];

export const PREGNANCY_OPTIONS = [
  "Currently pregnant",
  "Trying to conceive",
  "Fertility testing",
  "Fertility treatment",
  "Currently postpartum",
  "Breastfeeding or chestfeeding",
  "Previous pregnancy-related metabolic condition",
  "Previous gestational diabetes",
  "Previous pregnancy-related high blood pressure",
  "Fertility concern",
  "Prefer not to answer",
];

export const TESTOSTERONE_CONDITIONS = [
  "Diagnosed low testosterone or hypogonadism",
  "Previously recorded low testosterone",
  "Currently being evaluated for low testosterone",
  "Testosterone replacement therapy",
  "Previous testosterone treatment",
  "Anabolic steroid or performance-enhancing hormone use, current or previous",
  "Estrogen treatment",
  "Anti-androgen treatment",
  "Gender-affirming hormone treatment",
  "Delayed or early puberty history",
  "Prolactin or pituitary condition",
  "Gynecomastia",
  "Other androgen or hormonal condition",
  "None known",
  "Prefer not to answer",
];

export const ANDROGEN_SYMPTOMS = [
  "Reduced energy",
  "Persistent fatigue",
  "Reduced strength",
  "Loss of muscle",
  "Difficulty gaining muscle",
  "Increase in body fat",
  "Change in body-fat distribution",
  "Reduced motivation",
  "Mood changes",
  "Brain fog or difficulty concentrating",
  "Sleep disruption",
  "Reduced libido",
  "Change in erections",
  "Reduced morning erections",
  "Breast or chest tissue enlargement",
  "Breast or chest tenderness",
  "Reduced facial or body-hair growth",
  "Increased hair thinning or loss",
  "Other",
  "None",
  "Prefer not to answer",
];

export const TESTICULAR_OPTIONS = [
  "Testicular injury",
  "Testicular surgery",
  "Testicular torsion",
  "Testicular infection",
  "Removal of one or both testicles",
  "Undescended testicle history",
  "Vasectomy",
  "Fertility concerns",
  "Reduced sperm count or sperm quality",
  "Fertility testing",
  "Fertility treatment",
  "Other testicular or reproductive condition",
  "None known",
  "Prefer not to answer",
];

export const TESTICULAR_SYMPTOMS = [
  "Testicular discomfort",
  "New testicular change",
  "Change in size",
  "Fertility concern",
  "Pelvic discomfort",
  "Other",
  "Prefer not to answer",
];

export const PROSTATE_OPTIONS = [
  "Enlarged prostate",
  "Prostatitis",
  "Prostate cancer",
  "Previous prostate surgery or procedure",
  "Androgen-deprivation therapy",
  "Other prostate condition",
  "None known",
  "Prefer not to answer",
];

export const URINARY_SYMPTOMS = [
  "Urinary frequency",
  "Urinary urgency",
  "Difficulty starting urination",
  "Weak or interrupted urine stream",
  "Dribbling",
  "Difficulty emptying the bladder",
  "Waking frequently to urinate",
  "Blood in urine",
  "Pelvic or genital discomfort",
  "Other urinary change",
  "Inability to urinate",
  "Severe pelvic pain",
  "Severe or rapidly worsening symptoms",
];

export const GENDER_AFFIRMING_OPTIONS = [
  "Testosterone therapy",
  "Estrogen therapy",
  "Progesterone therapy",
  "Anti-androgen medication",
  "Puberty blockers",
  "Other gender-affirming hormone treatment",
  "Previous gender-affirming hormone treatment",
  "Chest surgery",
  "Hysterectomy",
  "Oophorectomy",
  "Orchiectomy",
  "Other relevant surgery",
  "Prefer not to answer",
];

export const HEALTH_SYMPTOMS = [
  "Fatigue",
  "Low energy",
  "Sleep disruption",
  "Hot flashes",
  "Night sweats",
  "Mood changes",
  "Brain fog or difficulty concentrating",
  "Appetite changes",
  "Increased cravings",
  "Reduced strength",
  "Loss of muscle",
  "Difficulty gaining muscle",
  "Increase in body fat",
  "Change in body-fat distribution",
  "Acne or oily skin",
  "Increased facial or body hair",
  "Reduced facial or body-hair growth",
  "Hair thinning or shedding",
  "Darkened skin patches",
  "Irregular periods",
  "Missed periods",
  "Heavy bleeding",
  "Vaginal dryness",
  "Change in libido",
  "Change in erections",
  "Reduced morning erections",
  "Breast or chest tenderness",
  "Breast or chest tissue enlargement",
  "Bloating or fluid retention",
  "Pelvic discomfort",
  "Testicular discomfort",
  "Urinary changes",
  "Headaches or migraines",
  "Unexplained weight change",
  "Other",
  "None",
  "Prefer not to answer",
];

export const MEDICATION_CATEGORIES = [
  "GLP-1 or weight-management medication",
  "Hormonal contraception",
  "Menopausal hormone therapy",
  "Testosterone therapy",
  "Estrogen therapy",
  "Progesterone therapy",
  "Anti-androgen medication",
  "Gender-affirming hormone treatment",
  "Thyroid medication",
  "Metformin",
  "Insulin",
  "Other diabetes medication",
  "Corticosteroids",
  "Antidepressant or mood medication",
  "Fertility medication",
  "Acne medication",
  "Spironolactone",
  "Finasteride",
  "Dutasteride",
  "Prostate medication",
  "Erectile-dysfunction medication",
  "Clomiphene or related hormonal treatment",
  "hCG treatment",
  "Anabolic steroid or performance-enhancing hormone",
  "Supplements",
  "Other prescription medication",
  "Other treatment",
];

export const EXPORT_SECTIONS = [
  { id: "body_bmi", label: "Body metrics and BMI" },
  { id: "weight_trend", label: "Weight trend" },
  { id: "medications", label: "Current medications and treatments" },
  { id: "conditions", label: "Diagnosed or suspected conditions" },
  { id: "hormonal", label: "Hormonal and reproductive context" },
  { id: "testosterone", label: "Testosterone and androgen context" },
  { id: "prostate_urinary_testicular", label: "Prostate, urinary or testicular context" },
  { id: "symptoms", label: "Selected symptoms and severity" },
  { id: "timeline", label: "Timeline changes" },
  { id: "provider_questions", label: "Questions for provider" },
] as const;

export type ExportSectionId = (typeof EXPORT_SECTIONS)[number]["id"];

export type ConditionEntry = {
  id: string;
  name: string;
  module: HealthModuleId;
  status: ConditionStatus;
  dateDiagnosed?: string;
  clinician?: string;
  treatment?: string;
  notes?: string;
  includeInExport: boolean;
};

export type BodyMetricsProfile = {
  heightInches: number | null;
  startingWeightLb: number | null;
  currentWeightLb: number | null;
  goalWeightLb: number | null;
  highestAdultWeightLb: number | null;
  lowestAdultWeightLb: number | null;
  waist: number | null;
  hips: number | null;
  chest: number | null;
  arm: number | null;
  thigh: number | null;
  weightChange12Months: string;
  unexplainedChange: string;
  clothingFit: string;
  notes: string;
};

export type MedicationEntry = {
  id: string;
  name: string;
  category: string;
  formulation: string;
  dose: string;
  frequency: string;
  startDate: string;
  endDate: string;
  reason: string;
  prescriber: string;
  currentlyTaking: boolean;
  observedChanges: string;
  sideEffects: string;
  notesForProvider: string;
  includeInExport: boolean;
};

export type SymptomEntry = {
  id: string;
  name: string;
  severity: SymptomSeverity;
  startDate: string;
  pattern: string;
  notes: string;
  addToProviderQuestions: boolean;
  includeInExport: boolean;
};

export type TimelineEvent = {
  id: string;
  label: string;
  at: string;
};

export type HealthContextState = {
  selectedModules: HealthModuleId[];
  bodyMetrics: BodyMetricsProfile;
  conditions: ConditionEntry[];
  multiSelect: Record<string, string[]>;
  medications: MedicationEntry[];
  symptoms: SymptomEntry[];
  timeline: TimelineEvent[];
  showDashboardReminders: boolean;
  exportSections: ExportSectionId[];
  lastUpdated: string | null;
  // Prototype flag — production writes go to authenticated secure storage
  storageMode: "prototype-demo";
};

export const BMI_NOTE =
  "BMI is one screening measurement based on height and weight. It does not measure body composition, muscle mass, body-fat distribution, health, or personal worth.";

export const HEALTH_SCOPE_NOTE =
  "The PYPER Method helps you record patterns and prepare for conversations with your healthcare provider. Symptoms and body changes can have many possible causes. This guide does not diagnose hormonal, reproductive, metabolic, prostate, testicular, thyroid, fertility, or other medical conditions.";

export const MEDICATION_CHANGE_NOTE =
  "Do not start, stop, restart, or change the dose of a prescription medication or hormone treatment based on information in this guide. Contact your licensed healthcare provider.";

export const PREGNANCY_SAFETY_NOTE =
  "Pregnancy, conception planning, breastfeeding, or chestfeeding must be discussed with your prescribing clinician before starting or continuing weight-management medication or changing treatment. This guide does not provide medication clearance.";

export const TESTICULAR_RED_FLAG =
  "Sudden or severe testicular pain requires urgent medical assessment. Do not wait for a routine PYPER check-in.";

export const URINARY_RED_FLAG =
  "These symptoms require prompt medical assessment. Contact an appropriate medical service rather than waiting for a routine PYPER check-in.";

export const EXPORT_DISCLAIMER =
  "This summary contains information entered by the member. It is not a diagnosis, clinical assessment, or verified medical record.";

export const PRIVACY_HEALTH_NOTE =
  "Your health logs may include sensitive health information. PYPER should only store this information in a secure member system with appropriate privacy, security, and vendor protections. Do not use this portal for emergencies.";

export function calcBmi(weightLb: number | null, heightInches: number | null): number | null {
  if (!weightLb || !heightInches || heightInches <= 0) return null;
  const bmi = (weightLb / (heightInches * heightInches)) * 703;
  return Math.round(bmi * 10) / 10;
}

export function uid(prefix = "hc"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createInitialHealthContext(): HealthContextState {
  return {
    selectedModules: [],
    bodyMetrics: {
      heightInches: null,
      startingWeightLb: null,
      currentWeightLb: null,
      goalWeightLb: null,
      highestAdultWeightLb: null,
      lowestAdultWeightLb: null,
      waist: null,
      hips: null,
      chest: null,
      arm: null,
      thigh: null,
      weightChange12Months: "",
      unexplainedChange: "",
      clothingFit: "",
      notes: "",
    },
    conditions: [],
    multiSelect: {},
    medications: [],
    symptoms: [],
    timeline: [
      {
        id: uid("tl"),
        label: "Health Context opened (prototype state — not secure storage)",
        at: new Date().toISOString(),
      },
    ],
    showDashboardReminders: false,
    exportSections: EXPORT_SECTIONS.map((s) => s.id),
    lastUpdated: null,
    storageMode: "prototype-demo",
  };
}

export const CHAPTER_HEALTH = {
  id: "health-context",
  title: "Health, Hormonal & Metabolic Context",
  time: "14 min",
  tag: "Private profile",
};

/** Suggested secure tables — see supabase/health_context_schema.md */
export const SECURE_TABLES = [
  "member_health_modules",
  "body_metric_entries",
  "health_conditions",
  "hormonal_context",
  "reproductive_context",
  "testosterone_androgen_context",
  "prostate_urinary_context",
  "testicular_reproductive_context",
  "gender_affirming_care_context",
  "medication_treatment_entries",
  "health_symptom_entries",
  "health_timeline_events",
  "provider_questions",
  "provider_export_preferences",
] as const;
