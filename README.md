# 🌿 Jaya Ayurveda

**A proactive Ayurvedic companion that walks with you from sunrise to sunset.**

Most wellness apps are graveyards of good intentions — you have to remember to open them, remember what to log, and interpret the numbers yourself. Jaya inverts that. It brings _one calm, specific instruction at the right hour_, asks a single question, and adapts tomorrow around your answer.

You do not navigate it. You confirm it.

```
06:30  🌅  Good morning, Arjun. Brahma Muhurta. Warm water, sit up slowly.      [I am awake]
06:30  🧘  Pranayama and meditation — 10 minutes.                              [Done] [Skipped]
08:00  🥣  Breakfast: cooling coconut rice pudding.                          [Ate this] [Something else]
12:30  🍽️  Lunch: kitchari with coconut. Agni at its peak.                    [Ate this] [Skipped]
15:00  😄  A small pause, on purpose.                                          [That helped]
20:00  🗒️  Shall we plan tomorrow? Groceries before the shops close.            [Let us plan]
22:30  😴  Shall I close the day? I will write your progress card.             [Close my day]
```

---

## What it does

| | |
|---|---|
| **Constitution-aware** | A 15-question Ayurvedic assessment derives your Vata / Pitta / Kapha composition. Every meal, pose, remedy and prompt is filtered through it. |
| **Profession-aware** | 15 profession profiles define waking, meals, breaks, screen limits and sleep — a farmer's day is not an engineer's day. |
| **Proactive, not passive** | ~20 scheduled prompts per day, each with a single question and two or three taps. They only surface inside their time window, so opening the app at noon does not replay your morning. |
| **Nutrition that adapts** | Meals chosen by dosha, season and region. Confirm what you ate, or tell Jaya what you actually ate — it feeds tomorrow's plan and the shopping list. |
| **Honest measurement** | WHO adult BMI (`kg / m²`), your healthy weight band, and an automatic goal when you sit outside it. |
| **Goals with reasons** | Every goal states the benefit _and_ the mechanism — why it works for a body like yours. |
| **A real closing ritual** | At bedtime: a day score, what you achieved, what to improve, and tomorrow's first meal. |
| **Private by default** | No account server, no telemetry, no third-party analytics. Your profile lives in your browser. |

---

## Screens

- **Landing** — the promise, the shloka, and a two-tap start (or a demo profile).
- **Onboarding** — one conversation: name → nine questions → body details with live BMI → profession.
- **Home** — current-hour guidance, sun arc, water tracker, mood check-in, constitution balance.
- **Coach** — conversational Ayurvedic guidance for sleep, food, anxiety, digestion.
- **Dinacharya** — the full Ayurvedic day, confirmed step by step.
- **Diet** — dosha/season/region meals with per-meal check-ins and recipes.
- **Yoga** — asanas and pranayama filtered by dosha and level.
- **Goals** — chosen goals, streaks, and the reason each one works.
- **Remedies** — home remedies with preparation, dosage and precautions.
- **Progress** — weekly trends plus the nightly progress card.
- **Profile** — account, BMI gauge, editable body details, constitution, sign out.
- **User guide** — 14 sections, in-app.

---

## Tech stack

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS v4** with a hand-tuned emerald/gold Ayurvedic palette
- **shadcn/ui** primitives (Radix), **lucide-react** icons
- **Hono** API sidecar (`server.tsx`) + **Prisma 7** on SQLite for optional persistence
- **Recharts** for progress visualisation
- Zero client-side network calls to third parties

---

## Getting started

```bash
bun install

# frontend (Vite)
bun run dev

# API sidecar + frontend together
bun run dev:full
```

The client runs on `http://localhost:3000` and proxies `/api` to the Hono server on `3001`.

```bash
bun run build        # production build
bun run start        # serve API + built assets
bun x tsc --noEmit   # type check
```

### Try it without onboarding

On the landing page choose **Try demo profile** — loads *Arjun, 28, software engineer, Pitta, 175 cm / 75 kg* with a populated day.

---

## Project structure

```
src/
├── App.tsx                     view router: landing → onboarding → app → profile/plan/guide
├── components/
│   ├── LandingPage.tsx         marketing surface + demo entry
│   ├── Onboarding.tsx          single-conversation setup (details → dosha → BMI → profession)
│   ├── Dashboard.tsx           current-hour guidance, sun arc, water, mood
│   ├── SmartPopups.tsx         the proactive companion overlay
│   ├── DailyRoutine.tsx        dinacharya with per-step confirmation
│   ├── DietPlan.tsx            meals, recipes, per-meal check-ins
│   ├── YogaSession.tsx         asana + pranayama library
│   ├── Remedies.tsx            home remedies
│   ├── Goals.tsx               goals, streaks, rationale
│   ├── TomorrowPlanning.tsx    evening plan + shopping list
│   ├── GoodNightRitual.tsx     nightly progress card
│   ├── UserProfile.tsx         account, BMI, body details, sign out
│   └── UserGuide.tsx           14-section in-app guide
└── lib/
    ├── data.ts                 doshas, quiz, dinacharya, meals, poses, remedies, seasons
    ├── professions.ts          15 profession days, humour, regions, holidays, goal library
    ├── smartEngine.ts          day plan, active prompt selection, tomorrow, day review
    ├── bmi.ts                  WHO classification, healthy band, dosha-aware guidance
    ├── store.ts                local persistence (profile, session, goals, prompts, logs)
    └── db.ts                   Prisma client for the optional API sidecar
prisma/schema.prisma            Prisma 7 schema
server.tsx                      Hono API (generated CRUD + custom routes)
custom-routes.ts                hand-written API routes
legacy-python-cli/              the original Python CLI prototype this grew from
docs/                           product, architecture, privacy, AI safety, roadmap, investor brief
```

---

## BMI

Jaya uses the World Health Organization adult classification:

```
BMI = weight (kg) / height (m)²
```

| BMI | Category |
|---|---|
| < 16.0 | Severe thinness |
| 16.0 – 16.9 | Moderate thinness |
| 17.0 – 18.4 | Mild thinness |
| **18.5 – 24.9** | **Healthy range** |
| 25.0 – 29.9 | Overweight |
| 30.0 – 34.9 | Obese class I |
| 35.0 – 39.9 | Obese class II |
| ≥ 40.0 | Obese class III |

Outside the healthy band, Jaya sets a goal automatically and shows the kg distance to the healthy range for your height. BMI is a population screening tool, not a diagnosis — it does not account for muscle mass, pregnancy or ethnicity-specific cut-offs.

---

## Data & privacy

Everything is stored in `localStorage` on your device. There is no account server, no analytics, no third-party SDK in the client bundle. Signing out clears the session; clearing site data removes the profile. See [`docs/PRIVACY.md`](docs/PRIVACY.md).

---

## Medical disclaimer

Jaya offers wellness guidance inspired by Ayurvedic tradition. It is **not** a medical device, does not diagnose or treat any condition, and does not replace a qualified physician. If a symptom is severe, sudden or worsening, seek medical care. See [`docs/AI-SAFETY.md`](docs/AI-SAFETY.md).

---

## Contributing

Branch model, commit conventions and the PR checklist live in [`CONTRIBUTING.md`](CONTRIBUTING.md). CI type-checks and builds every pull request.

---

## License

Apache-2.0 — see [`LICENSE`](LICENSE).

> स्वस्थस्य स्वास्थ्य रक्षणम् । आतुरस्य विकार प्रशमनम् ॥
> *To preserve the health of the healthy, and to relieve the disorder of the unwell.*
