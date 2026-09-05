import { describe, expect, it } from "vitest";

import { answerAcademicQuestion } from "@/lib/ai";

describe("grounding evaluation", () => {
  it("never answers from an empty authorized corpus", async () => {
    const result = await answerAcademicQuestion({
      question: "What is the KNUST compiler syllabus?",
      chunks: [],
    });

    expect(result.refused).toBe(true);
    expect(result.text.toLowerCase()).not.toContain("the syllabus is");
  });
});
