# The PYPER Method Interactive Guide Master Prompt for Claude Code / Cursor

Paste this into `CLAUDE.md` at the root of your project folder, or save it as `docs/pyper-member-portal-spec.md`.

---

You are an advanced product designer, brand systems designer, healthcare UX strategist, and senior full-stack developer.

We are building The PYPER Method Interactive Guide.

PYPER is a premium body-focused dermatology, GLP-1, metabolic transformation, and lifestyle-support brand. The portal should feel like Equinox discipline, luxury dermatology precision, and calm clinical support. It should not feel like a diet app, a cheap tracker, a PDF flipbook, a generic interactive clinical-lifestyle guide, or a wellness template.

Use the attached `preview.html` as the core content and visual direction source. Preserve the PYPER Method content, structure, tone, safety language, guide chapters, pillars, tables, check-in concepts, and member tools from `preview.html`, but do not keep it as a fixed PDF-style layout.

Important:
The existing guide is built like a print/PDF document with fixed Letter pages, page breaks, headers, footers, and static sections. Convert this into a responsive, interactive, mobile-first logged-in interactive guide for phones, tablets, and desktop.

Do not build a flipbook.
Do not keep fixed 8.5in x 11in pages.
Do not use page-break layouts as the main experience.
Do not remove medical disclaimers, safety warnings, red-flag guidance, clinician language, or member safety boundaries.
Do not create diagnosis logic.
Do not recommend dose changes.
Do not give medical advice.
Do not connect health logs to unsecured forms, email, Google Sheets, Airtable, Notion, Typeform, Webflow forms, or Netlify Forms.
Do not add advertising pixels, retargeting scripts, behavioral tracking, or session replay inside the logged-in interactive guide.
Do not pass member health data into affiliate links, partner links, analytics, or third-party tools.

Build this as a responsive private interactive guide with:
- Method guide chapters
- interactive trackers
- repeatable entries
- duplicate-entry functionality
- sliders and number fields
- reminders
- progress dashboard
- partner offers
- affiliate links
- safety tab
- provider check-in export
- mobile-first navigation
- future-ready secure backend structure

Recommended build:
- Frontend: mobile-first responsive web app
- Use clean HTML/CSS/JavaScript or React if the existing project is already React-based
- Backend-ready structure for Supabase Auth + secure database
- Health trackers should be prepared for authenticated secure storage, not localStorage as the permanent system
- LocalStorage can be used only for prototype/demo UI state until secure auth/database is connected

Primary product name:
The PYPER Method Interactive Guide

Main guide experience:
Today in The Guide

Core navigation:
1. Today
2. Method
3. Track
4. Reminders
5. Progress
6. The PYPER Edit
7. Safety


Mobile bottom navigation:
- Today
- Method
- Track
- Safety


The experience should open to Today, with the Guide section remaining the heart of the product.

TODAY DASHBOARD REQUIREMENTS

Create a premium dashboard called “Today in The Guide.”

Include:
- Today’s date
- member greeting
- current phase: Starting, Active Transformation, Lifestyle Phase, Maintenance, or Clinician-Guided Exception
- next best action
- today’s reminders
- next GLP-1 dose reminder
- hydration progress
- supplement routine status
- protein check
- symptom/tolerance check
- mental health check-in
- training/movement status
- body-care AM/PM routine status
- unresolved provider questions
- weekly check-in progress
- link to export check-in summary

Dashboard card language should feel elevated and calm:
- “Hydration check”
- “Protein protected?”
- “Medication rhythm”
- “Tolerance status”
- “Emotional check-in”
- “Body-care routine”
- “Training rhythm”
- “Questions for provider”

METHOD GUIDE REQUIREMENTS

Convert the content from `preview.html` into responsive guide chapters.

The Method tab should include:
- Start Here
- Medical & Member Safety
- The PYPER Method
- Seven PYPER Pillars
- Three-Phase Standard
- The Medication Window
- Body Composition
- Metabolic Nutrition
- Dining, Travel & Social Protocols
- Supplements, Strength & Movement
- Skin & Body Refinement
- Recovery, Mindset & Maintenance
- Tracking, Safety & Red Flags
- Beyond GLP-1
- Appendices & Member Tools

Each guide chapter should:
- be responsive
- use accordions for long educational content
- convert tables into mobile-friendly cards
- include “Save section”
- include “Add to provider questions”
- include “Mark chapter complete”
- include “Related tracker”
- include “Related reminder”
- preserve original safety language and clinical tone
- avoid walls of text on mobile

