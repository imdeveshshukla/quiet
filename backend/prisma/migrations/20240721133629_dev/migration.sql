/*
  Warnings:

  - The primary key for the `Upvote` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Upvote" DROP CONSTRAINT "Upvote_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Upvote_id_seq";
