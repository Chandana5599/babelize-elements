"use client";

import * as React from "react";

export interface LocaleNumberProps
  extends Omit<React.ComponentPropsWithoutRef<"data">, "value" | "style"> {
  /** Number to format. */
  value: number;
  /** BCP 47 locale, such as "en-US" or "de-DE". */
  locale?: string;
  /** Number formatting style. */
  style?: "decimal" | "percent" | "unit";
  /** Unit to display when style is "unit", such as "kilometer". */
  unit?: Intl.NumberFormatOptions["unit"];
  /** Unit display style. */
  unitDisplay?: Intl.NumberFormatOptions["unitDisplay"];
  /** Compact notation, such as 1.2K. */
  notation?: Intl.NumberFormatOptions["notation"];
  /** Minimum fraction digits. */
  minimumFractionDigits?: number;
  /** Maximum fraction digits. */
  maximumFractionDigits?: number;
}

export const LocaleNumber = React.forwardRef<
  HTMLDataElement,
  LocaleNumberProps
>(function LocaleNumber(
  {
    value,
    locale = "en",
    style = "decimal",
    unit,
    unitDisplay = "short",
    notation = "standard",
    minimumFractionDigits,
    maximumFractionDigits,
    ...rest
  },
  ref,
) {
  const formatted = new Intl.NumberFormat(locale, {
    style,
    ...(style === "unit" && unit ? { unit, unitDisplay } : {}),
    notation,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);

  return (
    <data ref={ref} value={value} {...rest}>
      {formatted}
    </data>
  );
});

LocaleNumber.displayName = "LocaleNumber";

