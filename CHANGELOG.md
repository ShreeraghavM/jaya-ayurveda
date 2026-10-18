# Changelog

All notable changes to this project. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [SemVer](https://semver.org).

## [1.0.0] — 2026-10-18

First complete release of the web application. The original command-line prototype is preserved under `legacy-python-cli/`.

### Added

**Companion engine**
- ~20 daily proactive prompts generated from profession, dosha, season and region, each with a time, a single question and two or three actions
- Active-prompt selection with a 150-minute due window so missed prompts do not replay later in the day
- Snooze (10 minutes), confirm and skip, persisted per day
- Deterministic daily rotation of meals, tips, quotes and humour so consecutive days differ

**Onboarding**
- Single-conversation setup: name and email → 15-question dosha assessment → body details with live BMI → profession selection
- "Why I ask" explainer for each field at the start
- Demo profile entry point (Arjun, 28, software engineer, Pitta)

**Body & health**
- WHO adult BMI classification (`kg / m²`) with eight bands and healthy weight range for height
- Automatic goal creation when BMI falls outside 18.5–24.9
- Dosha-aware, non-clinical first steps toward the healthy band
- BMI gauge with healthy-band markers

**Food**
- Dosha × season × region meal plans with recipes and ingredient lists
- Per-meal check-in: confirmed, replaced ("what did you actually eat"), or skipped
- Answers feed tomorrow's plan and shopping list

**Routine**
- 25-step dinacharya with per-step confirmation, optional "what did you do instead" note, and a completion summary
- Progress persisted per day

**Planning & review**
- Evening planning with tomorrow's meals, a focus statement and a shopping list
- Holiday and weekend awareness
- Nightly progress card: day score, achievements, improvements, encouragement, tomorrow's first meal, sleep ritual

**Goals**
- 12 goal templates filtered by dosha, each with benefit and mechanism
- Streaks, progress and removal
- Two sensible defaults seeded for a new user

**Libraries**
- 14 asanas and 6 pranayama techniques with contraindications
- 12 remedies with preparation, dosage and precautions
- 15 profession day profiles across technical and non-technical work

**Account & guidance**
- Profile page: account details, BMI, editable body data, profession, region, constitution, sign out
- 14-section in-app user guide
- Landing page with the Ayurvedic shloka, feature overview and two entry points

**Platform**
- Local-first persistence with no third-party network calls
- Optional Hono + Prisma sidecar for future accounts
- Apache-2.0 licence, documentation set and CI

### Changed

- Dashboard quick-action grid removed; it duplicated the bottom navigation
- Dosha balance chart now reflects the user's actual composition instead of fixed thirds
- `get现阶段Advice` renamed to `getTimeOfDayAdvice` (non-ASCII identifier)

### Fixed

- Onboarding dosha scoring accumulates per-option weights instead of passing raw answers
- Result screen percentages derive from accumulated scores

### Known limitations

- No accounts, sync or multi-device support
- No automated test suite yet; acceptance is a manual smoke path
- BMI cut-offs are not adjusted for South Asian populations
- Dosha assessment is a heuristic, not a validated instrument
- Profession presets assume a diurnal day; shift workers are not yet modelled