Do not expose internal design notes or color swatch direction to patients.

BRAND + VISUAL SYSTEM

Use the visual language from `preview.html` and current PYPER website aesthetic:
- cool ivory background
- soft bone/porcelain surfaces
- graphite text
- steel blue-gray accents
- dark espresso/graphite section moments
- mono micro-labels
- editorial spacing
- clinical cards
- slim rules
- luxury dermatology feel
- calm, minimal, polished UI
- not pink, not generic wellness, not app-store cartoon style

Suggested color system:
- Porcelain: #F7F6F2
- Ivory: #ECEAE4
- Bone: #E3E1DA
- Steel: #7C8991
- Med Blue: #6F8491
- Graphite/Espresso: #171717
- Soft text: #4A4A4A

Typography:
- Use the existing brand typography if available
- Strong editorial display headings
- clean grotesk body copy
- mono labels for small structural text
- make text readable on mobile
- minimum body text should feel comfortable, not tiny

TRACKERS / LOGS REQUIREMENTS

Use “Track” in primary navigation and “guide-related trackers” when describing supporting tracking tools.

Build the following core trackers:

1. Body Metrics
Formerly Weight Log.
Fields:
- entry date
- weight
- waist
- hips
- chest
- arm
- thigh
- clothing fit
- progress photo placeholder/future secure upload
- notes
- reviewed for check-in

2. Medication Rhythm
Formerly Dose Log.
Fields:
- entry date
- medication name
- dose amount
- dose unit
- injection date/time
- injection site
- missed dose yes/no
- side effects after dose
- notes for provider
- reviewed for check-in

Rules:
- Do not calculate dose changes.
- Do not recommend dose changes.
- Do not tell member to double dose.
- If dose is missed, show:
“Follow your prescriber’s instructions for missed doses. Do not double dose unless directed by your clinician.”

3. Supplement Routine
Fields:
- entry date
- supplement name
- dose
- frequency
- time taken
- taken yes/no
- clinician-approved yes/no
- side effects or tolerance
- notes
- reviewed for check-in

4. Tolerance Tracker
Formerly Symptom / Side Effect Log.
Use sliders for severity.
Fields:
- nausea severity slider 0–10
- constipation severity slider 0–10
- reflux severity slider 0–10
- headache severity slider 0–10
- dizziness severity slider 0–10
- fatigue severity slider 0–10
- abdominal pain severity slider 0–10
- vomiting yes/no
- unable to hydrate yes/no
- bowel movement yes/no
- notes
- reviewed for check-in

Add red-flag logic:
If member selects severe abdominal pain, repeated vomiting, inability to hydrate, fainting, chest pain, allergic reaction, suicidal thoughts, or severe mental health concern, show a clear urgent warning:
“This may require urgent medical attention. Contact your clinician or seek urgent/emergency care. Do not rely on this guide for urgent medical decisions.”

5. Emotional Check-In
Mental Health + Emotional Adjustment Log.
Use sliders.
Fields:
- mood slider 0–10
- anxiety slider 0–10
- stress slider 0–10
- irritability slider 0–10
- sleep quality slider 0–10
- energy slider 0–10
- confidence slider 0–10
- body image concern slider 0–10
- emotional eating urge slider 0–10
- fear of regain slider 0–10
- social pressure or comparison trigger yes/no
- medication-related mood concern yes/no
- notes for provider/support
- reviewed for check-in

Mental health safety:
Do not diagnose.
Do not provide therapy.
Do not give medication advice.
If member selects severe depression, suicidal thoughts, self-harm concern, panic symptoms, or inability to function, show:
“This may require immediate support. Contact your clinician, crisis support, or emergency services if you feel unsafe or at risk of harming yourself.”

6. Protein + Hydration
Fields:
- protein target
- protein consumed
- water target
- water consumed
- electrolytes yes/no
- appetite slider 0–10
- fullness slider 0–10
- cravings slider 0–10
- food noise slider 0–10
- meal tolerance slider 0–10
- constipation support note
- notes
- reviewed for check-in

Use number fields/steppers for protein and water.
Use sliders for appetite, fullness, cravings, food noise, and meal tolerance.

7. Training Rhythm
Fields:
- strength session yes/no
- Pilates yes/no
- walking yes/no
- steps
- workout type
- duration
- effort slider 0–10
- soreness slider 0–10
- recovery slider 0–10
- injury or pain note
- notes
- reviewed for check-in

