import { z } from "zod";

const ALLOWED_GENDERS = ["male", "female"] as const;
const currentYear = new Date().getFullYear();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^a-zA-Z0-9]/, "Password must include a special character");

// Location must look like a real place name: letters, spaces, commas, hyphens, apostrophes, periods only.
// This blocks digits, @ symbols, and anything containing "gmail"/"yahoo"/etc.
const locationSchema = z
  .string()
  .trim()
  .min(2, "Location is required")
  .max(100, "Location is too long")
  .regex(
    /^[a-zA-Z0-9\s,.'-]+$/,
    "Location can only contain letters, numbers, spaces, commas, and hyphens",
  )
  .refine(
    (val) => !/gmail|yahoo|hotmail|outlook|icloud|@/i.test(val),
    "Please enter a valid location",
  );

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.email("Please enter a valid email address").trim().toLowerCase(),
    phone: z
      .string()
      .trim()
      .regex(/^[+]?[\d\s()-]{7,20}$/, "Please enter a valid phone number"),
    gender: z.enum(ALLOWED_GENDERS, {
      message: "Please select a valid gender",
    }),
    yearCompleted: z.coerce
      .number()
      .int("Enter a valid year")
      .min(1970, "Year must be 1970 or later")
      .max(currentYear + 1, "Year cannot be in the future"),
    location: locationSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
