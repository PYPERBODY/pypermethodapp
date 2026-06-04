import { supabase } from "./supabaseClient";

export type GuideStorageRecord = Record<string, unknown> & { id?: string; user_id?: string };

export type DateRange = { start?: string; end?: string };

export const backendUnavailableMessage =
  "Secure guide storage is unavailable. Check your connection and Supabase configuration, then try again.";

export function isBackendAvailable() {
  return Boolean(supabase);
}

export function dateRangeForView(view: string, now = new Date()): DateRange {
  if (view === "All") return {};
  const end = new Date(now);
  const start = new Date(now);
  if (view === "Today") {
    return { start: toDate(start), end: toDate(end) };
  }
  if (view === "Week") start.setDate(start.getDate() - 7);
  if (view === "Month") start.setMonth(start.getMonth() - 1);
  if (view === "90 Days") start.setDate(start.getDate() - 90);
  if (view === "Year") start.setFullYear(start.getFullYear() - 1);
  return { start: toDate(start), end: toDate(end) };
}

export async function listUserRows(table: string, userId: string, dateColumn = "entry_date", range: DateRange = {}) {
  if (!supabase) throw new Error(backendUnavailableMessage);
  let query = (supabase as any)
    .from(table)
    .select("*")
    .eq("user_id", userId)
    .order(dateColumn, { ascending: false, nullsFirst: false });
  if (range.start) query = query.gte(dateColumn, range.start);
  if (range.end) query = query.lte(dateColumn, range.end);
  const { data, error } = await query.limit(100);
  if (error) throw error;
  return (data || []) as GuideStorageRecord[];
}

export async function createUserRow(table: string, userId: string, payload: GuideStorageRecord) {
  if (!supabase) throw new Error(backendUnavailableMessage);
  const { data, error } = await (supabase as any)
    .from(table)
    .insert({ ...payload, user_id: userId })
    .select("*")
    .single();
  if (error) throw error;
  return data as GuideStorageRecord;
}

export async function updateUserRow(table: string, userId: string, id: string, payload: GuideStorageRecord) {
  if (!supabase) throw new Error(backendUnavailableMessage);
  const { data, error } = await (supabase as any)
    .from(table)
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();
  if (error) throw error;
  return data as GuideStorageRecord;
}

export async function deleteUserRow(table: string, userId: string, id: string) {
  if (!supabase) throw new Error(backendUnavailableMessage);
  const { error } = await (supabase as any)
    .from(table)
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function listRoutineTemplates(userId: string, trackerType?: string) {
  if (!supabase) throw new Error(backendUnavailableMessage);
  let query = (supabase as any)
    .from("routine_templates")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (trackerType) query = query.eq("tracker_type", trackerType);
  const { data, error } = await query.limit(50);
  if (error) throw error;
  return (data || []) as GuideStorageRecord[];
}

export async function saveRoutineTemplate(userId: string, trackerType: string, templateName: string, templateData: GuideStorageRecord) {
  if (!supabase) throw new Error(backendUnavailableMessage);
  const { data, error } = await (supabase as any)
    .from("routine_templates")
    .insert({ user_id: userId, tracker_type: trackerType, template_name: templateName, template_data: templateData })
    .select("*")
    .single();
  if (error) throw error;
  return data as GuideStorageRecord;
}

export async function deleteRoutineTemplate(userId: string, id: string) {
  if (!supabase) throw new Error(backendUnavailableMessage);
  const { error } = await (supabase as any)
    .from("routine_templates")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

function toDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
