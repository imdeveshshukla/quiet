/*
  Warnings:

  - You are about to drop the column `dpURL` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "dpURL",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "dp" TEXT;
