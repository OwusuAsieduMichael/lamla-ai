import { describe, expect, it } from "vitest";

import { recommendNextStudy } from "./recommend";

describe("recommendNextStudy", () => {
  it("returns nothing when no authorized chunks exist", () => {
    expect(recommendNextStudy([])).toEqual([]);
  });
});
