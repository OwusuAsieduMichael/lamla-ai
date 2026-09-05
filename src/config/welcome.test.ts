import { describe, expect, it } from "vitest";

import { welcomeSlides } from "./welcome";

describe("welcomeSlides", () => {
  it("introduces LAMLA in exactly three tabs", () => {
    expect(welcomeSlides).toHaveLength(3);
    expect(welcomeSlides.map((slide) => slide.tab)).toEqual([
      "Welcome",
      "About LAMLA",
      "Get started",
    ]);
  });

  it("does not invent a KNUST course catalog", () => {
    const text = welcomeSlides
      .flatMap((slide) => [slide.body, ...slide.points])
      .join(" ");

    expect(text).not.toMatch(/CSM\s*\d{3}/i);
  });
});
