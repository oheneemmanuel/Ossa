-- CreateEnum
CREATE TYPE "SpinStatus" AS ENUM ('PENDING', 'FULFILLED', 'FAILED');

-- CreateTable
CREATE TABLE "Prize" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "dataMb" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "stock" INTEGER,
    "color" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Prize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prizeId" TEXT NOT NULL,
    "dayKey" TEXT NOT NULL,
    "status" "SpinStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Spin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prize_active_sortOrder_idx" ON "Prize"("active", "sortOrder");

-- CreateIndex
CREATE INDEX "Spin_status_idx" ON "Spin"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Spin_userId_dayKey_key" ON "Spin"("userId", "dayKey");

-- AddForeignKey
ALTER TABLE "Spin" ADD CONSTRAINT "Spin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spin" ADD CONSTRAINT "Spin_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "Prize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
