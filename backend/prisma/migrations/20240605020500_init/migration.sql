/*
  Warnings:

  - You are about to drop the column `dp` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "dp",
DROP COLUMN "username";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "username";
