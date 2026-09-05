import { describe, expect, it } from "vitest";

import { pilotOrganizationIds } from "@/config/pilot";
import { parseInput } from "@/lib/validation/parse";

import { resourceManifestSchema } from "./schemas";

const pendingManifest = {
  schemaVersion: 1,
  id: "example-pending-manifest",
  title: "EXAMPLE fixture — not a KNUST academic record",
  kind: "lecture_note",
  sourceAttribution: "Example attribution for schema tests only",
  authorization: {
    status: "pending",
    authorizedBy: null,
    authorizedAt: null,
    note: null,
  },
  license: null,
  programmeId: pilotOrganizationIds.programmeId,
  courseCode: null,
  courseTitle: null,
  academicYear: null,
  semester: null,
  storage: {
    bucket: "academic-resources",
    relativePath: null,
    mimeType: null,
    checksumSha256: null,
  },
} as const;

describe("resourceManifestSchema", () => {
  it("accepts a pending collection record without inventing a course", () => {
    const result = parseInput(resourceManifestSchema, pendingManifest);

    expect(result.success).toBe(true);
  });

  it("rejects a granted record that has no authorizing party", () => {
    const result = parseInput(resourceManifestSchema, {
      ...pendingManifest,
      authorization: {
        status: "granted",
        authorizedBy: null,
        authorizedAt: "2026-09-05",
        note: null,
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects a missing source attribution", () => {
    const result = parseInput(resourceManifestSchema, {
      ...pendingManifest,
      sourceAttribution: "   ",
    });

    expect(result.success).toBe(false);
  });
});
