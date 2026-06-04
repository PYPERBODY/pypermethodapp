# Phase 5 Security Safeguards

The PYPER Method Interactive Guide is not a patient portal. Authentication and storage exist only to protect guide progress, trackers, the PYPER Body-Care Plan, future reminders, future progress views, and guide-related support features.

Do not add appointment scheduling, provider messaging, pharmacy fulfillment, prescriptions, medical records, insurance tools, telehealth intake, clinical charting, or general member account features unrelated to The Guide.

Development rules:

1. Use fictional test users and fictional demo data only.
2. Do not store health-related data in unsecured `localStorage` in production.
3. Do not expose Supabase service-role keys in frontend code.
4. Do not send health data to affiliate links, analytics, advertising pixels, or session replay tools.
5. Do not use session replay in authenticated health-related areas.
6. Do not connect tracker forms to production storage until Phase 6.
