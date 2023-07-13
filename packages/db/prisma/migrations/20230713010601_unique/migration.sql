/*
  Warnings:

  - A unique constraint covering the columns `[classroomId,teacherId]` on the table `ClassroomTeachers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ClassroomTeachers_classroomId_teacherId_key" ON "ClassroomTeachers"("classroomId", "teacherId");
