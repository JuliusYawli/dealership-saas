import { VehicleForm } from "@/components/vehicles/vehicle-form";

export default function NewVehiclePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Add vehicle</h1>
      <VehicleForm />
    </div>
  );
}
