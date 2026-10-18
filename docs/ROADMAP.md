# Roadmap

## v1.0 — shipped

- Single-conversation onboarding: identity → dosha → body/BMI → profession
- WHO BMI with healthy weight band and automatic goal
- ~20 daily proactive prompts driven by profession, dosha, season and region
- Dinacharya with per-step confirmation
- Diet with dosha × season × region meals, recipes and per-meal check-ins
- Yoga/pranayama library, remedies library, goals with streaks
- Evening planning with shopping list
- Nightly progress card
- Profile with editable details and sign out
- 14-section in-app guide
- Local-first persistence, no network egress

## v1.1 — depth

- **Prompt engine as a pure, unit-tested module** (vitest) — `buildDayPopups`, `getActivePopup`, `reviewDay`, `calculateBmi`
- **Week view** of confirmations: which prompts are habitually skipped, and a weekly focus derived from it
- **Shift-worker profile family** (night shift, rotating, on-call) — the current presets assume a diurnal day
- **Ethnicity-adjusted BMI bands** with an explicit, sourced explanation
- **Export/import** of the local profile as JSON, so a device change is not data loss

## v1.2 — sync (optional, opt-in)

- Accounts on the existing Hono sidecar, with end-to-end encrypted payloads (server stores ciphertext only)
- Multi-device sync
- Data export and one-tap deletion endpoints
- DPIA, retention schedule and processor DPAs completed before any hosted health data

## v2.0 — assistant

- Grounded conversational coach (retrieval over the shipped knowledge base, not free generation)
- Emergency detection with fail-closed behaviour
- Clinician-reviewed refusal templates and a transcript review loop
- Voice check-ins for users with low literacy or motor constraints
- Clinician hand-off summary (user-initiated, explicitly consented)

## Explicitly not planned

- Calorie counting or food-photo recognition (false precision)
- Social feeds, leaderboards or competitive streaks
- Advertising or data monetisation of any kind
- Wearable-derived diagnosis

## Open questions

1. How should Jaya behave for users whose profession and chronotype conflict (a Kapha software engineer who is genuinely nocturnal)?
2. What is the smallest credible clinical validation for the dosha instrument — enough to call it "a heuristic with known limits" rather than a measurement?
3. Where does a wellness product stop and a regulated medical device start, once BMI goals and symptom guidance are involved? (MHRA guidance review required before v2.)
