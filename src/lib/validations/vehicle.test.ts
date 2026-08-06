import { describe, expect, it } from "vitest";
import { vehicleSchema } from "./vehicle";

const baseInput = {
  make: "Toyota",
  model: "Camry",
  year: 2022,
  status: "IN_STOCK"
};

describe("vehicleSchema", () => {
  it("accepts a minimal valid vehicle", () => {
    const result = vehicleSchema.safeParse(baseInput);
    expect(result.success).toBe(true);
  });

  it("rejects a missing make", () => {
    const { make, ...rest } = baseInput;
    const result = vehicleSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects a VIN that isn't 17 characters", () => {
    const result = vehicleSchema.safeParse({ ...baseInput, vin: "TOO_SHORT" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid 17-character VIN", () => {
    const result = vehicleSchema.safeParse({ ...baseInput, vin: "1HGCM82633A004352" });
    expect(result.success).toBe(true);
  });

  it("treats empty-string optional numeric fields as undefined", () => {
    const result = vehicleSchema.safeParse({ ...baseInput, mileage: "", listPrice: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.mileage).toBeUndefined();
      expect(result.data.listPrice).toBeUndefined();
    }
  });

  it("rejects an unknown status", () => {
    const result = vehicleSchema.safeParse({ ...baseInput, status: "UNKNOWN" });
    expect(result.success).toBe(false);
  });

  it("defaults checklist booleans to false", () => {
    const result = vehicleSchema.safeParse(baseInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.checklistDocsDone).toBe(false);
      expect(result.data.checklistPhotosDone).toBe(false);
    }
  });
});
