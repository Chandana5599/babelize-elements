"use client";

import * as React from "react";

type LocaleNumberBaseProps = Omit<React.ComponentPropsWithoutRef<"data">, "value" | "style"> & {
  /** Number to format. */
  value: number;
  /** BCP 47 locale, such as "en-US" or "de-DE". */
  locale?: string;
  /** Unit display style. */
  unitDisplay?: Intl.NumberFormatOptions["unitDisplay"];
  /** Compact notation, such as 1.2K. */
  notation?: Intl.NumberFormatOptions["notation"];
  /** Minimum fraction digits. */
  minimumFractionDigits?: number;
  /** Maximum fraction digits. */
  maximumFractionDigits?: number;
};

export type LocaleNumberProps = LocaleNumberBaseProps &
  (
    | {
        style?: "decimal" | "percent";
        unit?: never;
      }
    | {
        style: "unit";
        unit: NonNullable<Intl.NumberFormatOptions["unit"]>;
      }
  );

export const LocaleNumber = React.forwardRef<HTMLDataElement, LocaleNumberProps>(
  function LocaleNumber(
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
    if (style === "unit" && !unit) {
      throw new TypeError('LocaleNumber requires the "unit" prop when style="unit".');
    }

    const formatted = new Intl.NumberFormat(locale, {
      style,
      ...(style === "unit" ? { unit, unitDisplay } : {}),
      notation,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);

    return (
      <data ref={ref} value={value} {...rest}>
        {formatted}
      </data>
    );
  },
);

LocaleNumber.displayName = "LocaleNumber";
