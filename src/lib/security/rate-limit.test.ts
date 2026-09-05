import { describe, expect, it } from "vitest";

import { allowRequest, resetRateLimits } from "./rate-limit";

describe("allowRequest", () => {
  it("blocks a key after the window limit", () => {
    resetRateLimits();

    expect(allowRequest("ask:test", 2, 60_000, 1)).toBe(true);
    expect(allowRequest("ask:test", 2, 60_000, 2)).toBe(true);
    expect(allowRequest("ask:test", 2, 60_000, 3)).toBe(false);
  });
});
