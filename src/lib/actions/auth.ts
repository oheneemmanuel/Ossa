"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/register";

export async function createUserAccount(formData: FormData) {
  try {
    // -----------------------------
    // Parse + validate all fields in one pass
    // -----------------------------
    const raw = {
      firstName: formData.get("firstName")?.toString() ?? "",
      lastName: formData.get("lastName")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      gender: formData.get("gender")?.toString() ?? "",
      yearCompleted: formData.get("yearCompleted")?.toString() ?? "",
      location: formData.get("location")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
      confirmPassword: formData.get("confirmPassword")?.toString() ?? "",
    };

    const parsed = registerSchema.safeParse(raw);

    if (!parsed.success) {
      // Surface the first validation error — same shape your form already expects
      const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
      return {
        success: false,
        error: firstError,
      };
    }

    const { firstName, lastName, email, phone, gender, yearCompleted, location, password } =
      parsed.data;

    // -----------------------------
    // Hash password
    // -----------------------------
    const hashedPassword = await bcrypt.hash(password, 12);

    // -----------------------------
    // Create user
    // (relies on `email` being @unique in your Prisma schema —
    // this avoids the check-then-create race condition)
    // -----------------------------
    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        gender,
        yearCompleted,
        location,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        gender: true,
        yearCompleted: true,
        location: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      message: "Account created successfully.",
      user,
    };
  } catch (error) {
    // Handle duplicate email (Prisma unique constraint violation)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    console.error("Registration Error:", error);

    return {
      success: false,
      error: "Something went wrong while creating your account.",
    };
  }
}

// Login is now handled by Auth.js — see src/auth.config.ts (Credentials provider, `authorize` callback).