/*
  Warnings:

  - You are about to drop the `Leetcode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Leetcode" DROP CONSTRAINT "Leetcode_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "leetcode" TEXT;

-- DropTable
DROP TABLE "Leetcode";
