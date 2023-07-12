/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Action` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Action` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Action_id_key" ON "Action"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Action_name_key" ON "Action"("name");
