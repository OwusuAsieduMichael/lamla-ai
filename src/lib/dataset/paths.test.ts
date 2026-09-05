import { describe, expect, it } from "vitest";

import {
  assertSafeRelativePath,
  buildSuggestedStoragePath,
} from "./paths";

describe("buildSuggestedStoragePath", () => {
  it("keeps files unassigned when no authorized course code exists", () => {
    expect(
      buildSuggestedStoragePath({
        programmeSlug: "bsc-computer-science",
        courseCode: null,
        kind: "lecture_note",
        filename: "Authorized Notes.pdf",
      }),
    ).toBe(
      "bsc-computer-science/_unassigned/lecture_note/authorized-notes.pdf",
    );
  });

  it("rejects empty filenames", () => {
    expect(() =>
      buildSuggestedStoragePath({
        programmeSlug: "bsc-computer-science",
        courseCode: null,
        kind: "slide",
        filename: "***",
      }),
    ).toThrow(/empty/);
  });
});

describe("assertSafeRelativePath", () => {
  it("rejects parent-directory traversal", () => {
    expect(() => assertSafeRelativePath("../secret.pdf")).toThrow(
      /parent-directory/,
    );
  });
});
