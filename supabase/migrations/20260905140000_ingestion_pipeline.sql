-- Phase 3 — ingestion jobs and extracted chunks.
-- Embeddings and retrieval indexes belong to Phase 4.
-- This migration does not insert academic files or course rows.

create type public.ingestion_job_status as enum (
  'queued',
  'running',
  'succeeded',
  'failed',
  'skipped'
);

create table public.ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  manifest_id text,
  resource_id uuid references public.academic_resources (id) on delete set null,
  status public.ingestion_job_status not null default 'queued',
  skip_reason text,
  error_message text,
  mime_type text,
  extracted_char_count integer,
  chunk_count integer,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ingestion_jobs_counts_nonneg check (
    (extracted_char_count is null or extracted_char_count >= 0)
    and (chunk_count is null or chunk_count >= 0)
  )
);

create index ingestion_jobs_manifest_id_idx on public.ingestion_jobs (manifest_id);
create index ingestion_jobs_resource_id_idx on public.ingestion_jobs (resource_id);
create index ingestion_jobs_status_idx on public.ingestion_jobs (status);

create table public.resource_chunks (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.ingestion_jobs (id) on delete cascade,
  resource_id uuid references public.academic_resources (id) on delete set null,
  chunk_index integer not null,
  content text not null,
  token_count integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resource_chunks_content_not_blank check (char_length(btrim(content)) > 0),
  constraint resource_chunks_index_nonneg check (chunk_index >= 0),
  constraint resource_chunks_token_count_pos check (token_count is null or token_count > 0),
  constraint resource_chunks_job_index_unique unique (job_id, chunk_index)
);

create index resource_chunks_resource_id_idx on public.resource_chunks (resource_id);

create trigger ingestion_jobs_set_updated_at
  before update on public.ingestion_jobs
  for each row execute function public.set_updated_at();

create trigger resource_chunks_set_updated_at
  before update on public.resource_chunks
  for each row execute function public.set_updated_at();

alter table public.ingestion_jobs enable row level security;
alter table public.resource_chunks enable row level security;

create policy ingestion_jobs_staff_all
  on public.ingestion_jobs for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy resource_chunks_staff_all
  on public.resource_chunks for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select, insert, update, delete on
  public.ingestion_jobs,
  public.resource_chunks
to authenticated, service_role;

comment on table public.ingestion_jobs is
  'Document ingestion runs. Empty until an authorized incoming file exists.';
comment on table public.resource_chunks is
  'Extracted text chunks. No embeddings in Phase 3. Not student-visible yet.';
