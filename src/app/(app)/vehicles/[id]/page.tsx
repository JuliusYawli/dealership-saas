import { notFound } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { VehicleForm, VehicleFormDefaults } from "@/components/vehicles/vehicle-form";
import { FileUploader } from "@/components/vehicles/file-uploader";

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session?.user) notFound();

  const vehicle = await db.vehicle.findFirst({
    where: { id: params.id, dealershipId: session.user.dealershipId }
  });
  if (!vehicle) notFound();

  const defaultValues: VehicleFormDefaults = {
    stockNumber: vehicle.stockNumber ?? "",
    vin: vehicle.vin ?? "",
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color ?? "",
    mileage: vehicle.mileage ?? undefined,
    status: vehicle.status,
    purchasePrice: vehicle.purchasePrice?.toString() ?? "",
    listPrice: vehicle.listPrice?.toString() ?? "",
    transportCost: vehicle.transportCost?.toString() ?? "",
    transportFrom: vehicle.transportFrom ?? "",
    transportTo: vehicle.transportTo ?? "",
    transportEta: vehicle.transportEta ? vehicle.transportEta.toISOString().slice(0, 10) : "",
    customerName: vehicle.customerName ?? "",
    customerPhone: vehicle.customerPhone ?? "",
    customerEmail: vehicle.customerEmail ?? "",
    checklistDocsDone: vehicle.checklistDocsDone,
    checklistPhotosDone: vehicle.checklistPhotosDone,
    checklistVideoDone: vehicle.checklistVideoDone,
    checklistSocialDone: vehicle.checklistSocialDone,
    notes: vehicle.notes ?? ""
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">
        {vehicle.year} {vehicle.make} {vehicle.model}
      </h1>
      <VehicleForm vehicleId={vehicle.id} defaultValues={defaultValues} />
      <FileUploader vehicleId={vehicle.id} />
    </div>
  );
}
