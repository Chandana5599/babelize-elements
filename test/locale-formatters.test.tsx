import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocaleNumber } from "../src/registry/components/locale-number";
import { RelativeTime } from "../src/registry/components/relative-time";

describe("LocaleNumber", () => {
  it("formats numbers using the selected locale", () => {
    render(<LocaleNumber value={1234.5} locale="en-US" />);
    expect(screen.getByText("1,234.5")).toBeTruthy();
  });

  it("formats percentages", () => {
    render(<LocaleNumber value={0.25} style="percent" />);
    expect(screen.getByText("25%")).toBeTruthy();
  });

  it("formats units", () => {
    render(<LocaleNumber value={5} style="unit" unit="kilometer" />);
    expect(screen.getByText("5 km")).toBeTruthy();
  });
});

describe("RelativeTime", () => {
  it("formats a past date", () => {
    const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
    render(<RelativeTime date={date} numeric="always" />);
    expect(screen.getByText("1 day ago")).toBeTruthy();
  });

  it("formats a future date", () => {
    const date = new Date(Date.now() + 2 * 60 * 60 * 1000);
    render(<RelativeTime date={date} numeric="always" />);
    expect(screen.getByText("in 2 hours")).toBeTruthy();
  });

  it("renders a semantic time element", () => {
    render(<RelativeTime date="2026-01-01T00:00:00Z" />);
    expect(document.querySelector("time")?.getAttribute("datetime")).toBe(
      "2026-01-01T00:00:00.000Z",
    );
  });
});
