# Jaya Ayurveda — Investor Brief

> A proactive Ayurvedic companion that walks with a user from waking to sleep, and adapts every day around what they actually did.

**Status:** working prototype (this repository), pre-revenue, pre-clinical.
**Seeking:** pre-seed / innovation grant.
**Geography:** United Kingdom first, India as the content and evidence base.

---

## 1. The idea in one paragraph

Wellness apps fail on adherence, not on information. Jaya inverts the model: instead of a destination a user must remember to open, it emits roughly twenty **timed, single-question prompts** across the day — wake, breath, meals, water, movement, family time, planning, sleep — filtered through the user's Ayurvedic constitution, their profession, their region and the season. The user taps once to confirm. Every confirmation changes tomorrow's meals, plan and progress card. Health guidance becomes a relationship rather than a dashboard.

## 2. A day with Jaya

| Time | Prompt | Rationale |
|---|---|---|
| 06:30 | Good morning — Brahma Muhurta | fixed wake time anchors the sleep cycle |
| 06:30 | Pranayama and meditation (10 min) | raises vagal tone |
| 08:00 | Breakfast: cooling coconut rice pudding | Pitta-pacifying, seasonally rotated |
| 10:30 | Water check | thirst misread as hunger |
| 12:30 | Lunch: kitchari with coconut | largest meal when Agni peaks |
| 13:00 | Ten-minute walk | flattens post-prandial glucose |
| 15:00 | A small pause, on purpose | profession-matched humour; the only prompt with no health goal |
| 19:30 | Dinner: mung dal soup | light, three hours before sleep |
| 20:00 | Shall we plan tomorrow? | meals + shopping list while shops are open |
| 21:30 | Wind down | screens off, oil the feet |
| 22:30 | Shall I close the day? | score, achievements, improvements, tomorrow |

That is the whole product: **twelve moments, one tap each**.

## 3. What is actually built

This repository is a working prototype, not a deck. Verified end-to-end:

- Landing page with a two-tap demo profile
- One-conversation onboarding (identity → 15-question dosha assessment → body + live BMI → 15 professions)
- Dashboard with current-hour guidance, sun arc, water and mood
- ~20-prompt proactive engine with snooze, confirm, skip and tab hand-off
- Dinacharya with per-step confirmation and "what did you do instead"
- Diet with dosha × season × region meals, recipes and per-meal check-ins
- Yoga/pranayama and remedies libraries with contraindications and precautions
- Goals with streaks, and the mechanism behind each
- Evening planning with a shopping list
- Nightly progress card
- Profile with editable body data, WHO BMI gauge and sign out
- 14-section in-app guide

**Not built:** accounts, sync, clinical validation, any AI model in the runtime loop, payments. These are deliberately out of scope for a prototype that must first prove the prompt loop works.

## 4. Due-diligence questions

### 1. What is actually innovative?

The **delivery mechanism**, not the content. Ayurveda is three thousand years old; nudging is a decade old. Nobody has combined them into a *proactive, constitution-filtered, profession-timed loop with a consequence*.

Concretely novel in this build:
1. **Profession as the timing substrate.** Fifteen profession profiles define wake, meals, breaks, screen limits and sleep. A farmer's day is not an engineer's day; no competitor models this.
2. **Constitution as the filter.** Every instruction passes through Vata/Pitta/Kapha before display — food, movement, sleep, even humour style.
3. **One-question prompts with a feedback edge.** Each confirmation changes tomorrow's plan and the nightly review. Most apps log; this one *concludes*.
4. **An honest closing ritual.** A day score with achievements, improvements and tomorrow's first meal — a reflective loop, not a chart.

What it is not: a new dosha quiz, a new recipe database, or a chatbot wrapper.

### 2. Who are the competitors?

| Player | Strength | What they do not do |
|---|---|---|
| HealthifyMe | scale, Indian food database, coaching | generic timing, no constitution model, tracker-first, calorie-centric |
| Cult.fit | fitness content and live classes | class library, not a daily companion; no nutrition timing loop |
| Practo | teleconsultation | episodic care, not daily prevention |
| Calm / Headspace | meditation UX | mindfulness only, no food/routine/constitution |
| Noom | behavioural coaching | Western psychology, no Ayurveda, human-coach dependent |
| MyFitnessPal | logging ubiquity | passive diary, no guidance, no timing |

No incumbent combines **constitution + profession timing + proactive prompts + food planning** in one loop. Each has one slice.

### 3. Why can't an existing wellness company build this?

They can copy features; they cannot cheaply copy these four things:

