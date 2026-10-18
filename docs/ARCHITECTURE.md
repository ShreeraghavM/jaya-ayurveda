# Architecture

## Shape of the system

```
┌──────────────────────────────────────────────────────────────┐
│  Browser (React 19 + Vite 7 + Tailwind v4)                   │
│                                                              │
│  App.tsx ── view router                                      │
│    ├── LandingPage ────────────── marketing + demo entry      │
│    ├── Onboarding ─────────────── details → dosha → BMI → job │
│    ├── app shell ─┬── Dashboard        (current-hour)         │
│    │              ├── ChatCoach        (conversational)       │
│    │              ├── DailyRoutine     (confirm each step)    │
│    │              ├── DietPlan         (meal check-ins)       │
│    │              ├── YogaSession      (asana + pranayama)    │
│    │              ├── Goals            (streaks + rationale)  │
│    │              ├── Remedies                                │
│    │              └── Progress                                │
│    ├── UserProfile ─────────────── account, BMI, sign out     │
│    ├── TomorrowPlanning ────────── evening plan + shopping    │
│    ├── UserGuide ───────────────── 14-section manual          │
│    ├── SmartPopups ─────────────── the companion overlay      │
│    └── GoodNightRitual ─────────── nightly progress card      │
│                                                              │
│  lib/                                                        │
│    data.ts         static Ayurvedic domain knowledge          │
│    professions.ts  15 profession days, humour, regions        │
│    smartEngine.ts  day plan · prompt selection · review       │
│    bmi.ts          WHO classification + guidance              │
│    store.ts        localStorage persistence                   │
└──────────────────────────────────────────────────────────────┘
                            │ /api (optional)
┌──────────────────────────────────────────────────────────────┐
│  Hono sidecar (server.tsx) + Prisma 7 + SQLite               │
│  generated CRUD from prisma/schema.prisma                    │
│  + custom-routes.ts for hand-written endpoints               │
└──────────────────────────────────────────────────────────────┘
```

The client is fully functional **without** the API sidecar. The sidecar exists for accounts, server-side memory and future multi-device sync; today it carries a `User` model and generated CRUD.

## The three engines

### 1. Domain knowledge — `lib/data.ts`

Pure data, no side effects: dosha profiles, the 15-question assessment, the 25-step dinacharya, dosha × meal-slot recipe sets, asana and pranayama libraries, seasonal guidance, remedies.

Design rule: **data carries its own justification**. Every recipe lists ingredients and method; every pose lists benefits and contraindications; every seasonal tip carries per-dosha advice. The UI never invents clinical-sounding copy at runtime.

### 2. Profession model — `lib/professions.ts`

Fifteen seeds (school student → retired) each declare wake/sleep time, four meal anchors, break times, screen limit, exercise suggestion, family window and a work note. `buildSchedule()` expands a seed into a sorted timeline, so a new profession is ~15 lines of data rather than a bespoke screen.

The same module owns humour (four styles, profession-matched), regional food tables, a holiday calendar, and the goal library.

### 3. Companion engine — `lib/smartEngine.ts`

```
buildDayPopups(profile)          → Popup[]  ~20 prompts with times & actions
getActivePopup(profile, handled) → Popup|null  (due within 150 min, not handled)
buildTomorrowPlan(profile, log)  → meals + groceries + focus
reviewDay(profile, log, handled) → score + achievements + improvements
```

`getActivePopup` is the whole product in one function: filter by time window, drop anything already answered, return the most recent due prompt. `SmartPopups` re-evaluates every 45 seconds and on every tab change.

Content rotation is deterministic — `Math.floor(date / 86_400_000)` indexes the tip, quote, meal and joke arrays, so the same day always yields the same content and consecutive days differ.

## State & persistence

All client state lives in `localStorage` under a small, explicit key set:

| Key | Shape |
|---|---|
| `jaya_user_profile` | `UserProfile` (identity, body, dosha, profession, region, goals) |
| `jaya_auth_session` | `{ name, email, mode: account \| guest \| demo, signedInAt }` |
| `jaya_goals` | `Goal[]` |
| `jaya_popup_state` | `{ [date]: { [popupId]: 'done' \| 'skipped' \| 'snoozed' } }` |
| `jaya_routine_progress` | `{ [date]: { [stepKey]: 'done' \| 'skipped' } }` |
| `jaya_meal_confirmations` | `{ [date]: { slots, actual } }` |
| `jaya_daily_logs` | `DailyLog[]` |

Every read/write goes through `lib/store.ts`, which wraps `JSON.parse` and quota errors — a corrupt or full store degrades to in-memory defaults rather than a white screen.

## Key decisions

**No routing library.** View state is a small discriminated union in `App.tsx`. The app is a guided sequence, not a URL-addressable site; adding a router would buy little and cost bundle and complexity.

**Data over logic.** Ayurvedic content is declarative. Dosha-specific behaviour is `Record<Dosha, string[]>` lookups, which keeps every branch auditable and makes the content reviewable by a non-engineer.

**Prompt, do not infer.** The engine could guess meals from a food database or a photo. It asks instead: one tap, higher trust, and no false precision.

**Local-first.** Privacy is a product feature, not a compliance afterthought. Nothing leaves the browser, so there is nothing to breach, sell or lose in a migration.

**Generated layer is committed.** `src/generated/**` and `server.tsx` are produced by the Shogo SDK generator from `prisma/schema.prisma`. They are committed so a clone runs without a generation step; edit the schema, not the output.

## Performance notes

- Production bundle ~1.6 MB raw / ~283 kB gzip, dominated by Recharts + Radix primitives.
- `buildDayPopups` allocates ~20 small objects per evaluation and runs at most every 45 s — negligible.
- The dashboard recomputes the current routine step on a 60-second interval rather than per render.

## Testing

Type safety is enforced with `tsc --noEmit` in CI. The prompt engine is pure and deterministic, so it is the natural first target for unit tests (`buildDayPopups`, `getActivePopup`, `reviewDay`, `calculateBmi`). An end-to-end smoke path (landing → demo → dashboard → profile → guide → diet → goals → good night) is the current manual acceptance check.
