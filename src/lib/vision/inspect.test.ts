import { describe, expect, it } from "vitest";

import { inspectAcademicImage } from "./inspect";

describe("inspectAcademicImage", () => {
  it("refuses when no authorized academic image exists", () => {
    const result = inspectAcademicImage(0);

    expect(result.refused).toBe(true);
    expect(result.reason).toBe("no_authorized_sources");
  });

  it("still refuses to invent a reading when an authorized image row exists", () => {
    const result = inspectAcademicImage(1);

    expect(result.refused).toBe(true);
    expect(result.reason).toBe("provider_not_configured");
  });
});
