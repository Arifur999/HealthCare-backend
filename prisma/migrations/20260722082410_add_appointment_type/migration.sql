-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('IN_PERSON', 'VIDEO_CALL');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "appointmentType" "AppointmentType" NOT NULL DEFAULT 'IN_PERSON';
