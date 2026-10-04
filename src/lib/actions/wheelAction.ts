"use server";

import { randomInt } from "node:crypto";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth.config";
import { db } from "@/lib/prisma";
import { isWheelEnabled } from "@/lib/actions/settings";

// No 0/O or 1/I/l, so codes are easy to read out and type
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const makeCode = () =>
  "SPIN-" +
  Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");

export type SpinResult =
  | { ok: true; prizeId: string; label: string; dataMb: number; code: string }
  | {
      ok: false;
      error: "UNAUTHENTICATED" | "ALREADY_SPUN" | "UNAVAILABLE" | "DISABLED";
    };

const dayKey = () => new Date().toISOString().slice(0, 10); // UTC day (= Accra time)

export async function spinWheel(): Promise<SpinResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "UNAUTHENTICATED" };
  if (!(await isWheelEnabled())) return { ok: false, error: "DISABLED" };

  const key = dayKey();

  try {
    return await db.$transaction(async (tx) => {
      // Up to 3 attempts in case a limited-stock prize sells out mid-draw.
      for (let attempt = 0; attempt < 3; attempt++) {
        const pool = await tx.prize.findMany({
          where: { active: true, OR: [{ stock: null }, { stock: { gt: 0 } }] },
          orderBy: { sortOrder: "asc" },
        });
        const total = pool.reduce((sum, p) => sum + p.weight, 0);
        if (!pool.length || total <= 0)
          return { ok: false, error: "UNAVAILABLE" } as const;

        // Cryptographically secure weighted pick, done only on the server.
        let roll = randomInt(total);
        const prize = pool.find((p) => (roll -= p.weight) < 0)!;

        if (prize.stock !== null) {
          // Atomic decrement; count 0 means someone else took the last one.
          const { count } = await tx.prize.updateMany({
            where: { id: prize.id, stock: { gt: 0 } },
            data: { stock: { decrement: 1 } },
          });
          if (count === 0) continue;
        }

        // Unique(userId, dayKey) throws P2002 if the user already spun today,
        // which rolls the whole transaction back (including the stock change).
        const code = makeCode();
        await tx.spin.create({
          data: { userId, prizeId: prize.id, dayKey: key, code },
        });

        return {
          ok: true,
          prizeId: prize.id,
          label: prize.label,
          dataMb: prize.dataMb,
          code,
        } as const;
      }
      return { ok: false, error: "UNAVAILABLE" } as const;
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return { ok: false, error: "ALREADY_SPUN" };
    }
    throw e;
  }
}