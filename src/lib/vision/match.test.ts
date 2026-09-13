import { describe, expect, it } from "vitest";

import { classifyVisionMatch } from "./match";

describe("classifyVisionMatch", () => {
  it("never claims a match without extracted text", () => {
    const result = classifyVisionMatch({
      extractedText: null,
      chunks: [
        {
          id: "1",
          content: "EXAMPLE slide about binary trees.",
          sourceTitle: "EXAMPLE slides",
          sourceAttribution: "Test only",
          importanceScore: 0.8,
        },
      ],
    });

    expect(result.tier).toBe("none");
    expect(result.confidence).toBe("none");
  });

  it("marks an exact match only when extracted text is contained in a chunk", () => {
    const excerpt =
      "Binary search trees store keys so that the left subtree is smaller.";
    const result = classifyVisionMatch({
      extractedText: excerpt,
      chunks: [
        {
          id: "1",
          content: `EXAMPLE heading. ${excerpt} EXAMPLE tail.`,
          sourceTitle: "EXAMPLE slides",
          sourceAttribution: "Test only",
          importanceScore: 0.8,
        },
      ],
    });

    expect(result.tier).toBe("exact");
    expect(result.confidence).toBe("high");
  });

  it("uses likely only for lexical overlap, never a course claim", () => {
    const result = classifyVisionMatch({
      extractedText: "binary trees and recursion examples",
      chunks: [
        {
          id: "1",
          content: "EXAMPLE fixture covering binary trees and recursion.",
          sourceTitle: "EXAMPLE notes",
          sourceAttribution: "Test only",
          importanceScore: 0.5,
        },
      ],
    });

    expect(result.tier).toBe("likely");
    expect(result.note).not.toContain("Course");
  });
});
