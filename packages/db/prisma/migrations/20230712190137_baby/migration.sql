/*
  Warnings:

  - Made the column `dob` on table `Baby` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `Baby` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `Baby` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Baby" ALTER COLUMN "dob" SET NOT NULL,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;
