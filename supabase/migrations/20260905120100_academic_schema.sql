-- Phase 1 — academic data architecture.
-- Defines organizational, identity, course, resource, and past-question tables.
-- Does not insert courses, topics, concepts, resources, or past questions.

create type public.user_role as enum ('student', 'maintainer', 'admin');

create type public.semester as enum ('first', 'second');

create type public.resource_kind as enum (
  'lecture_note',
  'slide',
  'textbook_extract',
  'past_question_paper',
  'marking_scheme',
  'lab_manual',
  'assignment',
  'other'
);

create type public.resource_status as enum ('draft', 'approved', 'archived');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Organization
-- ---------------------------------------------------------------------------

create table public.institutions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint institutions_slug_format check (slug ~ '^[a-z0-9-]+$')
);

create table public.colleges (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions (id) on delete restrict,
  slug text not null,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint colleges_slug_format check (slug ~ '^[a-z0-9-]+$'),
  constraint colleges_institution_slug_unique unique (institution_id, slug)
);

create table public.faculties (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges (id) on delete restrict,
  slug text not null,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint faculties_slug_format check (slug ~ '^[a-z0-9-]+$'),
  constraint faculties_college_slug_unique unique (college_id, slug)
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid not null references public.faculties (id) on delete restrict,
  slug text not null,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint departments_slug_format check (slug ~ '^[a-z0-9-]+$'),
  constraint departments_faculty_slug_unique unique (faculty_id, slug)
);

create table public.programmes (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments (id) on delete restrict,
  slug text not null,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint programmes_slug_format check (slug ~ '^[a-z0-9-]+$'),
  constraint programmes_department_slug_unique unique (department_id, slug)
);

-- ---------------------------------------------------------------------------
-- Identity
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role public.user_role not null default 'student',
  programme_id uuid references public.programmes (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_programme_id_idx on public.profiles (programme_id);
create index profiles_role_idx on public.profiles (role);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select role in ('admin', 'maintainer')
      from public.profiles
      where id = auth.uid()
    ),
    false
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    'student'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
as $$
begin
  if not public.is_staff() then
    if new.role is distinct from old.role then
      raise exception 'profiles.role can only be changed by staff';
    end if;

    if new.programme_id is distinct from old.programme_id then
      raise exception 'profiles.programme_id can only be changed by staff';
    end if;

    new.id = old.id;
  end if;

  return new;
end;
$$;

create trigger profiles_protect_privileges
  before update on public.profiles
  for each row execute function public.protect_profile_privileges();

-- ---------------------------------------------------------------------------
-- Academic structure (empty until later phases supply authorized data)
-- ---------------------------------------------------------------------------

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.programmes (id) on delete restrict,
  code text not null,
  title text not null,
  year_level smallint not null,
  semester public.semester not null,
  credits numeric(3, 1),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint courses_code_not_blank check (char_length(btrim(code)) > 0),
  constraint courses_title_not_blank check (char_length(btrim(title)) > 0),
  constraint courses_year_level_range check (year_level >= 100 and year_level < 1000),
  constraint courses_programme_code_unique unique (programme_id, code)
);

create index courses_programme_id_idx on public.courses (programme_id);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  parent_id uuid references public.topics (id) on delete set null,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint topics_title_not_blank check (char_length(btrim(title)) > 0),
  constraint topics_id_course_unique unique (id, course_id)
);

create index topics_course_id_idx on public.topics (course_id);
create index topics_parent_id_idx on public.topics (parent_id);

