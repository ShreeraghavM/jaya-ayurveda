# 🌿 Jaya Ayurveda & Garry Tan's gstack

This repository is equipped with **Garry Tan's `gstack`** agile product workflows, 2026 AI-first engineering standards, and classical Ayurvedic intelligence from the Charaka Samhita.

---

## 🚀 Garry Tan's gstack Workflows

Use the `gstack` framework commands for structured product execution and venture building:

- **/office-hours**: Strategic ideation, constitution & lifestyle persona alignment, and core value proposition mapping.
- **/spec**: Define rigorous clinical and product specifications, edge-case handling, and Dinacharya user journeys.
- **/plan-ceo-review**: Evaluate product decisions from the perspective of an early-stage HealthTech investor and startup CEO.
- **/review**: Conduct strict code reviews against clean architectural boundaries, zero telemetry/private-by-default security, and static export constraints.
- **/qa**: Run automated and manual end-to-end tests across all user roles (Vata, Pitta, Kapha profiles, and professions).
- **/ship**: Verify clean build artifacts, Git commits, push to remote, and prepare production Netlify deployment.

---

## 🌟 What Jaya Ayurveda Solves: The Market-Ready Product

**Jaya Ayurveda** is a proactive Ayurvedic life companion that walks with you from sunrise to sunset, answering two critical market failures:

1. **The "Wellness Graveyard" Paradox**: Traditional fitness and diet apps demand constant manual logging, count calories without biological context, and induce cognitive burnout. Jaya inverts this: **it brings one calm, specific instruction at the right hour, asks a single question, and adapts tomorrow around your answer.** You do not navigate it. You confirm it.
2. **Clinical Authenticity Meets Modern Science**: Grounded in the classical foundational texts (*Charaka Samhita* and *Sushruta Samhita*), Jaya maps ancient wisdom (Prakriti, Vikriti, Agni, Shad Rasa, Dinacharya, Ritucharya) to modern chronobiology, WHO adult BMI metrics, and professional workplace rhythms (engineers, doctors, teachers, shift workers).

---

## 🛠️ Tech Stack & Key Architecture

- **Framework**: React 19 + TypeScript + Vite 7 (High-performance static SPA).
- **Styling**: Tailwind CSS v4 + Radix UI Primitives + Lucide React icons.
- **Visualizations**: Recharts for bio-metric telemetry, sun arc chronobiology, and habit compliance.
- **Design Tokens (Garry Tan gstack)**: Obsidian zinc backgrounds (`#08140c`, `#0a1a0a`), deep forest emeralds (`#10b981`), warm sattvic gold/amber glows (`#f59e0b`), DM Sans + JetBrains Mono typography with tabular figures (`tnum`).
- **Data Layer**: SSR-safe LocalStorage repository pattern (`src/lib/store.ts`, `src/lib/data.ts`) with zero third-party telemetry, 100% private in-browser persistence.
- **Target Deployment**: Netlify Static Hosting (`dist/` directory with `_redirects` and `netlify.toml`).

---

## 🛡️ Core Venture-Ready Features

1. **Constitution & Vikriti Assessment**:
   - Multi-step Prakriti diagnostic calculating fine-grained Vata / Pitta / Kapha composition percentages.
2. **Sun-Arc Dinacharya Companion**:
   - Real-time chronobiology mapping from Brahma Muhurta to Sandhya and deep sleep.
   - Proactive hourly check-in cards with 1-tap confirmation.
3. **Agni & Season-Adaptive Nutrition (Shad Rasa)**:
   - Dynamic meal recommendations balanced across the 6 Ayurvedic tastes (Sweet, Sour, Salty, Pungent, Bitter, Astringent).
4. **Interactive Pranayama & Yoga Studio**:
   - Live visual breathing spheres (Sheetali, Nadi Shodhana, Kapalabhati) with audio-visual cadence.
5. **Charaka Samhita Herbal Remedies Vault**:
   - Classical remedies with preparations, dosages, indications, and safety contraindications.
6. **Venture & HealthTech Grant Pitch Deck**:
   - Built-in interactive pitch deck for Ayush/HealthTech grant reviews, detailing TAM, unit economics, clinical validation, and roadmap.
7. **Instant Demo Switcher**:
   - Fast 1-click persona switching (Arjun · Pitta Engineer, Priya · Vata Educator, Rajesh · Kapha Executive).

---

## 💻 Build & Deploy Commands

```bash
# 1. Type check
npx tsc --noEmit

# 2. Build static production distribution for Netlify
npm run build

# 3. Test & review Git status
git status
git commit -am "feat: ..."
git push origin main
```
