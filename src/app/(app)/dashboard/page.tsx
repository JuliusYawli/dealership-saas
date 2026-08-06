import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { getDashboardSummary } from "@/lib/dashboard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { VehicleStatusBadge } from "@/components/vehicles/status-badge";

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  IN_STOCK: "In Stock",
  RESERVED: "Reserved",
  SOLD: "Sold",
  IN_TRANSIT: "In Transit"
};

function ChecklistBar({ label, done, total }: { label: string; done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-500">
          {done}/{total}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div className="h-2 rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getAuthSession();
  const summary = await getDashboardSummary(session!.user.dealershipId);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-gray-500">Total vehicles</p>
            <p className="mt-1 text-2xl font-semibold">{summary.total}</p>
          </CardContent>
        </Card>
        {Object.entries(summary.statusCounts).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="py-5">
              <p className="text-sm text-gray-500">{statusLabels[status] ?? status}</p>
              <p className="mt-1 text-2xl font-semibold">{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold">Recently updated vehicles</h2>
          </CardHeader>
          <CardContent>
            {summary.recentVehicles.length === 0 ? (
              <p className="text-sm text-gray-500">No vehicles yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {summary.recentVehicles.map((vehicle) => (
                  <li key={vehicle.id} className="flex items-center justify-between py-2">
                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-brand-600"
                    >
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </Link>
                    <VehicleStatusBadge status={vehicle.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold">Checklist completion</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChecklistBar label="Documents" done={summary.checklist.docsDone} total={summary.checklist.total} />
            <ChecklistBar label="Photos" done={summary.checklist.photosDone} total={summary.checklist.total} />
            <ChecklistBar label="Video" done={summary.checklist.videoDone} total={summary.checklist.total} />
            <ChecklistBar
              label="Social media"
              done={summary.checklist.socialDone}
              total={summary.checklist.total}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
