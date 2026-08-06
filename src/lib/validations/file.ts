import { z } from "zod";

export const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf"
] as const;

export const maxFileSizeBytes = 15 * 1024 * 1024; // 15 MB

export const presignRequestSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileType: z.enum(allowedFileTypes),
  fileSize: z
    .number()
    .int()
    .positive()
    .max(maxFileSizeBytes, "File must be 15MB or smaller")
});

export const createFileRecordSchema = presignRequestSchema.extend({
  key: z.string().min(1)
});
