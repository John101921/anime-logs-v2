"use client";

import { useEffect, useState } from "react";

type CountKey = "players" | "events" | "snapshots" | "purchases" | "gifts" | "sales" | "security";

type CountsResponse = {
  counts?: Partial<Record<CountKey, number | null>>;
};

const formatter = new Intl.NumberFormat("en-US");

export function AsyncCount({
  countKey,
  fallback,
  fallbackIsExact,
}: {
  countKey?: CountKey;
  fallback: number;
  fallbackIsExact: boolean;
}) {
  const [count, setCount] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!countKey) return;
    let cancelled = false;

    fetch("/api/counts", { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<CountsResponse> : null)
      .then((payload) => {
        const nextCount = payload?.counts?.[countKey];
        if (!cancelled && typeof nextCount === "number") {
          setCount(nextCount);
        }
      })
      .catch(() => {
        // Counts are non-critical; table rendering should never depend on them.
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [countKey]);

  if (count != null) {
    return formatter.format(count);
  }

  if (countKey) {
    return loaded ? `${formatter.format(fallback)}${fallbackIsExact ? "" : "+"}` : "Loading...";
  }

  return `${formatter.format(fallback)}${fallbackIsExact ? "" : "+"}`;
}
