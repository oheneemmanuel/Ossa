import { db } from "@/lib/prisma";

// Defaults to OFF until an admin switches it on.
export async function isWheelEnabled() {
  const s = await db.setting.findUnique({ where: { key: "wheel_enabled" } });
  return s?.value === "true";
}