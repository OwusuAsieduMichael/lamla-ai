import { describe, expect, it } from "vitest";

import { scoreAcademicImportance } from "./score";

describe("scoreAcademicImportance", () => {
  it("weights past-question overlap more than recency", () => {
    const highExam = scoreAcademicImportance({
      pastQuestionOverlap: 1,
      recency: 0,
      sourceWeight: 0,
    });
    const highRecency = scoreAcademicImportance({
      pastQuestionOverlap: 0,
      recency: 1,
      sourceWeight: 0,
    });

    expect(highExam).toBeGreaterThan(highRecency);
  });
});
