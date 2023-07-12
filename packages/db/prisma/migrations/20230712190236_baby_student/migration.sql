/*
  Warnings:

  - You are about to drop the `Baby` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BabyActionLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BabyActionLog" DROP CONSTRAINT "BabyActionLog_actionId_fkey";

-- DropForeignKey
ALTER TABLE "BabyActionLog" DROP CONSTRAINT "BabyActionLog_babyId_fkey";

-- DropTable
DROP TABLE "Baby";

-- DropTable
DROP TABLE "BabyActionLog";

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "mood" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentActionLog" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentActionLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentActionLog" ADD CONSTRAINT "StudentActionLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActionLog" ADD CONSTRAINT "StudentActionLog_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
