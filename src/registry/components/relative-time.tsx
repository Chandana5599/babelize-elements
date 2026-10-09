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

  for (const { unit, seconds } of UNITS) {
    if (Math.abs(difference) >= seconds || unit === "second") {
      return formatter.format(Math.round(difference / seconds), unit);
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
    const [now, setNow] = React.useState(() => Date.now());

    React.useEffect(() => {
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
