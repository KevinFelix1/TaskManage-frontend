import { z } from "zod";

export const loginSchemaUS = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "invalid email",
    })
    .email({ message: "Invalid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "The password is short" }),
});
