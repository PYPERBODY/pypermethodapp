import { useEffect, useMemo, useState } from "react";
import { PageHeader, Surface } from "./Shell";
import { useGuideAuth } from "../auth/AuthGate";
import {
  backendUnavailableMessage,
  createUserRow,
  deleteUserRow,
  isBackendAvailable,
  listUserRows,
  updateUserRow,
  type GuideStorageRecord,
} from "../../../lib/secureGuideStorage";
import { Bell, CalendarDays, CheckCircle2, Copy, Download, Edit3, Lock, Pause, Plus, RotateCcw, Save, Smartphone, Trash2 } from "lucide-react";

type ReminderDraft = {
  id?: string;
  reminderType: string;
  title: string;
  privateLabel: string;
  frequency: string;
  daysOfWeek: string[];
  timeOfDay: string;
  timezone: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  linkedTrackerType: string;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const REMINDER_TYPES = [
  "hydration",
  "supplements",
  "GLP-1 dose day",
  "protein check",
  "AM body-care routine",
  "PM body-care routine",
  "SPF reapplication",
  "body metrics",
  "mental health check-in",
  "weekly guide review",
  "provider question prep",
  "refill or clinician follow-up",
];
const FREQUENCIES = ["daily", "weekly", "monthly", "custom days", "one time"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const GENERIC_LABELS = [
  "PYPER reminder: open your guide",
  "PYPER reminder: hydration check",
  "PYPER reminder: scheduled check-in",
  "PYPER reminder: body-care routine",
  "PYPER reminder: sun protection check",
  "PYPER reminder: reapplication may be due",
  "PYPER reminder: protein check",
];

const DEMO_REMINDERS: ReminderDraft[] = [
  { reminderType: "hydration", title: "Hydration check", privateLabel: "PYPER reminder: hydration check", frequency: "daily", daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], timeOfDay: "09:00", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, startDate: "2026-06-04", endDate: "", isActive: true, linkedTrackerType: "Protein + Hydration" },
  { reminderType: "GLP-1 dose day", title: "Medication rhythm check", privateLabel: "PYPER reminder: scheduled check-in", frequency: "weekly", daysOfWeek: ["Sun"], timeOfDay: "08:00", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, startDate: "2026-06-08", endDate: "", isActive: true, linkedTrackerType: "Medication Rhythm" },
  { reminderType: "AM body-care routine", title: "PYPER Body-Care Plan AM", privateLabel: "PYPER reminder: body-care routine", frequency: "daily", daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], timeOfDay: "07:30", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, startDate: "2026-06-04", endDate: "", isActive: true, linkedTrackerType: "PYPER Body-Care Plan" },
  { reminderType: "SPF reapplication", title: "SPF reapplication support", privateLabel: "PYPER reminder: reapplication may be due", frequency: "custom days", daysOfWeek: ["Sat", "Sun"], timeOfDay: "14:00", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, startDate: "2026-06-04", endDate: "", isActive: false, linkedTrackerType: "PYPER Body-Care Plan" },
];

