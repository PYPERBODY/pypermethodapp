# Health Context — Secure Data Model Notes

Prototype UI only. Permanent health data must not rely on localStorage.

## Auth + RLS

- Connect Supabase Auth (or equivalent) before production writes.
- Enable Row Level Security on every table below.
- Members may `select/insert/update/delete` only where `user_id = auth.uid()`.
- Block public read/write. No service keys in frontend code.
- Authorized clinical workflows may read only member-approved export payloads.

## Suggested tables

- `member_health_modules`
- `body_metric_entries`
- `health_conditions`
- `hormonal_context`
- `reproductive_context`
- `testosterone_androgen_context`
- `prostate_urinary_context`
- `testicular_reproductive_context`
- `gender_affirming_care_context`
- `medication_treatment_entries`
- `health_symptom_entries`
- `health_timeline_events`
- `provider_questions`
- `provider_export_preferences`

## Common columns

Every health record should support:

- `id` (uuid)
- `user_id` (uuid, FK auth.users)
- `created_at`
- `updated_at`
- optional `start_date` / `end_date`
- `is_active` boolean
- `include_in_export` boolean
- `show_on_dashboard` boolean where relevant

## Hard exclusions

Do not send Health Context data to:

- affiliate platforms
- partner brands
- advertising / retargeting
- unapproved analytics
- session replay
- email marketing
- public profiles
- community features
- referral systems
- social sharing
- unsecured forms (Sheets, Airtable, Notion, Typeform, Netlify Forms, ordinary email)

## Future hooks (code comments)

- Supabase Auth session hydrate in `HealthContextProvider`
- Secure writes for each object above
- Clinician portal read of approved export only
- SMS reminders remain generic lock-screen copy only
