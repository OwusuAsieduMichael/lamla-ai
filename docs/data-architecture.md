# LAMLA AI Data Architecture

Current phase: **Phase 16 — KNUST web pilot**

This document describes the academic schema. It is not a claim that course catalogs, resources, or retrieval already have KNUST content.

## What Phase 1 includes

- PostgreSQL extensions: `pgcrypto`, `vector`
- Organizational hierarchy for the KNUST Computer Science pilot
- Profile rows linked to Supabase Auth
- Empty academic tables for courses, topics, concepts, resources, and past questions
- Row Level Security on every public table
- A private `academic-resources` storage bucket
- Typed TypeScript contracts in `src/types/database.ts` and Zod schemas in `src/lib/academic`

## What Phase 1 does not include

- Course catalog rows
- Lecture notes, slides, or other academic files
- Past-question papers or transcribed items
- Chunk / embedding tables
- Ingestion, retrieval, or RAG
- Auth UI or a mounted session middleware
- Student dashboard screens

## Entity model

```text
institution
  └── college
        └── faculty
              └── department
                    └── programme
                          └── course
                                ├── topic
                                │     └── concept
                                ├── academic_resource
                                └── past_question
                                      └── past_question_item
```

`profiles` references `auth.users` and may later point at a `programme`.

A past-question paper may optionally point at an `academic_resources` row when the scanned file exists. Item-to-topic and item-to-concept links are nullable until authorized transcription exists.

## Pilot seed

The only inserted academic rows are the official pilot organization. IDs are stable and match `src/config/pilot.ts`:

| Entity | Name |
| --- | --- |
| Institution | KNUST |
| College | College of Science |
| Faculty | Faculty of Physical and Computational Sciences |
| Department | Department of Computer Science |
| Programme | BSc Computer Science |

Do not invent KNUST course codes, topics, or resource records in migrations.

## Integrity rules

- Topics and concepts stay inside one course through composite foreign keys.
- Resource and past-question rows require a non-empty `source_attribution`.
- Students cannot change their own `role` or `programme_id`.
- Approved academic content is the only student-visible resource state.

## RLS summary

| Data | Read | Write |
| --- | --- | --- |
| Organization | Anyone | Staff (`admin`, `maintainer`) |
| Profile | Owner or staff | Owner (display name) or staff |
| Courses, topics, concepts | Authenticated | Staff |
| Resources and past questions | Authenticated, `approved` only (staff see all) | Staff |
| Storage objects | Service role only until a later phase | Service role only until a later phase |

`public.is_staff()` is `security definer` so role checks do not recurse through profile RLS.

The service-role client still bypasses RLS. Do not use it for ordinary user requests.

## Applying migrations

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and set the public URL and publishable key.
3. Run the files in `supabase/migrations` against that project, in filename order.
4. When the project exists, generate types into `src/types/database.ts` instead of editing that file by hand.

## Retrieval and learning

- `resource_chunks.embedding` is optional `vector(1536)`.
- `resource_chunks.importance_score` is optional and must stay between 0 and 1.
- `learning_events` stores study interactions after a signed-in student uses authorized material.
- `match_resource_chunks` is available for vector search. It returns no rows when embeddings are absent. RLS still applies.

Students can select a chunk only when its parent resource is `approved` and `authorization_status = granted`. The publishable-key server client loads that set; the service-role client is not used for Ask.
