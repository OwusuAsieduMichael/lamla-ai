-- Phases 4–10 — retrieval, importance, and learning storage.
-- No embeddings, course rows, or learning events are seeded.

alter table public.resource_chunks
  add column embedding vector(1536),
  add column importance_score numeric;

alter table public.resource_chunks
  add constraint resource_chunks_importance_range
  check (
    importance_score is null
    or (importance_score >= 0 and importance_score <= 1)
  );

create table public.learning_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  resource_id uuid references public.academic_resources (id) on delete set null,
  kind text not null,
  created_at timestamptz not null default now(),
  constraint learning_events_kind_not_blank check (char_length(btrim(kind)) > 0)
);

create index learning_events_profile_id_idx on public.learning_events (profile_id);

alter table public.learning_events enable row level security;

create policy learning_events_own_or_staff
  on public.learning_events for all
  to authenticated
  using (profile_id = auth.uid() or public.is_staff())
  with check (profile_id = auth.uid() or public.is_staff());

grant select, insert, update, delete on public.learning_events
to authenticated, service_role;

comment on column public.resource_chunks.embedding is
  'Optional pgvector embedding. Dimension is a starting convention and can change with the provider.';
comment on table public.learning_events is
  'Study interactions. Empty until students use authorized materials.';
