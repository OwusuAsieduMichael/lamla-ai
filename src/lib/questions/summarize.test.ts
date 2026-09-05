import { describe, expect, it } from "vitest";

import { summarizePastQuestions } from "./summarize";

describe("summarizePastQuestions", () => {
  it("drops papers without attribution", () => {
    expect(
      summarizePastQuestions([
        {
          title: "EXAMPLE paper",
          academicYear: "2024/2025",
          itemCount: 0,
          sourceAttribution: "",
        },
      ]),
    ).toEqual([]);
  });
});
