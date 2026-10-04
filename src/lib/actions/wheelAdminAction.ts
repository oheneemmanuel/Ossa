"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth.config";
import { db } from "@/lib/prisma";

export async function setWheelEnabled(enabled: boolean) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Not signed in");

  // Checked against the database, not the browser, so it can't be faked.
  const user = await db.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== "ADMIN") throw new Error("Forbidden");

  await db.setting.upsert({
    where: { key: "wheel_enabled" },
    update: { value: String(enabled) },
    create: { key: "wheel_enabled", value: String(enabled) },
  });

  revalidatePath("/", "layout"); // refreshes the sidebar and the wheel page
}