8. Body-Care Routine
Fields:
- AM routine completed yes/no
- PM routine completed yes/no
- prescribed product used yes/no
- irritation slider 0–10
- dryness slider 0–10
- itching slider 0–10
- acne flare slider 0–10
- texture concern slider 0–10
- pigmentation concern slider 0–10
- barrier concern yes/no
- skipped treatment yes/no
- notes
- reviewed for check-in

9. Provider Questions
Fields:
- question
- category
- priority
- created date
- resolved yes/no
- add from guide section
- add from tracker
- include in export yes/no

10. Chapter Progress
Fields:
- chapter id
- completed yes/no
- saved yes/no
- last opened
- notes

REPEATABLE ENTRIES + DUPLICATION

Every tracker must work as a repeatable entry system, not a static page.

Every tracker should allow:
- create new entry
- duplicate previous entry
- duplicate yesterday
- duplicate last week’s entry
- duplicate most recent entry
- duplicate selected date
- save as routine template
- edit entry
- delete entry
- mark reviewed for clinician check-in
- view by day
- view by week
- view by month
- view by 90 days
- view by year
- view all history
- export selected date range

Add routine templates for:
- daily supplement routine
- weekly dose routine
- AM body-care routine
- PM body-care routine
- strength training routine
- Pilates routine
- hydration goal
- protein target
- maintenance routine

SLIDER REQUIREMENTS

Use sliders for subjective ratings and severity:
- mood
- anxiety
- stress
- irritability
- sleep quality
- energy
- confidence
- body image concern
- emotional eating urge
- fear of regain
- nausea
- constipation
- reflux
- headache
- dizziness
- fatigue
- abdominal pain
- appetite
- fullness
- cravings
- food noise
- meal tolerance
- effort
- soreness
- recovery
- skin dryness
- irritation
- itch
- acne flare
- texture concern
- pigmentation concern

Use number fields/steppers for exact amounts:
- weight
- measurements
- dose
- protein grams
- water amount
- supplement dose
- steps
- workout duration

REMINDERS REQUIREMENTS

Create a reminders system inside the logged-in portal.

Use the word “reminders,” not “alarms.”

Reminder types:
- water / hydration reminders
- supplement reminders
- GLP-1 dose reminders
- protein check reminders
- AM body-care routine reminders
- PM body-care routine reminders
- weight/body metrics reminders
- mental health check-in reminders
- weekly progress check-in reminders
- provider question/appointment prep reminders
- refill or clinician follow-up reminders

Reminder features:
- create reminder
- edit reminder
- pause reminder
- delete reminder
- snooze reminder
- duplicate reminder
- mark complete
- repeat daily
- repeat weekly
- repeat monthly
- custom days of week
- custom time
- time zone support
- notification permission onboarding
- email fallback placeholder
- future SMS fallback placeholder
- add to calendar option

Privacy rules:
- lock-screen/push notification text should be generic
- do not show sensitive medication details, dose, weight, symptom, or mental health info on lock screen
- examples:
“PYPER reminder: open your portal.”
“PYPER reminder: hydration check.”
“PYPER reminder: scheduled check-in.”
- detailed health information should only be visible after login

PROGRESS STUDIO REQUIREMENTS

Create a Progress tab.

Include:
- weekly summary
- monthly summary
- 90-day trend
- yearly view
- body metrics trend
- dose adherence
- supplement consistency
- side-effect frequency
- constipation frequency
- nausea frequency
- mood/stress trend
- sleep trend
- protein consistency
- hydration consistency
- training consistency
- body-care consistency
- skin irritation pattern
- provider questions unresolved

Use beautiful data visualization:
- soft trend lines
- calm progress rings
- weekly cards
- simple streaks
- no aggressive red except safety alerts
- clear “steady / needs attention / bring to provider” labels

WEEKLY REVIEW REQUIREMENTS

Create “Weekly PYPER Review.”

Include:
- weight/body metrics trend
- dose completed
- supplement routine
- protein consistency
- hydration consistency
- symptoms/tolerance
- mental health/emotional check-in
- training rhythm
- skin/body-care routine
- provider questions
- next week focus

The weekly review should be exportable for clinician/member check-ins.

EXPORT SUMMARY REQUIREMENTS

Create “Export Check-In Summary.”

The export should include:
- selected date range
- body metrics trend
- medication rhythm
- missed dose notes
- supplement list
- symptom/tolerance summary
- mental health/emotional check-in summary
- protein/hydration summary
- training rhythm
- skin/body-care summary
- unresolved provider questions
- member notes
- red flags if logged

