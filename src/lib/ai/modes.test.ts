import { describe, expect, it } from "vitest";

import { applyLearningMode } from "./modes";

describe("applyLearningMode", () => {
  it("leaves ask questions unchanged", () => {
    expect(applyLearningMode("Explain recursion.", "ask")).toBe(
      "Explain recursion.",
    );
  });

  it("wraps simplify without adding invented course content", () => {
    const result = applyLearningMode("Explain recursion.", "simplify");

    expect(result).toContain("Explain recursion.");
    expect(result).toContain("authorized excerpts");
    expect(result).not.toContain("CSM");
  });
});
