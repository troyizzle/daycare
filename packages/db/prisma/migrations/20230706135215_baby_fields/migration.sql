/*
  Warnings:

  - You are about to drop the column `name` on the `Baby` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Baby" DROP COLUMN "name",
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "mood" TEXT;

-- AlterTable
ALTER TABLE "BabyActionLog" ADD COLUMN     "notes" TEXT;
