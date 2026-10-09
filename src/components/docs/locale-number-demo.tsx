"use client";

import { LocaleNumber } from "@/registry/components/locale-number";

export function LocaleNumberDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <LocaleNumber value={1234567.89} locale="en-US" />
      <LocaleNumber value={1234567.89} locale="de-DE" />
      <LocaleNumber value={0.25} style="percent" />
      <LocaleNumber value={1200} notation="compact" />
      <LocaleNumber value={5} style="unit" unit="kilometer" />
    </div>
  );
}
