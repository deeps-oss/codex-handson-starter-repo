# HistoryLens

HistoryLens is a Next.js (App Router) MVP that helps secondary school students explore history through guided AI-generated visuals, concise explanations, and quick knowledge checks. Teacher controls keep activities classroom-safe.

## Features
- **Landing + Units**: Choose from seeded units (Ancient Civilisations, Industrial Revolution, Cold War & Decolonisation). Timelines list key events.
- **Explore view** per event:
  - Scene Builder with guided fields (location, year, people, objects, mood, art style) and 3 generated variations.
  - 200–300 word tutor summary and cause/effect bullets.
  - Historical accuracy check for a student scene description.
  - Quick checks (mix of MCQ/short answer) with revealable answers.
  - Report image button (stored in-memory for now).
- **Teacher view** (passcode): enable/disable units/events, set conservative vs creative strictness, and classroom-safe flag.
- **Safety**: prompt guardrails to avoid gore, hate, extremist or real contemporary faces; sanitized input; system prefix for accuracy/safety; friendly fallbacks when blocked.

## Tech stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS for UI
- OpenAI SDK for image/text (uses `OPENAI_API_KEY`)
- Local JSON content seeding (`content/units.json`)

## Getting started
1. `cd frontend`
2. `cp .env.example .env` and fill values:
   - `OPENAI_API_KEY` – OpenAI key for images/text (placeholder images are used if unset).
   - `NEXT_PUBLIC_TEACHER_PASSCODE` – passcode to toggle Teacher view.
3. Install dependencies: `npm install`
4. Run dev server: `npm run dev` (visit http://localhost:3000)
5. Production build: `npm run build && npm start`

## Prompt construction & safety
- All scene prompts are sanitized to strip risky terms and checked against banned patterns (violence, weapons, hate, living political figures). Blocked requests return a friendly message and suggestions.
- The server prepends a safety + historical accuracy prefix and respects Teacher strictness (conservative = closer to facts; creative = gentler imaginative visuals).
- The tutor endpoint compares student descriptions with event facts for “Historical accuracy check.”
- Classroom-safe flag is visible in the footer; reporting an image records an in-memory entry.

## Seeded units & sample prompts
Seed data lives in `content/units.json` with summaries, knownFacts, and scene defaults.

Sample prompts used by the Scene Builder (auto-prepended with the safety prefix):
1. **Great Pyramid construction** – `location: Nile-side construction site, year: 2560 BCE, people: team of Egyptian builders and overseers, objects: limestone blocks, wooden sleds, ramps, mood: busy but orderly, style: watercolour`
2. **Cotton mill workday** – `location: brick textile mill interior, year: 1785, people: mill workers and an overseer, objects: spinning mules, looms, coal furnace, mood: noisy and focused, style: comic`
3. **Berlin Airlift** – `location: Tempelhof Airport runway, year: 1949, people: pilots, Berlin families, ground crew, objects: cargo planes, parachutes, supply crates, mood: hopeful under tension, style: watercolour`

## File map (frontend)
- `app/page.tsx` – landing + unit selection
- `app/unit/[unitId]/page.tsx` – timeline per unit
- `app/unit/[unitId]/[eventId]/page.tsx` – Explore view tabs
- `app/api/generate-image` – guarded image generation
- `app/api/tutor` – tutor summaries, vocab, quiz, accuracy check
- `app/api/report` – in-memory report log
- `content/units.json` – seeded units/events
- `components/*` – UI pieces (tabs, scene builder, brief, checks)