1. **Ayurveda as architecture, not a category.** For incumbents, Ayurveda is a content vertical bolted onto a calorie tracker. Here the constitution *is* the filter for every string in the product. Retrofitting that means rewriting the recommendation layer.
2. **The prompt-first paradigm contradicts their business model.** Their engagement metrics come from session length and logging streaks. Jaya optimises for the opposite: a 15-second interaction, three times a day, with the app closed the rest of the time. An incumbent shipping this cannibalises its own dashboard time.
3. **Cultural and clinical authority.** Credible Ayurvedic personalisation requires practitioners and a review process, not a content agency. That is a hiring problem measured in quarters.
4. **Distribution focus mismatch.** Incumbents optimise for the metro fitness market. Jaya's wedge — profession-specific preventive guidance for the diaspora and tier-2 India — is a market they under-serve by design.

Honest counter: a well-funded incumbent could build a 70% clone in 9–12 months. The defence is depth of personalisation, practitioner network and the data from the prompt loop, not the UI.

### 4. Why the UK?

- **Regulatory clarity.** MHRA and UK GDPR give a predictable path; a wellness product can ship without medical-device classification provided it stays inside the boundaries documented in `docs/AI-SAFETY.md`.
- **Diaspora density.** ~1.6 million people of Indian origin; Ayurveda is familiar, not exotic, so no education tax at activation.
- **Purchasing power.** A £5–9/month consumer price is viable where ₹299 is the ceiling in India.
- **Innovation funding.** Innovate UK and NIHR pathways explicitly favour preventive digital health.
- **Beachhead, not destination.** UK proves the model at high ARPU; India is the volume market; US/Canada/Australia/Gulf follow the same diaspora pattern.

Honest gap: the UK is not where the Ayurvedic practitioner supply chain sits. Content credibility will be built with Indian practitioners and reviewed by UK-registered clinicians for safety framing.

### 5. Why this founder?

The claim is narrow and verifiable rather than impressive on paper:

- **Domain fluency.** The Ayurvedic model in this repository — 15-question assessment, 25-step dinacharya, dosha × meal matrices, seasonal and regional food logic, contraindications — was authored, not licensed. That is the hardest part to buy.
- **Product judgment.** The decision to remove the "Today's meals" card and the "Explore" grid because they duplicated the bottom navigation is a product instinct, not a technical one.
- **Execution.** The prototype exists and runs. This brief is describing software, not a concept.
- **Willingness to state limits.** The roadmap names what is unvalidated (the dosha instrument has no psychometrics; BMI cut-offs are not South-Asian-adjusted) instead of overclaiming.

What is missing today: a clinical co-founder or advisor, and a commercial co-founder for distribution. That is a gap, not a secret.

### 6. Can the founder build it?

Evidence: the repository. A working React/TypeScript application with a domain engine, a prompt scheduler, persistent state, a design system and documentation — built end-to-end. `docs/ARCHITECTURE.md` describes the module boundaries.

What one person cannot do alone: clinical validation, practitioner network, payments infrastructure, enterprise sales. The plan hires for exactly those, in that order.

### 7. Who pays?

Four segments, ordered by evidence strength:

1. **Diaspora consumers (UK/US/Gulf)** — £5–9/month. Highest willingness to pay for culturally specific prevention. Validated next, not yet validated.
2. **Employers** — £1.5–4 per employee per month as a wellbeing benefit. Strong fit: profession-specific prompts map directly to workforce segments (desk engineers, shift healthcare staff, site workers).
3. **Indian consumers** — ₹299–499/month, the volume play, requires a lower-cost content and support model.
4. **Insurers (later)** — prevention and BMI trajectory data are actuarially interesting, but only after outcomes evidence exists.

Honest status: pricing is modelled, not proven. There are currently **zero paying customers**. The first milestone is ten paying users and a 30-day retention number — not a signed contract.

### 8. How will customers be acquired?

1. **Ayurvedic practitioner referral.** Practitioners have patients who ask "what do I do between visits?". Jaya is the between-visits layer. Revenue share, no ad spend.
2. **Diaspora community channels.** Community WhatsApp groups, temple and cultural associations, regional-language content creators. Low CAC, high trust.
3. **Employer pilots.** One 200-person desk-workforce pilot gives both revenue and a retention dataset. Cold outbound plus a wellbeing-benefit broker.
4. **Content SEO** — "Ayurvedic routine for night-shift workers", "Kapha breakfast for desk jobs". Long-tail, profession × dosha.

Weakness to fix: no acquisition channel has been tested. Any number here is a hypothesis.

### 9. How does it create UK jobs?

| Year | Roles | Headcount |
|---|---|---|
| 1 | founder engineering, clinical safety reviewer (part-time), content/practitioner lead | 3–5 |
| 2 | + product designer, growth, customer success, second engineer | 8–13 |
| 3 | + clinical operations, data/ML engineer, partnerships, support | 13–23 |

