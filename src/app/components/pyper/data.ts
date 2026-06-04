export const MEMBER = {
  firstName: "Alex",
  phase: "Active Transformation",
};

export const PHASES = [
  "Starting",
  "Active Transformation",
  "Lifestyle Phase",
  "Maintenance",
  "Clinician-Guided Exception",
];

export const TODAY_CARDS = [
  { key: "hydration", label: "Hydration check", value: "62 / 96 oz", progress: 64, hint: "Two more glasses before 6pm" },
  { key: "protein", label: "Protein protected?", value: "88 / 130 g", progress: 67, hint: "Add a 30g portion at dinner" },
  { key: "medication", label: "Medication rhythm", value: "Next dose Sun · 8:00am", progress: 100, hint: "Thigh rotation due this week" },
  { key: "tolerance", label: "Tolerance status", value: "Calm", progress: 18, hint: "No flagged symptoms today" },
  { key: "emotional", label: "Emotional check-in", value: "Steady", progress: 72, hint: "Logged 3 min ago" },
  { key: "bodycare", label: "Body-care routine", value: "AM done · PM pending", progress: 50, hint: "Retinoid night — barrier first" },
  { key: "training", label: "Training rhythm", value: "Strength · 42 min", progress: 80, hint: "Pilates scheduled tomorrow" },
  { key: "provider", label: "Questions for provider", value: "2 open", progress: 30, hint: "Bring to next check-in" },
];

export const REMINDERS_TODAY = [
  { time: "07:30", label: "AM body-care routine", type: "Body-care" },
  { time: "09:00", label: "Hydration check", type: "Hydration" },
  { time: "12:30", label: "Protein check", type: "Protein" },
  { time: "20:00", label: "PM body-care routine", type: "Body-care" },
  { time: "20:30", label: "Emotional check-in", type: "Mental" },
];

export const CHAPTERS = [
  { id: "start", title: "Start Here", time: "4 min", tag: "Onboarding" },
  { id: "safety", title: "Medical & Member Safety", time: "6 min", tag: "Safety" },
  { id: "method", title: "The PYPER Method", time: "8 min", tag: "Foundation" },
  { id: "pillars", title: "Seven PYPER Pillars", time: "10 min", tag: "Foundation" },
  { id: "phases", title: "Three-Phase Standard", time: "7 min", tag: "Framework" },
  { id: "window", title: "The Medication Window", time: "9 min", tag: "GLP-1" },
  { id: "composition", title: "Body Composition", time: "8 min", tag: "Physical" },
  { id: "nutrition", title: "Metabolic Nutrition", time: "12 min", tag: "Nutrition" },
  { id: "dining", title: "Dining, Travel & Social Protocols", time: "9 min", tag: "Lifestyle" },
  { id: "training", title: "Supplements, Strength & Movement", time: "11 min", tag: "Physical" },
  { id: "skin", title: "Skin & Body Refinement", time: "9 min", tag: "Dermatology" },
  { id: "recovery", title: "Recovery, Mindset & Maintenance", time: "8 min", tag: "Mindset" },
  { id: "tracking", title: "Tracking, Safety & Red Flags", time: "7 min", tag: "Safety" },
  { id: "beyond", title: "Beyond GLP-1", time: "10 min", tag: "Maintenance" },
  { id: "appendix", title: "Appendices & Member Tools", time: "5 min", tag: "Tools" },
];

export const PILLARS = [
  { n: "01", title: "Clinical Foundation", body: "Work with a licensed clinician. Every protocol begins with prescribed care and informed consent." },
  { n: "02", title: "Metabolic Nutrition", body: "Protein-protected meals, fiber, electrolytes, and disciplined hydration support the medication window." },
  { n: "03", title: "Strength & Movement", body: "Resistance training preserves lean mass. Pilates refines posture, mobility, and core control." },
  { n: "04", title: "Skin & Body Refinement", body: "Barrier-first dermatology supports the visible transformation as composition shifts." },
  { n: "05", title: "Recovery & Sleep", body: "Sleep and recovery anchor tolerance, mood, and metabolic response." },
  { n: "06", title: "Mindset & Emotional Care", body: "Emotional adjustment is part of the protocol — not an afterthought." },
  { n: "07", title: "Maintenance Discipline", body: "Lifestyle phase is where the work compounds. Maintenance is the brand." },
];

