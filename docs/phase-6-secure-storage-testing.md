# Phase 6 Secure Storage Testing

Use fictional test accounts only. Do not use real patient data.

## Fictional users

- User A: `alex.phase6-a@example.test`
- User B: `blair.phase6-b@example.test`

## Manual verification checklist

1. Sign in as User A.
2. Create, edit, duplicate, and delete entries for each connected guide tracker.
3. Save and apply at least one routine template.
4. Save a PYPER Body-Care Plan, products, application logs, skin tolerance log, SPF log, and plan version.
5. Mark entries as reviewed for check-in and include in future export.
6. Sign out.
7. Sign in as User B.
8. Confirm User A entries do not appear.
9. Attempt to open direct UI states for the same trackers; only User B records should load.
10. Create a User B entry and confirm it does not appear after signing back in as User A.

## Automated/code audit performed in Phase 6

- All tracker reads call Supabase with `.eq("user_id", userId)`.
- Inserts include `user_id` from the authenticated session.
- Updates and deletes include both row `id` and `.eq("user_id", userId)`.
- Routine template reads/writes/deletes are also scoped to `user_id`.
- Body-care plan, product, application, tolerance, SPF, and version operations use the same scoped storage helpers.

## Not part of Phase 6

- No provider sending.
- No automatic email export.
- No analytics, advertising pixels, or session replay.
- No real patient data.
