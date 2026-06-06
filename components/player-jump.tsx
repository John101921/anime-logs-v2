"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PlayerJump({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (/^\d+$/.test(trimmed)) {
      router.push(`/players/${trimmed}`);
    } else {
      router.push(`/players?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form className={compact ? "player-jump compact" : "player-jump"} onSubmit={submit}>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Jump to Player ID or username..."
      />
      <button type="submit">Investigate</button>
    </form>
  );
}
