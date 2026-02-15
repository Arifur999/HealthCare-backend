-- Rename the existing nullable column to match the Prisma schema field name
ALTER TABLE "doctor" RENAME COLUMN "currentWorkplace" TO "currentWorkingPlace";

-- Backfill existing rows so we can safely enforce NOT NULL constraints
UPDATE "doctor"
SET
  "currentWorkingPlace" = COALESCE(NULLIF("currentWorkingPlace", ''), 'Unknown'),
  "qualification" = COALESCE(NULLIF("qualification", ''), 'Unknown'),
  "designation" = COALESCE(NULLIF("designation", ''), 'Unknown'),
  "registrationNumber" = COALESCE(NULLIF("registrationNumber", ''), 'TEMP-' || "id");

-- Enforce required fields (matches prisma/schema/doctor.prisma)
ALTER TABLE "doctor" ALTER COLUMN "currentWorkingPlace" SET NOT NULL;
ALTER TABLE "doctor" ALTER COLUMN "qualification" SET NOT NULL;
ALTER TABLE "doctor" ALTER COLUMN "designation" SET NOT NULL;
ALTER TABLE "doctor" ALTER COLUMN "registrationNumber" SET NOT NULL;

-- Ensure registrationNumber uniqueness (matches @unique)
CREATE UNIQUE INDEX "doctor_registrationNumber_key" ON "doctor"("registrationNumber");

