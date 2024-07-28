-- DropForeignKey
ALTER TABLE "EnrolledRooms" DROP CONSTRAINT "EnrolledRooms_RoomId_fkey";

-- DropForeignKey
ALTER TABLE "EnrolledRooms" DROP CONSTRAINT "EnrolledRooms_userId_fkey";

-- AddForeignKey
ALTER TABLE "EnrolledRooms" ADD CONSTRAINT "EnrolledRooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrolledRooms" ADD CONSTRAINT "EnrolledRooms_RoomId_fkey" FOREIGN KEY ("RoomId") REFERENCES "Rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