export const TRACKERS = [
  { id: "body", name: "Body Metrics", note: "Weight · waist · hips · chest · arm · thigh" },
  { id: "medication", name: "Medication Rhythm", note: "Dose · site · missed-dose handling" },
  { id: "supplements", name: "Supplement Routine", note: "Clinician-approved · time taken" },
  { id: "tolerance", name: "Tolerance Tracker", note: "Severity sliders · red-flag logic" },
  { id: "emotional", name: "Emotional Check-In", note: "Mood · sleep · body image" },
  { id: "nutrition", name: "Protein + Hydration", note: "Targets · steppers · sliders" },
  { id: "training", name: "Training Rhythm", note: "Strength · Pilates · steps" },
  { id: "skin", name: "Body-Care Routine", note: "AM/PM · barrier · irritation" },
];

export const OFFERS = [
  {
    brand: "Ritual Protein",
    title: "Essential Protein Daily",
    category: "Protein",
    type: "Affiliate Link",
    reason: "Clean third-party tested protein that supports the medication window.",
    benefit: "15% off your first three orders",
    disclosure: "Affiliate link. PYPER may earn commission.",
  },
  {
    brand: "LMNT",
    title: "Zero-sugar electrolytes",
    category: "Hydration",
    type: "Member Partner Offer",
    reason: "Sodium, potassium, magnesium for hydration discipline.",
    benefit: "Free sample pack with purchase",
    disclosure: "Partner offer. PYPER may receive compensation from this brand.",
  },
  {
    brand: "SkinCeuticals",
    title: "Barrier-first regimen",
    category: "Skin + Body Care",
    type: "Guide Exclusive",
    reason: "Dermatology-grade actives paired for sensitive transformation skin.",
    benefit: "Member-only consultation",
    disclosure: "Partner offer. PYPER may receive compensation from this brand.",
  },
  {
    brand: "Equinox",
    title: "Pilates + Strength",
    category: "Pilates",
    type: "Member Partner Offer",
    reason: "Reformer Pilates programming aligned to lean-mass preservation.",
    benefit: "Waived initiation for PYPER members",
    disclosure: "Partner offer. PYPER may receive compensation from this brand.",
  },
  {
    brand: "Factor",
    title: "Protein-forward meal prep",
    category: "Meal Prep",
    type: "Affiliate Link",
    reason: "Helps members hit protein targets on travel weeks.",
    benefit: "$120 off across five boxes",
    disclosure: "Affiliate link. PYPER may earn commission.",
  },
  {
    brand: "Hydrant",
    title: "Travel hydration sachets",
    category: "Travel",
    type: "Member Partner Offer",
    reason: "Portable electrolytes for clinic days and travel.",
    benefit: "20% off + free shipping",
    disclosure: "Partner offer. PYPER may receive compensation from this brand.",
  },
];

export const PROGRESS_SERIES = [
  { week: "W1", weight: 184, protein: 78, tolerance: 4 },
  { week: "W2", weight: 182, protein: 82, tolerance: 3 },
  { week: "W3", weight: 181, protein: 88, tolerance: 5 },
  { week: "W4", weight: 179, protein: 90, tolerance: 2 },
  { week: "W5", weight: 178, protein: 94, tolerance: 2 },
  { week: "W6", weight: 176, protein: 96, tolerance: 3 },
  { week: "W7", weight: 175, protein: 98, tolerance: 1 },
  { week: "W8", weight: 173, protein: 101, tolerance: 2 },
];

export const SAFETY_ITEMS = [
  {
    title: "Urgent red flags",
    body: "Severe abdominal pain, repeated vomiting, inability to hydrate, fainting, chest pain, allergic reaction, suicidal thoughts, or severe mental health concerns may require urgent medical attention. Contact your clinician or seek urgent/emergency care. Do not rely on this guide for urgent medical decisions.",
  },
  {
    title: "Missed-dose guidance",
    body: "Follow your prescriber's instructions for missed doses. Do not double dose unless directed by your clinician.",
  },
  {
    title: "Mental health crisis",
    body: "If you feel unsafe or at risk of harming yourself, contact your clinician, crisis support, or emergency services immediately. This guide does not provide therapy or crisis intervention.",
  },
  {
    title: "Supplement caution",
    body: "Discuss any new supplement with your clinician, especially when taking GLP-1 or other prescribed medications.",
  },
  {
    title: "Body-care irritation",
    body: "Pause actives at first signs of barrier compromise. Barrier first, actives second.",
  },
];

export const RED_FLAG_KEYS = ["abdominalPain", "vomiting", "noHydrate"];
