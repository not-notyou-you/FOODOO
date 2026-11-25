// src/i18n/index.ts
import { en } from "./en.ts";
import { id } from "./id.ts";

export type Language = "en" | "id";
export type MessageKey = keyof typeof en;

const dictionaries: Record<Language, Record<MessageKey, string>> = { en, id };

export function translate(language: Language, key: MessageKey): string {
  return dictionaries[language][key];
}

export function t(key: MessageKey): string {
  return translate("en", key);
}
