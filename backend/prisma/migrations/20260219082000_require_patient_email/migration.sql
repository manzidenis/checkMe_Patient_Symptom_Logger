-- Backfill any existing NULL emails before enforcing NOT NULL
UPDATE "Patient"
SET "email" = CONCAT('patient_', "id", '@checkme.local')
WHERE "email" IS NULL;

-- Make email required at the database level
ALTER TABLE "Patient"
ALTER COLUMN "email" SET NOT NULL;
