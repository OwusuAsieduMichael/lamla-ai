-- Phase 2 — collection authorization on academic resources.
-- A student-visible resource must be both approved and authorization-granted.
-- This migration does not insert courses or resource files.

create type public.authorization_status as enum ('pending', 'granted', 'denied');

alter table public.academic_resources
  add column license text,
  add column authorization_status public.authorization_status not null default 'pending',
  add column authorized_by text,
  add column authorized_at timestamptz,
  add column authorization_note text,
  add column manifest_id text unique;

alter table public.academic_resources
  add constraint academic_resources_granted_requires_party
  check (
    authorization_status <> 'granted'
    or (
      authorized_by is not null
      and char_length(btrim(authorized_by)) > 0
      and authorized_at is not null
    )
  );

drop policy academic_resources_select_approved_or_staff
  on public.academic_resources;

create policy academic_resources_select_approved_or_staff
  on public.academic_resources for select
  to authenticated
  using (
    public.is_staff()
    or (
      status = 'approved'
      and authorization_status = 'granted'
    )
  );

comment on column public.academic_resources.manifest_id is
  'Optional link to a repo collection manifest. Not a course catalog key.';
comment on column public.academic_resources.authorization_status is
  'Legal/academic permission to use the source. Independent of draft/approved workflow.';
