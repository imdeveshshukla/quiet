-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visited" BOOLEAN NOT NULL DEFAULT false,
    "toUser" TEXT NOT NULL,
    "fromUser" TEXT NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_toUser_fkey" FOREIGN KEY ("toUser") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_fromUser_fkey" FOREIGN KEY ("fromUser") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
