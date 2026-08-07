// lib/actions/auth.ts
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth.config";
import { revalidatePath } from "next/cache";

// ...your existing login(...) and register(...) functions stay as they are...

export async function updateUserSettings(formData: {
  firstName: string;
  lastName: string;
  phone: string;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  if (!formData.firstName || !formData.lastName) {
    throw new Error("First and last name are required");
  }

  await db.user.update({
    where: { email: session.user.email },
    data: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    },
  });

  revalidatePath("/dashboard/settings");
}