/*
  Warnings:

  - Added the required column `date` to the `MoodEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MoodEntry_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "MoodEntry" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "MoodEntry_userId_date_idx" ON "MoodEntry"("userId", "date");
