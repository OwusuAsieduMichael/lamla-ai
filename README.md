# LAMLA AI

LAMLA AI is a student-centered academic intelligence web application.

The current pilot is limited to KNUST, College of Science, Faculty of Physical and Computational Sciences, Department of Computer Science, BSc Computer Science.

This repository is in **Phase 16 — KNUST web pilot**. New visitors see a three-tab welcome, then sign-up or sign-in, then the landing page. The student shell includes Dashboard, Workspace, Courses, Resources, Questions, Learn, Saved, History, and Profile. The academic corpus is empty, so the app refuses instead of inventing KNUST material.

## What is in the tree

- Next.js App Router foundation and KNUST-aligned visual tokens
- Academic schema, RLS, authorization, ingestion, retrieval, and learning tables
- Manifest contracts and empty collection folders
- Grounded Ask that retrieves authorized chunks before it may call a provider
- Vision, voice, learning, and past-question surfaces that stay empty without sources
- Student sign-in, sign-up, dashboard, workspace, catalog, saved, history, and profile pages (Supabase Auth; no invented KNUST identity)
- Architecture, security, deployment, pitch, and expansion documentation

## Requirements

- Node.js 20 or later
- npm

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Supabase and AI provider values are optional for viewing the workspaces. They are required before applying migrations or generating an answer from retrieved sources.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Vitest |
| `npm run evaluate` | Grounding evaluation |
| `npm run test:e2e` | Playwright |
| `npm run check:env` | Report whether known env names are set (values are not printed) |
| `npm run validate:manifests` | Validate collection manifests (zero files is valid) |
| `npm run ingest` | Report whether any authorized files are eligible to ingest |

## Documentation

- [Architecture](docs/architecture.md)
- [Data architecture](docs/data-architecture.md)
- [Dataset engineering](docs/dataset-engineering.md)
- [Document ingestion](docs/ingestion.md)
- [Security baseline](docs/security.md)
- [Deployment](docs/deployment.md)
- [Pitch notes](docs/pitch.md)
- [KNUST expansion](docs/expansion.md)

## Development rule

Do not invent KNUST course data, lecture notes, or placeholder answers. Empty authorized tables and a refusal are the correct state until real sources are granted.
