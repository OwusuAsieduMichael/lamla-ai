# LAMLA AI Architecture

Current phase: **Phase 16 — KNUST web pilot**

The workspace routes and academic engines are in the tree. They refuse when authorized sources or provider keys are missing. This is not a claim that a KNUST corpus already exists.

## Purpose

LAMLA AI is a student-centered academic intelligence platform. Intended behavior:

Student → academic context → course → topic → concept → authorized resources → past questions → explanation → learning recommendation

Text, voice, and image share one academic engine. Answers must be source-grounded. The system must not invent KNUST courses, lecture notes, or exam papers.

## Pilot scope

- Institution: KNUST
- College: College of Science
- Faculty: Faculty of Physical and Computational Sciences
- Department: Department of Computer Science
- Programme: BSc Computer Science

The only seeded academic rows are that official organizational path.

## Technology stack

| Area | Direction |
| --- | --- |
| Frontend | Next.js App Router, React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui conventions, Lucide icons |
| Data | Supabase, PostgreSQL, pgvector, Supabase Auth, Supabase Storage |
| Validation | Zod |
| Testing | Vitest, Playwright, `npm run evaluate` |
| Deployment | Vercel |
| AI | Provider abstraction for OpenAI or Gemini after retrieval |

## Folder structure

```text
src/
├── app/            Routes, server actions, global styles
├── components/     UI only — no secrets
├── config/         Product, navigation, pilot, and theme constants
├── hooks/          Client hooks
├── lib/            Env, academic, dataset, ingestion, retrieval, AI, security
└── types/          Shared TypeScript types, including Database

supabase/migrations   Academic schema, RLS, storage, org seed, retrieval
datasets/             Empty authorized collection folders
scripts/              Env, manifest, ingest, and evaluation scripts
docs/                 Architecture, data, security, deploy, pitch, expansion
```

## Architectural principles

1. Keep UI presentational. Logic, environment, and database clients live in `src/lib`.
2. Validate external input with Zod before it reaches application logic.
3. Do not invent academic data. Empty authorized tables are the valid state.
4. Retrieve first, then generate. Refuse when retrieval is empty or no provider key exists.
5. Treat student messages and source excerpts as untrusted data.
6. The service-role client is `server-only` and must not bypass RLS for ordinary user requests.

## Layer boundaries

| Layer | Location | Rule |
| --- | --- | --- |
| UI | `src/components`, `src/app` | Render state. Do not read secrets. |
| Configuration | `src/config` | Product and pilot constants only. |
| Environment | `src/lib/env` | Typed access. Fail without printing secret values. |
| Retrieval | `src/lib/retrieval` | Authorized chunks only. Empty corpus is valid. |
| AI | `src/lib/ai` | Grounded generation or explicit refusal. |
| Vision / voice | `src/lib/vision`, `src/lib/voice` | Same refusal rules as text. |
| Learning / questions | `src/lib/learning`, `src/lib/questions` | Rank or list only attributed records. |
| Security | `src/lib/security`, `src/middleware.ts` | Headers and in-memory rate limits. |

## Product routes

| Route | Mode |
| --- | --- |
| `/welcome` | Three-tab introduction before auth |
| `/` | Pilot home after welcome and sign-in |
| `/ask` | Text workspace |
| `/sources` | Authorized source library |
| `/vision` | Image inspection gate |
| `/voice` | Browser speech plus the same ask engine |
| `/learn` | Importance-ranked study guidance |
| `/questions` | Attributed past papers |
| `/login` | Student sign in |
| `/signup` | Student account creation |
| `/account` | Signed-in profile |

## Development phases

| Phase | Focus | Status |
| --- | --- | --- |
| 0 | Project foundation | Complete |
| 1 | Academic data architecture | Complete |
| 2 | Resource collection | Complete; corpus empty |
| 3 | Document ingestion | Complete; no files to ingest |
| 4 | Retrieval engine | Lexical rank plus authorized DB load |
| 5 | Academic importance | Scoring helper; stored scores optional |
| 6 | RAG and grounded AI | Refusal first; live provider only with a key |
| 7 | Text workspace | `/ask` |
| 8 | Computer vision | Gated; no invented readings |
| 9 | Voice interaction | Browser speech; server transcription optional |
| 10 | Learning engine | Recommendations from authorized chunks only |
| 11 | Past question intelligence | Attributed papers only |
| 12 | Web application UI | Pilot workspaces |
| 13 | Security hardening | Headers, rate limits, RLS |
| 14 | Testing and evaluation | Vitest plus grounding eval |
| 15 | Deployment and pitch | Docs only until a project is hosted |
| 16 | KNUST expansion | Documented; not executed |
