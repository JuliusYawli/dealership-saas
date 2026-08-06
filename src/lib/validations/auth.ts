import { z } from "zod";

export const signupSchema = z.object({
  dealershipName: z.string().min(2, "Dealership name is required").max(120),
  fullName: z.string().min(2, "Full name is required").max(120),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required")
});

export type LoginInput = z.infer<typeof loginSchema>;
