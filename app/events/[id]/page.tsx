import { DashboardShell } from "@/components/dashboard-shell";
import { PlayerEventDetailCard } from "@/components/log-detail-card";
import { getPlayerEventDetail } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getPlayerEventDetail(Number(id));

  if (!event) notFound();

  return (
    <DashboardShell title="Event Detail" active="Events">
      <div style={{ marginBottom: 16 }}>
        <Link className="page-button" href="/events">Back to events</Link>
      </div>
      <PlayerEventDetailCard event={event} />
    </DashboardShell>
  );
}
