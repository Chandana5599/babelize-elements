"use client";

import * as React from "react";

export interface RelativeTimeProps extends Omit<
  React.ComponentPropsWithoutRef<"time">,
  "dateTime" | "style"
> {
  /** Date to describe relative to the current time. */
  date: Date | string | number;
  /** BCP 47 locale, such as "en-US" or "fr-FR". */
  locale?: string;
  /** How the relative time is phrased. */
  numeric?: Intl.RelativeTimeFormatOptions["numeric"];
  /** How unit names are displayed. */
  style?: Intl.RelativeTimeFormatOptions["style"];
  /** Refresh interval in milliseconds; omit to disable live updates. */
  updateInterval?: number;
}

const UNITS = [
  { unit: "year", seconds: 31536000 },
  { unit: "month", seconds: 2592000 },
  { unit: "week", seconds: 604800 },
  { unit: "day", seconds: 86400 },
  { unit: "hour", seconds: 3600 },
  { unit: "minute", seconds: 60 },
  { unit: "second", seconds: 1 },
] as const;

function formatRelativeTime(
  date: Date,
  now: number,
  locale: string,
  numeric: Intl.RelativeTimeFormatOptions["numeric"],
  style: Intl.RelativeTimeFormatOptions["style"],
): string {
  const difference = (date.getTime() - now) / 1000;
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric, style });

  for (let index = 0; index < UNITS.length; index++) {
    const { unit, seconds } = UNITS[index];

    if (Math.abs(difference) >= seconds || index === UNITS.length - 1) {
      const rounded = Math.round(difference / seconds);
      const largerUnit = UNITS[index - 1];

      if (largerUnit && Math.abs(rounded) >= Math.round(largerUnit.seconds / seconds)) {
        return formatter.format(Math.round(difference / largerUnit.seconds), largerUnit.unit);
      }

      return formatter.format(rounded, unit);
    }
  }

  return formatter.format(0, "second");
}

export const RelativeTime = React.forwardRef<HTMLTimeElement, RelativeTimeProps>(
  function RelativeTime(
    { date, locale = "en", numeric = "auto", style = "long", updateInterval, ...rest },
    ref,
  ) {
    const parsedDate = date instanceof Date ? date : new Date(date);
    const [now, setNow] = React.useState(0);

    React.useEffect(() => {
      setNow(Date.now());
      if (!updateInterval || updateInterval <= 0) return;

      const timer = setInterval(() => setNow(Date.now()), updateInterval);
      return () => clearInterval(timer);
    }, [updateInterval]);

    const formatted = Number.isNaN(parsedDate.getTime())
      ? ""
      : formatRelativeTime(parsedDate, now, locale, numeric, style);

    return (
      <time
        ref={ref}
        dateTime={Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate.toISOString()}
        {...rest}
      >
        {formatted}
      </time>
    );
  },
);

RelativeTime.displayName = "RelativeTime";
