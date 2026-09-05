import { describe, expect, it } from "vitest";

import { parseInput } from "@/lib/validation/parse";

import { academicStorageBucket, academicTables } from "./tables";
import { courseSchema, institutionSchema } from "./schemas";

const validInstitution = {
  id: "00000000-0000-4000-8000-000000000001",
  slug: "knust",
  name: "KNUST",
};

describe("institutionSchema", () => {
  it("accepts the official pilot institution shape", () => {
    expect(parseInput(institutionSchema, validInstitution)).toEqual({
      success: true,
      data: validInstitution,
    });
  });

  it("rejects an uppercase slug", () => {
    const result = parseInput(institutionSchema, {
      ...validInstitution,
      slug: "KNUST",
    });

    expect(result.success).toBe(false);
  });
});

describe("courseSchema", () => {
  it("rejects a blank course code so invented empty rows cannot pass", () => {
    const result = parseInput(courseSchema, {
      id: "00000000-0000-4000-8000-000000000099",
      programmeId: "00000000-0000-4000-8000-000000000005",
      code: "   ",
      title: "Untitled",
      yearLevel: 100,
      semester: "first",
      credits: null,
      description: null,
    });

    expect(result.success).toBe(false);
  });
});

describe("academicTables", () => {
  it("lists the public tables and storage bucket", () => {
    expect(academicTables).toContain("programmes");
    expect(academicTables).toContain("academic_resources");
    expect(academicTables).toContain("resource_chunks");
    expect(academicTables).toContain("learning_events");
    expect(academicTables).not.toContain("resource_embeddings");
    expect(academicStorageBucket).toBe("academic-resources");
  });
});
