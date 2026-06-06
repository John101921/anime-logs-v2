"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const REFRESH_INTERVAL_MS = 30000;

export function LiveRefresh() {
  const router = useRouter();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function refresh() {
      if (document.hidden) return;
      setIsRefreshing(true);
      router.refresh();
      window.setTimeout(() => {
        if (cancelled) return;
        setLastUpdated(new Date());
        setIsRefreshing(false);
      }, 700);
    }

    const intervalId = window.setInterval(refresh, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [router]);

  return (
    <button
      className="live-refresh"
      onClick={() => {
        setIsRefreshing(true);
        router.refresh();
        window.setTimeout(() => {
          setLastUpdated(new Date());
          setIsRefreshing(false);
        }, 700);
      }}
      type="button"
      title="Refresh live data"
    >
      <RefreshCw className={isRefreshing ? "spinning" : ""} size={15} />
      <span>Live</span>
      {lastUpdated ? <small>{lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small> : null}
    </button>
  );
}