Salary assumption at UK market rates (~£55–75k technical, ~£45k ops) puts year-3 payroll at roughly £0.9–1.4m, which is what the seed allocation is sized against. Job creation is a consequence of the hiring plan, not the pitch.

### 10. How does it scale internationally?

The architecture scales because the content is data (`lib/data.ts`, `lib/professions.ts`) and the engine is generic. New geography = new region food table, new holiday calendar, new profession seeds. No code fork.

Sequence: UK diaspora → Canada/Australia/Gulf (same diaspora, same language) → India volume → US. Each step needs localisation of food and profession data, not re-engineering.

### 11. Is it medical advice?

No, and the boundary is enforced structurally: **every recommendation is an authored static string**, never model-generated. There is no runtime LLM, so there is no path for a hallucinated diagnosis. Remedies carry precautions and are scoped to mild complaints. Asanas ship contraindications. Anything persistent, severe or worsening is routed to a clinician in the copy itself. See `docs/AI-SAFETY.md`.

Before any generative expansion: output classifier, emergency detection, clinician-reviewed refusal templates, red-team suite in CI, kill switch.

### 12. How is health data protected?

Shipped architecture is local-first: **no health data leaves the device**, so there is no controller, no processor, no breach surface and no secondary use. No analytics SDK, no third-party script origin in the client bundle.

If hosted sync is introduced, all ten controls in `docs/PRIVACY.md` must land first: explicit Article 9 consent, DPIA, UK/EU residency, TLS 1.3 + AES-256, DSAR and one-tap erasure, retention schedule, processor DPAs, 72-hour breach runbook, DPO where applicable, and a plain-English notice at onboarding.

### 13. Is the AI safe?

Today: there is almost no AI to be unsafe. Personalisation is deterministic selection from an authored corpus. That is a deliberate safety choice, and it is the honest answer.

The assistant is v2.0, gated behind: retrieval-only grounding, a fail-closed output classifier, red-flag detection with emergency routing, canned refusals written with clinical review, transcript sampling, a versioned evaluation set in CI, and a server-side kill switch.

### 14. Is the business genuinely new?

The **combination** is new, and the prototype demonstrates it. The individual ingredients are old:
- Ayurveda: ancient
- dosha quizzes: commoditised
- nudging: commoditised
- profession-based scheduling: rare but not novel

What does not exist in market: a proactive, constitution-filtered, profession-timed companion whose confirmations feed tomorrow's plan. That is the claim, and it is testable by searching the app stores.

Honest risk: "new combination" is a weaker moat than "new technology". The durable advantage has to become the practitioner network and the behavioural dataset, not the interaction pattern.

### 15. Did the founder create this?

Yes — concept, domain model, architecture, implementation and documentation. The repository history shows the work: the Ayurvedic knowledge base, the profession model, the prompt engine and the UI were authored here. The `legacy-python-cli/` directory preserves the original command-line prototype that preceded the web app, as provenance.

Evidence the team can check in ten minutes:
1. Run it — landing → demo profile → dashboard → profile (BMI) → guide → diet check-in → goals → good night.
2. Read `docs/ARCHITECTURE.md` and `src/lib/smartEngine.ts`.
3. Ask for a live change to the prompt schedule and watch it ship.

---

## 5. Risks, stated plainly

| Risk | Severity | Mitigation |
|---|---|---|
| Adherence collapses after novelty | high | prompt content rotates daily; a skip is data, not failure; the evening loop gives a reason to return |
| Ayurveda perceived as pseudoscience | high | stay inside wellness framing; practitioner review; publish limits; never claim treatment |
| Incumbent clones the loop | medium | depth of content + practitioner network + behavioural data, not UI |
| Regulatory drift toward medical device | medium | MHRA classification review before v2; keep diagnosis out of scope |
| BMI is a blunt instrument | medium | ethnicity-adjusted bands on the roadmap; framed as screening, never diagnosis |
| Single-founder execution risk | high | clinical advisor first hire; narrow wedge before expansion |

## 6. The ask

Pre-seed / innovation grant to fund three things, in order:

1. **Prove the loop** — ten paying users, 30-day retention, prompt confirmation rate. (3 months)
2. **Clinical safety scaffolding** — a UK-registered clinical advisor and a written safety case. (parallel)
3. **Employer pilot** — one 200-person desk workforce, with a retention dataset. (6 months)

Everything else — sync, assistant, insurers — follows evidence, not enthusiasm.

---

*Jaya offers wellness guidance inspired by Ayurvedic tradition. It is not a medical device, does not diagnose or treat any condition, and does not replace a qualified physician.*
