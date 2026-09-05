-- Phase 1 — Row Level Security.
-- User-facing clients use the publishable key and must not bypass these policies.
-- The service-role key bypasses RLS and is reserved for trusted server jobs.

alter table public.institutions enable row level security;
alter table public.colleges enable row level security;
alter table public.faculties enable row level security;
alter table public.departments enable row level security;
alter table public.programmes enable row level security;
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.topics enable row level security;
alter table public.concepts enable row level security;
alter table public.academic_resources enable row level security;
alter table public.past_questions enable row level security;
alter table public.past_question_items enable row level security;

-- Organization is public catalog data for the pilot, not student records.
create policy institutions_select_all
  on public.institutions for select
  using (true);

create policy colleges_select_all
  on public.colleges for select
  using (true);

create policy faculties_select_all
  on public.faculties for select
  using (true);

create policy departments_select_all
  on public.departments for select
  using (true);

create policy programmes_select_all
  on public.programmes for select
  using (true);

create policy institutions_staff_write
  on public.institutions for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy colleges_staff_write
  on public.colleges for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy faculties_staff_write
  on public.faculties for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy departments_staff_write
  on public.departments for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy programmes_staff_write
  on public.programmes for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Profiles
create policy profiles_select_own_or_staff
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_staff());

create policy profiles_update_own_or_staff
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_staff())
  with check (id = auth.uid() or public.is_staff());

-- Academic catalog: readable once a user is signed in.
-- Writes stay with staff. No course rows exist yet.
create policy courses_select_authenticated
  on public.courses for select
  to authenticated
  using (true);

create policy courses_staff_write
  on public.courses for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy topics_select_authenticated
  on public.topics for select
  to authenticated
  using (true);

create policy topics_staff_write
  on public.topics for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy concepts_select_authenticated
  on public.concepts for select
  to authenticated
  using (true);

create policy concepts_staff_write
  on public.concepts for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Resources and past questions: students see approved rows only.
create policy academic_resources_select_approved_or_staff
  on public.academic_resources for select
  to authenticated
  using (status = 'approved' or public.is_staff());

create policy academic_resources_staff_write
  on public.academic_resources for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy past_questions_select_approved_or_staff
  on public.past_questions for select
  to authenticated
  using (status = 'approved' or public.is_staff());

create policy past_questions_staff_write
  on public.past_questions for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy past_question_items_select_via_parent
  on public.past_question_items for select
  to authenticated
  using (
    public.is_staff()
    or exists (
      select 1
      from public.past_questions as paper
      where paper.id = past_question_id
        and paper.status = 'approved'
    )
  );

create policy past_question_items_staff_write
  on public.past_question_items for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant execute on function public.is_staff() to anon, authenticated, service_role;

grant usage on schema public to anon, authenticated, service_role;

grant select on
  public.institutions,
  public.colleges,
  public.faculties,
  public.departments,
  public.programmes
to anon, authenticated;

grant select, insert, update, delete on
  public.institutions,
  public.colleges,
  public.faculties,
  public.departments,
  public.programmes,
  public.profiles,
  public.courses,
  public.topics,
  public.concepts,
  public.academic_resources,
  public.past_questions,
  public.past_question_items
to authenticated, service_role;

grant select on public.profiles to authenticated, service_role;
grant select on
  public.courses,
  public.topics,
  public.concepts,
  public.academic_resources,
  public.past_questions,
  public.past_question_items
to authenticated;
