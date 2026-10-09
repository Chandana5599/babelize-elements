import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
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

describe("LocaleNumber runtime validation", () => {
  it("rejects unit style without a unit from JavaScript callers", () => {
    const invalidProps = {
      value: 5,
      style: "unit",
    } as unknown as import("react").ComponentProps<typeof LocaleNumber>;

    expect(() => render(<LocaleNumber {...invalidProps} />)).toThrow(
      'LocaleNumber requires the "unit" prop when style="unit".',
    );
  });
});

describe("RelativeTime rounding boundaries", () => {
  it.each([
    { elapsedMilliseconds: 59.6 * 60 * 1000, expected: "1 hour ago" },
    { elapsedMilliseconds: 23.6 * 60 * 60 * 1000, expected: "1 day ago" },
    { elapsedMilliseconds: 6.6 * 24 * 60 * 60 * 1000, expected: "1 week ago" },
    { elapsedMilliseconds: 364 * 24 * 60 * 60 * 1000, expected: "1 year ago" },
  ])("promotes rounded values to the next unit", ({ elapsedMilliseconds, expected }) => {
    const date = new Date(Date.now() - elapsedMilliseconds);
    render(<RelativeTime date={date} numeric="always" />);
    expect(screen.getByText(expected)).toBeTruthy();
  });
});

describe("RelativeTime server rendering", () => {
  it("does not render epoch-relative text during SSR", () => {
    const html = renderToString(<RelativeTime date="2026-10-09T16:04:10.351Z" numeric="always" />);

    expect(html).not.toContain("in 57 years");
  });
});

describe("RelativeTime date handling", () => {
  it("treats offset-free date-time strings as UTC", () => {
    render(<RelativeTime date="2026-01-01T10:00:00" />);
    expect(document.querySelector("time")?.getAttribute("datetime")).toBe(
      "2026-01-01T10:00:00.000Z",
    );
  });

  it("describes a changed date relative to the current time", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    try {
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      const { rerender } = render(<RelativeTime date="2026-01-01T00:00:00Z" numeric="always" />);
      vi.setSystemTime(new Date("2026-01-01T02:00:00Z"));
      rerender(<RelativeTime date="2026-01-01T01:00:00Z" numeric="always" />);
      expect(screen.getByText("1 hour ago")).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });
});
