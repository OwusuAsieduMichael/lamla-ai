# Deployment

Current phase: **Phase 16 — KNUST web pilot**

LAMLA is a Next.js App Router app intended for Vercel. This is a runbook, not a claim that a production corpus exists.

## Before a first deploy

1. Create a Supabase project.
2. Apply every file in `supabase/migrations` in filename order.
3. Set environment variables in Vercel from `.env.example` names only.
4. Leave `OPENAI_API_KEY` or `GEMINI_API_KEY` unset until authorized sources exist. The app must refuse rather than invent answers.
5. Never add `NEXT_PUBLIC_` to service-role or provider keys.

## Required public values

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Optional server values

- `SUPABASE_SERVICE_ROLE_KEY` — trusted jobs only, never user requests
- `OPENAI_API_KEY` / `GEMINI_API_KEY` — grounded generation after retrieval
- `AI_PROVIDER` — `openai` or `gemini`

## Checks

```bash
npm run typecheck
npm test
npm run evaluate
npm run build
```

Playwright (`npm run test:e2e`) needs a local browser install. HTTP checks of `/`, `/ask`, `/sources`, `/vision`, `/voice`, `/learn`, and `/questions` are enough when browsers are unavailable.

## Pitch constraint

Do not present an empty corpus as a working KNUST tutor. The honest demo is the refusal path plus the official organizational scope.
