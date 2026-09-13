import { describe, expect, it } from "vitest";

import { collectRelatedEvidence } from "./related";

describe("collectRelatedEvidence", () => {
  it("returns no related resources when the corpus is empty", () => {
    expect(collectRelatedEvidence("recursion", [])).toEqual({ resources: [] });
  });

  it("deduplicates authorized source titles", () => {
    const result = collectRelatedEvidence("recursion", [
      {
        id: "1",
        content: "EXAMPLE fixture about recursion.",
        sourceTitle: "EXAMPLE notes",
        sourceAttribution: "Test only",
        importanceScore: 0.4,
      },
      {
        id: "2",
        content: "EXAMPLE second chunk about recursion.",
        sourceTitle: "EXAMPLE notes",
        sourceAttribution: "Test only",
        importanceScore: 0.2,
      },
    ]);

    expect(result.resources).toHaveLength(1);
    expect(result.resources[0]?.title).toBe("EXAMPLE notes");
  });
});
