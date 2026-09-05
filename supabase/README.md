# Supabase

The hosted schema covers organization, resources, ingestion, retrieval, and learning events.

- Application clients live in `src/lib/supabase`.
- Typed contracts live in `src/types/database.ts`.
- Domain validation lives in `src/lib/academic`, `src/lib/dataset`, and `src/lib/ingestion`.
- SQL migrations live in `migrations/`.

Apply migrations in filename order after the hosted project exists.

Do not insert Computer Science courses or academic files here. Retrieval and Ask stay empty until a granted authorized source exists.
