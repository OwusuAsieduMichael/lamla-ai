-- Students may read chunks that belong to approved, granted resources.
-- Writes stay staff-only. No academic rows are inserted.

create policy resource_chunks_select_authorized
  on public.resource_chunks for select
  to authenticated
  using (
    public.is_staff()
    or exists (
      select 1
      from public.academic_resources as resource
      where resource.id = resource_chunks.resource_id
        and resource.status = 'approved'
        and resource.authorization_status = 'granted'
    )
  );

create or replace function public.match_resource_chunks(
  query_embedding vector(1536),
  match_count integer default 5
)
returns table (
  id uuid,
  content text,
  resource_id uuid,
  importance_score numeric,
  similarity double precision
)
language sql
stable
as $$
  select
    chunk.id,
    chunk.content,
    chunk.resource_id,
    chunk.importance_score,
    (1 - (chunk.embedding <=> query_embedding))::double precision as similarity
  from public.resource_chunks as chunk
  where chunk.embedding is not null
  order by chunk.embedding <=> query_embedding
  limit greatest(coalesce(match_count, 5), 1);
$$;

grant execute on function public.match_resource_chunks(vector, integer)
to authenticated, service_role;

comment on function public.match_resource_chunks(vector, integer) is
  'Vector match over stored embeddings. Returns no rows when embeddings are absent. RLS still applies.';

comment on table public.resource_chunks is
  'Extracted text chunks. Students see only chunks from approved, granted sources.';
