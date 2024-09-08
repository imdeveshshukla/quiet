-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codeforces" TEXT,
ADD COLUMN     "showCf" BOOLEAN NOT NULL DEFAULT false;