export function Reminders() {
  const { user } = useGuideAuth();
  const [reminders, setReminders] = useState<ReminderDraft[]>([]);
  const [draft, setDraft] = useState<ReminderDraft>(blankReminder());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("Reminders support The Guide and use privacy-safe notification text.");
  const [error, setError] = useState<string | null>(null);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [notificationPermission, setNotificationPermission] = useState(() => ("Notification" in window ? Notification.permission : "unsupported"));

  const activeCount = useMemo(() => reminders.filter((item) => item.isActive).length, [reminders]);
  const backendReady = Boolean(user?.id && isBackendAvailable());

  useEffect(() => {
    void loadReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function loadReminders() {
    if (!user?.id) return;
    if (!isBackendAvailable()) {
      setError(backendUnavailableMessage);
      setReminders([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rows = await listUserRows("reminders", user.id, "created_at");
      setReminders(rows.map(fromDbReminder));
      await ensureNotificationPreferences();
      setMessage(rows.length ? "Loaded your saved guide reminders." : "No reminders yet. Start with a guide-related routine.");
    } catch {
      setError("Failed to load reminders. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function ensureNotificationPreferences() {
    if (!user?.id || !isBackendAvailable()) return;
    const existing = await listUserRows("notification_preferences", user.id, "created_at");
    if (!existing.length) {
      await createUserRow("notification_preferences", user.id, {
        push_enabled: false,
        email_enabled: false,
        sms_enabled_future: false,
        quiet_hours_start: "22:00",
        quiet_hours_end: "07:00",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
  }

  async function saveReminder() {
    const validation = validateReminder(draft);
    if (validation) {
      setError(validation);
      return;
    }
    if (!user?.id || !isBackendAvailable()) {
      setError(backendUnavailableMessage);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = toDbReminder(draft);
      if (editingId) {
        await updateUserRow("reminders", user.id, editingId, payload);
        setMessage("Reminder updated successfully.");
      } else {
        await createUserRow("reminders", user.id, payload);
        setMessage("Reminder created successfully.");
      }
      setDraft(blankReminder());
      setEditingId(null);
      await loadReminders();
    } catch {
      setError("Failed to save reminder. Nothing was silently stored.");
    } finally {
      setSaving(false);
    }
  }

  async function pauseReminder(reminder: ReminderDraft) {
    if (!reminder.id || !user?.id) return;
    try {
      await updateUserRow("reminders", user.id, reminder.id, { is_active: !reminder.isActive });
      setMessage(reminder.isActive ? "Reminder paused." : "Reminder resumed.");
      await loadReminders();
    } catch {
      setError("Failed to update reminder status.");
    }
  }

  function editReminder(reminder: ReminderDraft) {
    setDraft(reminder);
    setEditingId(reminder.id || null);
    setMessage("Editing reminder. Review details before saving.");
  }

  function duplicateReminder(reminder: ReminderDraft) {
    setDraft({ ...reminder, id: undefined, title: `${reminder.title} copy`, isActive: false });
    setEditingId(null);
    setMessage("Copied reminder. Review and save before it becomes active.");
  }

  async function deleteReminder(id?: string) {
    if (!id || !user?.id) return;
    if (!window.confirm("Delete this guide reminder?")) return;
    try {
      await deleteUserRow("reminders", user.id, id);
      setMessage("Reminder deleted.");
      await loadReminders();
    } catch {
      setError("Failed to delete reminder.");
    }
  }

  async function createEvent(reminder: ReminderDraft, status: string, patch: GuideStorageRecord = {}) {
    if (!reminder.id || !user?.id || !isBackendAvailable()) {
      setError(backendUnavailableMessage);
      return;
    }
    try {
      await createUserRow("reminder_events", user.id, {
        reminder_id: reminder.id,
        scheduled_for: new Date().toISOString(),
        status,
        ...patch,
      });
      setMessage(status === "completed" ? "Reminder marked complete." : status === "snoozed" ? "Reminder snoozed." : "Reminder event saved.");
    } catch {
      setError("Failed to save reminder event.");
    }
  }

  async function requestNotifications() {
    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
      setMessage("This browser does not support notification permission prompts.");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (user?.id && isBackendAvailable()) {
      try {
        const prefs = await listUserRows("notification_preferences", user.id, "created_at");
        if (prefs[0]?.id) await updateUserRow("notification_preferences", user.id, String(prefs[0].id), { push_enabled: permission === "granted" });
      } catch {
        setError("Notification preference could not be saved.");
      }
    }
  }

  async function installGuide() {
    if (!installEvent) {
      setMessage("Install prompt is not available yet. Use your browser menu to add The Guide to your home screen if supported.");
      return;
    }
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    setMessage(choice.outcome === "accepted" ? "The Guide install flow was accepted." : "The Guide install flow was dismissed.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Reminders"
        title="Guide routines, privacy-safe cues."
        subtitle="Reminders support guide-related routines only. Lock-screen text stays generic; detailed medication, body-care, symptom, weight, or mental health information stays visible only after sign-in."
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.9fr] gap-6 mb-6">
        <Surface className="p-5 flex items-start gap-3 bg-[var(--ivory)]">
          <Lock size={16} className="text-[var(--steel)] mt-1 shrink-0" />
          <div className="text-sm">
            <strong>Reminder privacy:</strong> Reminder notifications should remain brief for privacy. Detailed medication, dose, symptom, weight, prescription body-care, or mental health information should only be visible after sign-in.
          </div>
        </Surface>
        <Surface className="p-5">
          <div className="flex items-start gap-3">
            <Smartphone size={18} className="text-[var(--steel)] mt-1" />
            <div>
              <div className="mono-label mb-1">Installable PWA</div>
              <p className="text-sm text-[var(--soft-text)] mb-3">Install The PYPER Method Interactive Guide for home-screen access. Reminders remain privacy-safe and guide-related.</p>
              <button onClick={installGuide} className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--ivory)]"><Download size={14} /> Install The Guide</button>
            </div>
          </div>
        </Surface>
      </div>

      <Surface className="p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Metric label="Saved reminders" value={String(reminders.length)} hint="stored by user" />
          <Metric label="Active" value={String(activeCount)} hint="can be paused anytime" />
          <Metric label="Notifications" value={notificationPermission} hint="browser permission" />
          <Metric label="Backend" value={backendReady ? "Connected" : "Unavailable"} hint="Supabase user-scoped" />
        </div>
      </Surface>

      {error && <Notice tone="alert">{error}</Notice>}
      {message && <Notice>{message}</Notice>}
      {loading && <Notice>Loading saved reminders...</Notice>}

      <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6">
        <Surface className="p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
            <div>
              <div className="mono-label mb-2">Create or edit reminder</div>
              <h3>{editingId ? "Edit reminder" : "New reminder"}</h3>
            </div>
            <button onClick={() => { setDraft(blankReminder()); setEditingId(null); }} className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--ivory)]"><Plus size={14} /> Blank reminder</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Reminder type"><select value={draft.reminderType} onChange={(event) => setDraft({ ...draft, reminderType: event.target.value })} className="form-input">{REMINDER_TYPES.map((type) => <option key={type}>{type}</option>)}</select></Field>
            <Field label="Title"><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="form-input" /></Field>
            <Field label="Private lock-screen label"><select value={draft.privateLabel} onChange={(event) => setDraft({ ...draft, privateLabel: event.target.value })} className="form-input">{GENERIC_LABELS.map((label) => <option key={label}>{label}</option>)}</select></Field>
            <Field label="Frequency"><select value={draft.frequency} onChange={(event) => setDraft({ ...draft, frequency: event.target.value })} className="form-input">{FREQUENCIES.map((item) => <option key={item}>{item}</option>)}</select></Field>
            <Field label="Time"><input type="time" value={draft.timeOfDay} onChange={(event) => setDraft({ ...draft, timeOfDay: event.target.value })} className="form-input" /></Field>
            <Field label="Timezone"><input value={draft.timezone} onChange={(event) => setDraft({ ...draft, timezone: event.target.value })} className="form-input" /></Field>
            <Field label="Start date"><input type="date" value={draft.startDate} onChange={(event) => setDraft({ ...draft, startDate: event.target.value })} className="form-input" /></Field>
            <Field label="End date"><input type="date" value={draft.endDate} onChange={(event) => setDraft({ ...draft, endDate: event.target.value })} className="form-input" /></Field>
            <Field label="Linked tracker"><input value={draft.linkedTrackerType} onChange={(event) => setDraft({ ...draft, linkedTrackerType: event.target.value })} className="form-input" /></Field>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })} /> Active reminder</label>
          </div>
          <div className="mt-4">
            <div className="mono-label mb-2">Custom days of week</div>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button key={day} onClick={() => toggleDay(day, draft, setDraft)} className={`rounded-md border border-[var(--border)] px-3 py-2 text-xs ${draft.daysOfWeek.includes(day) ? "bg-[var(--graphite)] text-[var(--porcelain)]" : "hover:bg-[var(--ivory)]"}`}>{day}</button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <button disabled={saving || !backendReady} onClick={saveReminder} className="inline-flex items-center gap-2 rounded-md bg-[var(--graphite)] px-5 py-2.5 text-sm text-[var(--porcelain)] disabled:opacity-50"><Save size={14} /> {saving ? "Saving..." : editingId ? "Save edits" : "Create reminder"}</button>
            <button onClick={requestNotifications} className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-5 py-2.5 text-sm hover:bg-[var(--ivory)]"><Bell size={14} /> Notification permission onboarding</button>
            <button onClick={() => setMessage("Email fallback placeholder saved for later phase. No health data sent.")} className="rounded-md border border-[var(--border)] px-5 py-2.5 text-sm hover:bg-[var(--ivory)]">Email fallback placeholder</button>
            <button onClick={() => setMessage("Future SMS fallback placeholder only. No SMS sent in Phase 7.")} className="rounded-md border border-[var(--border)] px-5 py-2.5 text-sm hover:bg-[var(--ivory)]">Future SMS placeholder</button>
          </div>
        </Surface>

        <Surface className="divide-y divide-[var(--border)]">
          {reminders.length === 0 && !loading && (
            <div className="p-8 text-center text-sm text-[var(--soft-text)]">Your first reminder will appear here. Start with one useful guide routine.</div>
          )}
          {reminders.map((reminder) => (
            <div key={reminder.id} className="p-5 flex items-center gap-5 flex-wrap">
              <Bell size={16} className="text-[var(--steel)]" />
              <div className="flex-1 min-w-[220px]">
                <div className="text-sm">{reminder.title}</div>
                <div className="mono-label mt-0.5">{reminder.reminderType} · {reminder.frequency} · {reminder.daysOfWeek.join(", ") || "custom"}</div>
                <p className="text-xs text-[var(--soft-text)] mt-1">{reminder.privateLabel}</p>
              </div>
              <div className="font-mono text-sm text-[var(--steel)] w-32">{reminder.timeOfDay}<br />{reminder.timezone}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge>{reminder.isActive ? "Active" : "Paused"}</Badge>
                <IconBtn label="Mark complete" onClick={() => createEvent(reminder, "completed", { completed_at: new Date().toISOString() })}><CheckCircle2 size={14} /></IconBtn>
                <IconBtn label="Snooze reminder" onClick={() => createEvent(reminder, "snoozed", { snoozed_until: new Date(Date.now() + 30 * 60 * 1000).toISOString() })}><RotateCcw size={14} /></IconBtn>
                <IconBtn label={reminder.isActive ? "Pause reminder" : "Resume reminder"} onClick={() => pauseReminder(reminder)}><Pause size={14} /></IconBtn>
                <IconBtn label="Edit reminder" onClick={() => editReminder(reminder)}><Edit3 size={14} /></IconBtn>
                <IconBtn label="Duplicate reminder" onClick={() => duplicateReminder(reminder)}><Copy size={14} /></IconBtn>
                <IconBtn label="Delete reminder" onClick={() => deleteReminder(reminder.id)}><Trash2 size={14} /></IconBtn>
                <button onClick={() => setMessage("Add to calendar placeholder generated. Calendar file export can be added later without health details.")} className="rounded-md border border-[var(--border)] px-3 py-2 text-xs hover:bg-[var(--ivory)]"><CalendarDays size={12} className="inline mr-1" />Calendar</button>
              </div>
            </div>
          ))}
        </Surface>
      </div>

      <Surface className="mt-6 p-5">
        <div className="mono-label mb-2">Reminder boundaries</div>
        <p className="text-sm text-[var(--soft-text)]">Reminders support hydration, supplements, GLP-1 dose day, protein checks, body-care routines, SPF reapplication, body metrics, emotional check-ins, weekly guide review, provider question prep, refill or clinician follow-up, and other guide-related routines. They do not provide medical instructions or replace clinician guidance.</p>
      </Surface>
    </>
  );
}

function blankReminder(): ReminderDraft {
  return {
    reminderType: "hydration",
    title: "Hydration check",
    privateLabel: "PYPER reminder: hydration check",
    frequency: "daily",
    daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    timeOfDay: "09:00",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
    isActive: true,
    linkedTrackerType: "Protein + Hydration",
  };
}

function toDbReminder(reminder: ReminderDraft): GuideStorageRecord {
  return {
    reminder_type: reminder.reminderType,
    title: reminder.title,
    private_label: reminder.privateLabel,
    frequency: reminder.frequency,
    days_of_week: reminder.daysOfWeek,
    time_of_day: reminder.timeOfDay,
    timezone: reminder.timezone,
    start_date: reminder.startDate,
    end_date: reminder.endDate || null,
    is_active: reminder.isActive,
    linked_tracker_type: reminder.linkedTrackerType,
  };
}

function fromDbReminder(row: GuideStorageRecord): ReminderDraft {
  return {
    id: String(row.id || ""),
    reminderType: String(row.reminder_type || "hydration"),
    title: String(row.title || "Guide reminder"),
    privateLabel: String(row.private_label || "PYPER reminder: open your guide"),
    frequency: String(row.frequency || "daily"),
    daysOfWeek: Array.isArray(row.days_of_week) ? row.days_of_week.map(String) : [],
    timeOfDay: String(row.time_of_day || "09:00").slice(0, 5),
    timezone: String(row.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone),
    startDate: String(row.start_date || new Date().toISOString().slice(0, 10)),
    endDate: row.end_date ? String(row.end_date) : "",
    isActive: row.is_active !== false,
    linkedTrackerType: String(row.linked_tracker_type || ""),
  };
}

function validateReminder(reminder: ReminderDraft) {
  if (!reminder.title.trim()) return "Add a reminder title.";
  if (!reminder.privateLabel.startsWith("PYPER reminder:")) return "Use a privacy-safe PYPER reminder label.";
  if (!reminder.timeOfDay) return "Choose a reminder time.";
  if (!reminder.timezone.trim()) return "Add a timezone.";
  if (!reminder.startDate) return "Choose a start date.";
  return null;
}

function toggleDay(day: string, draft: ReminderDraft, setDraft: (draft: ReminderDraft) => void) {
  setDraft({ ...draft, daysOfWeek: draft.daysOfWeek.includes(day) ? draft.daysOfWeek.filter((item) => item !== day) : [...draft.daysOfWeek, day] });
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mono-label mb-2 block">{label}</span>{children}</label>;
}

function IconBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return <button aria-label={label} onClick={onClick} className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-[var(--border)] hover:bg-[var(--ivory)] text-[var(--steel)]">{children}</button>;
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return <div className="border border-[var(--border)] rounded-md p-4"><div className="mono-label mb-2">{label}</div><div className="text-xl" style={{ fontFamily: "var(--font-serif)" }}>{value}</div><p className="text-xs text-[var(--soft-text)] mt-1">{hint}</p></div>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="text-xs px-2 py-1 rounded-full border border-[var(--border)] text-[var(--steel)]">{children}</span>;
}

function Notice({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "alert" }) {
  return <div className={`mb-4 rounded-md border p-3 text-sm ${tone === "alert" ? "border-[#8a2a2a]/30 bg-[#fdf4f4] text-[#8a2a2a]" : "border-[var(--border)] bg-[var(--ivory)]"}`}>{children}</div>;
}
