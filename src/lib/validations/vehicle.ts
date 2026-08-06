import { z } from "zod";

const emptyToUndefined = (val: unknown) => (val === "" || val === null || val === undefined ? undefined : val);

const optionalString = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().max(max).optional());

const optionalNumber = (opts: { int?: boolean; min?: number } = {}) =>
  z.preprocess(
    emptyToUndefined,
    (opts.int ? z.coerce.number().int() : z.coerce.number())
      .refine((n) => opts.min === undefined || n >= opts.min, { message: "Value too low" })
      .optional()
  );

export const vehicleStatusValues = ["DRAFT", "IN_STOCK", "RESERVED", "SOLD", "IN_TRANSIT"] as const;

export const vehicleSchema = z.object({
  stockNumber: optionalString(50),
  vin: z.preprocess(
    emptyToUndefined,
    z.string().length(17, "VIN must be 17 characters").optional()
  ),
  make: z.string().min(1, "Make is required").max(80),
  model: z.string().min(1, "Model is required").max(80),
  year: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  color: optionalString(50),
  mileage: optionalNumber({ int: true, min: 0 }),
  status: z.enum(vehicleStatusValues),

  purchasePrice: optionalNumber({ min: 0 }),
  listPrice: optionalNumber({ min: 0 }),
  transportCost: optionalNumber({ min: 0 }),

  transportFrom: optionalString(120),
  transportTo: optionalString(120),
  transportEta: z.preprocess(emptyToUndefined, z.coerce.date().optional()),

  customerName: optionalString(120),
  customerPhone: optionalString(30),
  customerEmail: z.preprocess(emptyToUndefined, z.string().email().optional()),

  checklistDocsDone: z.boolean().default(false),
  checklistPhotosDone: z.boolean().default(false),
  checklistVideoDone: z.boolean().default(false),
  checklistSocialDone: z.boolean().default(false),

  notes: optionalString(2000)
});

export type VehicleInput = z.infer<typeof vehicleSchema>;

export const vehicleListQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(vehicleStatusValues).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
});
