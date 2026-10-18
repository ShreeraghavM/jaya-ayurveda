# AI safety

Jaya is a **guide, never a decider**. This document states the boundaries the product commits to, how they are enforced today, and what must be true before any generative or clinical expansion.

## 1. Scope boundary

In scope:
- traditional Ayurvedic lifestyle guidance (food, routine, breath, movement, sleep)
- general wellness education
- habit scaffolding and reflection

Out of scope, permanently:
- diagnosis, prognosis, or differential diagnosis
- prescribing, dosing or deprescribing medication
- interpreting lab results, imaging or wearable diagnostics
- emergency triage
- mental-health crisis counselling
- anything phrased as "you have X"

## 2. Enforcement today

**Content is authored, not generated.** Every recommendation the user sees is a static string in `lib/data.ts` or `lib/professions.ts`. There is no model in the runtime loop, so there is no path for a hallucinated diagnosis to reach a user. Personalisation selects *which* authored string is shown, never invents one.

**Language rules for authored content:**
- describe food, routine and behaviour — never pathology
- no "cure", "treat", "heal", "prevent disease"
- remedies carry explicit `precautions` and are labelled for mild complaints only
- contraindications ship with every asana and pranayama entry

**Escalation is explicit.** Remedy and guide surfaces state that persistent, severe or worsening symptoms belong with a clinician. The landing page and guide both carry the disclaimer.

**No inference from absence.** A skipped prompt is treated as missing information about behaviour, never as evidence about health.

## 3. Data minimisation as a safety control

Because nothing is transmitted (see [`PRIVACY.md`](PRIVACY.md)), there is no training corpus, no breach surface and no silent secondary use. This is a safety property, not only a privacy one.

## 4. If a language model is introduced

Required before ship:

1. **System prompt pinning** — the model may only restate authored guidance; it may not add conditions, dosages or diagnoses.
2. **Output classifier** — a pre-display check that blocks diagnostic phrasing, dosing language and emergency-minimising language. Fail closed: if the classifier errors, the deterministic authored response is shown instead.
3. **Retrieval over generation** — answers must be grounded in the shipped knowledge base; ungrounded answers are refused.
4. **Emergency detection** — keyword and semantic detection of red flags (chest pain, stroke signs, suicidal ideation, bleeding, breathing difficulty) short-circuits to an emergency message with local emergency numbers. Never a wellness tip.
5. **Refusal templates** — canned, tested refusals for dosing, diagnosis and crisis, written with clinical review.
6. **Human review loop** — a sampled transcript review with a clinician on a fixed cadence, and a user-facing report path.
7. **Model/data governance** — no user health data in fine-tuning; vendor contract prohibiting training on inputs.
8. **Versioning** — every prompt and model version recorded so a regression is attributable.
9. **Evaluation set** — a red-team suite of ~200 adversarial health prompts run in CI before any prompt change ships.
10. **Kill switch** — ability to disable generative responses server-side without an app release.

## 5. Known limitations (stated honestly)

- BMI is a population screen. It does not distinguish muscle from fat, and WHO cut-offs are not adjusted for South Asian populations, where risk rises at lower BMI. Jaya should eventually offer ethnicity-adjusted bands with a clear explanation.
- The dosha assessment is a self-report instrument with no validated psychometric properties. It is presented as a personalisation heuristic, not a measurement.
- Profession presets are population averages, not individual chronotypes. Shift workers need a separate model.
- Prompt timing is clock-based, not context-aware (no calendar, location or wearable signals). A prompt can therefore arrive at an inconvenient moment; snooze exists for exactly this reason.

## 6. Accessibility & dignity

- No shaming copy. A skip is recorded as "noted without judgement"; the review states improvements as forward-looking actions, not failures.
- No streak-loss penalties, no red badges, no loss-framed notifications.
- Text sizes and contrast tuned for low-vision reading; interactive targets are ≥32 px.
