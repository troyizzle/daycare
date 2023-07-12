-- CreateTable
CREATE TABLE "ClassTeachers" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "ClassTeachers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClassTeachers" ADD CONSTRAINT "ClassTeachers_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
