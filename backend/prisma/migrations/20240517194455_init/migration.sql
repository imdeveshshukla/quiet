/*
  Warnings:

  - A unique constraint covering the columns `[userID]` on the table `UserVarify` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserVarify_userID_key" ON "UserVarify"("userID");
