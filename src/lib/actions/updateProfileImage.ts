"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth.config";
import { revalidatePath } from "next/cache";

export async function updateProfileImage(url: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.user.update({
    where: { id: userId },
    data: { profileImageUrl: url },
  });

  revalidatePath("/profile"); // adjust to your actual profile route
}