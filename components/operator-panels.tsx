import Link from "next/link";

export function WorkbenchCard({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <Link className="workbench-card" href={href}>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span>{label}</span>
    </Link>
  );
}

export function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
