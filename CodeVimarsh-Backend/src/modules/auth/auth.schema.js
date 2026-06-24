import { z } from "zod";

export const registerSchema = z.object({
  prn: z
    .string({ required_error: "PRN is required." })
    .length(10, "PRN must be exactly 10 characters.")
    .regex(/^\d+$/, "PRN must contain digits only."),
  name: z
    .string({ required_error: "Full name is required." })
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email address."),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password is too long."),
});

export const loginSchema = z.object({
  prn: z
    .string({ required_error: "PRN is required." })
    .min(1, "PRN cannot be empty."),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password cannot be empty."),
});

export const resendVerificationSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email address."),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email address."),
});

export const resetPasswordSchema = z.object({
  token: z.string({ required_error: "Token is required." }),
  newPassword: z
    .string({ required_error: "New password is required." })
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password is too long."),
});
