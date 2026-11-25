// src/components/LanguageSwitch.tsx
import { LANGUAGES, useI18n } from "../i18n/index.ts";

export function LanguageSwitch() {
  const { language, setLanguage, t } = useI18n();
  return (
    <fieldset className="segmented">
      <legend>{t("lang.label")}</legend>
      <div className="segmented__options">
        {LANGUAGES.map((option) => (
          <label key={option} className="segmented__option">
            <input
              type="radio"
              name="language"
              value={option}
              checked={language === option}
              onChange={() => {
                setLanguage(option);
              }}
            />
            <span lang={option}>{t(`lang.${option}`)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
