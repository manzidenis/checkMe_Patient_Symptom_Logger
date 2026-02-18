/*
  Warnings:

  - Added the required column `updatedAt` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sex` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `SymptomEntry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "sex",
ADD COLUMN     "sex" "Sex" NOT NULL;

-- AlterTable
ALTER TABLE "SymptomEntry" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "SymptomEntry_patientId_occurredAt_idx" ON "SymptomEntry"("patientId", "occurredAt");
