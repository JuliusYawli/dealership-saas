import { VehicleStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<VehicleStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  IN_STOCK: "bg-green-100 text-green-700",
  RESERVED: "bg-amber-100 text-amber-700",
  SOLD: "bg-blue-100 text-blue-700",
  IN_TRANSIT: "bg-purple-100 text-purple-700"
};

const statusLabels: Record<VehicleStatus, string> = {
  DRAFT: "Draft",
  IN_STOCK: "In Stock",
  RESERVED: "Reserved",
  SOLD: "Sold",
  IN_TRANSIT: "In Transit"
};

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return <Badge className={statusStyles[status]}>{statusLabels[status]}</Badge>;
}