create table public.concepts (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  topic_id uuid not null references public.topics (id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint concepts_title_not_blank check (char_length(btrim(title)) > 0),
  constraint concepts_id_topic_unique unique (id, topic_id),
  constraint concepts_id_course_unique unique (id, course_id),
  constraint concepts_topic_course_fk
    foreign key (topic_id, course_id) references public.topics (id, course_id)
);

create index concepts_course_id_idx on public.concepts (course_id);
create index concepts_topic_id_idx on public.concepts (topic_id);

-- ---------------------------------------------------------------------------
-- Authorized resources and structured past questions
-- ---------------------------------------------------------------------------

create table public.academic_resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete restrict,
  topic_id uuid,
  concept_id uuid,
  kind public.resource_kind not null,
  status public.resource_status not null default 'draft',
  title text not null,
  description text,
  source_attribution text not null,
  academic_year text,
  storage_bucket text not null default 'academic-resources',
  storage_path text,
  mime_type text,
  byte_size bigint,
  checksum_sha256 text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint academic_resources_title_not_blank check (char_length(btrim(title)) > 0),
  constraint academic_resources_source_not_blank check (char_length(btrim(source_attribution)) > 0),
  constraint academic_resources_byte_size_nonneg check (byte_size is null or byte_size >= 0),
  constraint academic_resources_topic_course_fk
    foreign key (topic_id, course_id) references public.topics (id, course_id),
  constraint academic_resources_concept_course_fk
    foreign key (concept_id, course_id) references public.concepts (id, course_id)
);

create index academic_resources_course_id_idx on public.academic_resources (course_id);
create index academic_resources_topic_id_idx on public.academic_resources (topic_id);
create index academic_resources_status_idx on public.academic_resources (status);

create table public.past_questions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete restrict,
  resource_id uuid references public.academic_resources (id) on delete set null,
  status public.resource_status not null default 'draft',
  title text not null,
  academic_year text,
  semester public.semester,
  source_attribution text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint past_questions_title_not_blank check (char_length(btrim(title)) > 0),
  constraint past_questions_source_not_blank check (char_length(btrim(source_attribution)) > 0)
);

create index past_questions_course_id_idx on public.past_questions (course_id);

create table public.past_question_items (
  id uuid primary key default gen_random_uuid(),
  past_question_id uuid not null references public.past_questions (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete restrict,
  topic_id uuid,
  concept_id uuid,
  prompt_text text,
  marks numeric(6, 2),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint past_question_items_marks_nonneg check (marks is null or marks >= 0),
  constraint past_question_items_topic_course_fk
    foreign key (topic_id, course_id) references public.topics (id, course_id),
  constraint past_question_items_concept_course_fk
    foreign key (concept_id, course_id) references public.concepts (id, course_id)
);

create index past_question_items_past_question_id_idx
  on public.past_question_items (past_question_id);
create index past_question_items_course_id_idx
  on public.past_question_items (course_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create trigger institutions_set_updated_at
  before update on public.institutions
  for each row execute function public.set_updated_at();

create trigger colleges_set_updated_at
  before update on public.colleges
  for each row execute function public.set_updated_at();

create trigger faculties_set_updated_at
  before update on public.faculties
  for each row execute function public.set_updated_at();

create trigger departments_set_updated_at
  before update on public.departments
  for each row execute function public.set_updated_at();

create trigger programmes_set_updated_at
  before update on public.programmes
  for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

create trigger topics_set_updated_at
  before update on public.topics
  for each row execute function public.set_updated_at();

create trigger concepts_set_updated_at
  before update on public.concepts
  for each row execute function public.set_updated_at();

create trigger academic_resources_set_updated_at
  before update on public.academic_resources
  for each row execute function public.set_updated_at();

create trigger past_questions_set_updated_at
  before update on public.past_questions
  for each row execute function public.set_updated_at();

create trigger past_question_items_set_updated_at
  before update on public.past_question_items
  for each row execute function public.set_updated_at();

comment on table public.institutions is
  'Root academic organization. Pilot seed is KNUST only.';
comment on table public.courses is
  'Programme courses. Rows are added in later phases from authorized catalogs.';
comment on table public.academic_resources is
  'Metadata for authorized academic files. No resource rows are seeded in Phase 1.';
comment on table public.past_questions is
  'Structured past-question papers. Item transcription belongs to later phases.';
