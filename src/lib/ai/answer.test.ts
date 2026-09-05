import { describe, expect, it } from "vitest";

import { answerAcademicQuestion } from "./answer";

describe("answerAcademicQuestion", () => {
  it("refuses when no authorized chunks match", async () => {
    const result = await answerAcademicQuestion({
      question: "Explain linked lists",
      chunks: [],
    });

    expect(result.refused).toBe(true);
    expect(result.reason).toBe("no_authorized_sources");
  });

  it("refuses to invent an answer when a provider key is missing", async () => {
    const result = await answerAcademicQuestion({
      question: "linked lists",
      chunks: [
        {
          id: "1",
          content: "EXAMPLE fixture about linked lists.",
          sourceTitle: "EXAMPLE",
          sourceAttribution: "Test only",
          importanceScore: 0.5,
        },
      ],
      env: {},
    });

    expect(result.refused).toBe(true);
    expect(result.reason).toBe("provider_not_configured");
    expect(result.sources).toHaveLength(1);
  });

  it("answers only through the supplied generator when sources exist", async () => {
    const result = await answerAcademicQuestion({
      question: "linked lists",
      chunks: [
        {
          id: "1",
          content: "EXAMPLE fixture about linked lists.",
          sourceTitle: "EXAMPLE",
          sourceAttribution: "Test only",
          importanceScore: 0.5,
        },
      ],
      generate: async () => "EXAMPLE grounded answer from supplied generator.",
    });

    expect(result.refused).toBe(false);
    expect(result.text).toContain("EXAMPLE grounded answer");
  });
});