Export formats:
- clean on-screen summary
- printable PDF later
- copy summary text
- future secure send-to-provider placeholder

Do not automatically send exports to email or provider until secure clinical workflow is defined.

THE PYPER EDIT REQUIREMENTS

Create a portal-only section called “The PYPER Edit.”

The PYPER Edit includes:
1. Affiliate product links
2. Guide-only Member Partner Offers
3. Curated products, services, and partner perks that support the PYPER Method

Important:
Member Partner Offers are only available inside The PYPER Method Interactive Guide.
Do not create a public deals page.
Do not show partner offer codes, QR codes, redemption links, private terms, or claim buttons publicly.

Public website may only say:
“PYPER members receive access to curated partner offers inside The PYPER Method Interactive Guide.”

Offer labels:
- Affiliate Link
- Member Partner Offer
- Guide Exclusive

Categories:
- Protein
- Hydration
- Supplements
- Fitness
- Pilates
- Skin + Body Care
- Recovery
- Meal Prep
- Restaurants
- Body Treatments
- Travel
- Wellness Services
- Member Deals

Product/offer cards should include:
- brand name
- product or service name
- category
- offer type
- short reason it supports the PYPER Method
- member benefit
- caution note where relevant
- disclosure label
- terms / expiration date
- external link button
- reveal code button where applicable
- QR card placeholder where applicable
- save offer button
- mark as used button

Required disclosure near top:
“PYPER may earn commission, referral fees, sponsorship fees, or other compensation from some products and partner offers featured inside The PYPER Edit. Member Partner Offers are available exclusively to PYPER members inside The PYPER Method Interactive Guide. These recommendations do not replace medical advice, diagnosis, treatment, or clinician guidance.”

On affiliate cards:
“Affiliate link. PYPER may earn commission.”

On partner cards:
“Partner offer. PYPER may receive compensation from this brand.”

Rules:
- Require login to view Member Partner Offers.
- Do not expose partner codes or QR codes publicly.
- Do not index member offer pages publicly.
- Do not include partner offers in urgent safety sections, medication instructions, or red-flag symptom guidance.
- Do not pass member health data to affiliate or partner links.
- Do not make medical claims.
- Do not say products cure, prevent, treat, reverse, detox, tighten, or fix medical issues.
- Use safer language like “may support,” “commonly used for,” “helps organize,” “member convenience,” and “discuss with your clinician if you have medical conditions or take medication.”
- External links should use target="_blank" and rel="sponsored noopener noreferrer".

Redemption types:
- affiliate link
- partner landing page
- public partner code
- member-only reveal code
- unique member code
- single-use code
- QR member card
- request partner intro
- in-person verification

Anti-abuse features:
- require login to view member-only offers
- log when a member reveals or claims an offer
- allow one claim per member when required
- allow expiration dates
- allow code inventory for single-use codes
- allow admin to deactivate offers
- show offer terms clearly
- do not show private codes on public pages

SAFETY TAB REQUIREMENTS

Create a persistent Safety tab that is always accessible.

Include:
- medical disclaimer
- medication safety boundaries
- missed-dose warning
- side-effect escalation
- urgent red flags
- mental health crisis language
- when to contact clinician
- when to seek urgent/emergency care
- supplement caution
- body-care irritation caution
- allergic reaction caution
- do not rely on portal for emergencies

Safety tab should be calm, clear, and serious.

SUPPORT TAB REQUIREMENTS

Create guide support content for exports, community boundaries, FAQs, and contact placeholders without adding a primary Support nav item.

Include:
- provider questions queue
- export check-in summary
- Discord/member community link placeholder
- community guidelines
- no medical advice in community
- no dose advice in community
- no body shaming
- no supplement pushing
- no before/after pressure
- escalate medical issues to clinician
- FAQs
- contact support placeholder

INTAKE + PERSONALIZATION REQUIREMENTS

Add a PYPER Intake Profile.

Fields:
- goal
- current phase
- medication status
- GLP-1 start date
- skin concerns
- nutrition preference
- activity level
- travel frequency
- restaurant/social frequency
- reminders desired
- mental health/body image support desired
- constipation-prone yes/no
- nausea-prone yes/no
- training experience
- body-care concerns
- supplement use yes/no

Use the intake profile to show:
- “Your PYPER Focus This Week”
- recommended chapters
- suggested trackers
- relevant reminders
- relevant safety prompts
- relevant PYPER Edit categories

