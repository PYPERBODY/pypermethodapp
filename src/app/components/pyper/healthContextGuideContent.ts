/**
 * Phase 1 — readable guide content for Health, Hormonal & Metabolic Context.
 * Source: docs/PYPER_Master_Guide_Health_Hormonal_Metabolic_Update.md
 * Forms and interactive capture belong in later phases.
 */

export const HEALTH_CONTEXT_INTRO = {
  title: "Your Health Context",
  paragraphs: [
    "Your body does not change in isolation.",
    "Hormones, medical conditions, medications, sleep, stress, reproductive history, previous treatment, and changes in muscle or body composition may all shape how you feel and how you experience progress.",
    "This private section helps you record that context and prepare for more informed conversations with your healthcare provider.",
    "You may skip any question. Your answers do not create a diagnosis and are not used to make automatic treatment recommendations.",
  ],
};

export const HEALTH_CONTEXT_SCOPE = [
  "The PYPER Method helps you record patterns and prepare for conversations with your healthcare provider. Symptoms and body changes can have many possible causes. This guide does not diagnose hormonal, reproductive, metabolic, prostate, testicular, thyroid, fertility, or other medical conditions.",
  "Do not start, stop, restart, or change the dose of a prescription medication or hormone treatment based on information in this guide. Contact your licensed healthcare provider.",
];

export type GuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
};

