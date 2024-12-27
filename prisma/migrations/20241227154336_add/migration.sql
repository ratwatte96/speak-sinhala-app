-- CreateTable
CREATE TABLE "EventLog" (
    "id" SERIAL NOT NULL,
    "eventType" TEXT NOT NULL,
    "userId" INTEGER,
    "targetEmail" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);
