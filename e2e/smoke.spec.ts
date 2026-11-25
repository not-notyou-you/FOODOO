// e2e/smoke.spec.ts
import { expect, test } from "@playwright/test";

test("shell loads, installs its service worker, and reloads offline", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Foundation shell",
  );

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect(page.getByRole("status")).toHaveText("Ready to work offline.");

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Foundation shell",
  );
  await expect(
    page.getByText("No features are built yet. Coming soon."),
  ).toBeVisible();
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
