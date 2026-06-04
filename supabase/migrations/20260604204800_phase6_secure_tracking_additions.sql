-- Phase 6 additions for connected guide tracking UI.
-- Adds export flags and duplicate-source metadata required by connected trackers.

alter table public.weight_logs add column if not exists include_in_export boolean default true;
alter table public.dose_logs add column if not exists include_in_export boolean default true;
alter table public.supplement_logs add column if not exists include_in_export boolean default true;
alter table public.symptom_logs add column if not exists include_in_export boolean default true;
alter table public.mental_health_logs add column if not exists include_in_export boolean default true;
alter table public.nutrition_logs add column if not exists include_in_export boolean default true;
alter table public.training_logs add column if not exists include_in_export boolean default true;
alter table public.chapter_progress add column if not exists include_in_export boolean default true;
alter table public.body_care_applications add column if not exists include_in_export boolean default true;
alter table public.body_care_skin_tolerance_logs add column if not exists include_in_export boolean default true;
alter table public.body_care_spf_logs add column if not exists include_in_export boolean default true;
alter table public.body_care_products add column if not exists archived boolean default false;
alter table public.body_care_plans add column if not exists archived boolean default false;

alter table public.body_care_applications add column if not exists duplicated_from_entry_id uuid nullable;
alter table public.body_care_skin_tolerance_logs add column if not exists duplicated_from_entry_id uuid nullable;
alter table public.body_care_spf_logs add column if not exists duplicated_from_entry_id uuid nullable;

alter table public.mental_health_logs add column if not exists severe_mental_health_concern boolean default false;

alter table public.provider_questions add column if not exists reviewed_for_checkin boolean default false;
alter table public.chapter_progress add column if not exists reviewed_for_checkin boolean default false;
alter table public.chapter_progress add column if not exists related_reminder_placeholder text;
alter table public.provider_questions add column if not exists duplicated_from_entry_id uuid nullable;
alter table public.chapter_progress add column if not exists duplicated_from_entry_id uuid nullable;
