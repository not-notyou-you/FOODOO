// e2e/smoke.spec.ts
import { expect, test } from "@playwright/test";

test("demo stall loads, installs its service worker, and survives an offline reload", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Welcome to FOODOO" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Start setup" })).toBeVisible();

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });

  await page.getByRole("button", { name: "Try demo stall" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Today" }),
  ).toBeVisible();
  await expect(page.getByText("Demo data")).toBeVisible();

  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "Today" }),
  ).toBeVisible();
  await expect(page.getByText("Demo data")).toBeVisible();
  await expect(page.getByText("Offline. Saved on this device.")).toBeVisible();
});

test("Chromium reports no installability errors", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  const cdp = await page.context().newCDPSession(page);
  const result = await cdp.send("Page.getInstallabilityErrors");
  expect(result.installabilityErrors).toEqual([]);
});

test("web manifest is installable", async ({ page, request }) => {
  await page.goto("/");
  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(href).not.toBeNull();
  const response = await request.get(href ?? "");
  expect(response.ok()).toBe(true);
  const manifest = (await response.json()) as {
    name: string;
    display: string;
    icons: { sizes: string; purpose?: string }[];
  };
  expect(manifest.name).toBe("FOODOO");
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons.map((icon) => icon.sizes)).toEqual([
    "192x192",
    "512x512",
    "512x512",
  ]);
});
