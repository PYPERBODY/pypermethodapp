-- Phase 5 Supabase schema for The PYPER Method Interactive Guide.
-- This scaffolds secure guide-related storage only. Do not store real patient data in development.
-- Service-role keys must never be exposed in frontend code.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  current_phase text,
  goals text[],
  skin_concerns text[],
  medication_status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.body_care_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  plan_name text,
  plan_status text,
  active_version_id uuid nullable,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.body_care_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  plan_id uuid references public.body_care_plans(id) on delete cascade,
  product_name text,
  brand text,
  product_type text,
  pyper_pathway text,
  pyper_tier text,
  active_ingredient text,
  strength text,
  formulation text,
  prescriber_name text,
  plan_status text,
  treatment_purpose text,
  body_areas text[],
  prescribed_amount text,
  amount_unit text,
  frequency text,
  days_of_week text[],
  time_of_day text,
  start_date date,
  end_date date,
  review_date date,
  cycle_or_rest_period text,
  layering_order text,
  special_instructions text,
  spf_required boolean default false,
  refill_reminder boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.body_care_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.body_care_products(id) on delete set null,
  application_date date,
  time_applied time,
  body_area text,
  amount_applied text,
  applied_as_prescribed boolean,
  application_status text,
  moisturizer_layered boolean,
  spf_used boolean,
  reapplication_needed boolean,
  irritation_after_application boolean,
  notes text,
  reviewed_for_checkin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.body_care_plan_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  plan_id uuid references public.body_care_plans(id) on delete cascade,
  version_number integer,
  effective_date date,
  changed_by text,
  reason_for_change text,
  previous_plan_archived boolean,
  is_active boolean default false,
  version_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'body_care_plans_active_version_fk'
  ) then
    alter table public.body_care_plans
      add constraint body_care_plans_active_version_fk
      foreign key (active_version_id) references public.body_care_plan_versions(id) deferrable initially deferred;
  end if;
end $$;

