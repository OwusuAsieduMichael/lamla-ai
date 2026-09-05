import { describe, expect, it } from "vitest";

import { parseInput } from "@/lib/validation/parse";

import { safeNextPath, signInSchema, signUpSchema } from "./schemas";

describe("signInSchema", () => {
  it("rejects a short password", () => {
    const result = parseInput(signInSchema, {
      email: "student@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid sign-in payload", () => {
    const result = parseInput(signInSchema, {
      email: "Student@example.com",
      password: "long-enough-password",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("student@example.com");
    }
  });
});

describe("signUpSchema", () => {
  it("treats a blank display name as unset", () => {
    const result = parseInput(signUpSchema, {
      email: "student@example.com",
      password: "long-enough-password",
      displayName: "   ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.displayName).toBeNull();
    }
  });
});

describe("safeNextPath", () => {
  it("blocks open redirects", () => {
    expect(safeNextPath("https://evil.example")).toBe("/");
    expect(safeNextPath("//evil.example")).toBe("/");
    expect(safeNextPath("/account")).toBe("/account");
    expect(safeNextPath("/ask")).toBe("/ask");
    expect(safeNextPath(undefined)).toBe("/");
  });
});
