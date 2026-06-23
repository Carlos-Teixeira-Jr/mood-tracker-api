/*
  Warnings:

  - You are about to drop the column `date` on the `MoodEntry` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `MoodEntry` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SleepEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[checkinId,medicationId]` on the table `MedicationLog` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[checkinId]` on the table `MoodEntry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[checkinId,routineId]` on the table `RoutineLog` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[checkinId]` on the table `SleepEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `checkinId` to the `MedicationLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkinId` to the `MoodEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkinId` to the `RoutineLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkinId` to the `SleepEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MoodEntry" DROP CONSTRAINT "MoodEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "SleepEntry" DROP CONSTRAINT "SleepEntry_userId_fkey";

-- DropIndex
DROP INDEX "MoodEntry_userId_date_idx";

-- DropIndex
DROP INDEX "SleepEntry_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "MedicationLog" ADD COLUMN     "checkinId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MoodEntry" DROP COLUMN "date",
DROP COLUMN "userId",
ADD COLUMN     "checkinId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RoutineLog" ADD COLUMN     "checkinId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SleepEntry" DROP COLUMN "userId",
ADD COLUMN     "checkinId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Checkin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Checkin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Checkin_userId_date_idx" ON "Checkin"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Checkin_userId_date_key" ON "Checkin"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MedicationLog_checkinId_medicationId_key" ON "MedicationLog"("checkinId", "medicationId");

-- CreateIndex
CREATE UNIQUE INDEX "MoodEntry_checkinId_key" ON "MoodEntry"("checkinId");

-- CreateIndex
CREATE UNIQUE INDEX "RoutineLog_checkinId_routineId_key" ON "RoutineLog"("checkinId", "routineId");

-- CreateIndex
CREATE UNIQUE INDEX "SleepEntry_checkinId_key" ON "SleepEntry"("checkinId");

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodEntry" ADD CONSTRAINT "MoodEntry_checkinId_fkey" FOREIGN KEY ("checkinId") REFERENCES "Checkin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SleepEntry" ADD CONSTRAINT "SleepEntry_checkinId_fkey" FOREIGN KEY ("checkinId") REFERENCES "Checkin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationLog" ADD CONSTRAINT "MedicationLog_checkinId_fkey" FOREIGN KEY ("checkinId") REFERENCES "Checkin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineLog" ADD CONSTRAINT "RoutineLog_checkinId_fkey" FOREIGN KEY ("checkinId") REFERENCES "Checkin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