DATABASE STRUCTURE

Prepare these tables:

profiles
weight_logs
dose_logs
supplement_logs
symptom_logs
mental_health_logs
nutrition_logs
training_logs
skin_logs
provider_questions
chapter_progress
routine_templates
weekly_summaries
exports
reminders
reminder_events
notification_preferences
device_push_subscriptions
affiliate_products
brand_partners
partner_offers
offer_codes
member_offer_claims
offer_clicks
partner_categories
partner_applications
sponsorship_placements

All health tracker tables should include:
- id
- user_id
- created_at
- updated_at
- entry_date
- duplicated_from_entry_id
- notes
- reviewed_for_checkin boolean

Routine templates:
- id
- user_id
- template_name
- tracker_type
- template_data
- created_at
- updated_at

Reminders:
- id
- user_id
- reminder_type
- title
- private_label
- frequency
- days_of_week
- time_of_day
- timezone
- start_date
- end_date
- is_active
- linked_tracker_type
- created_at
- updated_at

Reminder events:
- id
- user_id
- reminder_id
- scheduled_for
- status
- completed_at
- snoozed_until
- skipped_at
- notes
- created_at

Notification preferences:
- id
- user_id
- push_enabled
- email_enabled
- sms_enabled_future
- quiet_hours_start
- quiet_hours_end
- timezone
- created_at
- updated_at

Partner offers:
- id
- partner_id
- offer_title
- offer_type
- category
- short_description
- member_benefit
- caution_note
- disclosure_type
- terms
- start_date
- end_date
- is_active
- requires_login
- requires_unique_code
- redemption_type
- affiliate_url
- partner_url
- public_code
- created_at
- updated_at

Offer codes:
- id
- offer_id
- code
- assigned_user_id
- claimed_at
- redeemed_at
- expires_at
- status

Member offer claims:
- id
- user_id
- offer_id
- code_id
- claimed_at
- marked_used_at
- saved
- notes

SECURITY REQUIREMENTS

Prepare for user-specific data access:
- every health tracker belongs to one user
- every reminder belongs to one user
- every provider question belongs to one user
- no user should be able to access another user’s data
- do not expose service keys in frontend code
- use Supabase Auth or equivalent authentication
- enable Row Level Security when database is connected
- block public read access to health trackers
- block public write access to health trackers
- partner offer public teaser pages must never reveal portal-only offers
- member-only offer details require login

PRIVACY + COMPLIANCE UX COPY

Add this privacy notice in the guide:
“Your health logs may include sensitive health information. PYPER should only store this information in a secure member system with appropriate privacy, security, and vendor protections. Do not use this guide for emergencies.”

Add this reminder privacy notice:
“Reminder notifications are intentionally brief for privacy. Detailed medication, dose, symptom, weight, or mental health information is only visible after login.”

ACCESSIBILITY REQUIREMENTS

Build with accessibility in mind:
- semantic HTML
- proper headings
- visible focus states
- keyboard navigation
- accessible form labels
- clear error states
- readable text sizes
- sufficient color contrast
- large mobile tap targets
- accordions should be keyboard accessible
- sliders should have labels, min/max, and current value announcements
- do not rely on color alone for warnings

RESPONSIVE REQUIREMENTS

Design and test for:
- iPhone
- Android phones
- iPad/tablet
- desktop
- narrow screens
- large screens

Tables from the guide should become mobile cards on small screens.

Do not force users to pinch and zoom.

PROJECT OUTPUT

Create or refactor into a clean structure:

/index.html
/styles.css
/app.js
/assets/
/components/ if needed
/data/ sample seed data if needed
/supabase/ schema notes if needed

Add comments in the code showing:
- where Supabase Auth connects
- where secure database writes happen
- where Row Level Security is required
- where future clinician portal features can be added
- where future SMS reminders can be added
- where future secure photo upload can be added
- where future partner admin dashboard can be added

Build the first version with polished sample/demo data if backend is not connected yet, but clearly separate demo state from production health data storage.

FINAL RESULT

The final result should feel like:

The PYPER Method Interactive Guide
A private GLP-1, body composition, skin, lifestyle, and maintenance support system with education, trackers, reminders, partner offers, safety guidance, and clinician check-in preparation.

The product rhythm should be:
Learn → Track → Review → Maintain

Do not deliver another static PDF.
Do not deliver a flipbook.
Do not deliver a generic tracker.
Build a premium member experience worthy of PYPER.
