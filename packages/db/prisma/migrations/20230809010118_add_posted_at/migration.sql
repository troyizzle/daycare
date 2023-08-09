/*
  Warnings:

  - Added the required column `postedAt` to the `StudentActionLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentActionLog" ADD COLUMN     "postedAt" TIMESTAMP(3) NOT NULL;
