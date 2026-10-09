"use client";

import { useEffect, useState } from "react";
import { RelativeTime } from "@/registry/components/relative-time";

export function RelativeTimeDemo() {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <p>
        Past: <RelativeTime date={now - 60 * 60 * 1000} />
      </p>
      <p>
        Future: <RelativeTime date={now + 24 * 60 * 60 * 1000} />
      </p>
      <p>
        French: <RelativeTime date={now - 24 * 60 * 60 * 1000} locale="fr" />
      </p>
    </div>
  );
}
