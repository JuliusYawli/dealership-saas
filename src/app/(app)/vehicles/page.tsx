"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { VehicleTable, VehicleListItem } from "@/components/vehicles/vehicle-table";
import { vehicleStatusValues } from "@/lib/validations/vehicle";

export default function VehiclesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [vehicles, setVehicles] = useState<VehicleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (status) params.set("status", status);

    setLoading(true);
    fetch(`/api/vehicles?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setVehicles(data.vehicles ?? []))
      .finally(() => setLoading(false));
  }, [debouncedSearch, status]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vehicles</h1>
        <Link href="/vehicles/new">
          <Button>Add vehicle</Button>
        </Link>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Search make, model, stock #, VIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="max-w-xs">
          <option value="">All statuses</option>
          {vehicleStatusValues.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <VehicleTable data={vehicles} />
      )}
    </div>
  );
}
