/**
 * Organizational scope of the first pilot.
 * IDs match supabase/migrations/20260905120400_seed_pilot_organization.sql.
 * Course lists and academic resources belong to later phases.
 */
export const pilotScope = {
  institution: "KNUST",
  college: "College of Science",
  faculty: "Faculty of Physical and Computational Sciences",
  department: "Department of Computer Science",
  programme: "BSc Computer Science",
} as const;

export const pilotOrganizationIds = {
  institutionId: "00000000-0000-4000-8000-000000000001",
  collegeId: "00000000-0000-4000-8000-000000000002",
  facultyId: "00000000-0000-4000-8000-000000000003",
  departmentId: "00000000-0000-4000-8000-000000000004",
  programmeId: "00000000-0000-4000-8000-000000000005",
} as const;

export type PilotScope = typeof pilotScope;
export type PilotOrganizationIds = typeof pilotOrganizationIds;
