/*
  Warnings:

  - The primary key for the `EnrolledRooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `EnrolledRooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,RoomId]` on the table `EnrolledRooms` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "EnrolledRooms" DROP CONSTRAINT "EnrolledRooms_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "EnrolledRooms_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "EnrolledRooms_userId_RoomId_key" ON "EnrolledRooms"("userId", "RoomId");