export const HEALTH_CONTEXT_SECTIONS: GuideSection[] = [
  {
    id: "module-selection",
    title: "Health Module Selection",
    paragraphs: [
      "Health Context does not begin with a binary male/female form.",
      "Members choose which private health areas to include. Only questions connected to selected modules appear later. Modules can be added or removed at any time.",
      "Which health areas would you like to include in your private profile? Select all that apply.",
    ],
    bullets: [
      "General health and medical conditions",
      "Metabolic health",
      "Thyroid and endocrine health",
      "Testosterone and androgen health",
      "Menstrual and cycle health",
      "PCOS",
      "Perimenopause or menopause",
      "Pregnancy, postpartum or fertility",
      "Prostate and urinary health",
      "Testicular and reproductive health",
      "Gender-affirming hormone care",
      "Medication and treatment history",
      "None right now",
      "Prefer not to answer",
    ],
  },
  {
    id: "body-metrics",
    title: "Body Metrics and BMI",
    paragraphs: [
      "This section supports private recording of height, weight history, optional measurements, clothing fit, and notes for clinician conversations.",
      "When height and weight are recorded in a later phase, the portal may calculate starting BMI, current BMI, and change in BMI as screening measurements only.",
    ],
    bullets: [
      "Height",
      "Starting weight",
      "Current weight",
      "Goal weight (optional)",
      "Highest adult weight (optional)",
      "Lowest adult weight (optional)",
      "Waist, hip, chest, arm, and thigh measurements (optional)",
      "Weight change during the previous 12 months",
      "Recent unexplained weight gain or loss",
      "Clothing fit",
      "Notes",
    ],
    note: "BMI is one screening measurement based on height and weight. It does not measure body composition, muscle mass, body-fat distribution, health, or personal worth.",
  },
  {
    id: "general-health",
    title: "General Health and Medical Conditions",
    paragraphs: [
      "Members may record general medical conditions that could affect energy, recovery, appetite, training, or maintenance — without creating a diagnosis in this portal.",
      "Each condition may later be marked as diagnosed, suspected or being investigated, previously diagnosed, resolved or no longer active, or prefer not to specify. Detail fields remain optional.",
    ],
    bullets: [
      "High blood pressure",
      "High cholesterol",
      "Cardiovascular, kidney, liver, gallbladder, gastrointestinal, or pancreatic conditions",
      "Sleep apnea",
      "Chronic pain or mobility limitation",
      "Eating disorder history",
      "Mental health, neurological, or autoimmune conditions",
      "Other medical condition",
      "None known",
      "Prefer not to answer",
    ],
  },
  {
    id: "metabolic",
    title: "Metabolic Health",
    paragraphs: [
      "Metabolic context may include insulin resistance, diabetes history, metabolic syndrome, fatty liver disease, prior bariatric surgery, prior medical weight-management treatment, and related conditions.",
      "This guide does not interpret laboratory results or label results normal or abnormal unless that information comes from a licensed provider workflow.",
    ],
    bullets: [
      "Insulin resistance, prediabetes, type 1 diabetes, type 2 diabetes",
      "History of gestational diabetes",
      "Metabolic syndrome",
      "Fatty liver disease",
      "High cholesterol or high blood pressure",
      "Sleep apnea",
      "Previous bariatric surgery",
      "Previous medical weight-management treatment",
      "Other metabolic condition",
      "None known",
      "Prefer not to answer",
    ],
  },
  {
    id: "thyroid",
    title: "Thyroid and Endocrine Health",
    paragraphs: [
      "Thyroid and endocrine context may include hypothyroidism, hyperthyroidism, Hashimoto’s disease, Graves’ disease, adrenal, pituitary, prolactin, growth hormone, or other endocrine conditions.",
      "Status, treatment, review timing, symptoms to monitor, and provider questions may be recorded later. This section does not diagnose endocrine disease.",
    ],
  },
  {
    id: "menstrual-pcos-menopause",
    title: "Menstrual, PCOS, Perimenopause and Menopause Context",
    paragraphs: [
      "These questions appear only when a member selects a relevant module. The guide does not assume every member menstruates or that hormonal health only means periods, PCOS, perimenopause, or menopause.",
      "Menstrual and cycle history may include current cycle patterns, surgical history, and hormonal contraception — with skip and prefer-not-to-answer options.",
      "PCOS-related context may be recorded when selected, but the guide must not diagnose PCOS from selected symptoms.",
      "Perimenopause and menopause context may include hormone therapy history and common changes in sleep, mood, body composition, and related symptoms.",
      "Other reproductive conditions such as PMS, PMDD, endometriosis, adenomyosis, fibroids, or fertility treatment may also be noted when relevant.",
    ],
  },
  {
    id: "pregnancy",
    title: "Pregnancy, Postpartum and Fertility Context",
    paragraphs: [
      "Members may privately note pregnancy, conception planning, fertility testing or treatment, postpartum status, breastfeeding or chestfeeding, and related metabolic history.",
      "Pregnancy loss questions, when offered later, must remain optional, gently worded, and skippable.",
    ],
    note: "Pregnancy, conception planning, breastfeeding, or chestfeeding must be discussed with the prescribing clinician before starting or continuing weight-management medication or changing treatment. This guide does not provide medication clearance.",
  },
  {
    id: "testosterone",
    title: "Testosterone and Androgen Health",
    paragraphs: [
      "Testosterone and androgen context is available to any member who selects the module. It may include low-testosterone evaluation or treatment history, related hormone treatments, and a symptom baseline.",
      "Symptoms must not trigger an automatic low-testosterone diagnosis or treatment suggestion.",
    ],
    bullets: [
      "Diagnosed, previously recorded, or currently evaluated low testosterone",
      "Testosterone replacement or previous testosterone treatment",
      "Related hormone or performance-enhancing hormone history when relevant",
      "Symptom baseline such as energy, strength, mood, sleep, libido, or body-composition changes",
      "None known",
      "Prefer not to answer",
    ],
  },
  {
    id: "testicular",
    title: "Testicular and Reproductive Health",
    paragraphs: [
      "This optional module supports private recording of testicular injury, surgery, infection, fertility concerns, and related reproductive history.",
      "The guide does not attempt to determine the cause of symptoms.",
    ],
    note: "Sudden or severe testicular pain requires urgent medical assessment. Do not wait for a routine PYPER check-in.",
  },
  {
    id: "prostate",
    title: "Prostate and Urinary Health",
    paragraphs: [
      "Prostate and urinary context may include enlarged prostate, prostatitis, prostate cancer history, prior procedures, androgen-deprivation therapy, and urinary symptom patterns.",
      "The guide does not interpret the cause of urinary changes.",
    ],
    note: "Inability to urinate, blood in urine, severe pelvic pain, or severe or rapidly worsening symptoms require prompt medical assessment. Contact an appropriate medical service rather than waiting for a routine PYPER check-in.",
  },
  {
    id: "gender-affirming",
    title: "Gender-Affirming Hormone and Surgical Context",
    paragraphs: [
      "This module is optional and private. Members may record gender-affirming hormone treatments and relevant surgical history when they choose to include this area.",
      "Do not infer anatomy, identity, fertility, menstrual status, prostate status, or pregnancy potential from a gender label.",
    ],
  },
  {
    id: "medication",
    title: "Medication and Treatment Context",
    paragraphs: [
      "Health Context expands tracking beyond GLP-1 medication. Members may later record hormonal contraception, menopausal hormone therapy, testosterone or estrogen therapy, thyroid medication, metformin, insulin, corticosteroids, mood medication, fertility medication, prostate medication, supplements, and other treatments.",
      "Entries may include name, category, formulation, dose, frequency, dates, prescriber, observed changes, tolerance notes, and whether to include the item in a provider export.",
    ],
    note: "Do not start, stop, restart, or change the dose of a prescription medication or hormone treatment based on information in this guide. Contact your licensed healthcare provider.",
  },
  {
    id: "provider-export",
    title: "Provider Export",
    paragraphs: [
      "Members may create a clinician-facing summary containing only the information they choose.",
      "Export sections may include body metrics and BMI, weight trend, medications and treatments, conditions, hormonal and reproductive context, testosterone and androgen context, prostate, urinary or testicular context, selected symptoms, timeline changes, and questions for provider.",
      "Before export, members can exclude any section. Partner activity, affiliate clicks, community activity, and unrelated lifestyle browsing are never included.",
    ],
    note: "This summary contains information entered by the member. It is not a diagnosis, clinical assessment, or verified medical record.",
  },
  {
    id: "privacy-safety",
    title: "Privacy and Safety",
    paragraphs: [
      "All information in Health Context is treated as sensitive health data. It must never appear in public profiles, community areas, referral systems, partner offers, affiliate tracking, social sharing, or marketing flows.",
      "Members should be able to skip a question, choose prefer not to answer, edit or delete answers, remove a module, control dashboard visibility, and control what appears in an export.",
      "Dashboard reminders that mention Health Context remain off unless the member enables them. Sensitive diagnoses are not placed on the main dashboard by default.",
      "This portal is not an emergency service. Urgent symptoms require clinician contact or emergency care.",
    ],
    bullets: [
      "Severe or persistent abdominal pain",
      "Repeated vomiting",
      "Inability to hydrate",
      "Fainting",
      "Chest pain",
      "Allergic reaction",
      "Suicidal thoughts or immediate mental-health danger",
      "Sudden or severe testicular pain",
      "Inability to urinate",
      "Blood in urine",
      "Severe pelvic pain",
      "Severe or rapidly worsening symptoms",
    ],
    note: "Your health logs may include sensitive health information. PYPER should only store this information in a secure member system with appropriate privacy, security, and vendor protections. Do not use this portal for emergencies.",
  },
];