create table if not exists public.body_care_skin_tolerance_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.body_care_products(id) on delete set null,
  entry_date date,
  body_area text,
  dryness integer,
  irritation integer,
  itching integer,
  burning_stinging integer,
  peeling integer,
  redness_discoloration integer,
  acne_flare integer,
  texture_concern integer,
  pigmentation_concern integer,
  eczema_flare integer,
  new_rash boolean,
  swelling boolean,
  blistering boolean,
  open_broken_skin boolean,
  signs_of_infection boolean,
  product_wrong_area boolean,
  product_eyes_mouth boolean,
  contact_clinician_requested boolean,
  notes text,
  reviewed_for_checkin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.body_care_spf_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date date,
  spf_product text,
  spf_level text,
  body_areas text[],
  applied_today boolean,
  reapplication_completed boolean,
  outdoor_exposure_expected boolean,
  swimming_or_sweating_expected boolean,
  skipped_reason text,
  notes text,
  reviewed_for_checkin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date date,
  weight numeric,
  waist numeric,
  hips numeric,
  chest numeric,
  arm numeric,
  thigh numeric,
  clothing_fit text,
  notes text,
  duplicated_from_entry_id uuid nullable,
  reviewed_for_checkin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.dose_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date date,
  medication_name text,
  dose_amount numeric,
  dose_unit text,
  injection_date date,
  injection_time time,
  injection_site text,
  missed_dose boolean,
  side_effects_after_dose text,
  notes_for_provider text,
  duplicated_from_entry_id uuid nullable,
  reviewed_for_checkin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.supplement_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date date,
  supplement_name text,
  dose text,
  dose_unit text,
  frequency text,
  time_taken time,
  taken boolean,
  clinician_approved boolean,
  side_effects_or_tolerance text,
  notes text,
  duplicated_from_entry_id uuid nullable,
  reviewed_for_checkin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.symptom_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date date,
  nausea integer,
  constipation integer,
  reflux integer,
  headache integer,
  dizziness integer,
  fatigue integer,
  abdominal_pain integer,
  vomiting boolean,
  unable_to_hydrate boolean,
  bowel_movement boolean,
  appetite_too_low boolean,
  notes text,
  duplicated_from_entry_id uuid nullable,
  reviewed_for_checkin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.mental_health_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date date,
  mood integer,
  anxiety integer,
  stress integer,
  irritability integer,
  sleep_quality integer,
  energy integer,
  confidence integer,
  body_image_concern integer,
  emotional_eating_urge integer,
  fear_of_regain integer,
  social_pressure_trigger boolean,
  medication_related_mood_concern boolean,
  panic_symptoms boolean,
  inability_to_function boolean,
  self_harm_concern boolean,
  suicidal_thoughts boolean,
  notes_for_provider text,
  duplicated_from_entry_id uuid nullable,
  reviewed_for_checkin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.nutrition_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date date,
  protein_target numeric,
  protein_consumed numeric,
  water_target numeric,
  water_consumed numeric,
  electrolytes boolean,
  appetite integer,
  fullness integer,
  cravings integer,
  food_noise integer,
  meal_tolerance integer,
  constipation_support_note text,
  notes text,
  duplicated_from_entry_id uuid nullable,
  reviewed_for_checkin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.training_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date date,
  strength_session boolean,
  pilates boolean,
  walking boolean,
  steps integer,
  workout_type text,
  duration_minutes integer,
  effort integer,
  soreness integer,
  recovery integer,
  injury_or_pain_note text,
  notes text,
  duplicated_from_entry_id uuid nullable,
  reviewed_for_checkin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.provider_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  question text,
  category text,
  priority text,
  source text,
  linked_tracker text,
  linked_guide_section text,
  resolved boolean default false,
  include_in_export boolean default true,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.chapter_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  chapter_id text,
  chapter_title text,
  completed boolean default false,
  saved boolean default false,
  last_opened_at timestamptz,
  notes text,
  related_tracker text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.routine_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  template_name text,
  tracker_type text,
  template_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.weekly_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  week_start date,
  week_end date,
  summary_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  export_type text,
  date_range_start date,
  date_range_end date,
  export_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  reminder_type text,
  title text,
  private_label text,
  frequency text,
  days_of_week text[],
  time_of_day time,
  timezone text,
  start_date date,
  end_date date,
  is_active boolean default true,
  linked_tracker_type text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.reminder_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  reminder_id uuid references public.reminders(id) on delete cascade,
  scheduled_for timestamptz,
  status text,
  completed_at timestamptz,
  snoozed_until timestamptz,
  skipped_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  push_enabled boolean default false,
  email_enabled boolean default false,
  sms_enabled_future boolean default false,
  quiet_hours_start time,
  quiet_hours_end time,
  timezone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.device_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  endpoint text,
  subscription_data jsonb,
  device_label text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.affiliate_products (
  id uuid primary key default gen_random_uuid(),
  product_name text,
  brand text,
  category text,
  description text,
  caution_note text,
  disclosure text,
  affiliate_url text,
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.brand_partners (
  id uuid primary key default gen_random_uuid(),
  brand_name text,
  website text,
  category text,
  contact_name text,
  contact_email text,
  partnership_status text,
  compensation_model text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.partner_offers (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.brand_partners(id) on delete cascade,
  offer_title text,
  offer_type text,
  category text,
  short_description text,
  member_benefit text,
  caution_note text,
  disclosure_type text,
  terms text,
  start_date date,
  end_date date,
  is_active boolean default false,
  requires_login boolean default true,
  requires_unique_code boolean default false,
  redemption_type text,
  affiliate_url text,
  partner_url text,
  public_code text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.offer_codes (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid references public.partner_offers(id) on delete cascade,
  code text,
  assigned_user_id uuid nullable references auth.users(id) on delete set null,
  claimed_at timestamptz,
  redeemed_at timestamptz,
  expires_at timestamptz,
  status text
);

create table if not exists public.member_offer_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  offer_id uuid references public.partner_offers(id) on delete cascade,
  code_id uuid references public.offer_codes(id) on delete set null,
  claimed_at timestamptz default now(),
  marked_used_at timestamptz,
  saved boolean default false,
  notes text
);

create table if not exists public.offer_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  offer_id uuid references public.partner_offers(id) on delete cascade,
  clicked_at timestamptz default now(),
  click_type text
);

-- RLS enablement.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','body_care_plans','body_care_products','body_care_applications','body_care_plan_versions','body_care_skin_tolerance_logs','body_care_spf_logs','weight_logs','dose_logs','supplement_logs','symptom_logs','mental_health_logs','nutrition_logs','training_logs','provider_questions','chapter_progress','routine_templates','weekly_summaries','exports','reminders','reminder_events','notification_preferences','device_push_subscriptions','affiliate_products','brand_partners','partner_offers','offer_codes','member_offer_claims','offer_clicks'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

-- Profiles: id must match auth.uid().
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select using (id = auth.uid());
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert with check (id = auth.uid());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- User-owned guide data policies.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'body_care_plans','body_care_products','body_care_applications','body_care_plan_versions','body_care_skin_tolerance_logs','body_care_spf_logs','weight_logs','dose_logs','supplement_logs','symptom_logs','mental_health_logs','nutrition_logs','training_logs','provider_questions','chapter_progress','routine_templates','weekly_summaries','exports','reminders','reminder_events','notification_preferences','device_push_subscriptions','member_offer_claims'
  ] loop
    execute format('drop policy if exists %I_select_own on public.%I', table_name, table_name);
    execute format('create policy %I_select_own on public.%I for select using (user_id = auth.uid())', table_name, table_name);
    execute format('drop policy if exists %I_insert_own on public.%I', table_name, table_name);
    execute format('create policy %I_insert_own on public.%I for insert with check (user_id = auth.uid())', table_name, table_name);
    execute format('drop policy if exists %I_update_own on public.%I', table_name, table_name);
    execute format('create policy %I_update_own on public.%I for update using (user_id = auth.uid()) with check (user_id = auth.uid())', table_name, table_name);
    execute format('drop policy if exists %I_delete_own on public.%I', table_name, table_name);
    execute format('create policy %I_delete_own on public.%I for delete using (user_id = auth.uid())', table_name, table_name);
  end loop;
