-- DropForeignKey
ALTER TABLE "Rooms" DROP CONSTRAINT "Rooms_CreatorId_fkey";

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_CreatorId_fkey" FOREIGN KEY ("CreatorId") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
