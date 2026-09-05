import { describe, expect, it } from "vitest";

import { parseInput } from "@/lib/validation/parse";
import { institutionSchema, programmeSchema } from "@/lib/academic/schemas";

import { pilotOrganizationIds, pilotScope } from "./pilot";

describe("pilotOrganizationIds", () => {
  it("matches the official KNUST Computer Science programme seed", () => {
    expect(
      parseInput(institutionSchema, {
        id: pilotOrganizationIds.institutionId,
        slug: "knust",
        name: pilotScope.institution,
      }).success,
    ).toBe(true);

    expect(
      parseInput(programmeSchema, {
        id: pilotOrganizationIds.programmeId,
        departmentId: pilotOrganizationIds.departmentId,
        slug: "bsc-computer-science",
        name: pilotScope.programme,
      }).success,
    ).toBe(true);
  });
});