end $$;

-- Offer clicks allow anonymous click logging without revealing health data. Authenticated users can read only their own clicks.
drop policy if exists offer_clicks_insert_safe on public.offer_clicks;
create policy offer_clicks_insert_safe on public.offer_clicks for insert with check (user_id is null or user_id = auth.uid());
drop policy if exists offer_clicks_select_own on public.offer_clicks;
create policy offer_clicks_select_own on public.offer_clicks for select using (user_id = auth.uid());

-- Affiliate/partner read rules.
drop policy if exists affiliate_products_public_active_read on public.affiliate_products;
create policy affiliate_products_public_active_read on public.affiliate_products for select using (is_active = true);

drop policy if exists brand_partners_authenticated_read on public.brand_partners;
create policy brand_partners_authenticated_read on public.brand_partners for select to authenticated using (true);

drop policy if exists partner_offers_authenticated_active_read on public.partner_offers;
create policy partner_offers_authenticated_active_read on public.partner_offers for select to authenticated using (is_active = true);

drop policy if exists partner_offers_public_non_member_read on public.partner_offers;
create policy partner_offers_public_non_member_read on public.partner_offers for select using (is_active = true and requires_login = false and requires_unique_code = false);

-- Private offer codes are never public. Assigned users can only read their assigned code.
drop policy if exists offer_codes_select_assigned on public.offer_codes;
create policy offer_codes_select_assigned on public.offer_codes for select using (assigned_user_id = auth.uid());

-- Updated_at triggers.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','body_care_plans','body_care_products','body_care_applications','body_care_plan_versions','body_care_skin_tolerance_logs','body_care_spf_logs','weight_logs','dose_logs','supplement_logs','symptom_logs','mental_health_logs','nutrition_logs','training_logs','provider_questions','chapter_progress','routine_templates','weekly_summaries','exports','reminders','notification_preferences','device_push_subscriptions','affiliate_products','brand_partners','partner_offers'
  ] loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;


-- Phase 6 connected tracking additions; see migration 20260604204800_phase6_secure_tracking_additions.sql.
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
