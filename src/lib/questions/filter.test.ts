import { describe, expect, it } from "vitest";

import { filterPastQuestions } from "./filter";

const paper = {
  title: "EXAMPLE paper",
  academicYear: "2024/2025",
  sourceAttribution: "Test only",
  courseCode: "EXAMPLE101",
  topicTitle: "Recursion",
  conceptTitle: "Base case",
  itemCount: 2,
};

describe("filterPastQuestions", () => {
  it("drops unattributed papers", () => {
    expect(
      filterPastQuestions(
        [{ ...paper, sourceAttribution: "" }],
        {},
      ),
    ).toEqual([]);
  });

  it("filters by course, year, topic, and concept without inventing rows", () => {
    expect(filterPastQuestions([paper], { courseCode: "EXAMPLE101" })).toEqual([
      paper,
    ]);
    expect(filterPastQuestions([paper], { courseCode: "MISSING" })).toEqual([]);
    expect(filterPastQuestions([paper], { academicYear: "2024/2025" })).toEqual([
      paper,
    ]);
    expect(filterPastQuestions([paper], { topic: "recur" })).toEqual([paper]);
    expect(filterPastQuestions([paper], { concept: "heap" })).toEqual([]);
  });
});
