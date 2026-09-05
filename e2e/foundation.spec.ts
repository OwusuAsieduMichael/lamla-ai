import { expect, test } from "@playwright/test";

test("welcome carousel introduces LAMLA in three tabs", async ({ page }) => {
  await page.goto("/welcome");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Welcome aboard",
  );
  await expect(page.getByRole("tab", { name: "Welcome" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "About LAMLA" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Get started" })).toBeVisible();
});

test("unsigned visitors are sent to welcome before home", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/welcome/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Welcome aboard",
  );
});

test("sign-in page is available", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sign in");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});

test("ask workspace refuses invented answers", async ({ page }) => {
  await page.goto("/ask");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Text workspace",
  );
  await expect(page.getByText("refuses when none exist")).toBeVisible();
});
