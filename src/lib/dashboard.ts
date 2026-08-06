import { db } from "@/lib/db";
import { vehicleStatusValues } from "@/lib/validations/vehicle";

export async function getDashboardSummary(dealershipId: string) {
  const [statusGroups, recentVehicles, total, docsDone, photosDone, videoDone, socialDone] =
    await Promise.all([
      db.vehicle.groupBy({ by: ["status"], where: { dealershipId }, _count: true }),
      db.vehicle.findMany({
        where: { dealershipId },
        orderBy: { updatedAt: "desc" },
        take: 5
      }),
      db.vehicle.count({ where: { dealershipId } }),
      db.vehicle.count({ where: { dealershipId, checklistDocsDone: true } }),
      db.vehicle.count({ where: { dealershipId, checklistPhotosDone: true } }),
      db.vehicle.count({ where: { dealershipId, checklistVideoDone: true } }),
      db.vehicle.count({ where: { dealershipId, checklistSocialDone: true } })
    ]);

  const statusCounts = Object.fromEntries(vehicleStatusValues.map((s) => [s, 0])) as Record<
    string,
    number
  >;
  for (const group of statusGroups) {
    statusCounts[group.status] = group._count;
  }

  return {
    total,
    statusCounts,
    recentVehicles,
    checklist: { total, docsDone, photosDone, videoDone, socialDone }
  };
}

export type DashboardSummary = Awaited<ReturnType<typeof getDashboardSummary>>;
