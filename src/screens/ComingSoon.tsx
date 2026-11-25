// src/screens/ComingSoon.tsx
import { Button } from "../components/Button.tsx";
import { EmptyState } from "../components/EmptyState.tsx";
import { Screen } from "../components/Screen.tsx";
import { useT, type MessageKey } from "../i18n/index.ts";

interface ComingSoonProps {
  title: MessageKey;
}

export function ComingSoon({ title }: ComingSoonProps) {
  const t = useT();
  return (
    <Screen title={t(title)}>
      <EmptyState
        title={t("soon.title")}
        body={t("soon.body")}
        action={
          <Button variant="secondary" to="/today">
            {t("soon.back")}
          </Button>
        }
      />
    </Screen>
  );
}
