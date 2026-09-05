-- Phase 1 — private academic file bucket.
-- Objects are not publicly listed. Authenticated download policies belong to
-- later phases, after auth and authorized ingestion exist.
-- Until then, only the service-role key can read or write objects.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'academic-resources',
  'academic-resources',
  false,
  52428800,
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'text/plain'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
