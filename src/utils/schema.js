import * as zod from "zod";

export const loginSchema = zod.object({
  email: zod.string().min(1, "Email is required").email("Invalid email format"),
  password: zod
    .string()
    .min(6, "Password must be at least 6 characters")
    .min(1, "Password is required"),
});

export const signupSchema = zod
  .object({
    name: zod.string().min(1, "Name is required"),
    email: zod
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),
    password: zod
      .string()
      .min(6, "Password must be at least 6 characters")
      .min(1, "Password is required"),
    confirmPassword: zod
      .string()
      .min(6, "Confirm Password must be at least 6 characters")
      .min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
