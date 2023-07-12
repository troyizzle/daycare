-- CreateTable
CREATE TABLE "ClassroomStudents" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "ClassroomStudents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomStudents_classroomId_studentId_key" ON "ClassroomStudents"("classroomId", "studentId");

-- AddForeignKey
ALTER TABLE "ClassroomStudents" ADD CONSTRAINT "ClassroomStudents_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomStudents" ADD CONSTRAINT "ClassroomStudents_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
