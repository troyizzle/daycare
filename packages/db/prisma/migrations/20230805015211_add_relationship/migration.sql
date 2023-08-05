/*
  Warnings:

  - Added the required column `relationship` to the `ContactInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactInformation" ADD COLUMN     "relationship" TEXT NOT NULL;
