-- Phase 1 — official pilot organization only.
-- These rows match src/config/pilot.ts. Do not add courses, topics,
-- concepts, resources, or invented KNUST academic records here.

insert into public.institutions (id, slug, name)
values (
  '00000000-0000-4000-8000-000000000001',
  'knust',
  'KNUST'
);

insert into public.colleges (id, institution_id, slug, name)
values (
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000001',
  'college-of-science',
  'College of Science'
);

insert into public.faculties (id, college_id, slug, name)
values (
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000002',
  'faculty-of-physical-and-computational-sciences',
  'Faculty of Physical and Computational Sciences'
);

insert into public.departments (id, faculty_id, slug, name)
values (
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000003',
  'computer-science',
  'Department of Computer Science'
);

insert into public.programmes (id, department_id, slug, name)
values (
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000004',
  'bsc-computer-science',
  'BSc Computer Science'
);
