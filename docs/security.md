# LAMLA AI Security Baseline

Current phase: **Phase 16 — KNUST web pilot**

This document records the security practices in force for the web pilot. Empty corpora and missing keys must produce a refusal, not a fabricated answer.

## In force now

### Secrets

- `.env.local` and other `.env*` files are ignored by Git, except `.env.example`.
- `.env.example` contains names only.
- `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, and any other secret must never use the `NEXT_PUBLIC_` prefix.
- Environment errors list missing variable names. They must never include values.

### Server and client boundaries

- Public Supabase values may be read in the browser.
- Service-role and AI provider keys may be imported only from server modules.
- `src/lib/supabase/admin.ts` and `src/lib/env/server.ts` use `server-only`.
- Do not create a browser Supabase client with the service-role key.

### Input validation

- External input should be parsed with Zod through `src/lib/validation/parse.ts`.
- Do not trust query params, form bodies, or uploaded metadata because they arrived from the UI.

### Data minimization

- The application collects no student academic records until a real feature needs them.
- The only seeded rows are the official KNUST Computer Science organization.
- Collect only what the current feature requires.

### Supabase and RLS

- User-facing queries should use the publishable-key clients so Row Level Security can apply.
- The admin client is reserved for trusted server jobs that cannot be expressed as the requesting user.
- RLS is enabled on every public academic table. Organization rows are readable; course and resource writes are staff-only; students see only `approved` resources that are also `authorization_status = granted`.
- Storage bucket `academic-resources` is private. Object read/write stays service-role-only until auth and ingestion exist.
- Incoming binaries are gitignored. Collection manifests cannot be marked granted without an authorizing party.
- Ingestion jobs stay staff-write. Students may read chunks only when the parent resource is approved and granted.
- Ask, vision, and voice actions use an in-memory rate limit.
- Middleware and `next.config.ts` set `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and a restrictive `Permissions-Policy`.
- See [data architecture](data-architecture.md) for the policy table.

## Still required before a public corpus

### Secure file uploads

- Authenticate the uploader.
- Restrict MIME types, file size, and storage paths.
- Scan or validate files before they enter an ingestion pipeline.

### Prompt injection and RAG

- Treat retrieved documents and user messages as untrusted text.
- Separate system instructions from student content and source excerpts.
- Cite sources rather than letting retrieved text silently become instructions.
- Keep `npm run evaluate` failing if an empty corpus produces an invented syllabus.

### Auth and session handling

- Root middleware refreshes a Supabase session only when public values are set.
- `/login` and `/signup` use the publishable-key server client. The service-role key is not used to create or look up accounts.
- New accounts receive a student profile through `handle_new_user`. Students can change only `display_name`. Role and programme stay staff-controlled.
- Sign-in, sign-up, and profile updates are rate-limited. Redirect targets must be same-origin paths.
- RLS still decides what a signed-in user can read.

### Production hardening

- Add Sentry, a hosted rate-limit store, and Vercel secret review before a public launch.

## Incident note

If a secret is committed, rotate it in the provider dashboard before any other cleanup. Do not rely on rewriting Git history as the only response.
