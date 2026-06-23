/*
  Warnings:

  - You are about to drop the column `sleptAt` on the `SleepEntry` table. All the data in the column will be lost.
  - You are about to drop the column `wokeAt` on the `SleepEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SleepEntry" DROP COLUMN "sleptAt",
DROP COLUMN "wokeAt";
