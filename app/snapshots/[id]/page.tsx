import { DashboardShell } from "@/components/dashboard-shell";
import { SnapshotDetailCard } from "@/components/log-detail-card";
import { getSnapshotDetail } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SnapshotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snapshot = await getSnapshotDetail(Number(id));

  if (!snapshot) notFound();

  return (
    <DashboardShell title="Snapshot Detail" active="Snapshots">
      <div style={{ marginBottom: 16 }}>
        <Link className="page-button" href="/snapshots">Back to snapshots</Link>
      </div>
      <SnapshotDetailCard snapshot={snapshot} />
    </DashboardShell>
  );
}
