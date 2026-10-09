import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { LanguageSwitcher } from "@/registry/components";

const locales = [{ code: "en" }, { code: "fr" }, { code: "ar" }];

describe("LanguageSwitcher", () => {
  it("renders the first locale when no value is given", () => {
    render(<LanguageSwitcher locales={locales} />);
    expect(screen.getByRole("button")).toHaveAccessibleName(/English/);
  });

  it("honours defaultValue and exposes listbox semantics", async () => {
    render(<LanguageSwitcher locales={locales} defaultValue="fr" />);
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("calls onValueChange exactly once per selection", async () => {
    const onValueChange = vi.fn();
    render(<LanguageSwitcher locales={locales} onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("option", { name: /French/ }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("fr");
  });

  it("follows an externally changed value prop (controlled mode)", async () => {
    function Harness() {
      const [value, setValue] = React.useState("en");
      return (
        <>
          <button type="button" onClick={() => setValue("fr")}>
            set fr
          </button>
          <LanguageSwitcher locales={locales} value={value} />
        </>
      );
    }
    render(<Harness />);
    expect(screen.getByRole("button", { name: /Current language: English/ })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "set fr" }));
    expect(screen.getByRole("button", { name: /Current language: French/ })).toBeInTheDocument();
  });

  it("forwards a ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<LanguageSwitcher locales={locales} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes unknown props through to the root element", () => {
    render(<LanguageSwitcher locales={locales} data-testid="switcher" />);
    expect(screen.getByTestId("switcher")).toBeInTheDocument();
  });

  it("gives the search box an accessible name", async () => {
    render(<LanguageSwitcher locales={locales} />);
    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));

    expect(screen.getByRole("textbox", { name: "Search languages" })).toBeInTheDocument();
  });

  it("marks the root rtl for an RTL locale and ltr otherwise", () => {
    const { container, rerender } = render(
      <LanguageSwitcher locales={locales} defaultValue="ar" />,
    );
    expect(container.firstElementChild).toHaveAttribute("dir", "rtl");

    rerender(<LanguageSwitcher locales={locales} value="en" />);
    expect(container.firstElementChild).toHaveAttribute("dir", "ltr");
  });

  it("lets a caller override the direction", () => {
    const { container } = render(
      <LanguageSwitcher locales={locales} defaultValue="ar" dir="ltr" />,
    );
    expect(container.firstElementChild).toHaveAttribute("dir", "ltr");
  });

  it.each([
    { code: "ckb", label: "Kurdish", rtl: true, direction: "rtl" },
    { code: "ar", label: "Arabic", rtl: false, direction: "ltr" },
  ])("honours rtl=$rtl for $code on the root and options", async ({ direction, ...locale }) => {
    const { container } = render(<LanguageSwitcher locales={[locale]} />);
    expect(container.firstElementChild).toHaveAttribute("dir", direction);

    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));
    expect(screen.getByRole("option", { name: locale.label })).toHaveAttribute("dir", direction);
  });

  it("updates direction when an overridden locale is selected", async () => {
    const { container } = render(
      <LanguageSwitcher locales={[{ code: "en" }, { code: "ckb", label: "Kurdish", rtl: true }]} />,
    );
    expect(container.firstElementChild).toHaveAttribute("dir", "ltr");

    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));
    await userEvent.click(screen.getByRole("option", { name: "Kurdish" }));
    expect(container.firstElementChild).toHaveAttribute("dir", "rtl");
  });

  it("does not reverse an RTL row twice", async () => {
    // `dir="rtl"` already lays a flex row out right-to-left; a flex-row-reverse on
    // top of it put the row back in LTR order.
    render(<LanguageSwitcher locales={locales} defaultValue="ar" showFlags />);
    const trigger = screen.getByRole("button", { name: /Current language/ });
    expect(trigger.className).not.toContain("flex-row-reverse");

    await userEvent.click(trigger);
    const option = screen.getByRole("option", { name: /العربية|Arabic/ });
    expect(option).toHaveAttribute("dir", "rtl");
    expect(option.className).not.toContain("flex-row-reverse");
    expect(option.className).not.toContain("text-right");
    expect(option.className).not.toContain("text-left");
  });
});
