// tests/App.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { App } from "../src/app/App.tsx";

vi.mock("../src/app/registerPwa.ts", () => ({
  registerPwa: (onOfflineReady: () => void) => {
    onOfflineReady();
  },
}));

describe("App shell", () => {
  it("renders the foundation placeholder and the offline-ready status", () => {
    render(
      <MemoryRouter
        initialEntries={["/"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Foundation shell",
    );
    expect(
      screen.getByText("No features are built yet. Coming soon."),
    ).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe(
      "Ready to work offline.",
    );
  });
});
