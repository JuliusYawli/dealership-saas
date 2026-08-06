"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema, VehicleInput, vehicleStatusValues } from "@/lib/validations/vehicle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type VehicleFormDefaults = Partial<Record<keyof VehicleInput, string | boolean | number>>;

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function VehicleForm({
  vehicleId,
  defaultValues
}: {
  vehicleId?: string;
  defaultValues?: VehicleFormDefaults;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = Boolean(vehicleId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { status: "IN_STOCK", ...defaultValues } as VehicleInput
  });

  async function onSubmit(data: VehicleInput) {
    setServerError(null);
    const res = await fetch(isEdit ? `/api/vehicles/${vehicleId}` : "/api/vehicles", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setServerError(typeof body.error === "string" ? body.error : "Could not save vehicle");
      return;
    }

    const body = await res.json();
    router.push(`/vehicles/${body.vehicle.id}`);
    router.refresh();
  }

  async function onDelete() {
    if (!vehicleId) return;
    if (!confirm("Delete this vehicle? This cannot be undone.")) return;
    const res = await fetch(`/api/vehicles/${vehicleId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/vehicles");
      router.refresh();
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Identity</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Stock #" error={errors.stockNumber?.message}>
            <Input {...register("stockNumber")} />
          </Field>
          <Field label="VIN" error={errors.vin?.message}>
            <Input {...register("vin")} maxLength={17} />
          </Field>
          <Field label="Status" error={errors.status?.message}>
            <Select {...register("status")}>
              {vehicleStatusValues.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Make" error={errors.make?.message}>
            <Input {...register("make")} />
          </Field>
          <Field label="Model" error={errors.model?.message}>
            <Input {...register("model")} />
          </Field>
          <Field label="Year" error={errors.year?.message}>
            <Input type="number" {...register("year")} />
          </Field>
          <Field label="Color" error={errors.color?.message}>
            <Input {...register("color")} />
          </Field>
          <Field label="Mileage" error={errors.mileage?.message}>
            <Input type="number" {...register("mileage")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Financial</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Purchase price" error={errors.purchasePrice?.message}>
            <Input type="number" step="0.01" {...register("purchasePrice")} />
          </Field>
          <Field label="List price" error={errors.listPrice?.message}>
            <Input type="number" step="0.01" {...register("listPrice")} />
          </Field>
          <Field label="Transport cost" error={errors.transportCost?.message}>
            <Input type="number" step="0.01" {...register("transportCost")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Transport</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="From" error={errors.transportFrom?.message}>
            <Input {...register("transportFrom")} />
          </Field>
          <Field label="To" error={errors.transportTo?.message}>
            <Input {...register("transportTo")} />
          </Field>
          <Field label="ETA" error={errors.transportEta?.message as string | undefined}>
            <Input type="date" {...register("transportEta")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Customer</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Name" error={errors.customerName?.message}>
            <Input {...register("customerName")} />
          </Field>
          <Field label="Phone" error={errors.customerPhone?.message}>
            <Input {...register("customerPhone")} />
          </Field>
          <Field label="Email" error={errors.customerEmail?.message}>
            <Input type="email" {...register("customerEmail")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Readiness checklist</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("checklistDocsDone")} /> Documents
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("checklistPhotosDone")} /> Photos
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("checklistVideoDone")} /> Video
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("checklistSocialDone")} /> Social media
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Notes</h2>
        </CardHeader>
        <CardContent>
          <textarea
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            rows={4}
            {...register("notes")}
          />
        </CardContent>
      </Card>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create vehicle"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
        {isEdit && (
          <Button type="button" variant="danger" onClick={onDelete}>
            Delete vehicle
          </Button>
        )}
      </div>
    </form>
  );
}
