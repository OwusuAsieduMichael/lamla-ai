-- Phases 7, 10, and 12 — student workspace persistence.
-- Conversations, saved items, and query history are owner-scoped.
-- No academic rows or sample chats are seeded.
-- Requires earlier migrations: profiles is created in 20260905120100_academic_schema.sql.

do $$
begin
  if to_regclass('public.profiles') is null then
    raise exception
      'public.profiles does not exist. In the SQL editor, run every file in supabase/migrations in filename order, starting with 20260905120000_enable_extensions.sql and 20260905120100_academic_schema.sql. Then run this file last.';
  end if;
end
$$;

create type public.workspace_channel as enum ('text', 'voice', 'image');

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_title_not_blank check (char_length(btrim(title)) > 0)
);

create index conversations_profile_id_idx on public.conversations (profile_id);

create table public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role text not null,
  content text not null,
  channel public.workspace_channel not null default 'text',
  mode text not null default 'ask',
  refused boolean not null default false,
  reason text,
  created_at timestamptz not null default now(),
  constraint conversation_messages_role_check check (role in ('user', 'assistant')),
  constraint conversation_messages_content_not_blank check (char_length(btrim(content)) > 0),
  constraint conversation_messages_mode_not_blank check (char_length(btrim(mode)) > 0)
);

create index conversation_messages_conversation_id_idx
  on public.conversation_messages (conversation_id);
create index conversation_messages_profile_id_idx
  on public.conversation_messages (profile_id);

create table public.conversation_sources (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.conversation_messages (id) on delete cascade,
  chunk_id uuid,
  source_title text not null,
  source_attribution text not null,
  excerpt text,
  created_at timestamptz not null default now(),
  constraint conversation_sources_title_not_blank check (char_length(btrim(source_title)) > 0),
  constraint conversation_sources_attribution_not_blank
    check (char_length(btrim(source_attribution)) > 0)
);

create index conversation_sources_message_id_idx
  on public.conversation_sources (message_id);

create table public.saved_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null,
  resource_id uuid references public.academic_resources (id) on delete set null,
  conversation_message_id uuid references public.conversation_messages (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint saved_items_kind_check check (kind in ('response', 'resource')),
  constraint saved_items_title_not_blank check (char_length(btrim(title)) > 0),
  constraint saved_items_body_not_blank check (char_length(btrim(body)) > 0)
);

create index saved_items_profile_id_idx on public.saved_items (profile_id);

create table public.query_history (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  query text not null,
  channel public.workspace_channel not null default 'text',
  mode text not null default 'ask',
  refused boolean not null default false,
  created_at timestamptz not null default now(),
  constraint query_history_query_not_blank check (char_length(btrim(query)) > 0)
);

create index query_history_profile_id_idx on public.query_history (profile_id);
create index query_history_created_at_idx on public.query_history (created_at desc);

create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

alter table public.conversations enable row level security;
alter table public.conversation_messages enable row level security;
alter table public.conversation_sources enable row level security;
alter table public.saved_items enable row level security;
alter table public.query_history enable row level security;

create policy conversations_own
  on public.conversations for all
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy conversation_messages_own
  on public.conversation_messages for all
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy conversation_sources_via_message
  on public.conversation_sources for all
  to authenticated
  using (
    exists (
      select 1
      from public.conversation_messages as message
      where message.id = message_id
        and message.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.conversation_messages as message
      where message.id = message_id
        and message.profile_id = auth.uid()
    )
  );

create policy saved_items_own
  on public.saved_items for all
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy query_history_own
  on public.query_history for all
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

grant select, insert, update, delete on
  public.conversations,
  public.conversation_messages,
  public.conversation_sources,
  public.saved_items,
  public.query_history
to authenticated, service_role;

comment on table public.conversations is
  'Student threads. Empty until a signed-in student asks a question.';
comment on table public.saved_items is
  'Bookmarked responses or authorized resources. Owner-scoped.';
comment on table public.query_history is
  'Recent student queries. Does not store invented academic content.';
