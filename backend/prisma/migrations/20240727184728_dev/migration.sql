/*
  Warnings:

  - A unique constraint covering the columns `[id,title]` on the table `Rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Rooms" ADD COLUMN     "bgImg" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_id_title_key" ON "Rooms"("id", "title");
