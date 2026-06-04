# Phase 7 Reminders and PWA Testing

Use fictional test accounts only. Do not use real health data.

## Reminder storage checks

1. Sign in as a fictional user.
2. Create guide-related reminders for hydration, supplements, GLP-1 dose day, protein check, AM/PM body-care, SPF reapplication, mental health check-in, weekly guide review, and provider question prep.
3. Edit a reminder and confirm the saved row updates for the signed-in user.
4. Pause/resume a reminder.
5. Duplicate a reminder and confirm it stays inactive until reviewed and saved.
6. Delete a reminder after confirmation.
7. Mark a reminder complete and confirm a `reminder_events` row is created.
8. Snooze a reminder and confirm a `reminder_events` row with `snoozed_until` is created.
9. Confirm reminder labels remain generic and privacy-safe.
10. Sign in as a second fictional user and confirm the first user's reminders do not appear.

## Notification and PWA checks

1. Open the Reminders tab after sign-in.
2. Use notification permission onboarding.
3. Confirm `notification_preferences.push_enabled` reflects permission state when Supabase is available.
4. Trigger the install prompt when the browser supports `beforeinstallprompt`, or verify the fallback copy appears.
5. Confirm `manifest.webmanifest`, install icons, and `sw.js` are available in the production build.
6. Confirm the service worker handles notification clicks by focusing or opening The Guide.

## Not part of Phase 7

- No appointment scheduling.
- No provider messaging or sending data to providers.
- No analytics, advertising pixels, or session replay.
- No Phase 8 progress/export work.
