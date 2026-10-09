"use client";

import { useState } from "react";
import { LocaleNumber } from "@/registry/components/locale-number";
import { RelativeTime } from "@/registry/components/relative-time";

export function LocaleFormattersDemo() {
  const [now] = useState(() => Date.now());

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h3 className="font-medium">Locale Number</h3>
        <div className="flex flex-wrap gap-4">
          <LocaleNumber value={1234567.89} locale="en-US" />
          <LocaleNumber value={1234567.89} locale="de-DE" />
          <LocaleNumber value={0.25} style="percent" />
          <LocaleNumber value={1200} notation="compact" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Relative Time</h3>
        <div className="flex flex-wrap gap-4">
          <RelativeTime date={now - 60 * 60 * 1000} />
          <RelativeTime date={now + 24 * 60 * 60 * 1000} />
        </div>
      </div>
    </div>
  );
}
