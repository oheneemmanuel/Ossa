"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/prisma";

const ALLOWED_GENDERS = ["male", "female"];

export async function createUserAccount(formData: FormData) {
  try {
    // -----------------------------
    // Get form values
    // -----------------------------
    const firstName = formData.get("firstName")?.toString().trim() ?? "";
    const lastName = formData.get("lastName")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
    const phone = formData.get("phone")?.toString().trim() ?? "";
    const gender = formData.get("gender")?.toString().trim() ?? "";
    const yearCompleted =
      formData.get("yearCompleted")?.toString().trim() ?? "";
    const location = formData.get("location")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

    // -----------------------------
    // Required fields
    // -----------------------------
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !gender ||
      !yearCompleted ||
      !location ||
      !password ||
      !confirmPassword
    ) {
      return {
        success: false,
        error: "Please fill in all required fields.",
      };
    }

    // -----------------------------
    // Email validation
    // -----------------------------
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Please enter a valid email address.",
      };
    }

    // -----------------------------
    // Phone validation (basic — adjust to your expected format)
    // -----------------------------
    const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;

    if (!phoneRegex.test(phone)) {
      return {
        success: false,
        error: "Please enter a valid phone number.",
      };
    }

    // -----------------------------
    // Gender allow-list
    // -----------------------------
    if (!ALLOWED_GENDERS.includes(gender)) {
      return {
        success: false,
        error: "Please select a valid gender.",
      };
    }

    // -----------------------------
    // Year completed validation
    // -----------------------------
    const yearNum = Number(yearCompleted);
    const currentYear = new Date().getFullYear();

    if (
      !Number.isInteger(yearNum) ||
      yearNum < 1970 ||
      yearNum > currentYear + 1
    ) {
      return {
        success: false,
        error: "Please enter a valid completion year.",
      };
    }

    // -----------------------------
    // Password validation
    // -----------------------------
    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long.",
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match.",
      };
    }

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
        yearCompleted: yearNum,
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

