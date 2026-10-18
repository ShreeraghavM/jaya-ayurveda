# Privacy

## Principle

Jaya holds health-adjacent data — body measurements, constitution, mood, meals, sleep. The safest place for that data is the device it was entered on, and the safest retention policy is "we never received it".

So the client is **local-first by design**. There is no account server in the shipped path, no analytics SDK, no crash reporter, no third-party font or script origin.

## What is collected

| Data | Where it lives | Why |
|---|---|---|
| Name, email | `localStorage` | to name prompts and identify the local profile |
| Age, gender, weight, height | `localStorage` | BMI and healthy weight band |
| Dosha answers and composition | `localStorage` | personalisation of every recommendation |
| Profession, region | `localStorage` | meal/break/sleep timing, local food |
| Goals, streaks | `localStorage` | progress |
| Prompt answers, routine steps, meal confirmations | `localStorage` | adaptation and the nightly review |
| Water, mood, practice minutes | `localStorage` | progress charts |

## What is not collected

- No analytics or behavioural tracking
- No advertising identifiers
- No location permission or GPS — region is a dropdown the user picks
- No contact, calendar, photo or microphone access
- No health data transmitted to any server
- No cookies beyond the single local storage namespace

## Security posture

- Data never crosses the network in the shipped configuration, so there is no transport surface to intercept.
- The optional Hono sidecar (`server.tsx`) is a separate deployment concern; it holds a minimal `User` model and must be placed behind TLS and authentication before storing anything health-related. Do not enable it for personal health data without completing the controls below.
- No secrets in the client bundle. No API keys of any kind ship to the browser.

## User control

| Action | Effect |
|---|---|
| Profile → Sign out | clears the session; the profile remains on device until removed |
| Clearing site data / "Clear browsing data" | permanently deletes the profile and all logs |
| Editing body details | recalculates BMI immediately; nothing is versioned server-side |

## Alignment with UK GDPR / Data Protection Act 2018

The shipped architecture is the strongest form of data minimisation: **no personal data is processed by a controller at all**, because it never leaves the user's device.

If a hosted deployment is introduced later, the following must be completed **before** launch:

1. **Lawful basis** — explicit consent for health-adjacent data (Art. 9(2)(a)), separately captured, not bundled with terms.
2. **DPIA** — a Data Protection Impact Assessment, given systematic processing of health data.
3. **Data residency** — UK/EU hosting, or a documented transfer mechanism.
4. **Encryption** — TLS 1.3 in transit, AES-256 at rest, keys rotated.
5. **DSAR & erasure** — export and one-tap deletion, honoured within one month.
6. **Retention** — documented schedule with automatic purge.
7. **Processors** — a DPA with every vendor; no processor may train models on user data.
8. **Breach process** — 72-hour notification path and an incident runbook.
9. **DPO / representative** — appointed where Article 37 applies.
10. **Accessibility & special category notices** — plain-English notice surfaced at onboarding, not buried.

## Children

Not intended for users under 16. If a school deployment is ever considered, parental consent and a separate DPIA are prerequisites.

## Medical boundary

Jaya does not diagnose, treat, prescribe or triage. It offers traditional wellness guidance and explicitly routes anything severe, sudden or worsening to a clinician. See [`AI-SAFETY.md`](AI-SAFETY.md).
