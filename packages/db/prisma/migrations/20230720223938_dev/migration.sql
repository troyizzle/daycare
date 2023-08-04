/*
  Warnings:

  - You are about to drop the column `userId` on the `ContactInformation` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `ContactInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactInformation" DROP COLUMN "userId",
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ContactInformation" ADD CONSTRAINT "ContactInformation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
