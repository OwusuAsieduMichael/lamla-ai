import { describe, expect, it } from "vitest";

import { createConfiguredGenerator } from "./generate";

describe("createConfiguredGenerator", () => {
  it("does not invent a generator when no provider key is set", () => {
    expect(createConfiguredGenerator({})).toBeUndefined();
  });

  it("builds a generator only after a provider key exists", () => {
    expect(
      createConfiguredGenerator({
        OPENAI_API_KEY: "test-key",
        AI_PROVIDER: "openai",
      }),
    ).toBeTypeOf("function");
  });
});
