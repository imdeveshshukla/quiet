/*
  Warnings:

  - Added the required column `commentId` to the `Upvote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Upvote" ADD COLUMN     "commentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
