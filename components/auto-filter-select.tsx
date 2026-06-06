"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function AutoFilterSelect({
  name,
  value,
  options,
  className = "input compact-select",
}: {
  name: string;
  value?: string | number;
  options: Array<{ label: string; value: string | number }>;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(nextValue: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextValue) {
      params.set(name, nextValue);
    } else {
      params.delete(name);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  return (
    <select className={className} defaultValue={String(value ?? "")} onChange={(event) => update(event.target.value)}>
      {options.map((option) => (
        <option key={String(option.value)} value={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
