-- CreateTable
CREATE TABLE "Leetcode" (
    "id" TEXT NOT NULL,
    "acceptanceRate" DOUBLE PRECISION NOT NULL,
    "contributionPoints" INTEGER NOT NULL,
    "easySolved" INTEGER NOT NULL,
    "hardSolved" INTEGER NOT NULL,
    "mediumSolved" INTEGER NOT NULL,
    "ranking" INTEGER NOT NULL,
    "totalEasy" INTEGER NOT NULL,
    "totalHard" INTEGER NOT NULL,
    "totalMedium" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "totalSolved" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Leetcode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leetcode_userId_key" ON "Leetcode"("userId");

-- AddForeignKey
ALTER TABLE "Leetcode" ADD CONSTRAINT "Leetcode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
