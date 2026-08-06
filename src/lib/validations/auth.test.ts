import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "./auth";

describe("signupSchema", () => {
  it("accepts a valid signup payload", () => {
    const result = signupSchema.safeParse({
      dealershipName: "Acme Motors",
      fullName: "Jane Doe",
      email: "jane@acme.test",
      password: "supersecret"
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short password", () => {
    const result = signupSchema.safeParse({
      dealershipName: "Acme Motors",
      fullName: "Jane Doe",
      email: "jane@acme.test",
      password: "short"
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({
      dealershipName: "Acme Motors",
      fullName: "Jane Doe",
      email: "not-an-email",
      password: "supersecret"
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires a non-empty password", () => {
    const result = loginSchema.safeParse({ email: "jane@acme.test", password: "" });
    expect(result.success).toBe(false);
  });
});
