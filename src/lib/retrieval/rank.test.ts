import { describe, expect, it } from "vitest";

import { rankChunks } from "./rank";

const exampleChunks = [
  {
    id: "1",
    content: "EXAMPLE fixture about linked lists and pointers.",
    sourceTitle: "EXAMPLE notes",
    sourceAttribution: "Test only",
    importanceScore: 0.2,
  },
  {
    id: "2",
    content: "EXAMPLE fixture about operating system processes.",
    sourceTitle: "EXAMPLE OS",
    sourceAttribution: "Test only",
    importanceScore: 0.9,
  },
];

describe("rankChunks", () => {
  it("returns no hits when the corpus is empty", () => {
    expect(rankChunks("linked lists", [])).toEqual([]);
  });

  it("ranks the matching authorized example chunk first", () => {
    const ranked = rankChunks("linked lists", exampleChunks);

    expect(ranked[0]?.id).toBe("1");
    expect(ranked[0]?.content.includes("KNUST")).toBe(false);
  });
});
