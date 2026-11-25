// tests/i18n.test.ts
import { describe, expect, it } from "vitest";
import { en } from "../src/i18n/en.ts";
import { id } from "../src/i18n/id.ts";
import { t, translate } from "../src/i18n/index.ts";

describe("i18n", () => {
  it("has identical keys in English and Bahasa Indonesia", () => {
    expect(Object.keys(id).sort()).toEqual(Object.keys(en).sort());
  });

  it("has no empty strings", () => {
    for (const value of [...Object.values(en), ...Object.values(id)]) {
      expect(value.trim().length).toBeGreaterThan(0);
    }
  });

  it("defaults to English and can translate to Bahasa Indonesia", () => {
    expect(t("shell.title")).toBe(en["shell.title"]);
    expect(translate("id", "shell.title")).toBe(id["shell.title"]);
  });
});
