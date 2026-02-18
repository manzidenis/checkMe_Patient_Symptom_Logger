-- CreateEnum
CREATE TYPE "SymptomType" AS ENUM ('BREAST_PAIN', 'LUMP_DETECTED', 'SKIN_CHANGES', 'NIPPLE_DISCHARGE', 'SWELLING', 'FATIGUE', 'OTHER');

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SymptomEntry" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "symptomType" "SymptomType" NOT NULL,
    "severity" INTEGER NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SymptomEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Patient_createdAt_idx" ON "Patient"("createdAt");

-- CreateIndex
CREATE INDEX "SymptomEntry_patientId_idx" ON "SymptomEntry"("patientId");

-- CreateIndex
CREATE INDEX "SymptomEntry_occurredAt_idx" ON "SymptomEntry"("occurredAt");

-- CreateIndex
CREATE INDEX "SymptomEntry_severity_idx" ON "SymptomEntry"("severity");

-- AddForeignKey
ALTER TABLE "SymptomEntry" ADD CONSTRAINT "SymptomEntry_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
