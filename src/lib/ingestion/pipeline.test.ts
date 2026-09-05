import { describe, expect, it } from "vitest";

import { pilotOrganizationIds } from "@/config/pilot";
import type { ResourceManifest } from "@/lib/dataset/schemas";

import { chunkText } from "./chunk";
import { decideIngestion } from "./gate";
import { runIngestionPipeline } from "./pipeline";

function exampleManifest(
  overrides: Partial<ResourceManifest> = {},
): ResourceManifest {
  return {
    schemaVersion: 1,
    id: "example-ingestion-fixture",
    title: "EXAMPLE fixture — not a KNUST academic record",
    kind: "lecture_note",
    sourceAttribution: "Example attribution for ingestion tests only",
    authorization: {
      status: "granted",
      authorizedBy: "Test authorizer",
      authorizedAt: "2026-09-05",
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
      mimeType: "text/plain",
      checksumSha256: null,
    },
    ...overrides,
  };
}

describe("decideIngestion", () => {
  it("skips manifests that are not authorization-granted", () => {
    const decision = decideIngestion(
      exampleManifest({
        authorization: {
          status: "pending",
          authorizedBy: null,
          authorizedAt: null,
          note: null,
        },
      }),
      { exists: true, mimeType: "text/plain", checksumSha256: null },
    );

    expect(decision).toEqual({
      ok: false,
      reason: "authorization_not_granted",
    });
  });

  it("defers images to the vision phase", () => {
    const decision = decideIngestion(exampleManifest(), {
      exists: true,
      mimeType: "image/png",
      checksumSha256: null,
    });

    expect(decision).toEqual({
      ok: false,
      reason: "mime_deferred_to_vision",
    });
  });
});

describe("chunkText", () => {
  it("splits long example text with overlap and does not invent course content", () => {
    const text = "alpha ".repeat(200);
    const chunks = chunkText(text, { maxChars: 80, overlapChars: 16 });

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0]?.content.includes("KNUST")).toBe(false);
    expect(chunks[1]?.index).toBe(1);
  });
});

describe("runIngestionPipeline", () => {
  it("chunks granted plain text", () => {
    const result = runIngestionPipeline(exampleManifest(), {
      exists: true,
      mimeType: "text/plain",
      checksumSha256: null,
      text: "EXAMPLE document used only to verify the ingestion pipeline.",
    });

    expect(result.status).toBe("succeeded");
    expect(result.chunks.length).toBeGreaterThan(0);
    expect(result.chunks[0]?.content).toContain("EXAMPLE document");
  });

  it("skips PDF until a parser is wired", () => {
    const result = runIngestionPipeline(exampleManifest(), {
      exists: true,
      mimeType: "application/pdf",
      checksumSha256: null,
      text: null,
    });

    expect(result.status).toBe("skipped");
    expect(result.skipReason).toBe("pdf_extractor_not_wired");
  });
});
