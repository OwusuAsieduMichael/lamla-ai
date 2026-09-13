# Supabase

The hosted schema covers organization, resources, ingestion, retrieval, and learning events.

- Application clients live in `src/lib/supabase`.
- Typed contracts live in `src/types/database.ts`.
- Domain validation lives in `src/lib/academic`, `src/lib/dataset`, and `src/lib/ingestion`.
- SQL migrations live in `migrations/`.

Apply migrations in filename order after the hosted project exists. Do not paste only the latest file into the SQL editor: `20260913190000_student_workspace.sql` needs `public.profiles` from `20260905120100_academic_schema.sql`.

1. `20260905120000_enable_extensions.sql`
2. `20260905120100_academic_schema.sql`
3. `20260905120200_row_level_security.sql`
4. `20260905120300_storage.sql`
5. `20260905120400_seed_pilot_organization.sql`
6. `20260905130000_resource_authorization.sql`
7. `20260905140000_ingestion_pipeline.sql`
8. `20260905150000_retrieval_and_learning.sql`
9. `20260905160000_authorized_chunk_read.sql`
10. `20260913190000_student_workspace.sql`

Do not insert Computer Science courses or academic files here. Retrieval and Ask stay empty until a granted authorized source exists.
