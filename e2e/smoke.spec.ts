import { test, expect } from "@playwright/test";

test("homepage loads with all sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("nav")).toBeVisible();
  await expect(page.getByText("An AI employee that never")).toBeVisible();
  await expect(page.getByText("24/7")).toBeVisible();
  await expect(page.getByText("Everything your customers need")).toBeVisible();
  await expect(page.getByText("How we help you grow")).toBeVisible();
  await expect(page.getByText("Three steps")).toBeVisible();
  await expect(page.getByText("Ready to stop missing customers")).toBeVisible();
  await expect(page.getByText("Tell us about your business")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
});

test("nav links scroll to sections", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Services" }).first().click();
  await expect(page.locator("#services")).toBeInViewport();
});

test("contact form shows validation errors", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("Name is required")).toBeVisible();
  await expect(page.getByText("Email is required")).toBeVisible();
});
