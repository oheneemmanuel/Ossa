/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Spin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Spin" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Spin_code_key" ON "Spin"("code");
