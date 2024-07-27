/*
  Warnings:

  - You are about to drop the `Community` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Community";

-- CreateTable
CREATE TABLE "Rooms" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT,
    "img" TEXT,
    "privateRoom" BOOLEAN NOT NULL,
    "CreatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnrolledRooms" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "RoomId" TEXT NOT NULL,

    CONSTRAINT "EnrolledRooms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_CreatorId_fkey" FOREIGN KEY ("CreatorId") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrolledRooms" ADD CONSTRAINT "EnrolledRooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrolledRooms" ADD CONSTRAINT "EnrolledRooms_RoomId_fkey" FOREIGN KEY ("RoomId") REFERENCES "Rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
